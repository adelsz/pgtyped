/** Types generated for queries found in "src/books/queries.sql" */
import { PreparedQuery } from "@pgtyped/query";

/** 'FindBookById' parameters type */
export interface IFindBookByIdParams {
  commentId: number | null;
}

/** 'FindBookById' return type */
export interface IFindBookByIdResult {
  id: number;
  rank: number | null;
  name: string | null;
  author_id: number | null;
}

/** 'FindBookById' query type */
export interface IFindBookByIdQuery {
  params: IFindBookByIdParams;
  result: IFindBookByIdResult;
}

const findBookByIdIR: any = {"name":"FindBookById","params":[{"name":"commentId","transform":{"type":"scalar"},"codeRefs":{"used":{"a":57,"b":65,"line":2,"col":32}}}],"usedParamSet":{"commentId":true},"statement":{"body":"SELECT * FROM books WHERE id = :commentId","loc":{"a":25,"b":65,"line":2,"col":0}}};

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
    rank: number,
    name: string,
    authorId: number
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

const insertBooksIR: any = {"name":"InsertBooks","params":[{"name":"books","codeRefs":{"defined":{"a":101,"b":105,"line":6,"col":9},"used":{"a":191,"b":195,"line":9,"col":8}},"transform":{"type":"pick_array_spread","keys":["rank","name","authorId"]}}],"usedParamSet":{"books":true},"statement":{"body":"INSERT INTO books (rank, name, author_id)\nVALUES :books RETURNING id as book_id","loc":{"a":141,"b":219,"line":8,"col":0}}};

/**
 * Query generated from SQL:
 * ```
 * INSERT INTO books (rank, name, author_id)
 * VALUES :books RETURNING id as book_id
 * ```
 */
export const insertBooks = new PreparedQuery<IInsertBooksParams,IInsertBooksResult>(insertBooksIR);


/** 'GetBooksByAuthorName' parameters type */
export interface IGetBooksByAuthorNameParams {
  authorName: string | null;
}

/** 'GetBooksByAuthorName' return type */
export interface IGetBooksByAuthorNameResult {
  id: number;
  rank: number | null;
  name: string | null;
  author_id: number | null;
}

/** 'GetBooksByAuthorName' query type */
export interface IGetBooksByAuthorNameQuery {
  params: IGetBooksByAuthorNameParams;
  result: IGetBooksByAuthorNameResult;
}

const getBooksByAuthorNameIR: any = {"name":"GetBooksByAuthorName","params":[{"name":"authorName","transform":{"type":"scalar"},"codeRefs":{"used":{"a":368,"b":377,"line":15,"col":44}}}],"usedParamSet":{"authorName":true},"statement":{"body":"SELECT b.* FROM books b\nINNER JOIN authors a ON a.id = b.author_id\nWHERE a.first_name || ' ' || a.last_name = :authorName","loc":{"a":257,"b":377,"line":13,"col":0}}};

/**
 * Query generated from SQL:
 * ```
 * SELECT b.* FROM books b
 * INNER JOIN authors a ON a.id = b.author_id
 * WHERE a.first_name || ' ' || a.last_name = :authorName
 * ```
 */
export const getBooksByAuthorName = new PreparedQuery<IGetBooksByAuthorNameParams,IGetBooksByAuthorNameResult>(getBooksByAuthorNameIR);


