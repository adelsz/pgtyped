#  Contributing to pgTyped

pgTyped is an open source project, and we welcome contributions of all kinds, including bug reports, feature requests, and pull requests.

# How to contribute?

Our rules for pull requests and issues are fairly standard and flexible. When submitting a change, please provide a brief and descriptive title, if possible written in the imperative mood.

If you have an idea for a new feature or want to address a bug, it's recommended that you first open an issue. We're available to assist and discuss the process of opening a pull request to ensure your changes are incorporated.

We highly recommend you include a test-case added to the `packages/example` project when you submit a pull request or an issue.

This will help us verify your issue or pull request and prevent regressions in the future.

# Development Setup

To get started, clone the repository and install the dependencies:

```bash
git clone git@github.com:adelsz/pgtyped.git
cd pgtyped
npm install
```

We use a mono-repo setup with [Lerna](https://lernajs.io/) and NPM workspaces.
This means that running `npm install` will install all the dependencies for all the packages in the project.
It will also link the packages together, so that you can make changes to one package and immediately see the effects in another package.

The `packages` directory contains the source code for the various components of pgTyped:

- `packages/cli` - The CLI tool for generating TypeScript types from SQL files
- `packages/wire` - The pgTyped PostgreSQL wire protocol implementation
- `packages/parser` - The pgTyped SQL and TS language parser
- `packages/runtime` - The pgTyped runtime library that provides the `sql` template tag and the `sql` function for executing queries.
- `packages/query` - This package contains higher level PostgreSQL protocol utilities for describing query types, SSL support, and more.
- `packages/example` - This repository contains a simple example of a pgTyped project written as a Jest test suite. We use this project both as a demonstration of pgTyped and as an end-to-end test suite for the project.

To build the project, run:

```bash
npm run build
```

This will build all the packages in the project. To run build in watch mode, run:

```bash
npm run watch
```

To run the tests, run:

```bash
npm test
```

It will run the tests for all the packages in the project, including end-to-end tests for the example project.

# The `packages/example` project

The `packages/example` project is an end-to-end test suite for pgTyped. It contains a simple example of a pgTyped project written as a Jest test suite.

The packages `npm test` runs the following command:

```bash
docker compose run build && docker compose run test && docker compose run test-cjs
```

As you can see it runs the `build` target, then runs the `test` target twice, once with the `esm` module format and once with the `cjs` module format:
- The `build` target runs pgTyped on the `sql` files in the `packages/example/src` directory generating the query code and type definitions. It also runs `git diff` to verify that the generated code matches the code in the repository.
- The `test` target runs the queries in `packages/example/src/index.ts` and verifies that the results match the expected results.
- The `test-cjs` target runs the same tests as the `test` target, but using the `cjs` module format to verify that the generated code works with both module formats.

All the targets are run in a Docker container, with a Postgres database running in a separate container spun up by Docker Compose.

The definitions of each of these targets and the DB service can be found in the `packages/example/docker-compose.yml` file.

The database is initialized with the `sql/schema.sql` file.
