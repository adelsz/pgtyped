## @pgtyped/query

This package provides the `sql` tagged template.  
The `sql` tagged template requires a generic parameter: `<TQueryType>`.
For each query PgTyped generates an interface that can be used in this parameter to type your query.

To run a query defined with the `sql` tagged template, call the `sql.run` method.  
The `sql.run` method automatically enforces correct input `TParams` and output `TResult` types.

```js
public run: (
  params: TParams,
  dbConnection: IDatabaseConnection,
) => Promise<TResult[]>;
```

Here `dbConnection` is any object that satisifies the `IDatabaseConnection` interface. It is used to actually send the query to the DB for execution.

```
interface IDatabaseConnection {
  query: (query: string, bindings: any[]) => Promise<{ rows: any[] }>;
}
```

This is usually the `client` object created with [node-postgres](https://github.com/brianc/node-postgres), but can be any other connection of your choice.

This package is part of the pgtyped project.  
Refer to [README](https://github.com/adelsz/pgtyped) for details.
