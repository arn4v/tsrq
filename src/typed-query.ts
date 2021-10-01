import { UnknownInstance } from './types';

class TypedQueryBuilder<TQueries, TMutations> {
  readonly fetchers: Readonly<{
    queries: TQueries;
    mutations: TMutations;
  }>;

  constructor(options: { queries?: TQueries; mutations?: TMutations } = {}) {
    this.fetchers = {
      queries: (options.queries ?? Object.create(null)) as TQueries,
      mutations: (options.mutations ?? Object.create(null)) as TMutations,
    };
  }

  public query<TKey extends string, TFunc extends Function>(
    key: TKey,
    func: TFunc
  ): TypedQueryBuilder<
    TQueries &
      {
        [key in typeof key]: typeof func;
      },
    TMutations
  > {
    return new TypedQueryBuilder({
      ...this.fetchers,
      queries: {
        ...this.fetchers.queries,
        [key]: func,
      },
    }) as TypedQueryBuilder<
      TQueries &
        {
          [key in typeof key]: typeof func;
        },
      TMutations
    >;
  }

  public mutation<TKey extends Readonly<string>, TFunc extends Function>(
    key: TKey,
    func: TFunc
  ): TypedQueryBuilder<
    TQueries,
    TMutations &
      {
        [key in TKey]: TFunc;
      }
  > {
    return new TypedQueryBuilder({
      ...this.fetchers,
      mutations: {
        ...this.fetchers.mutations,
        [key]: func,
      },
    }) as TypedQueryBuilder<
      TQueries,
      TMutations &
        {
          [key in TKey]: TFunc;
        }
    >;
  }

  public merge<TBuilderInstance extends UnknownInstance>(
    builderInstance: TBuilderInstance
  ): TypedQueryBuilder<
    TQueries & TBuilderInstance['fetchers']['queries'],
    TMutations & TBuilderInstance['fetchers']['mutations']
  > {
    return new TypedQueryBuilder({
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

export default TypedQueryBuilder;
