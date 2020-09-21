/** Types generated for queries found in "./src/notifications/notifications.ts" */
export type notification_type = 'notification' | 'reminder' | 'deadline';

export type Json = null | boolean | number | string | Json[] | { [key: string]: Json };

/** 'InsertNotifications' parameters type */
export interface IInsertNotificationsParams {
  params: Array<{
    payload: Json | null | void,
    user_id: number | null | void,
    type: notification_type | null | void
  }>;
}

/** 'InsertNotifications' return type */
export type IInsertNotificationsResult = void;

/** 'InsertNotifications' query type */
export interface IInsertNotificationsQuery {
  params: IInsertNotificationsParams;
  result: IInsertNotificationsResult;
}

/** 'InsertNotification' parameters type */
export interface IInsertNotificationParams {
  notification: {
    payload: Json | null | void,
    user_id: number | null | void,
    type: notification_type | null | void
  };
}

/** 'InsertNotification' return type */
export type IInsertNotificationResult = void;

/** 'InsertNotification' query type */
export interface IInsertNotificationQuery {
  params: IInsertNotificationParams;
  result: IInsertNotificationResult;
}

/** 'GetAllNotifications' parameters type */
export type IGetAllNotificationsParams = void;

/** 'GetAllNotifications' return type */
export interface IGetAllNotificationsResult {
  id: number;
  user_id: number | null;
  payload: Json;
  type: notification_type;
}

/** 'GetAllNotifications' query type */
export interface IGetAllNotificationsQuery {
  params: IGetAllNotificationsParams;
  result: IGetAllNotificationsResult;
}

