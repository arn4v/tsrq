import {
	MutationFunction,
	useMutation as useReactMutation,
	UseMutationOptions,
	useQuery as useReactQuery,
	UseQueryOptions,
	UseQueryResult,
} from "react-query";
import { Await, UnknownInstance } from "./types";

export function createUseMutation<TInstance extends UnknownInstance>(
	instance: TInstance,
) {
	const mutationFetchers = instance.fetchers.mutations;
	type MutationKeys = keyof TInstance["fetchers"]["mutations"] & string;
	type MutationFetchers = TInstance["fetchers"]["mutations"];

	const useMutation = <
		TKey extends MutationKeys,
		TVariables = Parameters<MutationFetchers[TKey]>[0],
		TData = Await<ReturnType<MutationFetchers[TKey]>>
	>(
		key: TKey,
		options?: UseMutationOptions<TData, unknown, TVariables>,
	) => {
		return useReactMutation(
			key,
			(mutationFetchers[key] as unknown) as MutationFunction<TData, TVariables>,
			options,
		);
	};

	return useMutation;
}

export function createUseQuery<TInstance extends UnknownInstance>(
	instance: TInstance,
) {
	const queryFetchers = instance.fetchers.queries;
	type QueryKeys = keyof TInstance["fetchers"]["queries"] & string;
	type Fetchers = TInstance["fetchers"]["queries"];

	function useQuery<
		Key extends QueryKeys,
		Options extends UseQueryOptions<Data>,
		Params extends Parameters<Fetchers[Key]>,
		Data = Await<ReturnType<Fetchers[Key]>>
	>(key: Key, params: Params, options?: Options): UseQueryResult<Data> {
		return useReactQuery(
			key,
			() => queryFetchers[key].apply(null, params),
			options as Options,
		);
	}

	return useQuery;
}
