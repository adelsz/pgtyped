---
id: sql-file-intro
title: Queries in SQL files 
sidebar_label: Queries in SQL files
---

Having installed and configured PgTyped it is now time to write some queries.  

Lets create our first query in `books/queries.sql`:
```sql title="books/queries.sql"
/* @name FindBookById */
SELECT * FROM books WHERE id = :bookId;
```

Notice the comment above the SQL query. PgTyped uses such comments to give generated query functions meaningful names.

If PgTyped is running in watch mode, it will automatically parse the SQL file on each change, extracting all queries and generating strictly typed TS queries in `books/queries.ts`:

```ts title="books/queries.ts"
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

Query `findBookById` is now statically typed, with types inferred from the PostgreSQL schema.  
This generated query can be imported and executed as follows:

```ts title="index.ts" {13}
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
      bookId: 42,
    },
    client,
  );
  console.log(`Book name: ${books[0].name}`);
  await client.end();
}

main();
```

For more information on writing queries in SQL files check out the [Annotated SQL](sql-file) guide.
