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

  public query<
    TKey extends Readonly<string>,
    TInput,
    TOutput,
    TFunc = (params: TInput) => Await<TOutput>
  >(
    key: TKey,
    fun: TFunc
  ): TypedQuery<
    TQueries &
      {
        // [key in keyof TKey]: TFunc;
        [key in typeof key]: TFunc;
      },
    TMutations
  > {
    return new TypedQuery({
      ...this.opts,
      queries: {
        ...this.opts.queries,
        [key]: fun,
      },
    }) as TypedQuery<
      TQueries &
        {
          [key in typeof key]: TFunc;
        },
      TMutations
    >;
  }

  public mutation<
    TKey extends Readonly<string>,
    TInput,
    TOutput,
    TFunc = (params: TInput) => Await<TOutput>
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
