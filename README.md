## PgTyped

[![Actions Status](https://github.com/adelsz/pgtyped/workflows/CI/badge.svg)](https://github.com/adelsz/pgtyped/actions)

Raw SQL query type generator.
Finally you can use raw SQL with guaranteed type-safety.
Works with PostgreSQL.

### Features:
1. Automatically generates types for parameters/results of SQL queries of any complexity
2. Generate query types as you type them using the `--watch` mode.
3. Useful parameter interpolation helpers for arrays and objects.

### Type generation example:

Query code:
```js
export const selectAllUsers = sql`
SELECT u.id,
       u.name AS username,
       b.name AS bookname
FROM users AS u
INNER JOIN books AS b ON b.uid = u.id
`;
```

Generated TypeScript interfaces:
```ts
/** 'SELECT_ALL_USERS' parameters type */
export type ISelectAllUsersParams = void;

/** 'SELECT_ALL_USERS' return type */
export interface ISelectAllUsersResult {
  id: string;
  username: string;
  bookname: string | null;
}
```

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

### Getting started:

1. `npm install @pgtyped/cli @pgtyped/query`
2. Create a config file for the type generator
3. `npx pgtyped`

You can also refer to the [example](https://github.com/adelsz/pgtyped/tree/master/packages/example) app, to see pgtyped in action.

### Project state:

This project is still in an experimental stage so its APIs are expected to change a lot in the short term.
Any help in the form of issue reports, feature requests or PRs is very appreciated.

### License

[MIT](https://github.com/adelsz/pgtyped/LICENSE)
Copyright (c) 2019-present, Adel Salakh
