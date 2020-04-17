## @pgtyped/cli

This package provides the `pgtyped` CLI.  
The `pgtyped` CLI can work in build and watch mode.

### Flags:

The CLI supports two flags:
* `-c config_file_path.json` to pass the config file path.
* `-w` to start in watch mode.

Running the CLI:
```
npx pgtyped -w -c config.json
```

### Config file:

Config file format (`config.json`):
```js
{
  // You can specify as many transforms as you want
  // Only TS and SQL files (modes) are supported at the moment
  "transforms": [
    {
      "mode": "sql", // SQL mode
      "include": "queries.sql" // SQL files pattern to scan for queries
    },
    {
      "mode": "ts", // TS mode
      "include": "sample.ts", // TS files pattern to scan for queries
      "emitFileName": "sample.types.ts" // Filename to save the generated query types
    }
  ],
  "srcDir": "./src/", // Directory to scan or watch for query files
  "db": {
    "dbName": "testdb", // DB name
    "user": "user", // DB username
    "password": "password", // DB password (optional)
    "host": "127.0.0.1" // DB host (optional)
  }
}
```

This package is part of the pgtyped project.  
Refer to root [README](https://github.com/adelsz/pgtyped) for details.
