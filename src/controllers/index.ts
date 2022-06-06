import AppController from "./AppController";
import AuthController from "./auth/AuthController";

const ControllerList: AppController[] = [new AuthController()];
export default ControllerList;
