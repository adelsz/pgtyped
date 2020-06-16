/** Types generated for queries found in "./src/comments/comments.sql" */
import { PreparedQuery } from '@pgtyped/query';

/** 'GetAllComments' parameters type */
export interface IGetAllCommentsParams {
  id: number | null | void;
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

const getAllCommentsIR: any = {"name":"GetAllComments","params":[{"name":"commentId","transform":{"type":"scalar"},"codeRefs":{"used":{"a":101,"b":109,"line":3,"col":40}}}],"usedParamSet":{"commentId":true},"statement":{"body":"SELECT * FROM book_comments WHERE id = :commentId","loc":{"a":61,"b":109,"line":3,"col":0}}};

/**
 * Query generated from SQL:
 * ```
 * SELECT * FROM book_comments WHERE id = :id or user_id = :id
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

const insertCommentIR: any = {"name":"InsertComment","params":[{"name":"comments","codeRefs":{"defined":{"a":147,"b":154,"line":7,"col":9},"used":{"a":239,"b":246,"line":10,"col":8}},"transform":{"type":"pick_array_spread","keys":["userId","commentBody"]}}],"usedParamSet":{"comments":true},"statement":{"body":"INSERT INTO book_comments (user_id, body)\nVALUES :comments","loc":{"a":189,"b":246,"line":9,"col":0}}};

/**
 * Query generated from SQL:
 * ```
 * INSERT INTO book_comments (user_id, body)
 * VALUES :comments
 * ```
 */
export const insertComment = new PreparedQuery<IInsertCommentParams,IInsertCommentResult>(insertCommentIR);


