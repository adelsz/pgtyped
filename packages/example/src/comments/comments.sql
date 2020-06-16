/* A query to get all comments */
/* @name GetAllComments */
SELECT * FROM book_comments WHERE id = :id or user_id = :id;

/*
  @name InsertComment
  @param comments -> ((userId, commentBody)...)
*/
INSERT INTO book_comments (user_id, body)
VALUES :comments;
