/** Types generated for queries found in "src/books/queries.ts" */

/** 'selectAllBooks' parameters type */
export type ISelectAllBooksParams = void;

/** 'selectAllBooks' return type */
export interface ISelectAllBooksResult {
  id: number;
  name: string | null;
  author_name: string | null;
}

/** 'deleteBooks' parameters type */
export interface IDeleteBooksParams {
  id: number | null;
}

/** 'deleteBooks' return type */
export type IDeleteBooksResult = void;
