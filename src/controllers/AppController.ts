import * as express from "express";

export default abstract class AppController {
    protected _router;
    constructor() {
        this._router = express.Router();
        this.init();
    }

    abstract init(): void;

    public get router(): express.Router {
        return this._router;
    }
}
