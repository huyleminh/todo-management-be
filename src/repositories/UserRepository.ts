import UserModel from "../models/UserModel";
import { DbConnection } from "../utils/DbConnection";
import KnexRepository from "./KnexRepository";

export default class UserRepository extends KnexRepository<UserModel, "userId"> {
    constructor() {
        super(DbConnection, "users");
    }
}
