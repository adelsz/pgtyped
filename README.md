<img width="340" height="150" align="right" src="https://raw.githubusercontent.com/adelsz/pgtyped/master/header.png">

# PgTyped

![npm](https://img.shields.io/npm/v/@pgtyped/cli)
[![Actions Status](https://github.com/adelsz/pgtyped/workflows/CI/badge.svg)](https://github.com/adelsz/pgtyped/actions)

An SQL type generator that makes it possible to use raw SQL with guaranteed type-safety. Works with PostgreSQL and TypeScript.  

---

### Features:
1. Automatically generates types for parameters/results of SQL queries of any complexity.
2. Generate query types as you write them using watch mode.
3. Useful parameter interpolation helpers for arrays and objects.
4. No need to define your DB schema in TypeScript, your running DB is the live source of type data.
5. Prevents SQL injections by not doing explicit parameter substitution. Instead, queries and parameters are sent separately to the DB driver, allowing parameter substitution to be safely done by the PostgreSQL server.

### Example:

Query code in `users/queries.ts`:
```ts
import { sql } from "@pgtyped/query";
import { ISelectUserIdsQuery } from "./queries.types.ts";

export const selectUserIds = sql<ISelectUserIdsQuery>`select id from users where id = $id and age = $age`;
```

PgTyped parses `sql` queries and generates corresponding TS interfaces in `users/queries.types.ts`:
```ts
/** Types generated for queries found in "users/queries.ts" */

/** 'selectUserIds' query type */
export interface ISelectUserIdsQuery {
  params: ISelectUserIdsParams;
  result: ISelectUserIdsResult;
}

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

| Helper       | Syntax                      | Parameter Type                                                    |
|---------------------|-----------------------------|------------------------------------------------------------|
| Named parameters    | `$paramName`                | `paramName: ParamType`                                     |
| Single value list   | `$paramName(name, author)`  | `paramName: { name: NameType, author: AuthorType }`        |
| Multiple value list | `$$paramName`               | `paramName: Array<ParamType>`                              |
| Multiple value list | `$$paramName(name, author)` | `paramName: Array<{ name: NameType, author: AuthorType }>` |

Examples:

| Query                                                                 | Parameters                                                         | Resulting Query                                                         |
|-----------------------------------------------------------------------|--------------------------------------------------------------------|-------------------------------------------------------------------------|
| `SELECT * FROM users WHERE name = $name`                              | `{name:"John"}`                                                    | `SELECT * FROM users WHERE name = 'John'`                               |
| `INSERT INTO users (name, age) VALUES $user(name, age) RETURNING id`  | `{user:{name:"John",age:34}}`                                      | `INSERT INTO users (name, age) VALUES ('John', 34) RETURNING id`        |
| `SELECT * FROM users WHERE role in $$roles`                           | `{roles:["admin","superuser","moderator"]}`                        | `SELECT * FROM users where role in ('admin', 'superuser', 'moderator')` |
| `INSERT INTO users (name, age) VALUES $$users(name, age)`             | `{users:[{name:"John",age:34},{name:"Jack",age:35}]}`              | `INSERT INTO users (name, age) VALUES ('John', 34), ('Jack', 35)`       |

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

This project is still in an experimental stage so its APIs are expected to change frequently.
Any help in the form of issue reports, feature requests or PRs is very appreciated.

### License

[MIT](https://github.com/adelsz/pgtyped/tree/master/LICENSE)

Copyright (c) 2019-present, Adel Salakh
