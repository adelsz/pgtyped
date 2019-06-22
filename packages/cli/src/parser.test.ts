import {
  parseCode,
} from './parser';

test('parser finds string template in correct file', () => {
  const fileContent = `
    const sql : any = null;

    const query = sql\`
      select id, name, age from users;
    \`;
  `;

  const result = parseCode(fileContent);
  const expectedResult = [{
    tagName: 'sql',
    tagContent: 'select id, name, age from users;',
  }];
  expect(result).toEqual(expectedResult);
});

test('parser finds string template in incorrect file', () => {
  const fileContent = `
    const sql  ny =/ null;

    const query = sql\`
      select id, name, age from users;
    \`;
  `;

  const result = parseCode(fileContent);
  const expectedResult = [{
    tagName: 'sql',
    tagContent: 'select id, name, age from users;',
  }];
  expect(result).toEqual(expectedResult);
});