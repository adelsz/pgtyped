CREATE TABLE users (
  id SERIAL PRIMARY KEY,
  email TEXT NOT NULL,
  user_name TEXT NOT NULL,
  first_name TEXT,
  last_name TEXT,
  age INT,
  registration_date DATE NOT NULL DEFAULT CURRENT_DATE
);

COMMENT ON COLUMN users.age IS 'Age (in years)';

CREATE TYPE notification_type AS ENUM ('notification', 'reminder', 'deadline');
CREATE TYPE category AS ENUM ('thriller', 'science-fiction', 'novel');

CREATE TABLE notifications (
  id SERIAL PRIMARY KEY,
  user_id INTEGER REFERENCES users,
  payload jsonb NOT NULL,
  type notification_type NOT NULL DEFAULT 'notification'
);

CREATE TABLE authors (
  id SERIAL PRIMARY KEY,
  first_name TEXT,
  last_name TEXT
);

CREATE TABLE books (
  id SERIAL PRIMARY KEY,
  rank INTEGER,
  name TEXT,
  author_id INTEGER REFERENCES authors,
  categories category[]
);

CREATE TABLE book_comments (
  id SERIAL PRIMARY KEY,
  user_id INTEGER REFERENCES users,
  book_id INTEGER REFERENCES books,
  body TEXT
);

INSERT INTO users (email, user_name, first_name, last_name, age)
VALUES ('alex.doe@example.com', 'alexd', 'Alex', 'Doe', 35),
       ('jane.holmes@example.com', 'jane67', 'Jane', 'Holmes', 23),
       ('andrewjackson@example.com', 'ajack9', 'Andrew', 'Jackson', 19);

INSERT INTO notifications (user_id, payload)
VALUES (1, '{
  "message": "You have new frogs",
  "num_frogs": 2,
  "history": [
    {
      "event": "NewFrog",
      "timestamp": "2020-05-05T17:12:25+01:00"
    },
    {
      "event": "NewFrog",
      "timestamp": "2020-05-05T17:13:04+01:00"
    }
  ]
}');

INSERT INTO authors (first_name, last_name)
VALUES ('Nassim', 'Taleb'),
       ('Carl', 'Sagan'),
       ('Bertolt', 'Brecht');

INSERT INTO books (rank, name, author_id)
VALUES (1, 'Black Swan', 1),
       (4, 'The Dragons Of Eden', 2),
       (2, 'Mysteries of a Barbershop', 3),
       (3, 'In the Jungle of Cities', 3);

INSERT INTO book_comments (user_id, book_id, body)
VALUES (1, 1, 'Fantastic read, recommend it!'),
       (1, 2, 'Did not like it, expected much more...');
