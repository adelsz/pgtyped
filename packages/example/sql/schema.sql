CREATE TABLE users (
  id SERIAL PRIMARY KEY,
  email TEXT NOT NULL,
  user_name TEXT NOT NULL,
  first_name TEXT,
  last_name TEXT,
  age INT,
  registration_date DATE NOT NULL DEFAULT CURRENT_DATE
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
  author_id INTEGER REFERENCES authors
);

CREATE TABLE book_comments (
  id SERIAL PRIMARY KEY,
  user_id INTEGER REFERENCES users,
  book_id INTEGER REFERENCES books,
  body TEXT
);

INSERT INTO users (email, user_name, first_name, last_name, age) VALUES
('alex.doe@example.com', 'alexd', 'Alex', 'Doe', 35),
('jane.holmes@example.com', 'jane67', 'Jane', 'Holmes', 23),
('andrewjackson@example.com', 'ajack9', 'Andrew', 'Jackson', 19);

INSERT INTO authors (first_name, last_name) VALUES
('Nassim', 'Taleb'),
('Carl', 'Sagan'),
('Bertolt', 'Brecht');

INSERT INTO books (rank, name, author_id) VALUES
(1, 'Black Swan', 1),
(4, 'The Dragons Of Eden', 2),
(2, 'Mysteries of a Barbershop', 3),
(3, 'In the Jungle of Cities', 3);

INSERT INTO book_comments (user_id, book_id, body) VALUES
(1, 1, 'Fantastic read, recommend it!'),
(1, 2, 'Did not like it, expected much more...');
