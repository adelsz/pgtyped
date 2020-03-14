import query from "@pgtyped/query";
const { sql } = query;

import {
  ISelectAllBooksQuery,
  IDeleteBooksQuery,
} from "./queries.types";

export const selectAllBooks = sql<ISelectAllBooksQuery>`select * from books`;

export const deleteBooks = sql<IDeleteBooksQuery>`delete from books * where id = $id`;
