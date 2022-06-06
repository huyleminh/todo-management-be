import * as dotenv from "dotenv";

dotenv.config();

export default class Config {
    static get APP() {
        return {
            AUTH_CLIENT_URL: process.env.AUTH_CLIENT_URL || "*",
            PORT: process.env.PORT ? +process.env.PORT : 5000,
            APP_URL: process.env.APP_URL || "http://localhost",
            ACCESS_TOKEN_SIGN: process.env.ACCESS_TOKEN_SIGN || "",
            ACCESS_TOKEN_SIGN_LIFE_TIME: process.env.ACCESS_TOKEN_SIGN_LIFE_TIME || "",
            REFRESH_TOKEN_SIGN: process.env.REFRESH_TOKEN_SIGN || "",
            REFRESH_TOKEN_SIGN_LIFE_TIME: process.env.REFRESH_TOKEN_SIGN_LIFE_TIME || "",
            ID_TOKEN_SIGN: process.env.ID_TOKEN_SIGN || "",
            ID_TOKEN_SIGN_LIFE_TIME: process.env.ID_TOKEN_SIGN_LIFE_TIME || "",
            ENV: process.env.ENV || "",
        };
    }

    static get DB() {
        return {
            HOST: process.env.DB_HOST || "localhost",
            USER_NAME: process.env.DB_USER_NAME || "root",
            PASSWORD: process.env.DB_PASSWORD || "",
            SCHEMA: process.env.DB_SCHEMA || "",
            PORT: process.env.DB_PORT ? +process.env.DB_PORT : 3306,
        };
    }

    static get GOOGLE() {
        return {
            GOOGLE_AUTH_CLIENT_ID: process.env.GOOGLE_AUTH_CLIENT_ID || "",
        };
    }
}
