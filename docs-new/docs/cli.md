---
id: cli
title: CLI config
sidebar_label: CLI config
---

`pgtyped` CLI can be launched in build or watch mode.  
Watch mode is most useful for a local development workflow,
while build mode can be used for generating types when running CI.

### Flags

The CLI supports two flags:

- `-c config_file_path.json` to pass the config file path.
- `-w` to start in watch mode.

```shell script title="Example:"
npx pgtyped -w -c config.json
```

### Environment variables

PgTyped supports common PostgreSQL environment variables:

- `PGHOST`
- `PGUSER`
- `PGPASSWORD`
- `PGDATABASE`
- `PGPORT`

These variables will override values provided in `config.json`.

### Configuration file format

```js title="config.json"
{
  // You can specify as many transforms as you want
  // Only TS and SQL files (modes) are supported at the moment
  "transforms": [
    {
      "mode": "sql", // SQL mode
      "include": "**/*.sql", // SQL files pattern to scan for queries
      "emitTemplate": "{{dir}}/{{name}}.queries.ts" // File name template to save generated files
    },
    {
      "mode": "ts", // TS mode
      "include": "**/action.ts", // TS file pattern to scan for queries
      "emitTemplate": "{{dir}}/{{name}}.types.ts" // File name template to save generated files
    }
  ],
  "srcDir": "./src/", // Directory to scan or watch for query files
  "failOnError": false, // Whether to fail on a file processing error and abort generation (can be omitted - default is false)
  "camelCaseColumnNames": false, // convert to camelCase column names of result interface
  "db": {
    "dbName": "testdb", // DB name
    "user": "user", // DB username
    "password": "password", // DB password (optional)
    "host": "127.0.0.1" // DB host (optional)
  }
}
```

### Customizing generated file paths

By default, PgTyped saves generated files in the same folder as the source files it parses.  
This behavior can be customized using the `emitTemplate` config parameter.  
In that template, four parameters are available for interpolation: `root`, `dir`, `base`, `name` and `ext`.  
For example, when parsing source/query file `/home/user/dir/file.sql`, these parameters are assigned the following values:

```
┌─────────────────────┬────────────┐
│          dir        │    base    │
├──────┬              ├──────┬─────┤
│ root │              │ name │ ext │
"  /    home/user/dir / file  .sql "
└──────┴──────────────┴──────┴─────┘
(All spaces in the "" line should be ignored. They are purely for formatting.)
```
