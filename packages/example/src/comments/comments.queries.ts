/** Types generated for queries found in "src/comments/comments.sql" */
import { PreparedQuery } from '@pgtyped/query';

/** 'GetAllComments' parameters type */
export interface IGetAllCommentsParams {
  commentId: number | null | void;
}

/** 'GetAllComments' return type */
export interface IGetAllCommentsResult {
  id: number;
  user_id: number | null;
  book_id: number | null;
  body: string | null;
}

/** 'GetAllComments' query type */
export interface IGetAllCommentsQuery {
  params: IGetAllCommentsParams;
  result: IGetAllCommentsResult;
}

const getAllCommentsIR: any = {"name":"GetAllComments","params":[{"name":"commentId","transform":{"type":"scalar"},"codeRefs":{"used":{"a":69,"b":77,"line":4,"col":40}}}],"usedParamSet":{"commentId":true},"statement":{"body":"SELECT * FROM book_comments WHERE id = :commentId","loc":{"a":29,"b":77,"line":4,"col":0}}};

/**
 * Query generated from SQL:
 * ```
 * SELECT * FROM book_comments WHERE id = :commentId
 * ```
 */
export const getAllComments = new PreparedQuery<IGetAllCommentsParams,IGetAllCommentsResult>(getAllCommentsIR);


/** 'InsertComment' parameters type */
export interface IInsertCommentParams {
  comments: Array<{
    userId: number,
    commentBody: string
  }>;
}

/** 'InsertComment' return type */
export type IInsertCommentResult = void;

/** 'InsertComment' query type */
export interface IInsertCommentQuery {
  params: IInsertCommentParams;
  result: IInsertCommentResult;
}

const insertCommentIR: any = {"name":"InsertComment","params":[{"name":"comments","codeRefs":{"defined":{"a":115,"b":122,"line":8,"col":9},"used":{"a":207,"b":214,"line":11,"col":8}},"transform":{"type":"pick_array_spread","keys":["userId","commentBody"]}}],"usedParamSet":{"comments":true},"statement":{"body":"INSERT INTO book_comments (user_id, body)\nVALUES :comments","loc":{"a":157,"b":214,"line":10,"col":0}}};

/**
 * Query generated from SQL:
 * ```
 * INSERT INTO book_comments (user_id, body)
 * VALUES :comments
 * ```
 */
export const insertComment = new PreparedQuery<IInsertCommentParams,IInsertCommentResult>(insertCommentIR);


