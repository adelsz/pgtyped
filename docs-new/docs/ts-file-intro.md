---
id: ts-file-intro
title: SQL-in-TS
sidebar_label: Queries in TS files
---

It sometimes makes sense to inline your queries instead of collecting them in separate SQL files.  
PgTyped supports inlined queries using the `sql` template literal.
To see how that works lets write some queries in `users/queries.ts`:

```ts title="users/queries.ts"
import { sql } from '@pgtyped/query';
import { ISelectUserIdsQuery } from './queries.types.ts';

export const selectUserIds = sql<
  ISelectUserIdsQuery
>`select id from users where id = $id and age = $age`;
```

PgTyped parses your TS files, scanning them for `sql` queries and generating corresponding TS interfaces in `users/queries.types.ts`:

```ts title="users/queries.types.ts"
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

We can now pass the `ISelectUserIdsQuery` as a generic parameter to our query in `users/queries.ts`:

```ts title="users/queries.ts"
import { sql } from '@pgtyped/query';
import { ISelectUserIdsQuery } from './queries.types.ts';

export const selectUserIds = sql<
  ISelectUserIdsQuery
>`select id from users where id = $id and age = $age`;

const users = await selectUserIds.run(
  {
    id: 'some-user-id',
    age: 34,
  },
  connection,
);

console.log(users[0]);
```

For more information on writing queries in TS files checkout the [SQL-in-TS](ts-file) guide.
