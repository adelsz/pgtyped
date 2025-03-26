var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
import { messages, PreparedObjectType } from '@pgtyped/wire';
import crypto from 'crypto';
import debugBase from 'debug';
import { checkServerFinalMessage, createClientSASLContinueResponse, createInitialSASLResponse, } from './sasl-helpers.js';
import { isEnum } from './type.js';
const debugQuery = debugBase('client:query');
export const generateHash = (username, password, salt) => {
    const hash = (str) => crypto.createHash('md5').update(str).digest('hex');
    const shadow = hash(password + username);
    const result = crypto.createHash('md5');
    result.update(shadow);
    result.update(salt);
    return 'md5' + result.digest('hex');
};
export function startup(options, queue) {
    var _a;
    return __awaiter(this, void 0, void 0, function* () {
        try {
            yield queue.connect(options);
            const startupParams = {
                user: options.user,
                database: options.dbName,
                client_encoding: "'utf-8'",
            };
            yield queue.send(messages.startupMessage, { params: startupParams });
            const result = yield queue.reply(messages.readyForQuery, messages.authenticationCleartextPassword, messages.authenticationMD5Password, messages.authenticationSASL);
            if ('trxStatus' in result) {
                // No auth required
                return;
            }
            if (!options.password) {
                throw new Error('password required for hash auth');
            }
            let password = options.password;
            if ('SASLMechanisms' in result) {
                if (((_a = result.SASLMechanisms) === null || _a === void 0 ? void 0 : _a.indexOf('SCRAM-SHA-256')) === -1) {
                    throw new Error('SASL: Only mechanism SCRAM-SHA-256 is currently supported');
                }
                const { clientNonce, response: initialSASLResponse } = createInitialSASLResponse();
                yield queue.send(messages.SASLInitialResponse, {
                    mechanism: 'SCRAM-SHA-256',
                    responseLength: Buffer.byteLength(initialSASLResponse),
                    response: initialSASLResponse,
                });
                const SASLContinueResult = yield queue.reply(messages.AuthenticationSASLContinue);
                const { response: SASLContinueResponse, calculatedServerSignature } = createClientSASLContinueResponse(password, clientNonce, SASLContinueResult.SASLData);
                yield queue.send(messages.SASLResponse, {
                    response: SASLContinueResponse,
                });
                const finalSASL = yield queue.reply(messages.authenticationSASLFinal);
                yield queue.reply(messages.authenticationOk);
                while (true) {
                    const res = yield queue.reply(messages.parameterStatus, messages.backendKeyData, messages.readyForQuery);
                    // break when we get readyForQuery
                    if ('trxStatus' in res) {
                        break;
                    }
                }
                if ('SASLData' in finalSASL) {
                    checkServerFinalMessage(finalSASL.SASLData, calculatedServerSignature);
                    return;
                }
                else {
                    throw new Error('SASL: No final SASL data returned');
                }
            }
            if ('salt' in result) {
                // hash password for md5 auth
                password = generateHash(options.user, password, result.salt);
            }
            // handles both cleartext and md5 password auth
            yield queue.send(messages.passwordMessage, { password });
            yield queue.reply(messages.authenticationOk);
            yield queue.reply(messages.readyForQuery);
        }
        catch (e) {
            // tslint:disable-next-line:no-console
            console.error(`Connection failed: ${e.message}`);
            process.exit(1);
        }
    });
}
export function runQuery(query, queue) {
    return __awaiter(this, void 0, void 0, function* () {
        const resultRows = [];
        yield queue.send(messages.query, { query });
        debugQuery('sent query %o', query);
        {
            const result = yield queue.reply(messages.rowDescription);
            debugQuery('received row description: %o', result.fields.map((c) => c.name.toString()));
        }
        {
            while (true) {
                const result = yield queue.reply(messages.dataRow, messages.commandComplete);
                if ('commandTag' in result) {
                    break;
                }
                const row = result.columns.map((c) => c.value.toString());
                resultRows.push(row);
                debugQuery('received row data: %o', row);
            }
        }
        return resultRows;
    });
}
/**
 * Returns the raw query type data as returned by the Describe message
 * @param query query string, can only contain proper Postgres numeric placeholders
 * @param query name, should be unique per query body
 * @param queue
 */
export function getTypeData(query, queue) {
    return __awaiter(this, void 0, void 0, function* () {
        const uniqueName = crypto.createHash('md5').update(query).digest('hex');
        // Send all the messages needed and then flush
        yield queue.send(messages.parse, {
            name: uniqueName,
            query,
            dataTypes: [],
        });
        yield queue.send(messages.describe, {
            name: uniqueName,
            type: PreparedObjectType.Statement,
        });
        yield queue.send(messages.close, {
            target: PreparedObjectType.Statement,
            targetName: uniqueName,
        });
        yield queue.send(messages.flush, {});
        const parseResult = yield queue.reply(messages.errorResponse, messages.parseComplete);
        // Recover server state from any errors
        yield queue.send(messages.sync, {});
        if ('fields' in parseResult) {
            // Error case
            const { fields: errorFields } = parseResult;
            return {
                errorCode: errorFields.R,
                hint: errorFields.H,
                message: errorFields.M,
                position: errorFields.P,
            };
        }
        const paramsResult = yield queue.reply(messages.parameterDescription, messages.noData);
        const params = 'params' in paramsResult ? paramsResult.params : [];
        const fieldsResult = yield queue.reply(messages.rowDescription, messages.noData);
        const fields = 'fields' in fieldsResult ? fieldsResult.fields : [];
        yield queue.reply(messages.closeComplete);
        return { params, fields };
    });
}
var TypeCategory;
(function (TypeCategory) {
    TypeCategory["ARRAY"] = "A";
    TypeCategory["BOOLEAN"] = "B";
    TypeCategory["COMPOSITE"] = "C";
    TypeCategory["DATE_TIME"] = "D";
    TypeCategory["ENUM"] = "E";
    TypeCategory["GEOMETRIC"] = "G";
    TypeCategory["NETWORK_ADDRESS"] = "I";
    TypeCategory["NUMERIC"] = "N";
    TypeCategory["PSEUDO"] = "P";
    TypeCategory["STRING"] = "S";
    TypeCategory["TIMESPAN"] = "T";
    TypeCategory["USERDEFINED"] = "U";
    TypeCategory["BITSTRING"] = "V";
    TypeCategory["UNKNOWN"] = "X";
})(TypeCategory || (TypeCategory = {}));
// Aggregate rows from database types catalog into MappableTypes
export function reduceTypeRows(typeRows) {
    const enumTypes = typeRows
        .filter((r) => r.typeKind === "e" /* DatabaseTypeKind.Enum */)
        .reduce((typeMap, { oid, typeName, enumLabel }) => {
        var _a;
        const typ = (_a = typeMap[oid]) !== null && _a !== void 0 ? _a : typeName;
        // We should get one row per enum value
        return Object.assign(Object.assign({}, typeMap), { [oid]: {
                name: typeName,
                // Merge enum values
                enumValues: [...(isEnum(typ) ? typ.enumValues : []), enumLabel],
            } });
    }, {});
    return typeRows.reduce((typeMap, { oid, typeName, typeCategory, elementTypeOid }) => {
        var _a;
        // Attempt to merge any partially defined types
        const typ = (_a = typeMap[oid]) !== null && _a !== void 0 ? _a : typeName;
        if (oid in enumTypes) {
            return Object.assign(Object.assign({}, typeMap), { [oid]: enumTypes[oid] });
        }
        if (typeCategory === TypeCategory.ARRAY &&
            elementTypeOid &&
            elementTypeOid in enumTypes) {
            return Object.assign(Object.assign({}, typeMap), { [oid]: {
                    name: typeName,
                    elementType: enumTypes[elementTypeOid],
                } });
        }
        return Object.assign(Object.assign({}, typeMap), { [oid]: typ });
    }, {});
}
// TODO: self-host
function runTypesCatalogQuery(typeOIDs, queue) {
    return __awaiter(this, void 0, void 0, function* () {
        let rows;
        if (typeOIDs.length > 0) {
            const concatenatedTypeOids = typeOIDs.join(',');
            rows = yield runQuery(`
SELECT pt.oid, pt.typname, pt.typtype, pe.enumlabel, pt.typelem, pt.typcategory
FROM pg_type pt
LEFT JOIN pg_enum pe ON pt.oid = pe.enumtypid
WHERE pt.oid IN (${concatenatedTypeOids})
OR pt.oid IN (SELECT typelem FROM pg_type ptn WHERE ptn.oid IN (${concatenatedTypeOids}));
`, queue);
        }
        else {
            rows = [];
        }
        return rows.map(([oid, typeName, typeKind, enumLabel, elementTypeOid, typeCategory]) => ({
            oid,
            typeName,
            typeKind,
            enumLabel,
            elementTypeOid,
            typeCategory,
        }));
    });
}
function getComments(fields, queue) {
    return __awaiter(this, void 0, void 0, function* () {
        const columnFields = fields.filter((f) => f.columnAttrNumber > 0);
        if (columnFields.length === 0) {
            return [];
        }
        const matchers = columnFields.map((f) => `(objoid=${f.tableOID} and objsubid=${f.columnAttrNumber})`);
        const selection = matchers.join(' or ');
        const descriptionRows = yield runQuery(`SELECT
      objoid, objsubid, description
     FROM pg_description WHERE ${selection};`, queue);
        return descriptionRows.map((row) => ({
            tableOID: Number(row[0]),
            columnAttrNumber: Number(row[1]),
            comment: row[2],
        }));
    });
}
export function getTypes(queryData, queue) {
    return __awaiter(this, void 0, void 0, function* () {
        const typeData = yield getTypeData(queryData.query, queue);
        if ('errorCode' in typeData) {
            return typeData;
        }
        const { params, fields } = typeData;
        const paramTypeOIDs = params.map((p) => p.oid);
        const returnTypesOIDs = fields.map((f) => f.typeOID);
        const usedTypesOIDs = paramTypeOIDs.concat(returnTypesOIDs);
        const typeRows = yield runTypesCatalogQuery(usedTypesOIDs, queue);
        const commentRows = yield getComments(fields, queue);
        const typeMap = reduceTypeRows(typeRows);
        const attrMatcher = ({ tableOID, columnAttrNumber, }) => `(attrelid = ${tableOID} and attnum = ${columnAttrNumber})`;
        const attrSelection = fields.length > 0 ? fields.map(attrMatcher).join(' or ') : false;
        const attributeRows = yield runQuery(`SELECT
      (attrelid || ':' || attnum) AS attid, attname, attnotnull
     FROM pg_attribute WHERE ${attrSelection};`, queue);
        const attrMap = attributeRows.reduce((acc, [attid, attname, attnotnull]) => (Object.assign(Object.assign({}, acc), { [attid]: {
                columnName: attname,
                nullable: attnotnull !== 't',
            } })), {});
        const getAttid = (col) => `${col.tableOID}:${col.columnAttrNumber}`;
        const commentMap = {};
        for (const c of commentRows) {
            commentMap[`${c.tableOID}:${c.columnAttrNumber}`] = c.comment;
        }
        const returnTypes = fields.map((f) => (Object.assign(Object.assign(Object.assign({}, attrMap[getAttid(f)]), (commentMap[getAttid(f)] ? { comment: commentMap[getAttid(f)] } : {})), { returnName: f.name, type: typeMap[f.typeOID] })));
        const paramMetadata = {
            params: params.map(({ oid }) => typeMap[oid]),
            mapping: queryData.mapping,
        };
        return { paramMetadata, returnTypes };
    });
}
//# sourceMappingURL=actions.js.map