---
id: dynamic-queries
title: Dynamic queries
sidebar_label: Dynamic queries
---

pgTyped doesn't support query composition or concatenation, but this doesn't mean you can't create dynamic queries.
Instead of providing non-typesafe query composition, pgTyped forces you to move the dynamic logic into the SQL layer.

### Dynamic `WHERE` filters

A frequently used pattern is a query with an optional filter that selects all rows by default.
This can be achieved using a `IS NULL` construct.
Here is an example of a query with optional `age` and `name` filters:

```sql
/* @name GetUsers */
SELECT * FROM users
WHERE (:name IS NULL OR name = :name)
  AND (:age_gt IS NULL OR age > :age_gt);
```

### Dynamic `ORDER BY` sorting

Sorting by a dynamic column is another widely used dynamic query:

```sql
/* @name GetAllComments */
SELECT * FROM book_comments
WHERE id = :id ORDER BY :order_column;
```

Next, if we want to include a dynamic sort order as well:

```sql
/* @name GetAllUsers */
SELECT * FROM users
ORDER BY (CASE WHEN :asc = true THEN :sort_column END) ASC, :sort_column DESC;
```

### Advanced dynamic queries 

More complicated dynamic queries can be built similarly to the above two.  
Note that highly dynamic SQL queries can lead to worse DB execution times, so sometimes it is worth to split a complex query into multiple independent ones.
