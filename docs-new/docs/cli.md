---
id: cli
title: CLI config
sidebar_label: CLI config
---

`pgtyped` CLI can be launched in build or watch mode.
Watch mode is most useful for a local development workflow,
while build mode can be used for generating types when running CI.

### Flags

The CLI supports a number of flags:

- `--config config_file_path.json` to pass the config file path.
- `--watch` to start in watch mode.
- `--file file_path.ts` if you only want to process one file (which can be useful when working on a big project). Incompatible with watch mode. Uses transforms defined in the config file to determine the mode and emit template, so a file path that doesn't fit the include glob patterns will not be processed.
- `--uri` to specify a PG connection URI (overriding the config value).
- `--help` for a quick flag reference.
- `--version` to show the version number.

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
- `PGURI`

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
  "dbUrl": "postgres://user:password@host/database", // DB URL (optional - will be merged with db if provided)
  "db": {
    "dbName": "testdb", // DB name
    "user": "user", // DB username
    "password": "password", // DB password (optional)
    "host": "127.0.0.1", // DB host (optional)
    "port": 5432, // DB port (optional)
    "ssl": false // Whether or not to connect to DB with SSL (optional)
  },
  "typesOverrides": {
    "date": "string" // Override default Postgres => TypeScript mapping
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

### Configuring SSL options

By default, if enabled it will attempt to verify the SSL connection with the local certificates on the machine.

Options can also be provided to customize the certificate used or to ignore SSL errors. More information about options can be found [here](https://nodejs.org/api/tls.html#tls_new_tls_tlssocket_socket_options).

Sample configuration files have been provided below.

```js title="custom_ca.json"
{
  "transforms": [
    {
      "mode": "sql",
      "include": "**/*.sql",
      "emitTemplate": "{{dir}}/{{name}}.queries.ts"
    }
  ],
  "srcDir": "./src/",
  "failOnError": false,
  "camelCaseColumnNames": false,
  "db": {
    "dbName": "testdb",
    "user": "user",
    "host": "someremote.host.com",
    "ssl": {
      "host": "someremote.host.com",
      "port": 5432,
      "ca": ["insert CA here"]
    }
  }
}
```

```js title="ignore_ssl.json"
{
  "transforms": [
    {
      "mode": "sql",
      "include": "**/*.sql",
      "emitTemplate": "{{dir}}/{{name}}.queries.ts"
    }
  ],
  "srcDir": "./src/",
  "failOnError": false,
  "camelCaseColumnNames": false,
  "db": {
    "dbName": "testdb",
    "user": "user",
    "host": "someremote.host.com",
    "ssl": {
      "rejectUnauthorized": false
    }
  }
}
```
