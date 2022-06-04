import { IAppRequest, IAppResponse } from "../../interfaces/IBaseInterfaces";
import AppResponse from "../../shared/AppResponse";
import AppController from "../AppController";

export default class DemoController extends AppController {
    constructor() {
        super();
    }

    init(): void {
        this._router.get("/", this.handleDemo);
    }

    handleDemo(req: IAppRequest, res: IAppResponse): void {
        new AppResponse(res).send();
    }
}
