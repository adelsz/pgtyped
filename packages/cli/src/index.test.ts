import { queryToInterface } from './index';
import * as queryModule from '@pg-typed/query';

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
  const result = await queryToInterface('DeleteUsers', query);
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