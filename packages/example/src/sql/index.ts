import { sql as sourceSql } from '@pgtyped/runtime';

import type { Category } from '../customTypes.js';

export type categoryArray = readonly (Category)[];
/** 'SqlSelectFromBooksWhereIdId' parameters type */
export interface ISqlSelectFromBooksWhereIdIdParams {
  id?: number | null | void;
}

/** 'SqlSelectFromBooksWhereIdId' return type */
export interface ISqlSelectFromBooksWhereIdIdResult {
  author_id: number | null;
  categories: categoryArray | null;
  id: number;
  name: string | null;
  rank: number | null;
}

/** 'SqlSelectFromBooksWhereIdId' query type */
export interface ISqlSelectFromBooksWhereIdIdQuery {
  params: ISqlSelectFromBooksWhereIdIdParams;
  result: ISqlSelectFromBooksWhereIdIdResult;
}

export function sql(s: `SELECT * FROM books WHERE id = $id`): ReturnType<typeof sourceSql<ISqlSelectFromBooksWhereIdIdQuery>>;

export function sql(s: string): unknown;
export function sql(s: string): unknown {
  return sourceSql([s] as any);
}