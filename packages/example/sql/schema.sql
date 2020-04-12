CREATE TABLE users (
  id int not null,
  age int,
  name text
);

CREATE TABLE books (
  id int not null,
  name text,
  author_name text
);

CREATE TABLE comments (
  id int not null,
  position int,
  author text,
  body text
);
