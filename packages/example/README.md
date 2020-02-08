## @pgtyped/example

This is an example app using `pgtyped`.  
Example queries are stored in `src/books/queries.ts` and `src/users/queries.ts`.

### Usage with your own DB:
1. `npm install`
2. Save your config into `config.json`
2. `npx pgtyped -w -c config.json`

### Using the dockerized example setup:
1. Clone the whole pgtyped monorepo into some directory.  
`git clone git@github.com:adelsz/pgtyped.git pgyped`
2. `npm install`
2. `npx lerna bootstrap`
3. `npm run watch`
4. `cd pgtyped/packages/example`
5. `docker-compose up`
