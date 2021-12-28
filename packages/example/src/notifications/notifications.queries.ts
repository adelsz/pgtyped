/** Types generated for queries found in "src/notifications/notifications.sql" */
import { PreparedQuery } from '@pgtyped/query';

export type notification_type = 'deadline' | 'notification' | 'reminder';

export type Json = null | boolean | number | string | Json[] | { [key: string]: Json };

/** 'SendNotifications' parameters type */
export interface ISendNotificationsParams {
  notifications: readonly ({
    user_id: number,
    payload: Json,
    type: notification_type
  })[];
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

const sendNotificationsIR: any = {"name":"SendNotifications","hintedColumnAliases":{},"params":[{"name":"notifications","codeRefs":{"defined":{"a":38,"b":50,"line":3,"col":9},"used":[{"a":150,"b":162,"line":6,"col":8}]},"transform":{"type":"pick_array_spread","keys":[{"name":"user_id","required":true},{"name":"payload","required":true},{"name":"type","required":true}]},"required":false}],"usedParamSet":{"notifications":true},"statement":{"body":"INSERT INTO notifications (user_id, payload, type)\nVALUES :notifications RETURNING id as notification_id","loc":{"a":91,"b":194,"line":5,"col":0}}};

/**
 * Query generated from SQL:
 * ```
 * INSERT INTO notifications (user_id, payload, type)
 * VALUES :notifications RETURNING id as notification_id
 * ```
 */
export const sendNotifications = new PreparedQuery<ISendNotificationsParams,ISendNotificationsResult>(sendNotificationsIR);


/** 'GetNotifications' parameters type */
export interface IGetNotificationsParams {
  userId: number | null | void;
}

/** 'GetNotifications' return type */
export interface IGetNotificationsResult {
  id: number;
  payload: Json;
  type: notification_type;
  user_id: number | null;
}

/** 'GetNotifications' query type */
export interface IGetNotificationsQuery {
  params: IGetNotificationsParams;
  result: IGetNotificationsResult;
}

const getNotificationsIR: any = {"name":"GetNotifications","hintedColumnAliases":{},"params":[{"name":"userId","required":false,"transform":{"type":"scalar"},"codeRefs":{"used":[{"a":275,"b":280,"line":11,"col":18}]}}],"usedParamSet":{"userId":true},"statement":{"body":"SELECT *\n  FROM notifications\n WHERE user_id = :userId","loc":{"a":227,"b":280,"line":9,"col":0}}};

/**
 * Query generated from SQL:
 * ```
 * SELECT *
 *   FROM notifications
 *  WHERE user_id = :userId
 * ```
 */
export const getNotifications = new PreparedQuery<IGetNotificationsParams,IGetNotificationsResult>(getNotificationsIR);


/** 'ThresholdFrogs' parameters type */
export interface IThresholdFrogsParams {
  numFrogs: number;
}

/** 'ThresholdFrogs' return type */
export interface IThresholdFrogsResult {
  payload: Json;
  type: notification_type;
  user_name: string;
}

/** 'ThresholdFrogs' query type */
export interface IThresholdFrogsQuery {
  params: IThresholdFrogsParams;
  result: IThresholdFrogsResult;
}

const thresholdFrogsIR: any = {"name":"ThresholdFrogs","hintedColumnAliases":{},"params":[{"name":"numFrogs","required":true,"transform":{"type":"scalar"},"codeRefs":{"used":[{"a":458,"b":466,"line":20,"col":46}]}}],"usedParamSet":{"numFrogs":true},"statement":{"body":"SELECT u.user_name, n.payload, n.type\nFROM notifications n\nINNER JOIN users u on n.user_id = u.id\nWHERE CAST (n.payload->'num_frogs' AS int) > :numFrogs!","loc":{"a":314,"b":466,"line":17,"col":0}}};

/**
 * Query generated from SQL:
 * ```
 * SELECT u.user_name, n.payload, n.type
 * FROM notifications n
 * INNER JOIN users u on n.user_id = u.id
 * WHERE CAST (n.payload->'num_frogs' AS int) > :numFrogs!
 * ```
 */
export const thresholdFrogs = new PreparedQuery<IThresholdFrogsParams,IThresholdFrogsResult>(thresholdFrogsIR);


