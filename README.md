# TypeScript React Query

If you're using React Query, you can either make use of the vanilla useQuery hook from `react-query` in every component. However, as your app grows and you need to reuse some of the same queries and mutations in multiple components you would have to extract those queries into many hooks.

While it's fine for a few queries, it can become cumbersome quickly if you have a complex app that's pulling data from 10s if not 100s of endpoints.

With TSRQ, you only define you write code for your queries and mutations once and reuse them wherever you want.

## Example usage:

```tsx
import {
  createQueryBuilder,
  createUseQuery,
  createUseMutation,
} from 'typed-query';

interface ITodo {
  id: string;
  title: string;
}

const builder = createQueryBuilder()
  .query('todos', async () => {
    return await fetch('/todos').then(res => res.json() as Array<ITodo>);
  })
  .query('byId', async (id: string) => {
    return await fetch(`/todos/${id}`).then(res => res.json() as ITodo);
  })
  .mutation('updateTodo', async ({ id, title }: ITodo) => {
    return await fetch(`/todos/${id}`, {
      method: 'PATCH',
      body: JSON.stringify({ title }),
    }).then(res => res.json() as ITodo);
  });

const useQuery = createUseQuery(builder);
const useMutation = createUseMutation(builder);

export default function TodosList() {
  const { data } = useQuery('todos');

  return (
    <ul>
      {data?.map(item => (
        <li key={item.id}>{item.title}</li>
      ))}
    </ul>
  );
}

export default function TodoPage({ id }: { id: string }) {
  const { data } = useQuery('byId', id);
  const { mutate } = useMutation('updateTodo');

  return <div>{data?.title}</div>;
}
```

## Credits

- Alex Katt for tRPC. This project is heavily inspired by `trpc`.
