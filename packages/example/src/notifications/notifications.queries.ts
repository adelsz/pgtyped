/** Types generated for queries found in "src/notifications/notifications.sql" */
import { PreparedQuery } from '@pgtyped/query';

export type Json = null | boolean | number | string | Json[] | { [key: string]: Json };

/** 'GetNotifications' parameters type */
export interface IGetNotificationsParams {
  userId: number | null | void;
}

/** 'GetNotifications' return type */
export interface IGetNotificationsResult {
  id: number;
  user_id: number | null;
  payload: Json;
}

/** 'GetNotifications' query type */
export interface IGetNotificationsQuery {
  params: IGetNotificationsParams;
  result: IGetNotificationsResult;
}

const getNotificationsIR: any = {"name":"GetNotifications","params":[{"name":"userId","transform":{"type":"scalar"},"codeRefs":{"used":{"a":74,"b":79,"line":4,"col":17}}}],"usedParamSet":{"userId":true},"statement":{"body":"SELECT *\nFROM notifications\nWHERE user_id = :userId","loc":{"a":29,"b":79,"line":2,"col":0}}};

/**
 * Query generated from SQL:
 * ```
 * SELECT *
 * FROM notifications
 * WHERE user_id = :userId
 * ```
 */
export const getNotifications = new PreparedQuery<IGetNotificationsParams,IGetNotificationsResult>(getNotificationsIR);


/** 'SendNotifications' parameters type */
export interface ISendNotificationsParams {
  notifications: Array<{
    user_id: number,
    payload: Json
  }>;
}

/** 'SendNotifications' return type */
export interface ISendNotificationsResult {
  notification_id: number;
}

/** 'SendNotifications' query type */
export interface ISendNotificationsQuery {
  params: ISendNotificationsParams;
  result: ISendNotificationsResult;
}

const sendNotificationsIR: any = {"name":"SendNotifications","params":[{"name":"notifications","codeRefs":{"defined":{"a":121,"b":133,"line":8,"col":9},"used":{"a":218,"b":230,"line":11,"col":8}},"transform":{"type":"pick_array_spread","keys":["user_id","payload"]}}],"usedParamSet":{"notifications":true},"statement":{"body":"INSERT INTO notifications (user_id, payload)\nVALUES :notifications RETURNING id as notification_id","loc":{"a":165,"b":262,"line":10,"col":0}}};

/**
 * Query generated from SQL:
 * ```
 * INSERT INTO notifications (user_id, payload)
 * VALUES :notifications RETURNING id as notification_id
 * ```
 */
export const sendNotifications = new PreparedQuery<ISendNotificationsParams,ISendNotificationsResult>(sendNotificationsIR);


/** 'ThresholdFrogs' parameters type */
export interface IThresholdFrogsParams {
  numFrogs: number | null | void;
}

/** 'ThresholdFrogs' return type */
export interface IThresholdFrogsResult {
  user_name: string;
  payload: Json;
}

/** 'ThresholdFrogs' query type */
export interface IThresholdFrogsQuery {
  params: IThresholdFrogsParams;
  result: IThresholdFrogsResult;
}

const thresholdFrogsIR: any = {"name":"ThresholdFrogs","params":[{"name":"numFrogs","transform":{"type":"scalar"},"codeRefs":{"used":{"a":431,"b":438,"line":19,"col":46}}}],"usedParamSet":{"numFrogs":true},"statement":{"body":"SELECT u.user_name, n.payload\nFROM notifications n\nINNER JOIN users u on n.user_id = u.id\nWHERE CAST (n.payload->'num_frogs' AS int) > :numFrogs","loc":{"a":295,"b":438,"line":16,"col":0}}};

/**
 * Query generated from SQL:
 * ```
 * SELECT u.user_name, n.payload
 * FROM notifications n
 * INNER JOIN users u on n.user_id = u.id
 * WHERE CAST (n.payload->'num_frogs' AS int) > :numFrogs
 * ```
 */
export const thresholdFrogs = new PreparedQuery<IThresholdFrogsParams,IThresholdFrogsResult>(thresholdFrogsIR);


