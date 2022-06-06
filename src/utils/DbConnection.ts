import { knex, Knex } from "knex";
import Config from "../../configs/config";

export const connectionInfo: Knex.MySqlConnectionConfig = {
	host: Config.DB.HOST,
	port: Config.DB.PORT,
	user: Config.DB.USER_NAME,
	password: Config.DB.PASSWORD,
	database: Config.DB.SCHEMA,
};

export const DbConnection: Knex = knex({
	client: "mysql2",
	connection: connectionInfo,
	pool: { min: 0, max: 10 },
});
