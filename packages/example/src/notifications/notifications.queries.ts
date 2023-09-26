/** Types generated for queries found in "src/notifications/notifications.sql" */
import { PreparedQuery } from '@pgtyped/runtime';

export type notification_type = 'deadline' | 'notification' | 'reminder';

export type DateOrString = Date | string;

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

const sendNotificationsIR: any = {"usedParamSet":{"notifications":true},"params":[{"name":"notifications","required":false,"transform":{"type":"pick_array_spread","keys":[{"name":"user_id","required":true},{"name":"payload","required":true},{"name":"type","required":true}]},"locs":[{"a":58,"b":71}]}],"statement":"INSERT INTO notifications (user_id, payload, type)\nVALUES :notifications RETURNING id as notification_id"};

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
  date: DateOrString;
  userId?: number | null | void;
}

/** 'GetNotifications' return type */
export interface IGetNotificationsResult {
  created_at: string;
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

const getNotificationsIR: any = {"usedParamSet":{"userId":true,"date":true},"params":[{"name":"userId","required":false,"transform":{"type":"scalar"},"locs":[{"a":47,"b":53}]},{"name":"date","required":true,"transform":{"type":"scalar"},"locs":[{"a":73,"b":78}]}],"statement":"SELECT *\n  FROM notifications\n WHERE user_id = :userId\n AND created_at > :date!"};

/**
 * Query generated from SQL:
 * ```
 * SELECT *
 *   FROM notifications
 *  WHERE user_id = :userId
 *  AND created_at > :date!
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

const thresholdFrogsIR: any = {"usedParamSet":{"numFrogs":true},"params":[{"name":"numFrogs","required":true,"transform":{"type":"scalar"},"locs":[{"a":143,"b":152}]}],"statement":"SELECT u.user_name, n.payload, n.type\nFROM notifications n\nINNER JOIN users u on n.user_id = u.id\nWHERE CAST (n.payload->'num_frogs' AS int) > :numFrogs!"};

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


