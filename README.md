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

## Credits

- Alex Johansson (@katt) for tRPC. This library is heavily inspired by `trpc`.
