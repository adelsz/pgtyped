import type { IConfig } from '../config.js';

const config = {
  transforms: [
    {
      mode: 'sql',
      include: '**/*.sql',
      emitTemplate: '{{dir}}/{{name}}.queries.ts',
    },
  ],
  srcDir: './src/',
  db: {
    host: 'localhost',
    port: 5432,
    user: 'postgres',
    dbName: 'testdb',
  },
} as IConfig;

export default config;
