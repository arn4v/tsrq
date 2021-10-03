import useSWROriginal, { mutate as mutateOriginal } from "swr";
import { UnknownInstance } from "../types";

function createUseSwr<TInstance extends UnknownInstance>(instance: TInstance) {
	const queryFetchers = instance.fetchers.queries;
	type QueryKeys = keyof TInstance["fetchers"]["queries"] & string;
	type Fetchers = TInstance["fetchers"]["queries"];

	function useSWR<
		TKey extends QueryKeys,
		Params extends Parameters<Fetchers[TKey]>
	>(key: TKey, params: Params extends [] ? never : Params) {
		return useSWROriginal([key], () => queryFetchers[key].apply(null, params));
	}

	const mutate = <TKey extends QueryKeys>(key: TKey) => mutateOriginal(key);

	return { useSWR, mutate };
}

export { createUseSwr };
