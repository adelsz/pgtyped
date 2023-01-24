---
id: ts-file
title: Typescript files
sidebar_label: Typescript files
---

PgTyped also supports parsing queries from TS files.
Such queries must be tagged with an `sql` template literal, like this:

```ts
import { sql } from '@pgtyped/runtime';

const getUsersWithComments = sql`
  SELECT u.* FROM users u
  INNER JOIN book_comments bc ON u.id = bc.user_id
  GROUP BY u.id
  HAVING count(bc.id) > $minCommentCount;`;
```

PgTyped will then scan your project for such `sql` tags and generate types for each query, saving the types in a `filename.types.ts` file.
Once the type files have been generated you can import them to type your query:

```ts
import { sql } from '@pgtyped/runtime';
import { IGetUsersWithCommentsQuery } from './sample.types';

const getUsersWithComments = sql<IGetUsersWithCommentsQuery>`
  SELECT u.* FROM users u
  INNER JOIN book_comments bc ON u.id = bc.user_id
  GROUP BY u.id
  HAVING count(bc.id) > $minCommentCount;`;

const result = await getUsersWithComments.run({ minCommentCount: 12 }, client);
```

# Expansions

Template literals also support parameter expansions.
Here is how a typical insert query looks like using SQL-in-TS syntax:

```ts
const query = sql`INSERT INTO users (name, age) VALUES $$users(name, age) RETURNING id`;
```

Here `$$users(name, age)` is a parameter expansion.

## Expansions in SQL-in-TS queries

### Array spread

The array spread expansion allows to pass an array of scalars as parameter.

#### Syntax:

```ts
$$paramName;
```

#### Example:

```ts title="Query code:"
const query = sql<IQueryType>`SELECT FROM users where age in $$ages`;

const parameters = { ages: [25, 30, 35] };

query.run(parameters, connection);
```

```sql title="Resulting query:"
-- Bindings: [25, 30, 35]
SELECT FROM users WHERE age in (25, 30, 35);
```

### Object pick

The object pick expansion allows to pass an object as a parameter.

#### Syntax:

```
$user(name, age)
```

#### Example:

```ts title="Query code:"
const query = sql<
  IQueryType
>`INSERT INTO users (name, age) VALUES $user(name, age) RETURNING id`;

const parameters = { user: { name: 'Rob', age: 56 } };

query.run(parameters, connection);
```

```sql title="Resulting query:"
-- Bindings: ['Rob', 56]
INSERT INTO users (name, age) VALUES ($1, $2) RETURNING id;
```

### Array spread and pick

The array spread-and-pick expansion allows to pass an array of objects as a parameter.

#### Syntax:

```
$$user(name, age)
```

#### Example:

```ts
const query = sql`INSERT INTO users (name, age) VALUES $$users(name, age) RETURNING id`;

const parameters = {
  users: [
    { name: 'Rob', age: 56 },
    { name: 'Tom', age: 45 },
  ],
};

query.run(parameters, connection);
```

```sql title="Resulting query:"
-- Bindings: ['Rob', 56, 'Tom', 45]
INSERT INTO users (name, age) VALUES ($1, $2), ($3, $4) RETURNING id;
```

## Parameter type reference

| Expansion             | Syntax                      | Parameter Type                                             |
| --------------------- | --------------------------- | ---------------------------------------------------------- |
| Scalar parameter      | `$paramName`                | `paramName: ParamType`                                     |
| Object pick           | `$paramName(name, author)`  | `paramName: { name: NameType, author: AuthorType }`        |
| Array spread          | `$$paramName`               | `paramName: Array<ParamType>`                              |
| Array pick and spread | `$$paramName(name, author)` | `paramName: Array<{ name: NameType, author: AuthorType }>` |

## Substitution reference

| Expansion             | Query in TS                  | Query with substituted parameter  |
|-----------------------|------------------------------|-----------------------------------|
| Simple parameter      | `$parameter`                 | `$1`                              |
| Object pick           | `$object(prop1, prop2)`      | `($1, $2)`                        |
| Array spread          | `$$array`                    | `($1, $2, $3)`                    |
| Array pick and spread | `$$objectArray(prop1, prop2)`| `($1, $2), ($3, $4), ($5, $6)`    |
