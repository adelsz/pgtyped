---
id: getting-started
title: Getting Started
sidebar_label: Getting Started
---

### Installation

1. `npm install -D @pgtyped/cli typescript` (typescript is a required peer dependency for pgtyped)
2. `npm install @pgtyped/runtime` (runtime is the only required runtime dependency for pgtyped)
2. Create a PgTyped configuration file (e.g., `config.json`, `config.ts`, `config.mjs`).
3. Run `npx pgtyped -w -c config.json` to start PgTyped in watch mode.

### Configuration

PgTyped requires a configuration file to run. Supported formats include `.json`, `.js`, `.cjs`, `.mjs`, `.ts`, `.mts`, and `.cts`. A basic JSON config file looks like this:

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
