/** Types generated for queries found in "./src/books/queries.ts" */

/** 'SELECT_ALL_BOOKS' parameters type */
export type ISelectAllBooksParams = void;

/** 'SELECT_ALL_BOOKS' return type */
export interface ISelectAllBooksResult {
  id: string;
  name: string | null;
  uid: string | null;
}


/** 'DELETE_BOOKS' parameters type */
export interface IDeleteBooksParams {
  id: string | null;
}

/** 'DELETE_BOOKS' return type */
export type IDeleteBooksResult = void;


