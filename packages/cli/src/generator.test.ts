import {
  reindent, generateInterface, FieldType,
} from './generator';

test('reindent works', () => {
  const base =
    `let x = 12;
let y = 13;`;
  const expected =
    `    let x = 12;
    let y = 13;`;
  const result = reindent(base, 2);
  expect(result).toEqual(expected);
});

test('interface generation', () => {
  const expected =
`export interface User {
  name: string;
  age: number | null;
}`;
  const fields = [{
    fieldName: 'name',
    fieldType: FieldType.String,
    nullable: false,
  }, {
    fieldName: 'age',
    fieldType: FieldType.Number,
    nullable: true,
  }];
  const result = generateInterface('User', fields);
  expect(result).toEqual(expected);
})