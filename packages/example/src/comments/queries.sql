/*
  @name GetAllComments
*/
SELECT * FROM book_comments WHERE id = :commentId;

/*
  @name InsertComment
  @param comments -> ((userId, commentBody)...)
*/
INSERT INTO book_comments (user_id, body)
VALUES :comments;
