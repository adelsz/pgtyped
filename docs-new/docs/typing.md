---
id: typing
title: Typing
sidebar_label: Typing
---

`pgtyped` allows you to override built-in types by providing custom TS types or by importing your own.

### Changing the types returned by Postgres

You can customise the way Postgres responses are parsed very simply in your application:

```ts
import { types } from 'pg'

// DATE are now returned as string instead of Date objects
types.setTypeParser(types.builtins.DATE, (val: string) => val);

// DECIMAL and other precision types are now returned as number instead of string
types.setTypeParser(types.builtins.NUMERIC, (val: string) => Number(val));
```

This is part of the [`pg` lib](https://github.com/brianc/node-pg-types) and has nothing to do with `pgtyped`.
For `pgtyped` to be aware of those custom parsers, you need to indicate those changes in the config file.

### Overriding default mapping

In the config file you can override the default type mapping:
```json
{
  "typesOverrides": { 
    "date": "string",
    "numeric": "number"
  }
}
```

You can also specify imported types from your project or from another npm package:
```json
{
  "typesOverrides": { 
    "timestamptz": "dayjs#Dayjs", // import { Dayjs } from 'dayjs';
    "money": "my-package#Foo as MyType", // import { Foo as MyType } from 'my-package';
    "char": "my-package as MyType", // import MyType from 'my-package';
    "numeric": "./path/to/file.js#MyCustomType", // import { MyCustomType } from './path/to/file.js';
    "float": "./path/to/file#MyCustomType as Alias", // import { MyCustomType as Alias } from './path/to/file';
    "smallint": "../myFile as MyType" // import MyType from '../myFile';
  }
}
```

All relative paths must be relative to the root of your project.

### Different types for parameters and return type

Query results are always parsed the same way, for instance a Postgres `DATE` will always be parsed as a javascript `Date` 
(assuming you did not add a custom parser).

```sql
SELECT date_of_birth FROM users;
```

Here `date_of_birth` should be typed as a `Date`. But query parameters can support multiple types, for instance a `DATE` 
can be compared with a javascript `Date` or with a `string`.

```sql
SELECT id FROM users WHERE date_of_birth = :dateOfBirth;
```

Here `dateOfBirth` should be typed `string | Date` as it can receive either. You can specify different types in the config file:
```json
{
  "typesOverrides": { 
    "date": {
      "parameter": "string | Date",
      "return": "Date"
    } 
  }
}
```

### Default mapping
The default mapping is as follows:

```ts
type Json = null | boolean | number | string | Json[] | { [key: string]: Json }

type DefaultMapping = {
  // Integer types
  'int2': number
  'int4': number
  'int8': string
  'smallint': number
  'int': number
  'bigint': string

  // Precision types
  'real': number
  'float4': number
  'float': number
  'float8': number
  'numeric': string
  'decimal': string

  // Serial types
  'smallserial': number
  'serial': number
  'bigserial': string

  // Common string types
  'uuid': string
  'text': string
  'varchar': string
  'char': string
  'bpchar': string
  'citext': string
  'name': string

  // Bool types
  'bit': boolean
  'bool': boolean
  'boolean': boolean

  // Dates and times
  'date': Date
  'timestamp': Date
  'timestamptz': Date
  'time': Date
  'timetz': Date
  'interval': string

  // Network address types
  'inet': string
  'cidr': string
  'macaddr': string
  'macaddr8': string

  // Extra types
  'money': string
  'tsvector': string
  'void': undefined,

  // JSON types
  'json': Json,
  'jsonb': Json,

  // Bytes
  'bytea': Buffer,
}
```