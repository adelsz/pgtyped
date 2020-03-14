/** Types generated for queries found in "src/books/queries.ts" */

/** 'selectAllBooks' parameters type */
export type ISelectAllBooksParams = void;

/** 'selectAllBooks' return type */
export interface ISelectAllBooksResult {
  id: number;
  name: string | null;
  author_name: string | null;
}

/** 'selectAllBooks' query type */
export interface ISelectAllBooksQuery {
  params: ISelectAllBooksParams;
  result: ISelectAllBooksResult;
}

/** 'deleteBooks' parameters type */
export interface IDeleteBooksParams {
  id: number | null;
}

/** 'deleteBooks' return type */
export type IDeleteBooksResult = void;

/** 'deleteBooks' query type */
export interface IDeleteBooksQuery {
  params: IDeleteBooksParams;
  result: IDeleteBooksResult;
}
