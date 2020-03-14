import processQuery, {
  ParamType,
  IQueryParameters,
} from "./preprocessor";

interface IDatabaseConnection {
  query: (query: string, bindings: any[]) => Promise<{ rows: any[] }>;
}

export class TaggedQuery<TTypePair extends {params: any, result: any}> {
  public run: (
    params: TTypePair["params"],
    dbConnection: IDatabaseConnection,
  ) => Promise<TTypePair["result"]>;

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

interface ITypePair {
  params: any;
  result: any;
}

const sql = <TTypePair extends ITypePair>(stringsArray: TemplateStringsArray) => (
  new TaggedQuery<TTypePair>(stringsArray[0])
);

export default sql;
