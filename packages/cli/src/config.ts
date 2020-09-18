/** @fileoverview Config file parser */

import * as Either from 'fp-ts/lib/Either';
import { join, isAbsolute } from 'path';
import * as t from 'io-ts';
import { reporter } from 'io-ts-reporters';

const transformCodecProps = {
  include: t.string,
  /** @deprecated emitFileName is deprecated */
  emitFileName: t.union([t.string, t.undefined]),
  emitTemplate: t.union([t.string, t.undefined]),
};

const TSTransformCodec = t.type({
  mode: t.literal('ts'),
  ...transformCodecProps,
});

const SQLTransformCodec = t.type({
  mode: t.literal('sql'),
  ...transformCodecProps,
});

const TransformCodec = t.union([TSTransformCodec, SQLTransformCodec]);

export type TransformConfig = t.TypeOf<typeof TransformCodec>;

const configParser = t.type({
  transforms: t.array(TransformCodec),
  srcDir: t.string,
  failOnError: t.union([t.boolean, t.undefined]),
  camelCaseColumnNames: t.union([t.boolean, t.undefined]),
  db: t.union([
    t.type({
      host: t.union([t.string, t.undefined]),
      password: t.union([t.string, t.undefined]),
      port: t.union([t.number, t.undefined]),
      user: t.union([t.string, t.undefined]),
      dbName: t.union([t.string, t.undefined]),
    }),
    t.undefined,
  ]),
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
  failOnError: boolean;
  camelCaseColumnNames: boolean;
  transforms: IConfig['transforms'];
  srcDir: IConfig['srcDir'];
}

function merge<T>(base: T, ...overrides: Partial<T>[]): T {
  return overrides.reduce<T>(
    (acc, o) =>
      Object.entries(o).reduce(
        (oAcc, [k, v]) => (v ? { ...oAcc, [k]: v } : oAcc),
        acc,
      ),
    { ...base },
  );
}

export function parseConfig(path: string): ParsedConfig {
  const fullPath = isAbsolute(path) ? path : join(process.cwd(), path);
  const configObject = require(fullPath);
  const result = configParser.decode(configObject);
  if (Either.isLeft(result)) {
    const message = reporter(result);
    throw new Error(message[0]);
  }

  const defaultDBConfig = {
    host: '127.0.0.1',
    user: 'postgres',
    password: '',
    dbName: 'postgres',
    port: 5432,
  };

  const envDBConfig = {
    host: process.env.PGHOST,
    user: process.env.PGUSER,
    password: process.env.PGPASSWORD,
    dbName: process.env.PGDATABASE,
    port: process.env.PGPORT ? Number(process.env.PGPORT) : undefined,
  };

  const {
    db = defaultDBConfig,
    transforms,
    srcDir,
    failOnError,
    camelCaseColumnNames,
  } = configObject as IConfig;

  if (transforms.some((tr) => !!tr.emitFileName)) {
    // tslint:disable:no-console
    console.log(
      'Warning: Setting "emitFileName" is deprecated. Consider using "emitTemplate" instead.',
    );
  }

  const finalDBConfig = merge(defaultDBConfig, db, envDBConfig);

  return {
    db: finalDBConfig,
    transforms,
    srcDir,
    failOnError: failOnError ?? false,
    camelCaseColumnNames: camelCaseColumnNames ?? false,
  };
}
