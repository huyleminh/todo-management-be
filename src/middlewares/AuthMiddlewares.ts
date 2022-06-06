import { IAppNextFuction, IAppRequest, IAppResponse } from "../interfaces/IBaseInterfaces";
import AppResponse from "../shared/AppResponse";

function validateLoginData(req: IAppRequest, res: IAppResponse, next: IAppNextFuction) {
    const { body } = req;
    const apiResponse = new AppResponse(res, 400);

    if (
        !body.email ||
        !body.email.trim() ||
        !body.email.match(/^[\w-\.]+@([\w-]+\.)+[\w-]{2,4}$/) ||
        !body.password ||
        !body.password.trim()
    ) {
        return apiResponse.data("Thông tin đăng nhập không hợp lệ").send();
    }

    next();
}

function validateRegisterData(req: IAppRequest, res: IAppResponse, next: IAppNextFuction) {
    const { body } = req;
    const response = new AppResponse(res, 400);

    if (!body.firstName || !body.firstName.trim() || !body.lastName || !body.lastName.trim()) {
        return response.data("Thiếu thông tin họ tên").send();
    }

    if (
        !body.password ||
        !body.password.trim() ||
        !body.password.match(
            new RegExp("^(?=.*?[A-Z])(?=.*?[a-z])(?=.*?[0-9])(?=.*?[#?!@$%^&*.,]).{8,}$")
        )
    ) {
        return response.data("Mật khẩu không hợp lệ").send();
    }

    if (
        !body.email ||
        !body.email.trim() ||
        !body.email.match(/^[\w-\.]+@([\w-]+\.)+[\w-]{2,4}$/)
    ) {
        return response.data("Email không hợp lệ").send();
    }

    res.locals.payload = {
        firstName: body.firstName,
        lastName: body.lastName,
        password: body.password,
        email: body.email,
    };
    next();
}

export default {
    validateLoginData,
    validateRegisterData,
};
