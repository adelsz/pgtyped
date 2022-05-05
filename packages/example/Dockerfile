ARG NODE_IMAGE=node:18-alpine

FROM $NODE_IMAGE

RUN apk add --update --no-cache postgresql-client

ADD scripts/wait-for-postgres-then /usr/local/bin/

WORKDIR /app/packages/example

ENTRYPOINT ["scripts/wait-for-postgres-then"]

