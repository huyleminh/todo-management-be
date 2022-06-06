import UserTokenModel from "../models/UserTokenModel";
import { DbConnection } from "../utils/DbConnection";
import KnexRepository from "./KnexRepository";

export default class UserTokenRepository extends KnexRepository<UserTokenModel, "id"> {
	constructor() {
		super(DbConnection, "user_tokens");
	}
}
