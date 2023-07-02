/** @fileoverview Config file parser */

import { createRequire } from 'module';
import * as Either from 'fp-ts/lib/Either.js';
import { join, isAbsolute } from 'path';
import * as t from 'io-ts';
import { reporter } from 'io-ts-reporters';
import tls from 'tls';
import { default as dbUrlModule, DatabaseConfig } from 'ts-parse-database-url';
import { TypeDefinition } from './types.js';
import { Type } from '@pgtyped/query';

// module import hack
const { default: parseDatabaseUri } = dbUrlModule as any;

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
  hungarianNotation: t.union([t.boolean, t.undefined]),
  dbUrl: t.union([t.string, t.undefined]),
  db: t.union([
    t.type({
      host: t.union([t.string, t.undefined]),
      password: t.union([t.string, t.undefined]),
      port: t.union([t.number, t.string, t.undefined]),
      user: t.union([t.string, t.undefined]),
      dbName: t.union([t.string, t.undefined]),
      ssl: t.union([t.UnknownRecord, t.boolean, t.undefined]),
    }),
    t.undefined,
  ]),
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

export type DBConfigArgs = {
  host: string;
  user: string;
  password: string;
  dbName: string;
  port: number | string;
  ssl: tls.ConnectionOptions | boolean;
  uri: string;
};

export type IConfig = typeof configParser._O;

function parseEnvTemplate(input?: string): string | undefined {
  const templateStringRegex = new RegExp('{{\\w+}}', 'g');
  const result = input ? templateStringRegex.exec(input) : undefined;
  return result?.input?.substring(2, result.input.length - 2);
}

export function getEnvDBConfig(dBConfig: Partial<DBConfigArgs>) {
  const host = parseEnvTemplate(dBConfig.host) ?? 'PGHOST';
  const user = parseEnvTemplate(dBConfig.user) ?? 'PGUSER';
  const password = parseEnvTemplate(dBConfig.password) ?? 'PGPASSWORD';
  const dbName = parseEnvTemplate(dBConfig.dbName) ?? 'PGDATABASE';
  const port = parseEnvTemplate(dBConfig?.port?.toString()) ?? 'PGPORT';
  const uri = parseEnvTemplate(dBConfig.uri) ?? 'PGURI';

  return {
    host: process.env[host],
    user: process.env[user],
    password: process.env[password],
    dbName: process.env[dbName],
    port: process.env[port] ? Number(process.env[port]) : undefined,
    uri: process.env[uri] ?? process.env.DATABASE_URL,
  };
}

export interface ParsedConfig {
  db: {
    host: string;
    user: string;
    password: string | undefined;
    dbName: string;
    port: number;
    ssl?: tls.ConnectionOptions | boolean;
  };
  failOnError: boolean;
  camelCaseColumnNames: boolean;
  hungarianNotation: boolean;
  transforms: IConfig['transforms'];
  srcDir: IConfig['srcDir'];
  typesOverrides: Record<string, Partial<TypeDefinition>>;
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

function convertParsedURLToDBConfig({
  host,
  password,
  user,
  port,
  database,
}: DatabaseConfig) {
  return {
    host,
    password,
    user,
    port,
    dbName: database,
  };
}

const require = createRequire(import.meta.url);

export function stringToType(str: string): Type {
  if (
    str.startsWith('./') ||
    str.startsWith('../') ||
    str.includes('#') ||
    str.includes(' as ')
  ) {
    const [firstSection, alias] = str.split(' as ');
    const [from, namedImport] = firstSection.split('#');

    if (!alias && !namedImport) {
      throw new Error(
        `Relative import "${str}" should have an alias if you want to import default (eg. "${str} as MyAlias") or have a named import (eg. "${str}#MyType")`,
      );
    }

    return {
      name: alias ?? namedImport,
      from,
      aliasOf: alias ? namedImport ?? 'default' : undefined,
    };
  }

  return { name: str };
}

export function parseConfig(
  path: string,
  argConnectionUri?: string,
): ParsedConfig {
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

  const {
    db = defaultDBConfig,
    dbUrl: configDbUri,
    transforms,
    srcDir,
    failOnError,
    camelCaseColumnNames,
    hungarianNotation,
    typesOverrides,
  } = configObject as IConfig;

  const envDBConfig = getEnvDBConfig(db);

  // CLI connectionUri flag takes precedence over the env and config one
  const dbUri = argConnectionUri || envDBConfig.uri || configDbUri;

  const urlDBConfig = dbUri
    ? convertParsedURLToDBConfig(parseDatabaseUri(dbUri))
    : {};

  if (transforms.some((tr) => !!tr.emitFileName)) {
    // tslint:disable:no-console
    console.log(
      'Warning: Setting "emitFileName" is deprecated. Consider using "emitTemplate" instead.',
    );
  }

  // The port may be a template string
  const dbConfig = {
    ...db,
    port: typeof db.port === 'string' ? Number(db.port) : db.port,
  };

  const finalDBConfig = merge(
    defaultDBConfig,
    dbConfig,
    urlDBConfig,
    envDBConfig,
  );

  const parsedTypesOverrides: Record<string, Partial<TypeDefinition>> = {};

  for (const [typeName, mappedTo] of Object.entries(typesOverrides ?? {})) {
    if (typeof mappedTo === 'string') {
      parsedTypesOverrides[typeName] = {
        parameter: stringToType(mappedTo),
        return: stringToType(mappedTo),
      };
    } else {
      parsedTypesOverrides[typeName] = {
        parameter: mappedTo.parameter
          ? stringToType(mappedTo.parameter)
          : undefined,
        return: mappedTo.return ? stringToType(mappedTo.return) : undefined,
      };
    }
  }

  return {
    db: finalDBConfig,
    transforms,
    srcDir,
    failOnError: failOnError ?? false,
    camelCaseColumnNames: camelCaseColumnNames ?? false,
    hungarianNotation: hungarianNotation ?? true,
    typesOverrides: parsedTypesOverrides,
  };
}
