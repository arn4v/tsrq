import TypedQuery from './typed-query';

export type Await<T> = T extends Promise<infer U> ? U : T;
export type UnknownInstance = TypedQuery<any, any>;
