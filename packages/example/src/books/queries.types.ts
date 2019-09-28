/** Types generated for queries found in "./src/books/queries.ts" */

/** 'selectAllBooks' parameters type */
export type ISelectAllBooksParams = void;

/** 'selectAllBooks' return type */
export interface ISelectAllBooksResult {
  id: string;
  name: string | null;
  uid: string | null;
}

/** 'deleteBooks' parameters type */
export interface IDeleteBooksParams {
  id: string | null;
}

/** 'deleteBooks' return type */
export type IDeleteBooksResult = void;
