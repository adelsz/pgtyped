/** Types generated for queries found in "./src/books/books.sql" */
import { PreparedQuery } from '@pgtyped/query';

/** 'FindBookById' parameters type */
export interface IFindBookByIdParams {
  commentId: number | null | void;
}

/** 'FindBookById' return type */
export interface IFindBookByIdResult {
  id: number;
  rank: number | null;
  name: string | null;
  author_id: number | null;
  r: number | null;
}

/** 'FindBookById' query type */
export interface IFindBookByIdQuery {
  params: IFindBookByIdParams;
  result: IFindBookByIdResult;
}

const findBookByIdIR: any = {"name":"FindBookById","params":[{"name":"commentId","transform":{"type":"scalar"},"codeRefs":{"used":[{"a":57,"b":65,"line":2,"col":32}]}}],"usedParamSet":{"commentId":true},"statement":{"body":"SELECT * FROM books WHERE id = :commentId","loc":{"a":25,"b":65,"line":2,"col":0}}};

/**
 * Query generated from SQL:
 * ```
 * SELECT * FROM books WHERE id = :commentId
 * ```
 */
export const findBookById = new PreparedQuery<IFindBookByIdParams,IFindBookByIdResult>(findBookByIdIR);


/** 'InsertBooks' parameters type */
export interface IInsertBooksParams {
  books: Array<{
    rank: number | null | void,
    name: string | null | void,
    authorId: number | null | void
  }>;
}

/** 'InsertBooks' return type */
export interface IInsertBooksResult {
  book_id: number;
}

/** 'InsertBooks' query type */
export interface IInsertBooksQuery {
  params: IInsertBooksParams;
  result: IInsertBooksResult;
}

const insertBooksIR: any = {"name":"InsertBooks","params":[{"name":"books","codeRefs":{"defined":{"a":101,"b":105,"line":6,"col":9},"used":[{"a":191,"b":195,"line":9,"col":8}]},"transform":{"type":"pick_array_spread","keys":["rank","name","authorId"]}}],"usedParamSet":{"books":true},"statement":{"body":"INSERT INTO books (rank, name, author_id)\nVALUES :books RETURNING id as book_id","loc":{"a":141,"b":219,"line":8,"col":0}}};

/**
 * Query generated from SQL:
 * ```
 * INSERT INTO books (rank, name, author_id)
 * VALUES :books RETURNING id as book_id
 * ```
 */
export const insertBooks = new PreparedQuery<IInsertBooksParams,IInsertBooksResult>(insertBooksIR);


/** 'UpdateBooksCustom' parameters type */
export interface IUpdateBooksCustomParams {
  rank: number | null | void;
  id: number | null | void;
}

/** 'UpdateBooksCustom' return type */
export type IUpdateBooksCustomResult = void;

/** 'UpdateBooksCustom' query type */
export interface IUpdateBooksCustomQuery {
  params: IUpdateBooksCustomParams;
  result: IUpdateBooksCustomResult;
}

const updateBooksCustomIR: any = {"name":"UpdateBooksCustom","params":[{"name":"rank","transform":{"type":"scalar"},"codeRefs":{"used":[{"a":305,"b":308,"line":17,"col":20},{"a":351,"b":354,"line":18,"col":23}]}},{"name":"id","transform":{"type":"scalar"},"codeRefs":{"used":[{"a":417,"b":418,"line":22,"col":12}]}}],"usedParamSet":{"rank":true,"id":true},"statement":{"body":"UPDATE books\nSET\n    rank = (\n        CASE WHEN (:rank::int IS NOT NULL)\n                 THEN :rank\n             ELSE rank\n            END\n        )\nWHERE id = :id","loc":{"a":255,"b":418,"line":14,"col":0}}};

/**
 * Query generated from SQL:
 * ```
 * UPDATE books
 * SET
 *     rank = (
 *         CASE WHEN (:rank::int IS NOT NULL)
 *                  THEN :rank
 *              ELSE rank
 *             END
 *         )
 * WHERE id = :id
 * ```
 */
export const updateBooksCustom = new PreparedQuery<IUpdateBooksCustomParams,IUpdateBooksCustomResult>(updateBooksCustomIR);


/** 'UpdateBooks' parameters type */
export interface IUpdateBooksParams {
  name: string | null | void;
  rank: number | null | void;
  id: number | null | void;
}

/** 'UpdateBooks' return type */
export type IUpdateBooksResult = void;

/** 'UpdateBooks' query type */
export interface IUpdateBooksQuery {
  params: IUpdateBooksParams;
  result: IUpdateBooksResult;
}

const updateBooksIR: any = {"name":"UpdateBooks","params":[{"name":"name","transform":{"type":"scalar"},"codeRefs":{"used":[{"a":477,"b":480,"line":29,"col":12}]}},{"name":"rank","transform":{"type":"scalar"},"codeRefs":{"used":[{"a":495,"b":498,"line":30,"col":12}]}},{"name":"id","transform":{"type":"scalar"},"codeRefs":{"used":[{"a":512,"b":513,"line":31,"col":12}]}}],"usedParamSet":{"name":true,"rank":true,"id":true},"statement":{"body":"UPDATE books\nSET\n    name = :name,\n    rank = :rank\nWHERE id = :id","loc":{"a":448,"b":513,"line":27,"col":0}}};

/**
 * Query generated from SQL:
 * ```
 * UPDATE books
 * SET
 *     name = :name,
 *     rank = :rank
 * WHERE id = :id
 * ```
 */
export const updateBooks = new PreparedQuery<IUpdateBooksParams,IUpdateBooksResult>(updateBooksIR);


/** 'GetBooksByAuthorName' parameters type */
export interface IGetBooksByAuthorNameParams {
  authorName: string | null | void;
}

/** 'GetBooksByAuthorName' return type */
export interface IGetBooksByAuthorNameResult {
  id: number;
  rank: number | null;
  name: string | null;
  author_id: number | null;
  r: number | null;
}

/** 'GetBooksByAuthorName' query type */
export interface IGetBooksByAuthorNameQuery {
  params: IGetBooksByAuthorNameParams;
  result: IGetBooksByAuthorNameResult;
}

const getBooksByAuthorNameIR: any = {"name":"GetBooksByAuthorName","params":[{"name":"authorName","transform":{"type":"scalar"},"codeRefs":{"used":[{"a":662,"b":671,"line":37,"col":44}]}}],"usedParamSet":{"authorName":true},"statement":{"body":"SELECT b.* FROM books b\nINNER JOIN authors a ON a.id = b.author_id\nWHERE a.first_name || ' ' || a.last_name = :authorName","loc":{"a":551,"b":671,"line":35,"col":0}}};

/**
 * Query generated from SQL:
 * ```
 * SELECT b.* FROM books b
 * INNER JOIN authors a ON a.id = b.author_id
 * WHERE a.first_name || ' ' || a.last_name = :authorName
 * ```
 */
export const getBooksByAuthorName = new PreparedQuery<IGetBooksByAuthorNameParams,IGetBooksByAuthorNameResult>(getBooksByAuthorNameIR);


