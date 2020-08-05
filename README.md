<img width="340" height="150" align="right" src="https://raw.githubusercontent.com/adelsz/pgtyped/master/header.png">

# [PgTyped](https://pgtyped.now.sh/)

![Version](https://img.shields.io/github/v/release/adelsz/pgtyped)
[![Actions Status](https://github.com/adelsz/pgtyped/workflows/CI/badge.svg)](https://github.com/adelsz/pgtyped/actions)

PgTyped makes it possible to use raw SQL in TypeScript with guaranteed type-safety.  
No need to map or translate your DB schema to TypeScript, PgTyped automatically generates types and interfaces for your SQL queries by using your running Postgres database as the source of type information.

---

## Features:
1. Automatically generates TS types for parameters/results of SQL queries of any complexity.
2. Supports extracting and typing queries from both SQL and TS files.
3. Generate query types as you write them, using watch mode.
4. Useful parameter interpolation helpers for arrays and objects.
5. No need to define your DB schema in TypeScript, your running DB is the live source of type data.
6. Prevents SQL injections by not doing explicit parameter substitution. Instead, queries and parameters are sent separately to the DB driver, allowing parameter substitution to be safely done by the PostgreSQL server.


### Documentation

Visit our new documentation page at [https://pgtyped.now.sh/](https://pgtyped.now.sh/)

### Getting started

1. `npm install @pgtyped/cli @pgtyped/query typescript` (typescript is a required peer dependency for pgtyped)
2. Create a PgTyped `config.json` file.
3. Run `npx pgtyped -w -c config.json` to start PgTyped in watch mode.

Refer to the [example app](./packages/example/README.md) for a preconfigured example.  

### Example

Lets save some queries in `books.sql`:
```sql
/* @name FindBookById */
SELECT * FROM books WHERE id = :bookId;
```

PgTyped parses the SQL file, extracting all queries and generating strictly typed TS queries in `books.queries.ts`:

```ts
/** Types generated for queries found in "books.sql" */

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

Query `findBookById` is now statically typed, with types inferred from the PostgreSQL schema.  
This generated query can be imported and executed as follows:

```ts
import { Client } from 'pg';
import { findBookById } from './books.queries';

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
      bookId: 5,
    },
    client,
  );
  console.log(`Book name: ${books[0].name}`);
  await client.end();
}

main();
```

### Resources

1. [Configuring Pgtyped](https://pgtyped.now.sh/docs/cli)
2. [Writing queries in SQL files](https://pgtyped.now.sh/docs/sql-file-intro)
3. [Advanced queries and parameter expansions in SQL files](https://pgtyped.now.sh/docs/sql-file)
3. [Writing queries in TS files](https://pgtyped.now.sh/docs/ts-file-intro)
3. [Advanced queries and parameter expansions in TS files](https://pgtyped.now.sh/docs/ts-file)

### Project state:

This project is being actively developed and its APIs might change.
All issue reports, feature requests and PRs appreciated.

### License

[MIT](https://github.com/adelsz/pgtyped/tree/master/LICENSE)

Copyright (c) 2019-present, Adel Salakh
