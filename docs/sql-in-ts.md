# SQL in TS files

PgTyped also supports parsing queries from TS files.
Such queries must be tagged with an `sql` template literal, like this: 

```ts
import { sql } from '@pgtyped/query';

const getUsersWithComments = sql`
  SELECT u.* FROM users u
  INNER JOIN book_comments bc ON u.id = bc.user_id
  GROUP BY u.id
  HAVING count(bc.id) > $minCommentCount;`;
```

PgTyped will then scan your project for such `sql` tags and generate types for each query, saving the types in a `filename.types.ts` file.
Once the type files have been generated you can import them to type your query: 

```ts
import { sql } from '@pgtyped/query';
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

## Expansions in SQL-in-TS queries:

### 1. Array spread:

The array spread expansion allows to pass an array of scalars as parameter.  
#### Syntax:
```ts
$$paramName
```

#### Example:
Query definition:
```ts
const query = sql`SELECT FROM users where age in $$ages`;
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
$user(name, age)
```

#### Example:
Query definition:
```ts
const query = sql`INSERT INTO users (name, age) VALUES $user(name, age) RETURNING id`;
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
$$user(name, age)
```

#### Example:
Query definition:
```ts
const query = sql`INSERT INTO users (name, age) VALUES $$users(name, age) RETURNING id`;
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
INSERT INTO users (name, age) VALUES ('Rob', 56), ('Tom', 45) RETURNING id;
```

### Reference

| Expansion       | Syntax                      | Parameter Type                                                    |
|---------------------|-----------------------------|------------------------------------------------------------|
| Scalar parameter    | `$paramName`                | `paramName: ParamType`                                     |
| Object pick   | `$paramName(name, author)`  | `paramName: { name: NameType, author: AuthorType }`        |
| Array spread | `$$paramName`               | `paramName: Array<ParamType>`                              |
| Array pick and spread | `$$paramName(name, author)` | `paramName: Array<{ name: NameType, author: AuthorType }>` |

Examples:

| Query                                                                 | Parameters                                                         | Resulting Query                                                         |
|-----------------------------------------------------------------------|--------------------------------------------------------------------|-------------------------------------------------------------------------|
| `SELECT * FROM users WHERE name = $name`                              | `{name:"John"}`                                                    | `SELECT * FROM users WHERE name = 'John'`                               |
| `INSERT INTO users (name, age) VALUES $user(name, age) RETURNING id`  | `{user:{name:"John",age:34}}`                                      | `INSERT INTO users (name, age) VALUES ('John', 34) RETURNING id`        |
| `SELECT * FROM users WHERE role in $$roles`                           | `{roles:["admin","superuser","moderator"]}`                        | `SELECT * FROM users where role in ('admin', 'superuser', 'moderator')` |
| `INSERT INTO users (name, age) VALUES $$users(name, age)`             | `{users:[{name:"John",age:34},{name:"Jack",age:35}]}`              | `INSERT INTO users (name, age) VALUES ('John', 34), ('Jack', 35)`       |

