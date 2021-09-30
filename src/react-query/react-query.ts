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

export function createReactQueryHooks<TInstance extends UnknownInstance>(
  instance: TInstance
) {
  type QueryKeys = keyof TInstance['opts']['queries'] & string;
  type Fetchers = TInstance['opts']['queries'];
  const queryFetchers = instance.opts.queries;

  function useQuery<
    Key extends QueryKeys,
    Params = Parameters<Fetchers[Key]> extends []
      ? never
      : Parameters<Fetchers[Key]>,
    Data = Await<ReturnType<Fetchers[Key]>>
  >(
    key: Key,
    arg2: Params extends never ? UseQueryOptions<Data> : Params,
    arg3?: Params extends never ? never : UseQueryOptions<Data, unknown, Data>
  ): UseQueryResult<Data> {
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

  type MutationKeys = keyof TInstance['opts']['mutations'] & string;
  type MutationFetchers = TInstance['opts']['mutations'];
  const mutationFetchers = instance.opts.mutations;

  function useMutation<
    TKey extends MutationKeys,
    TVariables = Parameters<MutationFetchers[TKey]>[0],
    TData = Await<ReturnType<MutationFetchers[TKey]>>
  >(key: TKey, options?: UseMutationOptions<TData, unknown, TVariables>) {
    return useReactMutation(
      key,
      (mutationFetchers[key] as unknown) as MutationFunction<TData, TVariables>,
      options
    );
  }

  return { useQuery, useMutation };
}
