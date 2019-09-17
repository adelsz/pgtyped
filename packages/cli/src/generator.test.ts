import * as queryModule from '@pg-typed/query';
import {
  reindent, generateInterface, FieldType, queryToTypeDeclarations,
} from './generator';

const getTypesMocked = jest
  .spyOn(queryModule, 'getTypes')
  .mockName('getTypes');

test('test query to interface', async () => {
  const query = `
      delete from users *
      where name = :userName and id = :userId and note = :userNote returning id, id, name, note as bote;
    `;
  const mockTypes = {
    returnTypes: [
      {
        returnName: 'id',
        columnName: 'id',
        typeName: 'uuid',
        nullable: false,
      },
      {
        returnName: 'name',
        columnName: 'name',
        typeName: 'text',
        nullable: false,
      },
      {
        returnName: 'bote',
        columnName: 'note',
        typeName: 'text',
        nullable: true,
      },
    ],
    paramTypes: {
      userName: 'text',
      id: 'uuid',
    },
  };
  getTypesMocked.mockResolvedValue(mockTypes)
  const result = await queryToTypeDeclarations({
    name: 'DeleteUsers',
    body: query,
  }, null);
  const expected = `export interface IDeleteUsersParams {
  userName: string | null;
  id: string | null;
}

export interface IDeleteUsersReturn {
  id: string;
  name: string;
  bote: string | null;
}`;
  expect(result).toEqual(expected)
})

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