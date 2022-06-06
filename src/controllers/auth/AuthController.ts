import * as moment from "moment";
import { IAppRequest, IAppResponse } from "../../interfaces/IBaseInterfaces";
import AuthMiddlewares from "../../middlewares/AuthMiddlewares";
import { UserStatusEnum, UserTypeEnum } from "../../models/UserModel";
import UserRepository from "../../repositories/UserRepository";
import UserTokenRepository from "../../repositories/UserTokenRepository";
import OAuth2Service from "../../services/OAuthService";
import TokenService from "../../services/TokenService";
import AppResponse from "../../shared/AppResponse";
import CommonConsts from "../../shared/CommonConsts";
import { BcryptUtils, CommonUtils } from "../../utils/Common";
import AppController from "../AppController";

export default class AuthController extends AppController {
    constructor() {
        super();
    }

    init(): void {
        this._router.get("/login/google", this.getLoginGoogleAsync);
        this._router.post("/token/refresh", this.postRefreshTokenAsync);

        this._router.post("/login", AuthMiddlewares.validateLoginData, this.postLoginAsync);
        this._router.post(
            "/register",
            AuthMiddlewares.validateRegisterData,
            this.postRegisterAsync
        );
    }

    async postLoginAsync(req: IAppRequest, res: IAppResponse) {
        const { body } = req;
        const apiResponse = new AppResponse(res);

        try {
            const userRepo = new UserRepository();
            const [user] = await userRepo.get({ email: body.email });
            if (user === undefined) {
                return apiResponse.code(400).data("Người dùng không tồn tại").send();
            }

            const isPasswordValid = BcryptUtils.verifyHashedString(body.password, user.password);
            if (!isPasswordValid) {
                return apiResponse.code(400).data("Thông tin đăng nhập không hợp lệ").send();
            }

            const accessToken = TokenService.generateAccessToken(user.userUuid, {
                tokenType: "Bearer",
                clientHost: req.headers.host || "",
                resourceAccess: {
                    roles: [],
                },
                scope: "",
                userType: user.userType,
            });

            const refreshTokenObj = TokenService.generateRefreshToken({
                tokenType: "refresh",
                scope: "",
                userUuid: user.userUuid,
                userType: user.userType,
            });

            const idToken = TokenService.generateIdToken(user.userUuid, {
                name: `${user.firstName} ${user.lastName}`,
                firstName: user.firstName,
                lastName: user.lastName,
                userType: user.userType,
                email: user.email,
            });

            // insert token
            const userTokenRepo = new UserTokenRepository();
            userTokenRepo
                .insert([
                    {
                        userId: user.userId,
                        refreshToken: refreshTokenObj.refreshToken,
                        initVector: refreshTokenObj.iv,
                        expiresDate: moment()
                            .add(7, "days")
                            .format(CommonConsts.MOMENT_BASE_DB_FORMAT),
                    },
                ])
                .catch((error) => {
                    console.log(error);
                });

            // update login timestamp
            userRepo
                .update(
                    { userId: user.userId },
                    { lastLogin: moment().format(CommonConsts.MOMENT_BASE_DB_FORMAT) }
                )
                .catch((error) => {
                    console.log(error);
                });

            apiResponse
                .data({
                    accessToken,
                    refreshToken: refreshTokenObj.refreshToken,
                    idToken,
                    expiresIn: 3000, // 5 mins
                    expiresAt: moment().add(5, "minute").valueOf(),
                    infor: `${user.firstName} ${user.lastName}`,
                })
                .send();
        } catch (error) {
            CommonUtils.handleAsyncError(apiResponse, error);
        }
    }

    async getLoginGoogleAsync(req: IAppRequest, res: IAppResponse) {
        const { headers } = req;
        const { authorization } = headers;
        const tokenId = authorization?.split(" ")[1];
        const apiRes = new AppResponse(res);

        if (tokenId === undefined) {
            return apiRes.code(400).data("Thông tin đăng nhập Google không hợp lệ").send();
        }

        try {
            const ticket = await new OAuth2Service().verifyToken(tokenId);

            const payload = ticket.getPayload();
            if (payload === undefined) {
                return apiRes.code(400).data("Thông tin đăng nhập Google không hợp lệ").send();
            }

            const { email, family_name, given_name, name, sub } = payload;
            if (email === undefined) {
                throw new Error("google_login_token_payload_missing_email");
            }
            const userRepo = new UserRepository();
            const [user] = await userRepo.get({ email: email });

            let accessToken = "";
            let userId = -1;
            if (user === undefined) {
                const userUuid = CommonUtils.generateUuidV4();
                const [id] = await userRepo.insert([
                    {
                        userUuid,
                        password: BcryptUtils.generateHash(sub),
                        email,
                        firstName: given_name || "given_name",
                        lastName: family_name || "family_name",
                        userType: UserTypeEnum.GOOGLE,
                        status: UserStatusEnum.ACTIVE,
                    },
                ]);
                if (id === undefined) throw new Error("goolge_login_create_user_error");

                userId = id;
                accessToken = TokenService.generateAccessToken(userUuid, {
                    tokenType: "Bearer",
                    clientHost: req.headers.host || "",
                    resourceAccess: {
                        roles: [],
                    },
                    scope: "",
                    userType: UserTypeEnum.GOOGLE,
                });
            } else {
                userId = user.userId;
                accessToken = TokenService.generateAccessToken(user.userUuid, {
                    tokenType: "Bearer",
                    clientHost: req.headers.host || "",
                    resourceAccess: {
                        roles: [],
                    },
                    scope: "",
                    userType: user.userType,
                });
            }

            // update login timestamp
            userRepo
                .update(
                    { userId },
                    { lastLogin: moment().format(CommonConsts.MOMENT_BASE_DB_FORMAT) }
                )
                .catch((error) => console.log);

            apiRes
                .data({
                    accessToken,
                    expiresIn: 3598000,
                    expiresAt: moment().add(3598, "seconds").valueOf(),
                    infor: name,
                })
                .send();
        } catch (error) {
            CommonUtils.handleAsyncError(apiRes, error);
        }
    }

    postRefreshTokenAsync(req: IAppRequest, res: IAppResponse) {
        // const { query, headers } = req;
        // const refreshToken = query.refresh_token;
        // const idToken = headers.authorization?.split(" ")[1];
        // const apiResponse = new AppResponse(res);
        // if (idToken === undefined || refreshToken === undefined) {
        // 	return apiResponse.code(401).data("unauthorized_user").send();
        // }
        // jwt.verify(idToken, AppConfigs.JWT_ID_TOKEN, async function (error, data) {
        // 	if (error) {
        // 		Logger.error("Id Token error", error);
        // 		return apiResponse.code(403).send();
        // 	}
        // 	const { refeshUuid, userId } = data as any;
        // 	const [tokenObj] = await TokenModel.getByuseridAndUuid(userId, refeshUuid);
        // 	if (tokenObj === undefined || tokenObj.refreshToken !== refreshToken) {
        // 		return apiResponse.code(403).send();
        // 	}
        // 	jwt.verify(refreshToken, AppConfigs.JWT_REFRESH, async function (error, data) {
        // 		if (error) {
        // 			Logger.error("Refresh Token error", error);
        // 			TokenModel.delete(userId, refeshUuid);
        // 			return apiResponse.code(403).send();
        // 		}
        // 		const accessToken = jwt.sign({ data }, AppConfigs.JWT_SIGN, {
        // 			expiresIn: "5 mins",
        // 		});
        // 		apiResponse
        // 			.data({
        // 				accessToken,
        // 				expiresIn: 3000, // 5 mins
        // 				expiresAt: moment().add(5, "minute").valueOf(),
        // 			})
        // 			.send();
        // 	});
        // });
    }

    async postRegisterAsync(req: IAppRequest, res: IAppResponse) {
        const userInfo = res.locals.payload;
        const apiRes = new AppResponse(res);

        try {
            const userRepo = new UserRepository();
            const [user] = await userRepo.get({ email: userInfo.email });
            if (user !== undefined) {
                return apiRes.code(400).data("Email này đã được sử dụng").send();
            }

            const hashPassword = BcryptUtils.generateHash(userInfo.password);
            await userRepo.insert([
                {
                    ...userInfo,
                    userUuid: CommonUtils.generateUuidV4(),
                    password: hashPassword,
                    userType: UserTypeEnum.NORMAL,
                    status: UserStatusEnum.ACTIVE,
                },
            ]);
            apiRes.code(201).send();
        } catch (error) {
            CommonUtils.handleAsyncError(apiRes, error);
        }
    }
}
