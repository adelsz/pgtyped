import { sql } from '@pgtyped/runtime';
import {
  IInsertNotificationQuery,
  IInsertNotificationsQuery,
  IGetAllNotificationsQuery,
} from './notifications.types.js';

// Table order is (user_id, payload, type)
export const insertNotifications = sql<IInsertNotificationsQuery>`
INSERT INTO notifications (payload, user_id, type)
values $$params(payload!, user_id!, type!)
`;

export const insertNotification = sql<IInsertNotificationQuery>`
    INSERT INTO notifications (payload, user_id, type)
    values $notification(payload!, user_id!, type!)
`;

export const getAllNotifications = sql<IGetAllNotificationsQuery>`
  SELECT * FROM notifications
`;
