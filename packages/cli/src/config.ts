/** @fileoverview Config file parser */

import * as Either from 'fp-ts/lib/Either';
import * as Option from 'fp-ts/lib/Option';
import { readFileSync } from 'fs';
import * as t from 'io-ts';
import { reporter } from 'io-ts-reporters';

const TSTransformCodec = t.type({
  mode: t.literal('ts'),
  include: t.string,
  emitFileName: t.string,
});

const SQLTransformCodec = t.type({
  mode: t.literal('sql'),
  include: t.union([t.string, t.undefined]),
});

const TransformCodec = t.union([TSTransformCodec, SQLTransformCodec]);

export type TransformConfig = t.TypeOf<typeof TransformCodec>;

const configParser = t.type({
  transforms: t.array(TransformCodec),
  srcDir: t.string,
  db: t.type({
    host: t.union([t.string, t.undefined]),
    password: t.union([t.string, t.undefined]),
    user: t.string,
    dbName: t.string,
  }),
});

export type IConfig = typeof configParser._O;

export function parseConfig(path: string): IConfig {
  const configStr = readFileSync(path);
  let configObject;
  configObject = JSON.parse(configStr.toString());
  const result = configParser.decode(configObject);
  if (Either.isLeft(result)) {
    const message = reporter(result);
    throw new Error(message[0]);
  }
  return configObject;
}
