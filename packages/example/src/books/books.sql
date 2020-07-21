/* @name FindBookById */
SELECT * FROM books WHERE id = :commentId;

/*
  @name InsertBooks
  @param books -> ((rank, name, authorId)...)
*/
INSERT INTO books (rank, name, author_id)
VALUES :books RETURNING id as book_id;

/*
  @name UpdateBooksCustom
*/
UPDATE books
SET
    rank = (
        CASE WHEN (:rank::int IS NOT NULL)
                 THEN :rank
             ELSE rank
            END
        )
WHERE id = :id;

/*
  @name UpdateBooks
*/
UPDATE books
SET
    name = :name,
    rank = :rank
WHERE id = :id;


/* @name GetBooksByAuthorName */
SELECT b.* FROM books b
INNER JOIN authors a ON a.id = b.author_id
WHERE a.first_name || ' ' || a.last_name = :authorName;
