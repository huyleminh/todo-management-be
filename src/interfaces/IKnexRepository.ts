export interface IKnexReader<T> {
	getAll(): Promise<T[]>;
	get(filter: Partial<T>): Promise<T[]>;
}

export interface IKnexWriter<T, OmitKey extends string> {
	insert(items: Omit<T, OmitKey>[]): Promise<number[]>;
	update(filter: Partial<T>, value: Partial<T>): Promise<number[]>;
}
