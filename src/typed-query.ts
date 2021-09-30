// import { useQuery, UseQueryResult } from "react-query";
// import { ValueOf } from "~/types";
import * as React from "react";
import {
  useQuery as useReactQuery,
  UseQueryOptions,
  UseQueryResult,
} from "react-query";
import { Await } from "./src/types";

const createTypedQuery = <
  QueryKeys extends string,
  TQueryFetchers extends Record<QueryKeys, (params: infer Params) => infer Data>
>(
  queryFetchers: Readonly<TQueryFetchers>
) => {
  function useQuery<
    Key extends QueryKeys,
    Params = Parameters<TQueryFetchers[Key]>[0],
    Data = Await<ReturnType<TQueryFetchers[Key]>>
  >(
    key: Key,
    params: Params,
    options?: UseQueryOptions<Data>
  ): UseQueryResult<Data>;

  function useQuery<
    Key extends QueryKeys,
    Params = Parameters<TQueryFetchers[Key]>[0],
    Data = Await<ReturnType<TQueryFetchers[Key]>>
  >(
    key: Key,
    params: Params,
    options?: UseQueryOptions<Data>
  ): UseQueryResult<Data>;

  function useQuery<
    Key extends QueryKeys,
    Params = Parameters<TQueryFetchers[Key]>[0],
    Data = Await<ReturnType<TQueryFetchers[Key]>>
  >(
    arg1: Key,
    arg2?: Params extends never ? UseQueryOptions<Data> : Params,
    arg3?: Params extends never ? never : UseQueryOptions<Data, unknown, Data>
  ) {
    const key = arg1;
    const params = Array.isArray(arg2) ? arg2 : [];
    const options = !!arg3 && Array.isArray(arg2) ? arg3 : arg2;

    return useReactQuery(
      key,
      () => queryFetchers[key].apply(null, params),
      options
    );
  }

  return useQuery;
};

// export default function createTypedQuery<
//   TQueryFetchers extends Record<
//     string,
//     (...args: any[]) => Promise<any> | (() => Promise<any>)
//   >,
//   QueryKeys = keyof TQueryFetchers
// >(queryFetchers: Readonly<TQueryFetchers>) {
//   function useQuery<
//     Key extends QueryKeys,
//     /* @ts-ignore */
//     Params = Parameters<TQueryFetchers[Key]>,
//     /* @ts-ignore */
//     Data = Await<ReturnType<TQueryFetchers[Key]>>
//   >(
//     key: Key,
//     params: Params,
//     options?: UseQueryOptions<Data>
//   ): UseQueryResult<Data>;

//   function useQuery<
//     Key extends QueryKeys,
//     /* @ts-ignore */
//     Params = Parameters<TQueryFetchers[Key]>,
//     /* @ts-ignore */
//     Data = Await<ReturnType<TQueryFetchers[Key]>>
//   >(
//     key: Key,
//     params: Params,
//     options?: UseQueryOptions<Data>
//   ): UseQueryResult<Data>;

//   function useQuery<
//     Key extends QueryKeys,
//     /* @ts-ignore */
//     Params = Parameters<TQueryFetchers[Key]>,
//     /* @ts-ignore */
//     Data = Await<ReturnType<TQueryFetchers[Key]>>
//   >(
//     arg1: Key,
//     arg2?: Params extends never ? UseQueryOptions<Data> : Params,
//     arg3?: Params extends never ? never : UseQueryOptions<Data, unknown, Data>
//   ) {
//     const key = arg1;
//     const params = Array.isArray(arg2) ? arg2 : [];
//     const options = !!arg3 && Array.isArray(arg2) ? arg3 : arg2;

//     return useReactQuery(
//       /* @ts-ignore */
//       key,
//       /* @ts-ignore */
//       () => queryFetchers[key].apply(null, params),
//       options
//     );
//   }

//   return useQuery;
// }

const fetchers = {
  pokemons: async (id: string) => {
    return id;
  },
} as const;

const useTypedQuery = createTypedQuery<keyof typeof fetchers, typeof fetchers>(
  fetchers
);

useTypedQuery("pokemons", 1, {});

const testFn = <T extends object>(m: T) => {
  return (key: keyof T) => key;
};

// export const createTypedQuery = <
//   T = Readonly<Record<string, (...args: any[]) => any | Promise<any>>>,
//   Keys = keyof T
// >(
//   fetchers: T
// ): ((...args: any[]) => UseQueryResult) => {
//   return useQuery();
// };

// const {} = createTypedQuery({
//   "employers/id": (id: string) => {
//     return fetch("/employers/" + id);
//   },
// });

// const createFetcher = <T, U>(fn: (params: T) => Promise<U> | U) => {
//   return fn as const;
// };

// /**
//  * @internal
//  */
// export type ProcedureRecord<
//   TInputContext = any,
//   TContext = any,
//   TInput = any,
//   TOutput = any
// > = Record<string, Procedure<TInputContext, TContext, TInput, TOutput>>;

// class Fetcher {
//   constructor(private key: string, private fun: ) {}

// }

// export default class TypedQuery {
//   private queries: Record<string, Fetcher>
// }

// const createTypedQuery = () => {};
