FROM node:13-alpine

WORKDIR /app

ENTRYPOINT cd packages/example && npx pgtyped -w -c config.json
