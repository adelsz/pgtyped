---
id: intro
title: Overview
sidebar_label: Overview
---

PgTyped makes it possible to use raw SQL in TypeScript with guaranteed type-safety.  
No need to map or translate your DB schema to TypeScript, PgTyped automatically generates types and interfaces for your SQL queries by using your running Postgres database as the source of type information.

## Project goals

- **Smooth dev experience** - Provide a smooth and reliable development experience for engineers that want to use raw SQL queries.
- **Static typing** - SQL queries are validated and fully usable by the typechecker.
- **No magic** - PgTyped is not a query builder or an ORM.
