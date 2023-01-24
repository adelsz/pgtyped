/** Types generated for queries found in "src/comments/comments.sql" */
import { PreparedQuery } from '@pgtyped/runtime';

/** 'GetAllComments' parameters type */
export interface IGetAllCommentsParams {
  id: number;
}

/** 'GetAllComments' return type */
export interface IGetAllCommentsResult {
  body: string | null;
  book_id: number | null;
  id: number;
  user_id: number | null;
}

/** 'GetAllComments' query type */
export interface IGetAllCommentsQuery {
  params: IGetAllCommentsParams;
  result: IGetAllCommentsResult;
}

const getAllCommentsIR: any = {"usedParamSet":{"id":true},"params":[{"name":"id","required":true,"transform":{"type":"scalar"},"locs":[{"a":39,"b":42},{"a":57,"b":59}]}],"statement":"SELECT * FROM book_comments WHERE id = :id! OR user_id = :id                                      "};

/**
 * Query generated from SQL:
 * ```
 * SELECT * FROM book_comments WHERE id = :id! OR user_id = :id                                      
 * ```
 */
export const getAllComments = new PreparedQuery<IGetAllCommentsParams,IGetAllCommentsResult>(getAllCommentsIR);


/** 'GetAllCommentsByIds' parameters type */
export interface IGetAllCommentsByIdsParams {
  ids: readonly (number)[];
}

/** 'GetAllCommentsByIds' return type */
export interface IGetAllCommentsByIdsResult {
  body: string | null;
  book_id: number | null;
  id: number;
  user_id: number | null;
}

/** 'GetAllCommentsByIds' query type */
export interface IGetAllCommentsByIdsQuery {
  params: IGetAllCommentsByIdsParams;
  result: IGetAllCommentsByIdsResult;
}

const getAllCommentsByIdsIR: any = {"usedParamSet":{"ids":true},"params":[{"name":"ids","required":true,"transform":{"type":"array_spread"},"locs":[{"a":40,"b":43},{"a":55,"b":59}]}],"statement":"SELECT * FROM book_comments WHERE id in :ids AND id in :ids!"};

/**
 * Query generated from SQL:
 * ```
 * SELECT * FROM book_comments WHERE id in :ids AND id in :ids!
 * ```
 */
export const getAllCommentsByIds = new PreparedQuery<IGetAllCommentsByIdsParams,IGetAllCommentsByIdsResult>(getAllCommentsByIdsIR);


/** 'InsertComment' parameters type */
export interface IInsertCommentParams {
  comments: readonly ({
    userId: number,
    commentBody: string
  })[];
}

/** 'InsertComment' return type */
export type IInsertCommentResult = void;

/** 'InsertComment' query type */
export interface IInsertCommentQuery {
  params: IInsertCommentParams;
  result: IInsertCommentResult;
}

const insertCommentIR: any = {"usedParamSet":{"comments":true},"params":[{"name":"comments","required":false,"transform":{"type":"pick_array_spread","keys":[{"name":"userId","required":true},{"name":"commentBody","required":true}]},"locs":[{"a":49,"b":57}]}],"statement":"INSERT INTO book_comments (user_id, body)\nVALUES :comments"};

/**
 * Query generated from SQL:
 * ```
 * INSERT INTO book_comments (user_id, body)
 * VALUES :comments
 * ```
 */
export const insertComment = new PreparedQuery<IInsertCommentParams,IInsertCommentResult>(insertCommentIR);


