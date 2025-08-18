/** @fileoverview Config file parser */

import * as t from 'io-ts';
import tls from 'tls';
import { TypeDefinition } from './types.js';

export type TransformMode =
  | { mode: 'sql' }
  | { mode: 'ts' }
  | { mode: 'ts-implicit'; functionName: string };

export const DbCodec = t.type({
  host: t.union([t.string, t.undefined]),
  password: t.union([t.string, t.undefined]),
  port: t.union([t.number, t.undefined]),
  user: t.union([t.string, t.undefined]),
  dbName: t.union([t.string, t.undefined]),
  ssl: t.union([t.UnknownRecord, t.boolean, t.undefined]),
});

export interface DbConfig {
  host: string;
  user: string;
  password: string | undefined;
  dbName: string;
  port: number;
  ssl?: tls.ConnectionOptions | boolean;
}

export const TypegenCodec = t.type({
  failOnError: t.union([t.boolean, t.undefined]),
  camelCaseColumnNames: t.union([t.boolean, t.undefined]),
  hungarianNotation: t.union([t.boolean, t.undefined]),
  nonEmptyArrayParams: t.union([t.boolean, t.undefined]),
  typesOverrides: t.union([
    t.record(
      t.string,
      t.union([
        t.string,
        t.type({
          parameter: t.union([t.string, t.undefined]),
          return: t.union([t.string, t.undefined]),
        }),
      ]),
    ),
    t.undefined,
  ]),
});

export interface TypegenConfig {
  failOnError?: boolean;
  camelCaseColumnNames?: boolean;
  hungarianNotation?: boolean;
  nonEmptyArrayParams?: boolean;
  typesOverrides?: Record<string, Partial<TypeDefinition>>;
}
