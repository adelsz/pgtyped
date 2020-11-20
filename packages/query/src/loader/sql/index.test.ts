import parse from './index';

test('Named query', () => {
  const text = `
  /* @name GetAllUsers */
  SELECT * FROM users;`;
  const parseTree = parse(text);
  expect(parseTree).toMatchSnapshot();
});

test('Named query selects some fields', () => {
  const text = `
  /* @name GetAllUsers */
  SELECT id, name FROM users;`;
  const parseTree = parse(text);
  expect(parseTree).toMatchSnapshot();
});

test('Named query with an inferred param', () => {
  const text = `
  /* @name GetUserById */
  SELECT * FROM users WHERE userId = :userId;`;
  const parseTree = parse(text);
  expect(parseTree).toMatchSnapshot();
});

test('Named query with two inferred params', () => {
  const text = `
  /* @name GetUserById */
  SELECT * FROM users WHERE userId = :userId or parentId = :userId;`;
  const parseTree = parse(text);
  expect(parseTree).toMatchSnapshot();
});

test('Named query with a valid param', () => {
  const text = `
  /*
    @name CreateCustomer
    @param customers -> (customerName, contactName, address)
  */
  INSERT INTO customers (customer_name, contact_name, address)
  VALUES :customers;`;
  const parseTree = parse(text);
  expect(parseTree).toMatchSnapshot();
});

test('Named query with pick param used twice', () => {
  const text = `
  /*
    @name CreateCustomer
    @param customers -> (customerName, contactName, address)
  */
  INSERT INTO customers (customer_name, contact_name, address)
  VALUES :customers, :customers;`;
  const parseTree = parse(text);
  expect(parseTree).toMatchSnapshot();
});

test('Unused parameters produce warnings', () => {
  const text = `
  /*
    @name GetAllUsers
    @param userNames -> (...)
    @param users -> ((name,time)...)
  */
  SELECT * FROM users;`;
  const parseTree = parse(text);
  expect(parseTree).toMatchSnapshot();
});

test('Another test', () => {
  const text = `
    /* @name GetBooksByAuthorName */
    SELECT b.* FROM books b
    INNER JOIN authors a ON a.id = b.author_id
    WHERE a.first_name || ' ' || a.last_name = :authorName;`;
  const parseTree = parse(text);
  expect(parseTree).toMatchSnapshot();
});

test('Double and single quotes are supported', () => {
  const text = `
  /* @name GetAllUsers */
  SELECT u."rank" FROM users u where name = 'some-name';`;
  const parseTree = parse(text);
  expect(parseTree).toMatchSnapshot();
});

test('Postgres cast operator is correctly parsed', () => {
  const text = `
  /* @name GetAllUsers */
  SELECT u."rank" FROM users u where name = :name::text;`;
  const parseTree = parse(text);
  expect(parseTree).toMatchSnapshot();
});

test('Ignore inline comments in queries', () => {
  const text = `
  /* @name UpdateBooks */
  UPDATE books
  /* ignored comment */
  SET name = :name, rank = :rank WHERE id = :id;
`;
  const parseTree = parse(text);
  expect(parseTree).toMatchSnapshot();
});
