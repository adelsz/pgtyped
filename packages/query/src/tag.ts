import processQuery, {
  ParamType,
  IQueryParameters,
} from "./preprocessor";

interface IDatabaseConnection {
  query: (query: string, bindings: any[]) => Promise<{ rows: any[] }>;
}

export class TaggedQuery<TResult, TParams> {
  public run: (
    params: TParams,
    dbConnection: IDatabaseConnection,
  ) => Promise<TResult[]>;

  private query: string;

  constructor(query: string) {
    this.query = query;
    this.run = async (params, connection) => {
      const {
        query: processedQuery,
        bindings,
      } = processQuery(this.query, params as any);
      const result = await connection.query(processedQuery, bindings);
      return result.rows;
    };
  }
}

const sql = <TResult, TParams>(stringsArray: TemplateStringsArray) => (
  new TaggedQuery<TResult, TParams>(stringsArray[0])
);

export default sql;
