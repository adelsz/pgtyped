/** @fileoverview Config file parser */

import * as Either from "fp-ts/lib/Either";
import * as Option from "fp-ts/lib/Option";
import { readFileSync } from "fs";
import * as t from "io-ts";

const configParser = t.type({
  emit: t.union([
    t.type({
      mode: t.literal("query-file"),
      queryFileName: t.string,
      emitFileName: t.string,
    }),
    t.type({
      mode: t.literal("sql-file"),
      pattern: t.string,
    }),
  ]),
  srcDir: t.string,
  db: t.type({
    host: t.union([t.string, t.undefined]),
    password: t.union([t.string, t.undefined]),
    user: t.string,
    dbName: t.string,
  }),
});

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
