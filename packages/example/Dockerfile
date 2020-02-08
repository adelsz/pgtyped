FROM node:13-alpine

WORKDIR /app

# COPY package.json package-lock.json /app/

# RUN npm install

ENTRYPOINT cd packages/example && DEBUG=* npx pgtyped -w -c config.json