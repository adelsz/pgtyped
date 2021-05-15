/* A query to get all comments */
/* @name GetAllComments */
SELECT * FROM book_comments WHERE id = :id! OR user_id = :id;

/* A query to get multiple comments */
/*
  @name GetAllCommentsByIds
  @param ids -> (...)
*/
SELECT * FROM book_comments WHERE id in :ids;

/*
  @name InsertComment
  @param comments -> ((userId!, commentBody!)...)
*/
INSERT INTO book_comments (user_id, body)
VALUES :comments;
