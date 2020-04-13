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

test('Named query with a valid param', () => {
  const text = `
  /*
    @name CreateCustomer
    @param customer -> (customerName, contactName, address)
  */
  INSERT INTO customers (customer_name, contact_name, address)
  VALUES :customers;`;
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
