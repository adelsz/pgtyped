/** Types generated for queries found in "src/comments/comments.sql" */
import { PreparedQuery } from '@pgtyped/query';

/** 'GetAllComments' parameters type */
export interface IGetAllCommentsParams {
  id: number;
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

const getAllCommentsIR: any = {"name":"GetAllComments","params":[{"name":"id","required":true,"transform":{"type":"scalar"},"codeRefs":{"used":[{"a":101,"b":103,"line":3,"col":40},{"a":119,"b":120,"line":3,"col":58}]}}],"usedParamSet":{"id":true},"statement":{"body":"SELECT * FROM book_comments WHERE id = :id! OR user_id = :id                                      ","loc":{"a":61,"b":120,"line":3,"col":0}}};

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
  id: number;
  user_id: number | null;
  book_id: number | null;
  body: string | null;
}

/** 'GetAllCommentsByIds' query type */
export interface IGetAllCommentsByIdsQuery {
  params: IGetAllCommentsByIdsParams;
  result: IGetAllCommentsByIdsResult;
}

const getAllCommentsByIdsIR: any = {"name":"GetAllCommentsByIds","params":[{"name":"ids","codeRefs":{"defined":{"a":203,"b":205,"line":8,"col":9},"used":[{"a":260,"b":262,"line":10,"col":41},{"a":275,"b":278,"line":10,"col":56}]},"transform":{"type":"array_spread"},"required":true}],"usedParamSet":{"ids":true},"statement":{"body":"SELECT * FROM book_comments WHERE id in :ids AND id in :ids!","loc":{"a":219,"b":278,"line":10,"col":0}}};

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

const insertCommentIR: any = {"name":"InsertComment","params":[{"name":"comments","codeRefs":{"defined":{"a":316,"b":323,"line":14,"col":9},"used":[{"a":410,"b":417,"line":17,"col":8}]},"transform":{"type":"pick_array_spread","keys":[{"name":"userId","required":true},{"name":"commentBody","required":true}]},"required":false}],"usedParamSet":{"comments":true},"statement":{"body":"INSERT INTO book_comments (user_id, body)\nVALUES :comments","loc":{"a":360,"b":417,"line":16,"col":0}}};

/**
 * Query generated from SQL:
 * ```
 * INSERT INTO book_comments (user_id, body)
 * VALUES :comments
 * ```
 */
export const insertComment = new PreparedQuery<IInsertCommentParams,IInsertCommentResult>(insertCommentIR);


