<h1><b><center>tsrq</center></b></h1>

- [Introduction](#introduction)
- [Install](#install)
- [Quick Start Example:](#quick-start-example)
- [API Reference](#api-reference)
- [Credits](#credits)

## Introduction

When using React Query, for the same query, you can either copy paste the code into different components or abstract it into a custom hook. The first one is just bad practice and the second method become unmanageable very quickly as your app (and # of endpoints) grows.

With TSRQ, you only define you write code for your queries and mutations once and reuse them wherever you want.

## Install

npm:

```bash
npm i -S tsrq react-query
```

yarn:

```bash
yarn add tsrq react-query
```

## Quick Start Example:

```tsx
import {
	createQueryBuilder,
	createUseQuery,
	createUseMutation,
} from "typed-query";

interface ITodo {
	id: string;
	title: string;
}

const builder = createQueryBuilder()
	.query("todos", async () => {
		return await fetch("/todos").then(res => res.json() as Array<ITodo>);
	})
	.query("byId", async (id: string) => {
		return await fetch(`/todos/${id}`).then(res => res.json() as ITodo);
	})
	.mutation("updateTodo", async ({ id, title }: ITodo) => {
		return await fetch(`/todos/${id}`, {
			method: "PATCH",
			body: JSON.stringify({ title }),
		}).then(res => res.json() as ITodo);
	});

const useQuery = createUseQuery(builder);
const useMutation = createUseMutation(builder);

export default function TodosList() {
	const { data } = useQuery("todos");

	return (
		<ul>
			{data?.map(item => (
				<li key={item.id}>{item.title}</li>
			))}
		</ul>
	);
}

export default function TodoPage({ id }: { id: string }) {
	const { data } = useQuery("byId", id);
	const { mutate } = useMutation("updateTodo");

	return <div>{data?.title}</div>;
}
```

## API Reference

- createQueryBuilder

Create instance:

```ts
import { createQueryBuilder } from "tsrq";

const builder = createQueryBuilder();
```

Add Query to Instance:

```ts
import { createQueryBuilder } from "tsrq";

const builder = createQueryBuilder().query("todos", () => {
	return fetch("/todos").then(res => res.json());
});
```

Add Mutation to Instance:

```ts
import { createQueryBuilder } from "tsrq";

const builder = createQueryBuilder().mutation("add", (title: string) => {
	return fetch("/todos", {
		method: "POST",
		body: JSON.stringify({
			title,
		}),
	});
});
```

- createUseQuery

```ts
import { createQueryBuilder, createUseQuery } from "tsrq";

// Builder Code
const builder = createQueryBuilder();
// ...End Builder Code

export const useQuery = createUseQuery(builder);
```

Usage:

```tsx
import * as React from "react";
import { useQuery } from "./tsrq.config";

const TodoPage = ({ id }: { id: string }) => {
	const { data, isLoading } = useQuery("byId", [id]);

	if (isLoading) return null;

	return <div>{/** JSX */}</div>;
};
```

- createUseMutation

```ts
import { createQueryBuilder, createUseMutation } from "tsrq";

// Builder Code
const builder = createQueryBuilder();
// ...End Builder Code

export const useMutation = createUseMutation(builder);
```

Usage:

```tsx
import * as React from "react";
import { useMutation } from "./tsrq.config";

const CreateTodoPage = () => {
	const [title, setTitle] = React.useState("");
	const { mutate } = useMutation("add");

	const addTodo = () => {
		mutate(title);
	};
	return <div>{/** JSX */}</div>;
};
```

## Credits

- Alex Johansson (@katt) for tRPC. This library is heavily inspired by `trpc`.
