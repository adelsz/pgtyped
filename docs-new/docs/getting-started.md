---
id: getting-started
title: Getting Started
sidebar_label: Getting Started
---

### Installation

1. `npm install @pgtyped/cli @pgtyped/query typescript` (TS is a required peer dependency)
2. Create a PgTyped `config.json` file.
3. Run `npx pgtyped -w -c config.json` to start PgTyped in watch mode.

### Configuration

PgTyped requires a `config.json` file to run, a basic config file looks like this:

```json title="config.json"
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
    "host": "db",
    "user": "test",
    "dbName": "test",
    "password": "example"
  }
}
```

Refer to the [CLI page](cli) for more info on the config file, available CLI flags and environment variables.

:::note
If you are having trouble configuring PgTyped, you can refer to the [example app](https://github.com/adelsz/pgtyped/tree/master/packages/example) for a preconfigured example.  
:::
