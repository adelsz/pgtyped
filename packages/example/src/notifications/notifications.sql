/*
  @name SendNotifications
  @param notifications -> ((user_id!, payload!, type!)...)
*/
INSERT INTO notifications (user_id, payload, type)
VALUES :notifications RETURNING id as notification_id;

/* @name GetNotifications */
SELECT *
  FROM notifications
 WHERE user_id = :userId;


/*
  @name ThresholdFrogs
*/
SELECT u.user_name, n.payload, n.type
FROM notifications n
INNER JOIN users u on n.user_id = u.id
WHERE CAST (n.payload->'num_frogs' AS int) > :numFrogs!;
