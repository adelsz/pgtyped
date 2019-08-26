/** @fileoverview Config file parser */

import { readFileSync } from 'fs';
import * as t from 'io-ts';
import * as Option from 'fp-ts/lib/Option';
import * as Either from 'fp-ts/lib/Either';

const configParser = t.type({
  typeDir: t.string,
  srcDir: t.string,
  db: t.type({
    user: t.string,
    dbName: t.string,
  }),
})

export type IConfig = typeof configParser._O;

export function parseConfig(path: string): Option.Option<IConfig> {
  const configStr = readFileSync(path);
  let configObject;
  try {
    configObject = JSON.parse(configStr.toString());
  } catch (e) {
    return Option.none;
  }
  const result = configParser.decode(configObject);
  if (Either.isLeft(result)) {
    return Option.none;
  }
  return Option.some(configObject);
}