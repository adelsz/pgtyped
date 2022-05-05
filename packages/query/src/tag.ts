import { QueryIR } from './loader/sql';
import { parseTSQuery, TSQueryAST } from './loader/typescript';
import { processSQLQueryIR } from './preprocessor-sql';
import { processTSQueryAST } from './preprocessor-ts';

export interface IDatabaseConnection {
  query: (query: string, bindings: any[]) => Promise<{ rows: any[] }>;
}

function mapQueryResultRows(rows: any[]): any[] {
  for (const row of rows) {
    for (const column in row) {
      const lastCharacter = column[column.length - 1];
      const isHintedColumn = lastCharacter === '!' || lastCharacter === '?';
      if (isHintedColumn) {
        row[column.slice(0, -1)] = row[column];
        delete row[column];
      }
    }
  }
  return rows;
}

/* Used for SQL-in-TS */
export class TaggedQuery<TTypePair extends { params: any; result: any }> {
  public run: (
    params: TTypePair['params'],
    dbConnection: IDatabaseConnection,
  ) => Promise<Array<TTypePair['result']>>;

  private readonly query: TSQueryAST;

  constructor(query: TSQueryAST) {
    this.query = query;
    this.run = async (params, connection) => {
      const { query: processedQuery, bindings } = processTSQueryAST(
        this.query,
        params as any,
      );
      const result = await connection.query(processedQuery, bindings);
      return mapQueryResultRows(result.rows);
    };
  }
}

interface ITypePair {
  params: any;
  result: any;
}

const sql = <TTypePair extends ITypePair>(
  stringsArray: TemplateStringsArray,
) => {
  const { query } = parseTSQuery(stringsArray[0]);
  return new TaggedQuery<TTypePair>(query);
};

/* Used for pure SQL */
export class PreparedQuery<TParamType, TResultType> {
  public run: (
    params: TParamType,
    dbConnection: IDatabaseConnection,
  ) => Promise<Array<TResultType>>;

  private readonly queryIR: QueryIR;

  constructor(queryIR: QueryIR) {
    this.queryIR = queryIR;
    this.run = async (params, connection) => {
      const { query: processedQuery, bindings } = processSQLQueryIR(
        this.queryIR,
        params as any,
      );
      const result = await connection.query(processedQuery, bindings);
      return mapQueryResultRows(result.rows);
    };
  }
}

export default sql;
