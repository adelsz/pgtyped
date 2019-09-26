## PgTyped

[![Actions Status](https://github.com/adelsz/pgtyped/workflows/CI/badge.svg)](https://github.com/adelsz/pgtyped/actions)

Raw SQL query type generator.
Finally you can use raw SQL with guaranteed type-safety.
Works with PostgresSQL.

### Features:
1. Automatically generates types for parameters/results of SQL queries of any complexity
2. Generate query types as you type them using the `--watch` mode.
3. Extensive parameter interpolation helpers.
4. Allows you to use non-standard query executors. 

### Example:

Query code:
```js
export const SELECT_ALL_USERS = sql`
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

### Interpolations:

| Interpolation       | Syntax                        | Parameter Type                                             |
|---------------------|-------------------------------|------------------------------------------------------------|
| Named parameters    | `:paramName`                  | `paramName: ParamType`                                     |
| Single value list   | `:paramName(:name, :author)`  | `paramName: { name: NameType, author: AuthorType }`        |
| Multiple value list | `::paramName`                 | `paramName: Array<ParamType>`                              |
| Multiple value list | `::paramName(:name, :author)` | `paramName: Array<{ name: NameType, author: AuthorType }>` |

Example `INSERT_USERS`:
```sql
INSERT INTO users (name, age)
VALUES ::users(:userName, :userAge) RETURNING id
```
can be executed as follows:
```ts
const usersToInsert = [
  { name: 'Bob', age: 12 },
  { name: 'Tom', age: 16 },
];
const result = await query<IInsertUsersQuery>(INSERT_USERS, usersToInsert);
```
