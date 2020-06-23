/** Types generated for queries found in "./src/notifications/notifications.ts" */
export type notification_type = 'notification' | 'reminder' | 'deadline';

export type Json = null | boolean | number | string | Json[] | { [key: string]: Json };

/** 'insertNotifications' parameters type */
export interface IInsertNotificationsParams {
  params: Array<{
    payload: Json,
    user_id: number,
    type: notification_type
  }>;
}

/** 'insertNotifications' return type */
export type IInsertNotificationsResult = void;

/** 'insertNotifications' query type */
export interface IInsertNotificationsQuery {
  params: IInsertNotificationsParams;
  result: IInsertNotificationsResult;
}

/** 'insertNotification' parameters type */
export interface IInsertNotificationParams {
  notification: {
    payload: Json,
    user_id: number,
    type: notification_type
  };
}

/** 'insertNotification' return type */
export type IInsertNotificationResult = void;

/** 'insertNotification' query type */
export interface IInsertNotificationQuery {
  params: IInsertNotificationParams;
  result: IInsertNotificationResult;
}

