/** Types generated for queries found in "src/comments/queries.sql" */
import { PreparedQuery } from "@pgtyped/query";

/** 'GetAllComments' parameters type */
export interface IGetAllCommentsParams {
  commentId: number | null;
}

/** 'GetAllComments' return type */
export interface IGetAllCommentsResult {
  id: number;
  position: number | null;
  author: string | null;
  body: string | null;
}

/** 'GetAllComments' query type */
export interface IGetAllCommentsQuery {
  params: IGetAllCommentsParams;
  result: IGetAllCommentsResult;
}

const getAllCommentsIR: any = {"name":"GetAllComments","params":[{"name":"commentId","transform":{"type":"scalar"},"codeRefs":{"used":{"a":64,"b":72,"line":4,"col":35}}}],"usedParamSet":{},"statement":{"body":"SELECT * FROM comments WHERE id = :commentId","loc":{"a":29,"b":72,"line":4,"col":0}}};

/**
 * Query generated from SQL:
 * ```
 * SELECT * FROM comments WHERE id = :commentId
 * ```
 */
export const getAllComments = new PreparedQuery<IGetAllCommentsParams,IGetAllCommentsResult>(getAllCommentsIR);


/** 'InsertComment' parameters type */
export interface IInsertCommentParams {
  comments: Array<{
    author: string,
    body: string
  }>;
}

/** 'InsertComment' return type */
export type IInsertCommentResult = void;

/** 'InsertComment' query type */
export interface IInsertCommentQuery {
  params: IInsertCommentParams;
  result: IInsertCommentResult;
}

const insertCommentIR: any = {"name":"InsertComment","params":[{"name":"comments","codeRefs":{"defined":{"a":110,"b":117,"line":8,"col":9},"used":{"a":190,"b":197,"line":12,"col":8}},"transform":{"type":"pick_array_spread","keys":["author","body"]}}],"usedParamSet":{},"statement":{"body":"INSERT INTO comments (author, body)\nVALUES :comments","loc":{"a":146,"b":197,"line":11,"col":0}}};

/**
 * Query generated from SQL:
 * ```
 * INSERT INTO comments (author, body)
 * VALUES :comments
 * ```
 */
export const insertComment = new PreparedQuery<IInsertCommentParams,IInsertCommentResult>(insertCommentIR);


