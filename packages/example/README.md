## @pgtyped/example

This is an example app using `pgtyped`.  
Example queries are stored in `src/books/queries.sql`, `src/users/queries.ts` and `src/comments/queries.sql`.
Try starting PgTyped and editing them to see live query type generation.

### Usage with your own DB:
1. `npm install`
2. Save your config into `config.json`
2. `npx pgtyped -w -c config.json`

### Using the dockerized example setup:
1. Clone the whole pgtyped monorepo into some directory.  
`git clone git@github.com:adelsz/pgtyped.git pgyped`
2. `cd pgtyped/packages/example`
3. `npm install`
4. `docker-compose run watch`
5. Try editing queries in the SQL and TS files and see how PgTyped handles it.

The dockerized setup isn't required and is included for convenience.  
It creates a PostgreSQL DB, loading it with the schema and seed records defined in `sql/schema.sql`.  
After that it starts PgTyped in a separate container, connecting it to the DB.

