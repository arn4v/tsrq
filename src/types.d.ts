import { QueryBuilder } from "./builder";

export type Await<T> = T extends Promise<infer U> ? U : T;
export type UnknownInstance = QueryBuilder<any, any>;
