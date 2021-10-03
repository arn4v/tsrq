export type Await<T> = T extends Promise<infer U> ? U : T;
export type UnknownInstance = QueryBuilder<any, any>;

class QueryBuilder<TQueries, TMutations> {
	readonly fetchers: Readonly<{
		queries: TQueries;
		mutations: TMutations;
	}>;

	constructor(options: { queries?: TQueries; mutations?: TMutations } = {}) {
		this.fetchers = {
			queries: (options?.queries ?? Object.create(null)) as TQueries,
			mutations: (options?.mutations ?? Object.create(null)) as TMutations,
		};
	}

	public query<TKey extends string, TFunc extends Function>(
		key: TKey,
		func: TFunc,
	): QueryBuilder<
		TQueries &
			{
				[key in typeof key]: typeof func;
			},
		TMutations
	> {
		return new QueryBuilder({
			...this.fetchers,
			queries: {
				...this.fetchers.queries,
				[key]: func,
			},
		}) as QueryBuilder<
			TQueries &
				{
					[key in typeof key]: typeof func;
				},
			TMutations
		>;
	}

	public mutation<TKey extends Readonly<string>, TFunc extends Function>(
		key: TKey,
		func: TFunc,
	): QueryBuilder<
		TQueries,
		TMutations &
			{
				[key in TKey]: TFunc;
			}
	> {
		return new QueryBuilder({
			...this.fetchers,
			mutations: {
				...this.fetchers.mutations,
				[key]: func,
			},
		}) as QueryBuilder<
			TQueries,
			TMutations &
				{
					[key in TKey]: TFunc;
				}
		>;
	}

	public merge<TBuilderInstance extends UnknownInstance>(
		builderInstance: TBuilderInstance,
	): QueryBuilder<
		TQueries & TBuilderInstance["fetchers"]["queries"],
		TMutations & TBuilderInstance["fetchers"]["mutations"]
	> {
		return new QueryBuilder({
			queries: {
				...this.fetchers.queries,
				...builderInstance.fetchers.queries,
			},
			mutations: {
				...this.fetchers.mutations,
				...builderInstance.fetchers.mutations,
			},
		});
	}
}

export const createQueryBuilder = () => new QueryBuilder();

export * from "./react-query";
