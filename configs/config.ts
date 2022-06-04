import * as dotenv from "dotenv";
dotenv.config();

export default class Config {
    public static get APP() {
        return {
            AUTH_CLIENT_URLS: process.env.AUTH_CLIENT_URLS || "*",
            PORT: process.env.PORT ? +process.env.PORT : 5000,
            APP_URL: process.env.APP_URL || "http://localhost",
        };
    }
}
