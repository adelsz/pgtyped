/* @name FindBookById */
SELECT * FROM books WHERE id = :id;

/* @name FindBookNameOrRank */
SELECT id, name
FROM books
WHERE (name = :name OR rank = :rank);

/* @name FindBookUnicode */
SELECT * FROM books WHERE name = 'שקל';

/*
  @name InsertBooks
  @param books -> ((rank!, name!, authorId!, categories)...)
*/
INSERT INTO books (rank, name, author_id, categories)
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
WHERE id = :id!;

/*
  @name UpdateBooks
*/
UPDATE books
/* ignored comment */
SET
    name = :name,
    rank = :rank
WHERE id = :id!;

/*
  @name UpdateBooksRankNotNull
*/
UPDATE books
SET
    rank = :rank!,
    name = :name
WHERE id = :id!;

/* @name GetBooksByAuthorName */
SELECT b.* FROM books b
INNER JOIN authors a ON a.id = b.author_id
WHERE a.first_name || ' ' || a.last_name = :authorName!;

/* @name AggregateEmailsAndTest */
SELECT array_agg(email) as "emails!", array_agg(age) = :testAges as ageTest FROM users;
