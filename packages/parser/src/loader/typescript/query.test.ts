import parse from './query';

test('scalar param', () => {
  const query = `select * from users where id = $id and title= $title`;

  const result = parse(query);
  expect(result).toMatchSnapshot();
});

test('pick param', () => {
  const query = `select * from users where id in $activeUsers(userOne, userTwo)`;

  const result = parse(query);
  expect(result).toMatchSnapshot();
});

test('array param', () => {
  const query = `select * from users where id in $$ids`;

  const result = parse(query);
  expect(result).toMatchSnapshot();
});

test('array spread param', () => {
  const query = `INSERT INTO customers (customer_name, contact_name, address)
  VALUES $$customers(customerName, contactName, address)`;

  const result = parse(query);
  expect(result).toMatchSnapshot();
});
