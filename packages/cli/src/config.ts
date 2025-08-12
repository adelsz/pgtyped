import { Type } from '@pgtyped/query';
import * as t from 'io-ts';
import * as Either from 'fp-ts/lib/Either.js';
import { isAbsolute, join } from 'path';
import { reporter } from 'io-ts-reporters';
import { DatabaseConfig, default as dbUrlModule } from 'ts-parse-database-url';
import {
  DbCodec,
  DbConfig,
  TypegenCodec,
  TypegenConfig,
  TypeDefinition,
} from '@pgtyped/typegen';
import { createRequire } from 'module';

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

export type TSTypedSQLTagTransformConfig = t.TypeOf<
  typeof TSTypedSQLTagTransformCodec
>;

const SQLTransformCodec = t.type({
  mode: t.literal('sql'),
  ...transformCodecProps,
});

const TransformCodec = t.union([
  TSTransformCodec,
  SQLTransformCodec,
  TSTypedSQLTagTransformCodec,
]);

export type TransformConfig = t.TypeOf<typeof TransformCodec>;

const configParser = t.type({
  // maximum number of worker threads to use for the codegen worker pool
  maxWorkerThreads: t.union([t.number, t.undefined]),
  transforms: t.array(TransformCodec),
  srcDir: t.string,
  dbUrl: t.union([t.string, t.undefined]),
  db: t.union([DbCodec, t.undefined]),
  ...TypegenCodec.props,
});

export type IConfig = typeof configParser._O;

export interface ParsedConfig extends TypegenConfig {
  db: DbConfig;
  maxWorkerThreads: number | undefined;
  transforms: IConfig['transforms'];
  srcDir: IConfig['srcDir'];
  nonEmptyArrayParams: boolean;
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
    nonEmptyArrayParams,
    typesOverrides,
  } = configObject as IConfig;

  // CLI connectionUri flag takes precedence over the env and config one
  const dbUri = argConnectionUri || envDBConfig.uri || configDbUri;

  const urlDBConfig = dbUri
    ? convertParsedURLToDBConfig(parseDatabaseUri(dbUri))
    : {};

  if (transforms.some((tr) => tr.mode !== 'ts-implicit' && !!tr.emitFileName)) {
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
    hungarianNotation: hungarianNotation ?? true,
    nonEmptyArrayParams: nonEmptyArrayParams ?? false,
    typesOverrides: parsedTypesOverrides,
    maxWorkerThreads,
  };
}
