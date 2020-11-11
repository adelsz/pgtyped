---
id: sql-file
title: Annotated SQL files
sidebar_label: Annotated SQL files
---

PgTyped supports parsing queries from SQL files, allowing developers to write DB queries in their favourite database IDE.
To help PgTyped generate executable queries from these SQL files, they need to be annotated with special comments.

```sql title="example.sql"
/* @name getAllComments */
SELECT * FROM book_comments WHERE id = :commentId;

/*
  @name selectSomeUsers
  @param ages -> (...)
*/
SELECT FROM users WHERE age in :ages;
```

## Annotation format

PgTyped has a number of requirements for SQL file contents:

1. Each query must be preceded with an annotation (comment).
2. An annotation must specify the query name using the `@name` tag.
3. Each query must be a single SQL statement that ends with a semicolon.
4. Queries can contain parameters. Parameters should start with a colon, ex. `:paramName`.
5. Annotations can include param expansions if needed using the `@param` tag.

## Parameter expansions

Parameter expansions allow the user to pass arrays and objects as query parameters.
This allows to build more complicated queries, which would be impossible or would look too big if they used only scalar parameters.

For example, with parameter expansions a typical insert query looks like this:

```sql
/*
  @name InsertComment
  @param comments -> ((userId, commentBody)...)
*/
INSERT INTO book_comments (user_id, body)
VALUES :comments;
```

Here `comments -> ((userId, commentBody)...)` is a parameter expansion that instructs pgtyped to expand `comments` into an array of objects with each object having a `userId` and `commentBody` field.

A query can also contain multiple expansions if needed:

```sql
/*
  @name selectSomeUsers
  @param ages -> (...)
  @param names -> (...)
*/
SELECT FROM users WHERE age in :ages or name in :names;
```

At the moment, PgTyped supports three expansion types:

### Array spread

The array spread expansion allows to pass an array of scalars as parameter.

#### Syntax:

```
@param paramName -> (...)
```

#### Example:

```sql title="Query definition:"
/*
  @name selectSomeUsers
  @param ages -> (...)
*/
SELECT FROM users WHERE age in :ages;
```

```ts title="Execution:"
const parameters = { ages: [25, 30, 35] };
selectSomeUsers.run(parameters, connection);
```

```sql title="Resulting query:"
-- Parameters: [25, 30, 35]
SELECT FROM users WHERE age in ($1, $2, $3);
```

### Object pick

The object pick expansion allows to pass an object as a parameter.

#### Syntax:

```
@param paramName -> (name, age)
```

#### Example:

```sql title="Query definition:"
/*
  @name insertUsers
  @param user -> (name, age)
*/
INSERT INTO users (name, age) VALUES :user RETURNING id;
```

```ts title="Execution:"
const parameters = { user: { name: 'Rob', age: 56 } };
insertUsers.run(parameters, connection);
```

```sql title="Resulting query:"
-- Bindings: ['Rob', 56]
INSERT INTO users (name, age) VALUES ($1, $2) RETURNING id;
```

### Array spread and pick

The array spread-and-pick expansion allows to pass an array of objects as a parameter.

#### Syntax:

```
@param paramName -> ((name, age)...)
```

#### Example:

```sql title="Query definition:"
/*
  @name insertUsers
  @param users -> ((name, age)...)
*/
INSERT INTO users (name, age) VALUES :users RETURNING id;`;
```

```ts title="Execution:"
const parameters = {
  users: [
    { name: 'Rob', age: 56 },
    { name: 'Tom', age: 45 },
  ],
};
insertUsers.run(parameters, connection);
```

```sql title="Resulting query:"
-- Bindings: ['Rob', 56, 'Tom', 45]
INSERT INTO users (name, age) VALUES ($1, $2), ($3, $4) RETURNING id;
```

:::note
We will be adding more annotation tags and expansion types in the future.  
If you have an idea for a new expansion type, or a new annotation tag, please submit an issue for that so we can consider it.
:::
