import sql from "@pg-typed/query";
import {
  ISelectAllBooksParams, ISelectAllBooksResult,
  IDeleteBooksResult, IDeleteBooksParams,
} from "./queries.types";

export const selectAllBooks = sql<
  ISelectAllBooksResult, ISelectAllBooksParams
  >`select * from books`;

export const deleteBooks = sql<
  IDeleteBooksResult, IDeleteBooksParams
  >`delete from books * where id = $id`;
