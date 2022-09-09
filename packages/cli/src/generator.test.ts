import * as queryModule from '@pgtyped/query';
import { parseSQLFile, parseTypeScriptFile } from '@pgtyped/query';
import { IQueryTypes } from '@pgtyped/query/lib/actions';
import { ParsedConfig } from './config';
import {
  escapeComment,
  generateInterface,
  queryToTypeDeclarations,
} from './generator';
import { ProcessingMode } from './index';
import { DefaultTypeMapping, TypeAllocator } from './types';

const getTypesMocked = jest.spyOn(queryModule, 'getTypes').mockName('getTypes');

const partialConfig = { hungarianNotation: true } as ParsedConfig;

function parsedQuery(
  mode: ProcessingMode,
  queryString: string,
): Parameters<typeof queryToTypeDeclarations>[0] {
  return mode === ProcessingMode.SQL
    ? { mode, ast: parseSQLFile(queryString).queries[0] }
    : { mode, ast: parseTypeScriptFile(queryString).queries[0] };
}

describe('query-to-interface translation', () => {
  [ProcessingMode.SQL, ProcessingMode.TS].forEach((mode) => {
    test(`TypeMapping and declarations (${mode})`, async () => {
      const queryStringSQL = `
    /* @name GetNotifications */
    SELECT payload, type FROM notifications WHERE id = :userId;
    `;
      const queryStringTS = `
      const getNotifications = sql\`SELECT payload, type FROM notifications WHERE id = $userId\`;
      `;
      const queryString =
        mode === ProcessingMode.SQL ? queryStringSQL : queryStringTS;
      const mockTypes: IQueryTypes = {
        returnTypes: [
          {
            returnName: 'payload',
            columnName: 'payload',
            type: 'json',
            nullable: false,
            comment: 'Notification contents @type {Notification}',
          },
          {
            returnName: 'type',
            columnName: 'type',
            type: { name: 'PayloadType', enumValues: ['message', 'dynamite'] },
            nullable: false,
          },
        ],
        paramMetadata: {
          params: ['uuid'],
          mapping: [
            {
              name: 'userId',
              type: queryModule.ParamTransform.Scalar,
              assignedIndex: 1,
              required: false,
            },
          ],
        },
      };
      getTypesMocked.mockResolvedValue(mockTypes);
      const types = new TypeAllocator(DefaultTypeMapping);
      // Test out imports
      types.use({ name: 'PreparedQuery', from: '@pgtyped/query' });
      const result = await queryToTypeDeclarations(
        parsedQuery(mode, queryString),
        null,
        types,
        partialConfig,
      );
      const expectedTypes = `import { PreparedQuery } from '@pgtyped/query';

export type PayloadType = 'dynamite' | 'message';

export type Json = null | boolean | number | string | Json[] | { [key: string]: Json };\n`;

      expect(types.declaration()).toEqual(expectedTypes);
      const expected = `/** 'GetNotifications' parameters type */
export interface IGetNotificationsParams {
  userId: string | null | void;
}

/** 'GetNotifications' return type */
export interface IGetNotificationsResult {
  /** Notification contents @type {Notification} */
  payload: Json;
  type: PayloadType;
}

/** 'GetNotifications' query type */
export interface IGetNotificationsQuery {
  params: IGetNotificationsParams;
  result: IGetNotificationsResult;
}\n\n`;
      expect(result).toEqual(expected);
    });

    test(`Insert notification query (${mode})`, async () => {
      const queryStringSQL = `
    /*
      @name InsertNotifications
      @param notification -> (payload, user_id, type)
    */
    INSERT INTO notifications (payload, user_id, type) VALUES :notification
    `;
      const queryStringTS = `const insertNotifications = sql\`INSERT INTO notifications (payload, user_id, type) VALUES $notification(payload, user_id, type)\`;`;
      const queryString =
        mode === ProcessingMode.SQL ? queryStringSQL : queryStringTS;
      const mockTypes: IQueryTypes = {
        returnTypes: [],
        paramMetadata: {
          params: ['json', 'uuid', 'text'],
          mapping: [
            {
              name: 'notification',
              type: queryModule.ParamTransform.Pick,
              dict: {
                payload: {
                  name: 'payload',
                  assignedIndex: 1,
                  required: false,
                  type: queryModule.ParamTransform.Scalar,
                },
                user_id: {
                  name: 'user_id',
                  assignedIndex: 2,
                  required: false,
                  type: queryModule.ParamTransform.Scalar,
                },
                type: {
                  name: 'type',
                  assignedIndex: 3,
                  required: false,
                  type: queryModule.ParamTransform.Scalar,
                },
              },
            },
          ],
        },
      };
      const types = new TypeAllocator(DefaultTypeMapping);
      getTypesMocked.mockResolvedValue(mockTypes);
      const result = await queryToTypeDeclarations(
        parsedQuery(mode, queryString),
        null,
        types,
        partialConfig,
      );
      const expected = `/** 'InsertNotifications' parameters type */
export interface IInsertNotificationsParams {
  notification: {
    payload: Json | null | void,
    user_id: string | null | void,
    type: string | null | void
  };
}

/** 'InsertNotifications' return type */
export type IInsertNotificationsResult = void;

/** 'InsertNotifications' query type */
export interface IInsertNotificationsQuery {
  params: IInsertNotificationsParams;
  result: IInsertNotificationsResult;
}

`;
      expect(result).toEqual(expected);
    });

    test(`DeleteUsers by UUID (${mode})`, async () => {
      const queryStringSQL = `
    /* @name DeleteUsers */
      delete from users * where name = :userName and id = :userId and note = :userNote returning id, id, name, note as bote;
    `;
      const queryStringTS = `const deleteUsers = sql\`delete from users * where name = $userName and id = $userId and note = $userNote returning id, id, name, note as bote\``;
      const queryString =
        mode === ProcessingMode.SQL ? queryStringSQL : queryStringTS;
      const mockTypes: IQueryTypes = {
        returnTypes: [
          {
            returnName: 'id',
            columnName: 'id',
            type: 'uuid',
            nullable: false,
          },
          {
            returnName: 'name',
            columnName: 'name',
            type: 'text',
            nullable: false,
          },
          {
            returnName: 'bote',
            columnName: 'note',
            type: 'text',
            nullable: true,
          },
        ],
        paramMetadata: {
          params: ['text', 'uuid', 'text'],
          mapping: [
            {
              name: 'userName',
              type: queryModule.ParamTransform.Scalar,
              required: false,
              assignedIndex: 1,
            },
            {
              name: 'userId',
              type: queryModule.ParamTransform.Scalar,
              required: false,
              assignedIndex: 2,
            },
            {
              name: 'userNote',
              type: queryModule.ParamTransform.Scalar,
              required: false,
              assignedIndex: 3,
            },
          ],
        },
      };
      const types = new TypeAllocator(DefaultTypeMapping);
      getTypesMocked.mockResolvedValue(mockTypes);
      const result = await queryToTypeDeclarations(
        parsedQuery(mode, queryString),
        null,
        types,
        partialConfig,
      );
      const expected = `/** 'DeleteUsers' parameters type */
export interface IDeleteUsersParams {
  userId: string | null | void;
  userName: string | null | void;
  userNote: string | null | void;
}

/** 'DeleteUsers' return type */
export interface IDeleteUsersResult {
  bote: string | null;
  id: string;
  name: string;
}

/** 'DeleteUsers' query type */
export interface IDeleteUsersQuery {
  params: IDeleteUsersParams;
  result: IDeleteUsersResult;
}

`;
      expect(result).toEqual(expected);
    });

    test(`TypeMapping and declarations camelCase (${mode})`, async () => {
      const queryStringSQL = `
    /* @name GetNotifications */
    SELECT payload, type FROM notifications WHERE id = :userId;
    `;
      const queryStringTS = `
      const getNotifications = sql\`SELECT payload, type FROM notifications WHERE id = $userId\`;
      `;
      const queryString =
        mode === ProcessingMode.SQL ? queryStringSQL : queryStringTS;
      const mockTypes: IQueryTypes = {
        returnTypes: [
          {
            returnName: 'payload_camel_case',
            columnName: 'payload',
            type: 'json',
            nullable: false,
          },
          {
            returnName: 'type_camel_case',
            columnName: 'type',
            type: { name: 'PayloadType', enumValues: ['message', 'dynamite'] },
            nullable: false,
          },
        ],
        paramMetadata: {
          params: ['uuid'],
          mapping: [
            {
              name: 'userId',
              type: queryModule.ParamTransform.Scalar,
              required: false,
              assignedIndex: 1,
            },
          ],
        },
      };
      getTypesMocked.mockResolvedValue(mockTypes);
      const types = new TypeAllocator(DefaultTypeMapping);
      // Test out imports
      types.use({ name: 'PreparedQuery', from: '@pgtyped/query' });
      const result = await queryToTypeDeclarations(
        parsedQuery(mode, queryString),
        null,
        types,
        { camelCaseColumnNames: true, hungarianNotation: true } as ParsedConfig,
      );
      const expectedTypes = `import { PreparedQuery } from '@pgtyped/query';

export type PayloadType = 'dynamite' | 'message';

export type Json = null | boolean | number | string | Json[] | { [key: string]: Json };\n`;

      expect(types.declaration()).toEqual(expectedTypes);
      const expected = `/** 'GetNotifications' parameters type */
export interface IGetNotificationsParams {
  userId: string | null | void;
}

/** 'GetNotifications' return type */
export interface IGetNotificationsResult {
  payloadCamelCase: Json;
  typeCamelCase: PayloadType;
}

/** 'GetNotifications' query type */
export interface IGetNotificationsQuery {
  params: IGetNotificationsParams;
  result: IGetNotificationsResult;
}\n\n`;
      expect(result).toEqual(expected);
    });

    test(`readonly array params (${mode})`, async () => {
      const queryStringSQL = `
    /*
      @name GetNotifications
      @param userIds -> (...)
    */
    SELECT payload, type FROM notifications WHERE id in :userIds
    `;
      const queryStringTS = `
      const getNotifications = sql\`SELECT payload, type FROM notifications WHERE id in $userIds\`;
      `;
      const queryString =
        mode === ProcessingMode.SQL ? queryStringSQL : queryStringTS;
      const mockTypes: IQueryTypes = {
        returnTypes: [
          {
            returnName: 'payload_camel_case',
            columnName: 'payload',
            type: 'json',
            nullable: false,
          },
          {
            returnName: 'type_camel_case',
            columnName: 'type',
            type: { name: 'PayloadType', enumValues: ['message', 'dynamite'] },
            nullable: false,
          },
        ],
        paramMetadata: {
          params: ['uuid'],
          mapping: [
            {
              name: 'userIds',
              type: queryModule.ParamTransform.Spread,
              assignedIndex: 1,
              required: false,
            },
          ],
        },
      };
      getTypesMocked.mockResolvedValue(mockTypes);
      const types = new TypeAllocator(DefaultTypeMapping);
      // Test out imports
      types.use({ name: 'PreparedQuery', from: '@pgtyped/query' });
      const result = await queryToTypeDeclarations(
        parsedQuery(mode, queryString),
        null,
        types,
        { camelCaseColumnNames: true, hungarianNotation: true } as ParsedConfig,
      );
      const expectedTypes = `import { PreparedQuery } from '@pgtyped/query';

export type PayloadType = 'dynamite' | 'message';

export type Json = null | boolean | number | string | Json[] | { [key: string]: Json };\n`;

      expect(types.declaration()).toEqual(expectedTypes);
      const expected = `/** 'GetNotifications' parameters type */
export interface IGetNotificationsParams {
  userIds: readonly (string | null | void)[];
}

/** 'GetNotifications' return type */
export interface IGetNotificationsResult {
  payloadCamelCase: Json;
  typeCamelCase: PayloadType;
}

/** 'GetNotifications' query type */
export interface IGetNotificationsQuery {
  params: IGetNotificationsParams;
  result: IGetNotificationsResult;
}\n\n`;
      expect(result).toEqual(expected);
    });

    test(`Columns without nullable info should be nullable (${mode})`, async () => {
      const queryStringSQL = `
    /* @name GetNotifications */
    SELECT payload, type FROM notifications WHERE id = :userId;
    `;
      const queryStringTS = `
      const getNotifications = sql\`SELECT payload, type FROM notifications WHERE id = $userId\`;
      `;
      const queryString =
        mode === ProcessingMode.SQL ? queryStringSQL : queryStringTS;
      const mockTypes: IQueryTypes = {
        returnTypes: [
          {
            returnName: 'payload',
            columnName: 'payload',
            type: 'json',
          },
          {
            returnName: 'type',
            columnName: 'type',
            type: { name: 'PayloadType', enumValues: ['message', 'dynamite'] },
            nullable: false,
          },
        ],
        paramMetadata: {
          params: ['uuid'],
          mapping: [
            {
              name: 'userId',
              type: queryModule.ParamTransform.Scalar,
              required: false,
              assignedIndex: 1,
            },
          ],
        },
      };
      getTypesMocked.mockResolvedValue(mockTypes);
      const types = new TypeAllocator(DefaultTypeMapping);
      // Test out imports
      types.use({ name: 'PreparedQuery', from: '@pgtyped/query' });
      const result = await queryToTypeDeclarations(
        parsedQuery(mode, queryString),
        null,
        types,
        partialConfig,
      );
      const expectedTypes = `import { PreparedQuery } from '@pgtyped/query';

export type PayloadType = 'dynamite' | 'message';

export type Json = null | boolean | number | string | Json[] | { [key: string]: Json };\n`;

      expect(types.declaration()).toEqual(expectedTypes);
      const expected = `/** 'GetNotifications' parameters type */
export interface IGetNotificationsParams {
  userId: string | null | void;
}

/** 'GetNotifications' return type */
export interface IGetNotificationsResult {
  payload: Json | null;
  type: PayloadType;
}

/** 'GetNotifications' query type */
export interface IGetNotificationsQuery {
  params: IGetNotificationsParams;
  result: IGetNotificationsResult;
}\n\n`;
      expect(result).toEqual(expected);
    });

    test(`Columns with nullability hints (${mode})`, async () => {
      const queryStringSQL = `
    /* @name GetNotifications */
    SELECT payload as "payload!", type as "type?" FROM notifications WHERE id = :userId;
    `;
      const queryStringTS = `
      const getNotifications = sql\`SELECT payload as "payload!", type FROM notifications WHERE id = $userId\`;
      `;
      const queryString =
        mode === ProcessingMode.SQL ? queryStringSQL : queryStringTS;
      const mockTypes: IQueryTypes = {
        returnTypes: [
          {
            returnName: 'payload!',
            columnName: 'payload!',
            type: 'json',
          },
          {
            returnName: 'type?',
            columnName: 'type?',
            type: { name: 'PayloadType', enumValues: ['message', 'dynamite'] },
            nullable: false,
          },
        ],
        paramMetadata: {
          params: ['uuid'],
          mapping: [
            {
              name: 'userId',
              type: queryModule.ParamTransform.Scalar,
              required: false,
              assignedIndex: 1,
            },
          ],
        },
      };
      getTypesMocked.mockResolvedValue(mockTypes);
      const types = new TypeAllocator(DefaultTypeMapping);
      // Test out imports
      types.use({ name: 'PreparedQuery', from: '@pgtyped/query' });
      const result = await queryToTypeDeclarations(
        parsedQuery(mode, queryString),
        null,
        types,
        partialConfig,
      );
      const expectedTypes = `import { PreparedQuery } from '@pgtyped/query';

export type PayloadType = 'dynamite' | 'message';

export type Json = null | boolean | number | string | Json[] | { [key: string]: Json };\n`;

      expect(types.declaration()).toEqual(expectedTypes);
      const expected = `/** 'GetNotifications' parameters type */
export interface IGetNotificationsParams {
  userId: string | null | void;
}

/** 'GetNotifications' return type */
export interface IGetNotificationsResult {
  payload: Json;
  type: PayloadType | null;
}

/** 'GetNotifications' query type */
export interface IGetNotificationsQuery {
  params: IGetNotificationsParams;
  result: IGetNotificationsResult;
}\n\n`;
      expect(result).toEqual(expected);
    });
  });
});

test('comment escaping', () => {
  expect(escapeComment('simple comment')).toEqual('simple comment');
  expect(escapeComment('nested /* comment */')).toEqual(
    'nested /* comment *\\/',
  );
  expect(escapeComment('nested /* nested /* comment */ */')).toEqual(
    'nested /* nested /* comment *\\/ *\\/',
  );
});

test('interface generation', () => {
  const expected = `export interface User {
  age: number;
  name: string;
}

`;
  const fields = [
    {
      fieldName: 'name',
      fieldType: 'string',
    },
    {
      fieldName: 'age',
      fieldType: 'number',
    },
  ];
  const result = generateInterface('User', fields);
  expect(result).toEqual(expected);
});
