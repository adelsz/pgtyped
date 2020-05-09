# Annotated SQL files

PgTyped supports parsing queries from SQL files. This allows developers to write DB queries in their favourite database IDE.  
To help PgTyped generate executable queries from these SQL files, they sometimes need to be annotated with special comments.  

Annotated SQL file example:
```sql
/* @name getAllComments */
SELECT * FROM book_comments WHERE id = :commentId;

/*
  @name selectSomeUsers
  @param ages -> (...)
*/
SELECT FROM users WHERE age in :ages;
```

PgTyped has a number of requirements for SQL file contents:
1. Each query must be preceded with an annotation (comment).
2. The annotation must specify the query name using the `@name` tag.
3. Each query must be a single SQL statement that ends with a semicolon.
4. A query can contain parameters. Parameters should start with a colon, ex. `:paramName`.
5. Annotations can include param expansions if needed using the `@param` tag.

## Parameter expansions

You always define parameters by a colon-prefixed token in your query, like `:age`. Ordinary parameters (those that do not need to be expanded and can be directly substituted) do not need any additional annotations within the query comment block.

PgTyped also supports parameter expansions that help build more complicated queries by expanding parameters into their components arrays and fields, which are then spliced into the query.

For example, a typical insert query looks like this:

```sql
/*
  @name InsertComment
  @param comments -> ((userId, commentBody)...)
*/
INSERT INTO book_comments (user_id, body)
VALUES :comments;
```

Here `comments -> ((userId, commentBody)...)` is a parameter expansion that instructs pgtyped to expand `comments` into an array of objects with each object having a field `userId` and `commentBody`.

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

### 1. Array spread:

The array spread expansion allows to pass an array of scalars as parameter.  
#### Syntax:
```
@param paramName -> (...)
```

#### Example:
Query definition:
```sql
/*
  @name selectSomeUsers
  @param ages -> (...)
*/
SELECT FROM users WHERE age in :ages;
```
Params:
```ts
const parameters = { ages: [25, 30, 35] };
```
Expanded query to be executed:
```sql
SELECT FROM users WHERE age in (25, 30, 35);
```

### 2. Object pick:

The object pick expansion allows to pass an object as a parameter.  
#### Syntax:
```
@param paramName -> (name, age)
```

#### Example:
Query definition:
```sql
/*
  @name insertUsers
  @param user -> (name, age)
*/
INSERT INTO users (name, age) VALUES :user RETURNING id;
```
Params:
```ts
const parameters = { user: {name: 'Rob', age: 56} };
```
Expanded query to be executed:
```sql
INSERT INTO users (name, age) VALUES ('Rob', 56) RETURNING id;
```

### 2. Array spread and pick:

The array spread-and-pick expansion allows to pass an array of objects as a parameter.  
#### Syntax:
```
@param paramName -> ((name, age)...)
```

#### Example:
Query definition:
```sql
/*
  @name insertUsers
  @param users -> ((name, age)...)
*/
INSERT INTO users (name, age) VALUES :users RETURNING id;`;
```
Params:
```ts
const parameters = {
  users: [
    {name: 'Rob', age: 56},
    {name: 'Tom', age: 45},
  ]
};
```
Expanded query to be executed:
```sql
INSERT INTO users (name, age) VALUES (('Rob', 56), ('Tom', 45)) RETURNING id;
```

### Additional expansions and annotation tags

We will be adding more annotation tags and expansion types in the future.  
If you have an idea for a new expansion type, or a new annotation tag, please submit an issue for that so we can consider it.
