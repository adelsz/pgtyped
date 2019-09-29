## PgTyped

[![Actions Status](https://github.com/adelsz/pgtyped/workflows/CI/badge.svg)](https://github.com/adelsz/pgtyped/actions)

SQL query type generator.  
Finally you can use raw SQL with guaranteed type-safety.  
Works with PostgreSQL and TypeScript.

### Features:
1. Automatically generates types for parameters/results of SQL queries of any complexity.
2. Generate query types as you write them using watch mode.
3. Useful parameter interpolation helpers for arrays and objects.
4. No need to define your DB schema in TypeScript, your running DB is the live source of type data.

### Example:

Query code:
```js
import sql from "@pgtyped/query";

export const selectUserIds = sql<
  ISelectUserIdsResult, ISelectUserIdsParams
  >`select id from users where id = $id and age = $age`;
`;
```

Generated TypeScript interfaces:
```ts
/** 'selectUserIds' parameters type */
export interface ISelectUserIdsParams {
  id: string | null;
  age: number | null;
}

/** 'selectUserIds' return type */
export interface ISelectUserIdsResult {
  id: string;
}
```

To run the `selectUserIds` query:
```ts
  const users = await selectAllUsers.run({
    id: "some-user-id",
  }, connection);

  console.log(users[0]);
```

### Demo:

![](https://raw.githubusercontent.com/adelsz/pgtyped/master/demo.gif)

### Getting started:

1. `npm install @pgtyped/cli @pgtyped/query typescript`
2. Create a config file for the type generator
3. Put your queries in separate files (ex. `queries.ts`) and use the `sql` tag when defining them.
3. Run `npx pgtyped` to generate query type files.

You can also refer to the [example](https://github.com/adelsz/pgtyped/tree/master/packages/example) app, to see pgtyped in action.  
Additional details are available in READMEs for the [@pgtyped/cli](https://github.com/adelsz/pgtyped/tree/master/packages/cli) and [@pgtyped/query](https://github.com/adelsz/pgtyped/tree/master/packages/query) packages.

### Using PgTyped:

`pgtyped` command scans your `srcDir` for query files, 


### Interpolation helpers:

| Helper       | Syntax                      | Parameter Type                                             |
|---------------------|-----------------------------|------------------------------------------------------------|
| Named parameters    | `$paramName`                | `paramName: ParamType`                                     |
| Single value list   | `$paramName(name, author)`  | `paramName: { name: NameType, author: AuthorType }`        |
| Multiple value list | `$$paramName`               | `paramName: Array<ParamType>`                              |
| Multiple value list | `$$paramName(name, author)` | `paramName: Array<{ name: NameType, author: AuthorType }>` |

Example `insertUsers`:
```sql
INSERT INTO users (name, age)
VALUES $$users(name, age) RETURNING id
```
can be executed as follows:
```ts
const usersToInsert = [
  { name: 'Bob', age: 12 },
  { name: 'Tom', age: 16 },
];
const result = await insertUsers(usersToInsert, connection);
```

### Project state:

This project is still in an experimental stage so its APIs are expected to change a lot in the short term.
Any help in the form of issue reports, feature requests or PRs is very appreciated.

### License

[MIT](https://github.com/adelsz/pgtyped/tree/master/LICENSE)

Copyright (c) 2019-present, Adel Salakh
