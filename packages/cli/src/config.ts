/** @fileoverview Config file parser */

import { Type } from '@pgtyped/query';
import * as Either from 'fp-ts/lib/Either.js';
import * as t from 'io-ts';
import { reporter } from 'io-ts-reporters';
import { createRequire } from 'module';
import { isAbsolute, join } from 'path';
import tls from 'tls';
import { DatabaseConfig, default as dbUrlModule } from 'ts-parse-database-url';
import { TypeDefinition } from './types.js';

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

const TSTypedSQLTagTransformCodec = t.type({
  mode: t.literal('ts-implicit'),
  include: t.string,
  functionName: t.string,
  emitFileName: t.string,
});

const TSPgPromiseTransformCodec = t.type({
  mode: t.literal('ts-pg-promise'),
  include: t.string,
  exclude: t.union([t.string, t.undefined]),
  emitFileName: t.string,
  tsconfigPath: t.string,
  maxMethodParameterUnionTypeLength: t.union([t.number, t.undefined]),
  argumentTypeWarning: t.union([t.boolean, t.undefined]),
  parameterKindWarning: t.union([t.boolean, t.undefined]),
  variableNames: t.array(t.string),
  interfaceName: t.string,
});

export type TSTypedSQLTagTransformConfig = t.TypeOf<
  typeof TSTypedSQLTagTransformCodec
>;

export type TSPgPromiseTransformConfig = t.TypeOf<
  typeof TSPgPromiseTransformCodec
>;

const SQLTransformCodec = t.type({
  mode: t.literal('sql'),
  ...transformCodecProps,
});

const TransformCodec = t.union([
  TSTransformCodec,
  SQLTransformCodec,
  TSTypedSQLTagTransformCodec,
  TSPgPromiseTransformCodec,
]);

const EnumsAsEnumsCodec = t.type({
  style: t.literal('enum'),
  nameCase: t.union([t.literal('keep'), t.literal('pascal')]),
  keyCase: t.union([
    t.literal('upper'),
    t.literal('lower'),
    t.literal('sameAsValue'),
  ]),
  dropNameSuffix: t.union([t.string, t.undefined]),
});

const EnumsAsTypesCodec = t.type({
  style: t.literal('type'),
});

const EnumCodec = t.union([EnumsAsEnumsCodec, EnumsAsTypesCodec]);

export type EnumsAsEnumsConfig = t.TypeOf<typeof EnumsAsEnumsCodec>;

export type TransformConfig = t.TypeOf<typeof TransformCodec>;

export type EnumConfig = t.TypeOf<typeof EnumCodec>;

const configParser = t.type({
  // maximum number of worker threads to use for the codegen worker pool
  maxWorkerThreads: t.union([t.number, t.undefined]),
  transforms: t.array(TransformCodec),
  srcDir: t.string,
  failOnError: t.union([t.boolean, t.undefined]),
  camelCaseColumnNames: t.union([t.boolean, t.undefined]),
  anonymousColumnWarning: t.union([t.boolean, t.undefined]),
  enums: t.union([EnumCodec, t.undefined]),
  interfaceComments: t.union([t.boolean, t.undefined]),
  hungarianNotation: t.union([t.boolean, t.undefined]),
  dbUrl: t.union([t.string, t.undefined]),
  db: t.union([
    t.type({
      host: t.union([t.string, t.undefined]),
      password: t.union([t.string, t.undefined]),
      port: t.union([t.number, t.undefined]),
      user: t.union([t.string, t.undefined]),
      dbName: t.union([t.string, t.undefined]),
      ssl: t.union([t.UnknownRecord, t.boolean, t.undefined]),
      schema: t.union([t.string, t.undefined]),
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

export type IConfig = typeof configParser._O;

export interface ParsedConfig {
  db: {
    host: string;
    user: string;
    password: string | undefined;
    dbName: string;
    port: number;
    ssl?: tls.ConnectionOptions | boolean;
    schema?: string;
  };
  maxWorkerThreads: number | undefined;
  failOnError: boolean;
  camelCaseColumnNames: boolean;
  anonymousColumnWarning: boolean;
  enums: EnumConfig | undefined;
  interfaceComments: boolean;
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

  const envDBConfig = {
    host: process.env.PGHOST,
    user: process.env.PGUSER,
    password: process.env.PGPASSWORD,
    dbName: process.env.PGDATABASE,
    port: process.env.PGPORT ? Number(process.env.PGPORT) : undefined,
    uri: process.env.PGURI ?? process.env.DATABASE_URL,
  };

  const {
    maxWorkerThreads,
    db = defaultDBConfig,
    dbUrl: configDbUri,
    transforms,
    srcDir,
    failOnError,
    camelCaseColumnNames,
    hungarianNotation,
    typesOverrides,
    enums,
    interfaceComments,
    anonymousColumnWarning,
  } = configObject as IConfig;

  // CLI connectionUri flag takes precedence over the env and config one
  const dbUri = argConnectionUri || envDBConfig.uri || configDbUri;

  const urlDBConfig = dbUri
    ? convertParsedURLToDBConfig(parseDatabaseUri(dbUri))
    : {};

  if (
    transforms.some(
      (tr) =>
        tr.mode !== 'ts-implicit' &&
        tr.mode !== 'ts-pg-promise' &&
        !!tr.emitFileName,
    )
  ) {
    // tslint:disable:no-console
    console.log(
      'Warning: Setting "emitFileName" is deprecated. Consider using "emitTemplate" instead.',
    );
  }

  const finalDBConfig = merge(defaultDBConfig, db, urlDBConfig, envDBConfig);

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
    anonymousColumnWarning: anonymousColumnWarning ?? true,
    hungarianNotation: hungarianNotation ?? true,
    typesOverrides: parsedTypesOverrides,
    maxWorkerThreads,
    enums,
    interfaceComments: interfaceComments ?? true,
  };
}
