import { Response } from "express";

export default class AppResponse {
    private _res: Response;
    private _code?: number;
    private _data: any;
    private _message?: string;

    /**
     *
     * @param res
     * @param code
     * @param message
     * @param data
     */
    constructor(res: Response, code?: number, message?: string, data?: any) {
        this._res = res;
        this._code = code ? code : 200;
        this._message = message;
        this._data = data;
    }

    public code(code: number): this {
        this._code = code;
        return this;
    }

    public data(dataResponse: any): this {
        this._data = dataResponse;
        return this;
    }

    public message(msg: string): this {
        this._message = msg;
        return this;
    }

    public send() {
        this._res.status(200).json({
            code: this._code,
            message: this._message,
            data: this._data,
        });
    }
}
