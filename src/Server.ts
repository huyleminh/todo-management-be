import * as cors from "cors";
import * as express from "express";
import helmet from "helmet";
import * as morgan from "morgan";
import Config from "../configs/config";
import ControllerList from "./controllers";
import AppController from "./controllers/AppController";
import { IAppNextFuction, IAppRequest, IAppResponse } from "./interfaces/IBaseInterfaces";
import { AppLogStream, Logger } from "./utils/Logger";

export default class Server {
    private _app: express.Application;
    private readonly PORT: number;

    constructor() {
        this._app = express();
        this.PORT = Config.APP.PORT;
    }

    private initializeGlobalMiddlewares() {
        this._app.use(express.json()); // parsing application/json
        this._app.use(express.urlencoded({ extended: true }));
        this._app.use(helmet());
        this._app.use(
            cors({
                origin: Config.APP.AUTH_CLIENT_URLS,
                credentials: true,
                methods: ["GET", "POST", "PUT", "PATCH", "DELETE"],
                allowedHeaders: [
                    "Origin",
                    "X-Requested-With",
                    "Content-Type",
                    "Accept",
                    "Authorization",
                ],
            })
        );

        this._app.use(
            morgan("combined", {
                stream: new AppLogStream(),
            })
        );
    }

    private initializeControllers() {
        ControllerList.forEach((controller: AppController) => {
            this._app.use("/", controller.router);
        });
    }

    private initializeErrorHandlerMiddlewares() {
        this._app.use((req: IAppRequest, res: IAppResponse, next: IAppNextFuction) => {
            res.status(404).send();
        });

        this._app.use((err: any, req: IAppRequest, res: IAppResponse, next: IAppNextFuction) => {
            Logger.error(err);
            res.status(500).send();
        });
    }

    public start() {
        this.initializeGlobalMiddlewares();
        this.initializeControllers();
        this.initializeErrorHandlerMiddlewares();
        this._app.listen(this.PORT, () => {
            Logger.info(`Server is listening on ${this.PORT}`);
        });
    }
}
