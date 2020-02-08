## @pgtyped/cli

This package provides the `pgtyped` command.  
`pgtyped` supports two modes: normal and watch mode.

In normal mode, `pgtyped` operates as follows:
1. Scans your `srcDir` for query files. Query file name format is specified using the `queryFileName` config option.
2. Extracts all queries defined in query files using the `sql` tagged template.
3. Connects to your database and fetches the input and output types for all the queries found in step 3.
4. For each query file, saves its queries type declaration in a query type declaration file (defined by the `emitFileName` option of the config.
5. Exit

Watch mode operation is the same, except that `pgtyped` doesn't exit after processing all files, but continues running in the background, watching `srcDir` for changes and regenerating query types files on file change or creation.

### Config file:

Config file format (`config.json`):
```js
{
  "emit": {
    "mode": "query-file", // Only query-file mode is supported at the moment. 
    "queryFileName": "queries.ts", // Filenames to scan for SQL queries
    "emitFileName": "queries.types.ts" // Filenames to save type information into
  },
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
