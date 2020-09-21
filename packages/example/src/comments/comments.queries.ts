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

const getAllCommentsIR: any = {"name":"GetAllComments","params":[{"name":"id","transform":{"type":"scalar"},"codeRefs":{"used":[{"a":101,"b":102,"line":3,"col":40},{"a":118,"b":119,"line":3,"col":57}]}}],"usedParamSet":{"id":true},"statement":{"body":"SELECT * FROM book_comments WHERE id = :id or user_id = :id","loc":{"a":61,"b":119,"line":3,"col":0}}};

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
    userId: number | null | void,
    commentBody: string | null | void
  }>;
}

/** 'InsertComment' return type */
export type IInsertCommentResult = void;

/** 'InsertComment' query type */
export interface IInsertCommentQuery {
  params: IInsertCommentParams;
  result: IInsertCommentResult;
}

const insertCommentIR: any = {"name":"InsertComment","params":[{"name":"comments","codeRefs":{"defined":{"a":157,"b":164,"line":7,"col":9},"used":[{"a":249,"b":256,"line":10,"col":8}]},"transform":{"type":"pick_array_spread","keys":["userId","commentBody"]}}],"usedParamSet":{"comments":true},"statement":{"body":"INSERT INTO book_comments (user_id, body)\nVALUES :comments","loc":{"a":199,"b":256,"line":9,"col":0}}};

/**
 * Query generated from SQL:
 * ```
 * INSERT INTO book_comments (user_id, body)
 * VALUES :comments
 * ```
 */
export const insertComment = new PreparedQuery<IInsertCommentParams,IInsertCommentResult>(insertCommentIR);


