FROM node:13-alpine

RUN apk add --update --no-cache postgresql-client

ADD scripts/wait-for-postgres-then /usr/local/bin/

WORKDIR /app/packages/example

ENTRYPOINT ["scripts/wait-for-postgres-then"]

