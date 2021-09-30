import { Await } from './types';

class TypedQuery<TQueries, TMutations> {
  readonly opts: Readonly<{
    queries: TQueries;
    mutations: TMutations;
  }>;

  constructor(options: { queries?: TQueries; mutations?: TMutations } = {}) {
    this.opts = {
      queries: (options.queries ?? Object.create(null)) as TQueries,
      mutations: (options.mutations ?? Object.create(null)) as TMutations,
    };
  }

  public query<TKey extends string, TFunc extends (params: any) => any>(
    key: TKey,
    func: TFunc
  ): TypedQuery<
    TQueries &
      {
        [key in typeof key]: typeof func;
      },
    TMutations
  > {
    return new TypedQuery({
      ...this.opts,
      queries: {
        ...this.opts.queries,
        [key]: func,
      },
    }) as TypedQuery<
      TQueries &
        {
          [key in typeof key]: typeof func;
        },
      TMutations
    >;
  }

  public mutation<
    TKey extends Readonly<string>,
    TFunc extends (params: any) => any
  >(
    key: TKey,
    func: TFunc
  ): TypedQuery<
    TQueries,
    TMutations &
      {
        [key in TKey]: TFunc;
      }
  > {
    return new TypedQuery({
      ...this.opts,
      mutations: {
        ...this.opts.mutations,
        [key]: func,
      },
    }) as TypedQuery<
      TQueries,
      TMutations &
        {
          [key in TKey]: TFunc;
        }
    >;
  }
}

export default TypedQuery;
