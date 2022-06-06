import { Knex } from "knex";
import { IKnexReader, IKnexWriter } from "../interfaces/IKnexRepository";

export default abstract class KnexRepository<T, K extends string>
	implements IKnexReader<T>, IKnexWriter<T, K>
{
	constructor(protected readonly _connection: Knex, protected readonly _tableName: string) {}

	get queryBuilder() {
		return this._connection(this._tableName);
	}

	getAll(): Promise<T[]> {
		return this.queryBuilder.select();
	}

	get(filter: Partial<T>): Promise<T[]> {
		return this.queryBuilder.where(filter).select();
	}

	/**
	 *
	 * @param item
	 * @returns array of inserted id
	 */
	insert(items: Omit<T, K>[]): Promise<number[]> {
		return this.queryBuilder.insert(items);
	}

	/**
	 *
	 * @description supports PostgreSQL, MSSQL, and Oracle databases
	 * @param items
	 * @param returnOptions
	 */
	insertWithReturn(items: Omit<T, K>[], returnOptions: string[]) {
		return this.queryBuilder.insert(items, returnOptions);
	}

	update(filter: Partial<T>, value: Partial<T>): Promise<number[]> {
		return this.queryBuilder.where(filter).update(value);
	}
}
