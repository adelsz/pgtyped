/** @fileoverview Config file parser */
import * as Either from 'fp-ts/lib/Either.js';
import * as t from 'io-ts';
import { reporter } from 'io-ts-reporters';
import { createRequire } from 'module';
import { isAbsolute, join } from 'path';
import { default as dbUrlModule } from 'ts-parse-database-url';
// module import hack
const { default: parseDatabaseUri } = dbUrlModule;
const transformCodecProps = {
    include: t.string,
    /** @deprecated emitFileName is deprecated */
    emitFileName: t.union([t.string, t.undefined]),
    emitTemplate: t.union([t.string, t.undefined]),
};
const TSTransformCodec = t.type(Object.assign({ mode: t.literal('ts') }, transformCodecProps));
const TSTypedSQLTagTransformCodec = t.type({
    mode: t.literal('ts-implicit'),
    include: t.string,
    functionName: t.string,
    emitFileName: t.string,
});
const SQLTransformCodec = t.type(Object.assign({ mode: t.literal('sql') }, transformCodecProps));
const TransformCodec = t.union([
    TSTransformCodec,
    SQLTransformCodec,
    TSTypedSQLTagTransformCodec,
]);
const configParser = t.type({
    // maximum number of worker threads to use for the codegen worker pool
    maxWorkerThreads: t.union([t.number, t.undefined]),
    transforms: t.array(TransformCodec),
    srcDir: t.string,
    failOnError: t.union([t.boolean, t.undefined]),
    camelCaseColumnNames: t.union([t.boolean, t.undefined]),
    hungarianNotation: t.union([t.boolean, t.undefined]),
    nonEmptyArrayParams: t.union([t.boolean, t.undefined]),
    dbUrl: t.union([t.string, t.undefined]),
    db: t.union([
        t.type({
            host: t.union([t.string, t.undefined]),
            password: t.union([t.string, t.undefined]),
            port: t.union([t.number, t.undefined]),
            user: t.union([t.string, t.undefined]),
            dbName: t.union([t.string, t.undefined]),
            ssl: t.union([t.UnknownRecord, t.boolean, t.undefined]),
        }),
        t.undefined,
    ]),
    typesOverrides: t.union([
        t.record(t.string, t.union([
            t.string,
            t.type({
                parameter: t.union([t.string, t.undefined]),
                return: t.union([t.string, t.undefined]),
            }),
        ])),
        t.undefined,
    ]),
});
function merge(base, ...overrides) {
    return overrides.reduce((acc, o) => Object.entries(o).reduce((oAcc, [k, v]) => (v ? Object.assign(Object.assign({}, oAcc), { [k]: v }) : oAcc), acc), Object.assign({}, base));
}
function convertParsedURLToDBConfig({ host, password, user, port, database, }) {
    return {
        host,
        password,
        user,
        port,
        dbName: database,
    };
}
const require = createRequire(import.meta.url);
export function stringToType(str) {
    if (str.startsWith('./') ||
        str.startsWith('../') ||
        str.includes('#') ||
        str.includes(' as ')) {
        const [firstSection, alias] = str.split(' as ');
        const [from, namedImport] = firstSection.split('#');
        if (!alias && !namedImport) {
            throw new Error(`Relative import "${str}" should have an alias if you want to import default (eg. "${str} as MyAlias") or have a named import (eg. "${str}#MyType")`);
        }
        return {
            name: alias !== null && alias !== void 0 ? alias : namedImport,
            from,
            aliasOf: alias ? namedImport !== null && namedImport !== void 0 ? namedImport : 'default' : undefined,
        };
    }
    return { name: str };
}
export function parseConfig(path, argConnectionUri) {
    var _a;
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
        uri: (_a = process.env.PGURI) !== null && _a !== void 0 ? _a : process.env.DATABASE_URL,
    };
    const { maxWorkerThreads, db = defaultDBConfig, dbUrl: configDbUri, transforms, srcDir, failOnError, camelCaseColumnNames, hungarianNotation, nonEmptyArrayParams, typesOverrides, } = configObject;
    // CLI connectionUri flag takes precedence over the env and config one
    const dbUri = argConnectionUri || envDBConfig.uri || configDbUri;
    const urlDBConfig = dbUri
        ? convertParsedURLToDBConfig(parseDatabaseUri(dbUri))
        : {};
    if (transforms.some((tr) => tr.mode !== 'ts-implicit' && !!tr.emitFileName)) {
        // tslint:disable:no-console
        console.log('Warning: Setting "emitFileName" is deprecated. Consider using "emitTemplate" instead.');
    }
    const finalDBConfig = merge(defaultDBConfig, db, urlDBConfig, envDBConfig);
    const parsedTypesOverrides = {};
    for (const [typeName, mappedTo] of Object.entries(typesOverrides !== null && typesOverrides !== void 0 ? typesOverrides : {})) {
        if (typeof mappedTo === 'string') {
            parsedTypesOverrides[typeName] = {
                parameter: stringToType(mappedTo),
                return: stringToType(mappedTo),
            };
        }
        else {
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
        failOnError: failOnError !== null && failOnError !== void 0 ? failOnError : false,
        camelCaseColumnNames: camelCaseColumnNames !== null && camelCaseColumnNames !== void 0 ? camelCaseColumnNames : false,
        hungarianNotation: hungarianNotation !== null && hungarianNotation !== void 0 ? hungarianNotation : true,
        nonEmptyArrayParams: nonEmptyArrayParams !== null && nonEmptyArrayParams !== void 0 ? nonEmptyArrayParams : false,
        typesOverrides: parsedTypesOverrides,
        maxWorkerThreads,
    };
}
//# sourceMappingURL=config.js.map