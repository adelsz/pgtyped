/** @fileoverview Config file parser */

import * as Either from 'fp-ts/lib/Either';
import { readFileSync } from 'fs';
import * as t from 'io-ts';
import { reporter } from 'io-ts-reporters';

const TSTransformCodec = t.type({
  mode: t.literal('ts'),
  include: t.string,
  /** @deprecated emitFileName is deprecated */
  emitFileName: t.union([t.string, t.undefined]),
  emitTemplate: t.union([t.string, t.undefined]),
});

const SQLTransformCodec = t.type({
  mode: t.literal('sql'),
  include: t.union([t.string, t.undefined]),
  /** @deprecated emitFileName is deprecated */
  emitFileName: t.union([t.string, t.undefined]),
  emitTemplate: t.union([t.string, t.undefined]),
});

const TransformCodec = t.union([TSTransformCodec, SQLTransformCodec]);

export type TransformConfig = t.TypeOf<typeof TransformCodec>;

const configParser = t.type({
  transforms: t.array(TransformCodec),
  srcDir: t.string,
  db: t.type({
    host: t.union([t.string, t.undefined]),
    password: t.union([t.string, t.undefined]),
    port: t.union([t.number, t.undefined]),
    user: t.union([t.string, t.undefined]),
    dbName: t.union([t.string, t.undefined]),
  }),
});

export type IConfig = typeof configParser._O;

export interface ParsedConfig {
  db: {
    host: string;
    user: string;
    password: string | undefined;
    dbName: string;
    port: number;
  };
  transforms: IConfig['transforms'];
  srcDir: IConfig['srcDir'];
}

export function parseConfig(path: string): ParsedConfig {
  const configStr = readFileSync(path);
  let configObject;
  configObject = JSON.parse(configStr.toString());
  const result = configParser.decode(configObject);
  if (Either.isLeft(result)) {
    const message = reporter(result);
    throw new Error(message[0]);
  }
  const { db, transforms, srcDir } = configObject as IConfig;
  const host = process.env.PGHOST ?? db.host ?? '127.0.0.1';
  const user = process.env.PGUSER ?? db.user ?? 'postgres';
  const password = process.env.PGPASSWORD ?? db.password;
  const dbName = process.env.PGDATABASE ?? db.dbName ?? 'postgres';
  const port = parseInt(
    process.env.PGPORT ?? db.port?.toString() ?? '5432',
    10,
  );
  if (transforms.some((tr) => !!tr.emitFileName)) {
    // tslint:disable:no-console
    console.log(
      'Warning: Setting "emitFileName" is deprecated. Consider using "emitTemplate" instead.',
    );
  }
  const finalDBConfig = {
    host,
    user,
    password,
    dbName,
    port,
  };
  return {
    db: finalDBConfig,
    transforms,
    srcDir,
  };
}
