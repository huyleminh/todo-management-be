import * as bcrypt from "bcrypt";
import * as moment from "moment";
import AppResponse from "../shared/AppResponse";
import CommonConsts from "../shared/CommonConsts";
import { v4 as uuidV4 } from "uuid";
import { Logger } from "./Logger";

export class CommonUtils {
    static handleAsyncError(res: AppResponse, error: any) {
        Logger.error("Error", error);
        res.code(500).data("Internal Error").send();
    }

    // static convertToCamelCaseObject(object: any) {
    //     return Object.keys(object).reduce((acc, curr) => {
    //         const ret = { ...acc };
    //         const value = ret[curr];
    //         delete ret[curr];

    //         ret[_.camelCase(curr)] = value;
    //         return ret;
    //     }, object);
    // }

    // static convertToSnakeCaseObject(object: any) {
    //     return Object.keys(object).reduce((acc, curr) => {
    //         const ret = { ...acc };
    //         const value = ret[curr];

    //         delete ret[curr];
    //         ret[_.snakeCase(curr)] = value;
    //         return ret;
    //     }, object);
    // }

    static generateUuidV4(): string {
        return uuidV4();
    }
}

export class BcryptUtils {
    static generateHash(value: string): string {
        const salt = bcrypt.genSaltSync(10);
        const hash = bcrypt.hashSync(value, salt);
        return hash;
    }

    static verifyHashedString(valueToBeCompared: string, hashValue: string): boolean {
        return bcrypt.compareSync(valueToBeCompared, hashValue);
    }
}

export class DateTimeUtils {
    static currentDbDateTime(): string {
        return moment().format(CommonConsts.MOMENT_BASE_DB_FORMAT);
    }
}
