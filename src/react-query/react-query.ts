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
  const mutationFetchers = instance.opts.mutations;
  type MutationKeys = keyof TInstance['opts']['mutations'] & string;
  type MutationFetchers = TInstance['opts']['mutations'];

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
  const queryFetchers = instance.opts.queries;
  type QueryKeys = keyof TInstance['opts']['queries'] & string;
  type Fetchers = TInstance['opts']['queries'];

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

  function useQuery<
    Key extends QueryKeys,
    Data = Await<ReturnType<Fetchers[Key]>>,
    Params = Parameters<Fetchers[Key]> extends []
      ? never
      : Parameters<Fetchers[Key]>
  >(key: Key, params: Params): UseQueryResult<Data>;

  function useQuery<
    Key extends QueryKeys,
    Data = Await<ReturnType<Fetchers[Key]>>,
    Options = UseQueryOptions<Data>
  >(key: Key, options?: Options): UseQueryResult<Data>;

  function useQuery<
    Key extends QueryKeys,
    Data = Await<ReturnType<Fetchers[Key]>>,
    Params = Parameters<Fetchers[Key]> extends []
      ? never
      : Parameters<Fetchers[Key]>,
    Options = UseQueryOptions<Data>
  >(
    arg1: Key,
    arg2?: Params extends never ? Options : Params,
    arg3?: Params extends never ? Options : Options
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
      options
    );
  }

  return useQuery;
}
