import {
  processQueryString,
  ParamTransform,
  IQueryParameters, processQueryAST,
} from "./preprocessor";
import {Query as QueryAST} from "./loader/sql";

interface IDatabaseConnection {
  query: (query: string, bindings: any[]) => Promise<{ rows: any[] }>;
}

/* Used for SQL-in-TS */
export class TaggedQuery<TTypePair extends {params: any, result: any}> {
  public run: (
    params: TTypePair["params"],
    dbConnection: IDatabaseConnection,
  ) => Promise<Array<TTypePair["result"]>>;

  private readonly query: string;

  constructor(query: string) {
    this.query = query;
    this.run = async (params, connection) => {
      const {
        query: processedQuery,
        bindings,
      } = processQueryString(this.query, params as any);
      const result = await connection.query(processedQuery, bindings);
      return result.rows;
    };
  }
}

interface ITypePair {
  params: any;
  result: any;
}

const sql = <TTypePair extends ITypePair>(stringsArray: TemplateStringsArray) => (
  new TaggedQuery<TTypePair>(stringsArray[0])
);

/* Used for pure SQL */
export class PreparedQuery<TParamType, TResultType> {
  public run: (
    params: TParamType,
    dbConnection: IDatabaseConnection,
  ) => Promise<Array<TResultType>>;

  private readonly query: QueryAST;

  constructor(query: QueryAST) {
    this.query = query;
    this.run = async (params, connection) => {
      const {
        query: processedQuery,
        bindings,
      } = processQueryAST(this.query, params as any);
      const result = await connection.query(processedQuery, bindings);
      return result.rows;
    };
  }
}

export default sql;
