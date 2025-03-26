var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
import { parseTSQuery } from '@pgtyped/parser';
import { processSQLQueryIR } from './preprocessor-sql.js';
import { processTSQueryAST } from './preprocessor-ts.js';
/** Check for column modifier suffixes (exclamation and question marks). */
function isHintedColumn(columnName) {
    const lastCharacter = columnName[columnName.length - 1];
    return lastCharacter === '!' || lastCharacter === '?';
}
function mapQueryResultRows(rows) {
    for (const row of rows) {
        for (const columnName in row) {
            if (isHintedColumn(columnName)) {
                const newColumnNameWithoutSuffix = columnName.slice(0, -1);
                row[newColumnNameWithoutSuffix] = row[columnName];
                delete row[columnName];
            }
        }
    }
    return rows;
}
/* Used for SQL-in-TS */
export class TaggedQuery {
    constructor(query) {
        this.query = query;
        this.run = (params, connection) => __awaiter(this, void 0, void 0, function* () {
            const { query: processedQuery, bindings } = processTSQueryAST(this.query, params);
            const result = yield connection.query(processedQuery, bindings);
            return mapQueryResultRows(result.rows);
        });
        this.stream = (params, connection) => {
            const { query: processedQuery, bindings } = processTSQueryAST(this.query, params);
            if (connection.stream == null)
                throw new Error("Connection doesn't support streaming.");
            const cursor = connection.stream(processedQuery, bindings);
            return {
                read(rowCount) {
                    return __awaiter(this, void 0, void 0, function* () {
                        const rows = yield cursor.read(rowCount);
                        return mapQueryResultRows(rows);
                    });
                },
                close() {
                    return __awaiter(this, void 0, void 0, function* () {
                        yield cursor.close();
                    });
                },
            };
        };
    }
}
export const sql = (stringsArray) => {
    const { query } = parseTSQuery(stringsArray[0]);
    return new TaggedQuery(query);
};
/* Used for pure SQL */
export class PreparedQuery {
    constructor(queryIR) {
        this.queryIR = queryIR;
        this.run = (params, connection) => __awaiter(this, void 0, void 0, function* () {
            const { query: processedQuery, bindings } = processSQLQueryIR(this.queryIR, params);
            const result = yield connection.query(processedQuery, bindings);
            return mapQueryResultRows(result.rows);
        });
        this.runWithCounts = (params, connection) => __awaiter(this, void 0, void 0, function* () {
            const { query: processedQuery, bindings } = processSQLQueryIR(this.queryIR, params);
            const result = yield connection.query(processedQuery, bindings);
            return {
                result: mapQueryResultRows(result.rows),
                rowCount: result.rowCount,
            };
        });
        this.stream = (params, connection) => {
            const { query: processedQuery, bindings } = processSQLQueryIR(this.queryIR, params);
            if (connection.stream == null)
                throw new Error("Connection doesn't support streaming.");
            const cursor = connection.stream(processedQuery, bindings);
            return {
                read(rowCount) {
                    return __awaiter(this, void 0, void 0, function* () {
                        const rows = yield cursor.read(rowCount);
                        return mapQueryResultRows(rows);
                    });
                },
                close() {
                    return __awaiter(this, void 0, void 0, function* () {
                        yield cursor.close();
                    });
                },
            };
        };
    }
}
export default sql;
//# sourceMappingURL=tag.js.map