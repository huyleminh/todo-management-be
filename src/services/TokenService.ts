import * as crypto from "crypto";
import * as jwt from "jsonwebtoken";
import Config from "../../configs/config";

interface IResourceAccess extends Record<string, any> {
	roles: [];
}

export interface IAccessTokenData extends Record<string, any> {
	tokenType: "Bearer";
	scope: string;
	clientHost: string;
	resourceAccess: IResourceAccess;
}

export interface IRefreshTokenData extends Record<string, any> {
	tokenType: "refresh";
	scope: string;
}

export interface IIdTokenData extends Record<string, any> {
	name: string;
	firstName: string;
	lastName: string;
}

function generateAccessToken(userUuid: string, data: IAccessTokenData) {
	return jwt.sign(data, Config.APP.ACCESS_TOKEN_SIGN, {
		algorithm: "HS256",
		expiresIn: Config.APP.ACCESS_TOKEN_SIGN_LIFE_TIME,
		subject: `${userUuid}`,
		issuer: Config.APP.APP_URL,
	});
}

function generateRefreshToken(data: IRefreshTokenData) {
	const algorithm = "aes-256-cbc";
	const initVector = crypto.randomBytes(16);
	const cipher = crypto.createCipheriv(
		algorithm,
		Buffer.from(Config.APP.REFRESH_TOKEN_SIGN, "hex"),
		initVector,
	);

	let token = cipher.update(
		JSON.stringify({ data, lifeTime: Config.APP.REFRESH_TOKEN_SIGN_LIFE_TIME }),
	);
	token = Buffer.concat([token, cipher.final()]);
	return { iv: initVector.toString("hex"), refreshToken: token.toString("hex") };
}

function generateIdToken(userUuid: string, data: IIdTokenData) {
	return jwt.sign({ ...data }, Config.APP.ID_TOKEN_SIGN, {
		algorithm: "HS256",
		expiresIn: Config.APP.ID_TOKEN_SIGN_LIFE_TIME,
		subject: `${userUuid}`,
		issuer: Config.APP.APP_URL,
	});
}

function decryptRefreshToken(token: string, iv: string) {
	const algorithm = "aes-256-cbc";
	const decipher = crypto.createDecipheriv(
		algorithm,
		Buffer.from(Config.APP.REFRESH_TOKEN_SIGN, "hex"),
		Buffer.from(iv, "hex"),
	);

	let decrypted = decipher.update(token, "hex", "utf8");
	decrypted += decipher.final("utf8");
	return decrypted;
}

export default {
	generateAccessToken,
	generateRefreshToken,
	generateIdToken,
	decryptRefreshToken,
};
