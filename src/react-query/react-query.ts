import * as React from 'react';
import {
  useQuery as useReactQuery,
  useMutation as useReactMutation,
  UseQueryOptions,
  UseQueryResult,
  UseMutationOptions,
  MutationFunction,
} from 'react-query';
import { Await, UnknownInstance } from '../types';

export function createUseMutation<TInstance extends UnknownInstance>(
  instance: TInstance
) {
  const mutationFetchers = instance.fetchers.mutations;
  type MutationKeys = keyof TInstance['fetchers']['mutations'] & string;
  type MutationFetchers = TInstance['fetchers']['mutations'];

  const useMutation = <
    TKey extends MutationKeys,
    TVariables = Parameters<MutationFetchers[TKey]>[0],
    TData = Await<ReturnType<MutationFetchers[TKey]>>
  >(
    key: TKey,
    options?: UseMutationOptions<TData, unknown, TVariables>
  ) => {
    return useReactMutation(
      key,
      (mutationFetchers[key] as unknown) as MutationFunction<TData, TVariables>,
      options
    );
  };

  return useMutation;
}

export function createUseQuery<TInstance extends UnknownInstance>(
  instance: TInstance
) {
  const queryFetchers = instance.fetchers.queries;
  type QueryKeys = keyof TInstance['fetchers']['queries'] & string;
  type Fetchers = TInstance['fetchers']['queries'];

  // function useQuery<
  //   Key extends QueryKeys,
  //   Params = Parameters<Fetchers[Key]>,
  //   Data = Await<ReturnType<Fetchers[Key]>>
  // >(key: Key, options?: UseQueryOptions<Data>): UseQueryResult<Data>;

  // function useQuery<
  //   Key extends QueryKeys,
  //   Params = Parameters<typeof queryFetchers[Key]>,
  //   Data = Await<ReturnType<typeof queryFetchers[Key]>>
  // >(
  //   key: Key,
  //   params: Params,
  //   options?: UseQueryOptions<Data>
  // ): UseQueryResult<Data>;

  // function useQuery<
  //   Key extends QueryKeys,
  //   Params extends Parameters<Fetchers[Key]> = Parameters<Fetchers[Key]>,
  //   Data = Await<ReturnType<Fetchers[Key]>>,
  //   Options = UseQueryOptions<Data>
  // >(
  //   key: Key,
  //   params: Params,
  //   options?: Params extends [] ? Options : Params
  // ): UseQueryResult<Data>;

  // function useQuery<
  //   Key extends QueryKeys,
  //   Params extends Parameters<Fetchers[Key]> = Parameters<Fetchers[Key]>,
  //   Data = Await<ReturnType<Fetchers[Key]>>,
  //   Options = UseQueryOptions<Data>
  // >(key: Key, options: Options): UseQueryResult<Data>;

  function useQuery<
    Key extends QueryKeys,
    Options extends UseQueryOptions<Data>,
    Params extends Parameters<Fetchers[Key]>,
    Data = Await<ReturnType<Fetchers[Key]>>
  >(
    arg1: Key,
    arg2: Params extends [] ? Options : Params,
    arg3?: Params extends [] ? never : Options
  ): UseQueryResult<Data> {
    const key = React.useMemo(() => arg1, [arg1]);
    const params = React.useMemo(() => (Array.isArray(arg2) ? arg2 : []), [
      arg2,
    ]);
    const options = React.useMemo(
      () => (!!arg3 && Array.isArray(arg2) ? arg3 : arg2),
      [arg2, arg3]
    );

    return useReactQuery(
      key,
      () => queryFetchers[key].apply(null, params),
      options as Options
    );
  }

  return useQuery;
}
