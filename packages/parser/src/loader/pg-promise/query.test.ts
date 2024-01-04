import { parseTextPgPromise as parse } from './query';

test('scalar named param', () => {
  const query = `select * from users where id = $(id) and title = $(title)`;

  const result = parse(query);
  expect(result).toMatchSnapshot();
});

test('scalar index param', () => {
  const query = `select * from users where id = $1 and title = $2`;

  const result = parse(query);
  expect(result).toMatchSnapshot();
});

test('scalar named param nullable', () => {
  const query = `select * from users where id = $(id)/*nullable*/ and title = $(title)`;

  const result = parse(query);
  expect(result).toMatchSnapshot();
});

test('scalar index param nullable', () => {
  const query = `select * from users where id = $1 and title = $2/*nullable*/`;

  const result = parse(query);
  expect(result).toMatchSnapshot();
});

test('array param', () => {
  const query = `select * from users where id in ($(ids:list))`;

  const result = parse(query);
  expect(result).toMatchSnapshot();
});

test('array param nullable', () => {
  const query = `select * from users where id in ($(ids:list)/*nullable*/)`;

  const result = parse(query);
  expect(result).toMatchSnapshot();
});

test('identifier param', () => {
  const query = `select * from $(table:name)`;

  const result = parse(query);
  expect(result).toMatchSnapshot();
});

test('identifier param short', () => {
  const query = `select * from $(table~)`;

  const result = parse(query);
  expect(result).toMatchSnapshot();
});

test('raw param', () => {
  const query = `select * from $(table:raw)`;

  const result = parse(query);
  expect(result).toMatchSnapshot();
});

test('raw param short', () => {
  const query = `select * from $(table^)`;

  const result = parse(query);
  expect(result).toMatchSnapshot();
});

test('ignore line comments', () => {
  const query = `
select * from users where id in ($(ids:list))
-- this should be ignored: $(foo)
-- also this: 'hi hey"
-- and this: åäöÅÄÖ
`;

  const result = parse(query);
  expect(result).toMatchSnapshot();
});
