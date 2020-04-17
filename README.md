<img width="340" height="150" align="right" src="https://raw.githubusercontent.com/adelsz/pgtyped/master/header.png">

# PgTyped

![npm](https://img.shields.io/npm/v/@pgtyped/cli)
[![Actions Status](https://github.com/adelsz/pgtyped/workflows/CI/badge.svg)](https://github.com/adelsz/pgtyped/actions)

An SQL type generator that makes it possible to use raw SQL with guaranteed type-safety. Works with PostgreSQL and TypeScript.  

---

## Features:
1. Automatically generates types for parameters/results of SQL queries of any complexity.
2. Supports extracting and typing queries from both SQL and TS files.
3. Generate query types as you write them using watch mode.
4. Useful parameter interpolation helpers for arrays and objects.
5. No need to define your DB schema in TypeScript, your running DB is the live source of type data.
6. Prevents SQL injections by not doing explicit parameter substitution. Instead, queries and parameters are sent separately to the DB driver, allowing parameter substitution to be safely done by the PostgreSQL server.

## Supported file sources:

PgTyped can extract and process queries from both SQL and TS files:

### For queries defined in SQL files:

Query code in `books/queries.sql`:
```sql
/* @name FindBookById */
SELECT * FROM books WHERE id = :bookId;
```

PgTyped parses the SQL file extracting all queries and generating strictly typed TS queries in `users/queries.ts`:

```ts
/** Types generated for queries found in "src/books/queries.sql" */

//...

/** 'FindBookById' parameters type */
export interface IFindBookByIdParams {
  bookId: number | null;
}

/** 'FindBookById' return type */
export interface IFindBookByIdResult {
  id: number;
  rank: number | null;
  name: string | null;
  author_id: number | null;
}

/**
 * Query generated from SQL:
 * SELECT * FROM books WHERE id = :commentId
 */
export const findBookById = new PreparedQuery<
  IFindBookByIdParams,
  IFindBookByIdResult
>(...);
```

Query `findBookById` is statically typed with types inferred from the PostgreSQL schema.  
It can now be imported and executed as follows:

```ts
import { Client } from 'pg';
import { findBookById } from './src/books/queries.sql';

export const client = new Client({
  host: 'localhost',
  user: 'test',
  password: 'example',
  database: 'test',
});

async function main() {
  await client.connect();
  const books = await findBookById.run(
    {
      bookId: 'carl-sagan-76',
    },
    client,
  );
  console.log(`Book name: ${books[0].name}`);
}

main();
```

### For queries defined in TS files:

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

### Getting started:

1. `npm install @pgtyped/cli @pgtyped/query typescript`
2. Create a PgTyped `config.json` file.
3. Run `npx pgtyped -w -c config.json` to start PgTyped in watch mode.

Refer to the [example app](./packages/example/README.md) for a preconfigured example.  

### Using PgTyped:

PgTyped requires a `config.json` file to run, a basic config file looks like this:
```json
{
  "transforms": [
    {
      "mode": "sql",
      "include": "queries.sql"
    }
  ],
  "srcDir": "./src/",
  "db": {
    "host": "db",
    "user": "test",
    "dbName": "test",
    "password": "example"
  }
}
```

Refer to PgTyped [CLI docs](./packages/cli/README.md) for more info on the config file and CLI flags.

To find out more on how to write typed queries in TS or SQL files:
* [Annotated SQL files](./docs/annotated-sql.md)
* [TypeScript files](./docs/sql-in-ts.md)

### Parameter expansions:

PgTyped also supports parameter expansions to help you build more complicated queries.
For example, a typical insert query looks like this:

```sql
/*
  @name InsertComment
  @param comments -> ((userId, commentBody)...)
*/
INSERT INTO book_comments (user_id, body)
VALUES :comments;
```

Notice the expansion `comments -> ((userId, commentBody)...)` that allows to pass an array of objects as `comments`: 
```ts
const parameters = [
  {
     userId: 1,
     commentBody: "What a great book, highly recommended!"
  },
  {
     userId: 2,
     commentBody: "Good read, but there is much more to the subject.."
  },
]
```
Expanded query:
```sql
INSERT INTO book_comments (user_id, body)
VALUES (
  (1, 'What a great book, highly recommended!'),
  (2, 'Good read, but there is much more to the subject.')
);
```

You can learn more about the expansion types here:
* [Annotated SQL files](./docs/annotated-sql.md)
* [TypeScript files](./docs/sql-in-ts.md)

### Project state:

This project is being actively developed and its APIs might change.
All issue reports, feature requests and PRs appreciated.

[Project Goals and Roadmap](./docs/roadmap.md)

### License

[MIT](https://github.com/adelsz/pgtyped/tree/master/LICENSE)

Copyright (c) 2019-present, Adel Salakh
