/*
  @name GetAllComments
*/
SELECT * FROM comments WHERE id = :commentId;

/*
  @name InsertComment
  @param comments -> ((author, body)...)

*/
INSERT INTO comments (author, body)
VALUES :comments;
