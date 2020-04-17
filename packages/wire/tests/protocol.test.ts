import {
  buildMessage,
  IMessagePayload,
  parseMessage,
  parseOneOf,
  ParseResult,
} from '../src/protocol';

import { messages, IServerMessage } from '../src/messages';

test('buildMessage for StartupMessage works', () => {
  const base = buildMessage(messages.startupMessage, {
    params: {
      user: 'testingdb-app',
      database: 'testingdb',
      client_encoding: "'utf-8'",
    },
  });
  const expected = Buffer.from([
    0x00,
    0x00,
    0x00,
    0x47,
    0x00,
    0x03,
    0x00,
    0x00,
    0x75,
    0x73,
    0x65,
    0x72,
    0x00,
    0x74,
    0x65,
    0x73,
    0x74,
    0x69,
    0x6e,
    0x67,
    0x64,
    0x62,
    0x2d,
    0x61,
    0x70,
    0x70,
    0x00,
    0x64,
    0x61,
    0x74,
    0x61,
    0x62,
    0x61,
    0x73,
    0x65,
    0x00,
    0x74,
    0x65,
    0x73,
    0x74,
    0x69,
    0x6e,
    0x67,
    0x64,
    0x62,
    0x00,
    0x63,
    0x6c,
    0x69,
    0x65,
    0x6e,
    0x74,
    0x5f,
    0x65,
    0x6e,
    0x63,
    0x6f,
    0x64,
    0x69,
    0x6e,
    0x67,
    0x00,
    0x27,
    0x75,
    0x74,
    0x66,
    0x2d,
    0x38,
    0x27,
    0x00,
    0x00,
  ]);
  expect(base).toEqual(expected);
});

test('parseMessage for ErrorResponse works', () => {
  const buf = Buffer.from([
    0x45,
    0x00,
    0x00,
    0x00,
    0x5d,
    0x53,
    0x46,
    0x41,
    0x54,
    0x41,
    0x4c,
    0x00,
    0x56,
    0x46,
    0x41,
    0x54,
    0x41,
    0x4c,
    0x00,
    0x43,
    0x33,
    0x44,
    0x30,
    0x30,
    0x30,
    0x00,
    0x4d,
    0x64,
    0x61,
    0x74,
    0x61,
    0x62,
    0x61,
    0x73,
    0x65,
    0x20,
    0x22,
    0x74,
    0x65,
    0x73,
    0x74,
    0x69,
    0x6e,
    0x64,
    0x62,
    0x22,
    0x20,
    0x64,
    0x6f,
    0x65,
    0x73,
    0x20,
    0x6e,
    0x6f,
    0x74,
    0x20,
    0x65,
    0x78,
    0x69,
    0x73,
    0x74,
    0x00,
    0x46,
    0x70,
    0x6f,
    0x73,
    0x74,
    0x69,
    0x6e,
    0x69,
    0x74,
    0x2e,
    0x63,
    0x00,
    0x4c,
    0x38,
    0x34,
    0x36,
    0x00,
    0x52,
    0x49,
    0x6e,
    0x69,
    0x74,
    0x50,
    0x6f,
    0x73,
    0x74,
    0x67,
    0x72,
    0x65,
    0x73,
    0x00,
    0x00,
  ]);
  const result = parseMessage(messages.errorResponse, buf);
  if (result.type !== 'MessagePayload') {
    throw new Error('Expected MessagePayload');
  }
  const { data, bufferOffset } = result;
  const expected = {
    fields: {
      C: '3D000',
      F: 'postinit.c',
      L: '846',
      M: 'database "testindb" does not exist',
      R: 'InitPostgres',
      S: 'FATAL',
      V: 'FATAL',
    },
  };
  expect(bufferOffset).toBe(buf.length);
  expect(data).toEqual(expected);
});

test('parseMessage for normal message returns ServerError if message is ErrorResponse', () => {
  const buf = Buffer.from([
    0x45,
    0x00,
    0x00,
    0x00,
    0x5d,
    0x53,
    0x46,
    0x41,
    0x54,
    0x41,
    0x4c,
    0x00,
    0x56,
    0x46,
    0x41,
    0x54,
    0x41,
    0x4c,
    0x00,
    0x43,
    0x33,
    0x44,
    0x30,
    0x30,
    0x30,
    0x00,
    0x4d,
    0x64,
    0x61,
    0x74,
    0x61,
    0x62,
    0x61,
    0x73,
    0x65,
    0x20,
    0x22,
    0x74,
    0x65,
    0x73,
    0x74,
    0x69,
    0x6e,
    0x64,
    0x62,
    0x22,
    0x20,
    0x64,
    0x6f,
    0x65,
    0x73,
    0x20,
    0x6e,
    0x6f,
    0x74,
    0x20,
    0x65,
    0x78,
    0x69,
    0x73,
    0x74,
    0x00,
    0x46,
    0x70,
    0x6f,
    0x73,
    0x74,
    0x69,
    0x6e,
    0x69,
    0x74,
    0x2e,
    0x63,
    0x00,
    0x4c,
    0x38,
    0x34,
    0x36,
    0x00,
    0x52,
    0x49,
    0x6e,
    0x69,
    0x74,
    0x50,
    0x6f,
    0x73,
    0x74,
    0x67,
    0x72,
    0x65,
    0x73,
    0x00,
    0x00,
  ]);
  const result = parseMessage(messages.readyForQuery, buf);
  if (result.type !== 'ServerError') {
    throw new Error('Expected ServerError');
  }
  const expected = {
    type: 'ServerError',
    message: 'database "testindb" does not exist',
    severity: 'FATAL',
    bufferOffset: 94,
  };
  expect(result).toEqual(expected);
});

test('parseMessage for RowData works', () => {
  const buf = Buffer.from([
    0x44,
    0x00,
    0x00,
    0x00,
    0x39,
    0x00,
    0x02,
    0x00,
    0x00,
    0x00,
    0x24,
    0x35,
    0x64,
    0x30,
    0x37,
    0x38,
    0x63,
    0x33,
    0x36,
    0x2d,
    0x37,
    0x32,
    0x37,
    0x36,
    0x2d,
    0x31,
    0x31,
    0x65,
    0x39,
    0x2d,
    0x38,
    0x38,
    0x32,
    0x63,
    0x2d,
    0x31,
    0x37,
    0x37,
    0x33,
    0x64,
    0x35,
    0x38,
    0x33,
    0x61,
    0x63,
    0x61,
    0x34,
    0x00,
    0x00,
    0x00,
    0x07,
    0x6f,
    0x72,
    0x64,
    0x65,
    0x72,
    0x65,
    0x64,
  ]);
  const result = parseMessage(messages.dataRow, buf);
  if (result.type !== 'MessagePayload') {
    throw new Error('Expected MessagePayload');
  }
  const { data, bufferOffset } = result;
  const expected = {
    columns: [
      {
        value: Buffer.from('5d078c36-7276-11e9-882c-1773d583aca4'),
      },
      {
        value: Buffer.from('ordered'),
      },
    ],
  };
  expect(bufferOffset).toBe(buf.length);
  expect(data).toEqual(expected);
});

test('parseMessage for RowDescription works', () => {
  const buf = Buffer.from([
    0x54,
    0x00,
    0x00,
    0x00,
    0x33,
    0x00,
    0x02,
    0x69,
    0x64,
    0x00,
    0x00,
    0x01,
    0x4c,
    0x36,
    0x00,
    0x01,
    0x00,
    0x00,
    0x0b,
    0x86,
    0x00,
    0x10,
    0xff,
    0xff,
    0xff,
    0xff,
    0x00,
    0x00,
    0x73,
    0x74,
    0x61,
    0x74,
    0x65,
    0x00,
    0x00,
    0x01,
    0x4c,
    0x36,
    0x00,
    0x04,
    0x00,
    0x00,
    0x00,
    0x19,
    0xff,
    0xff,
    0xff,
    0xff,
    0xff,
    0xff,
    0x00,
    0x00,
  ]);
  const result = parseMessage(messages.rowDescription, buf);
  if (result.type !== 'MessagePayload') {
    throw new Error('Expected MessagePayload');
  }
  const { data, bufferOffset } = result;
  const expected = {
    fields: [
      {
        name: 'id',
        tableOID: 85046,
        columnAttrNumber: 1,
        typeOID: 2950,
        typeSize: 16,
        typeModifier: -1,
        formatCode: 0,
      },
      {
        name: 'state',
        tableOID: 85046,
        columnAttrNumber: 4,
        typeOID: 25,
        typeSize: -1,
        typeModifier: -1,
        formatCode: 0,
      },
    ],
  };
  expect(bufferOffset).toBe(buf.length);
  expect(data).toEqual(expected);
});

test('parseMessage for ReadyForQuery works', () => {
  const buf = Buffer.from([0x5a, 0x00, 0x00, 0x00, 0x05, 0x49]);
  const result = parseMessage(messages.readyForQuery, buf);
  if (result.type !== 'MessagePayload') {
    throw new Error('Expected MessagePayload');
  }
  const { data, bufferOffset } = result;
  const expected = {
    trxStatus: 'I',
  };
  expect(bufferOffset).toBe(buf.length);
  expect(data).toEqual(expected);
});

test('parseMessage for backendKeyData works', () => {
  const buf = Buffer.from([
    0x4b,
    0x00,
    0x00,
    0x00,
    0x0c,
    0x00,
    0x01,
    0x1b,
    0x91,
    0x25,
    0x83,
    0x8d,
    0x83,
  ]);
  const expected = {
    processId: 72593,
    secretKey: 629378435,
  };
  const result = parseMessage(messages.backendKeyData, buf);
  if (result.type !== 'MessagePayload') {
    throw new Error('Expected MessagePayload');
  }
  const { data, bufferOffset } = result;

  expect(bufferOffset).toBe(buf.length);
  expect(data).toEqual(expected);
});

test('parseMessage for ParameterStatus works', () => {
  const buf = Buffer.from([
    0x53,
    0x00,
    0x00,
    0x00,
    0x19,
    0x54,
    0x69,
    0x6d,
    0x65,
    0x5a,
    0x6f,
    0x6e,
    0x65,
    0x00,
    0x45,
    0x75,
    0x72,
    0x6f,
    0x70,
    0x65,
    0x2f,
    0x4b,
    0x69,
    0x65,
    0x76,
    0x00,
  ]);
  const expected = {
    name: 'TimeZone',
    value: 'Europe/Kiev',
  };
  const result = parseMessage(messages.parameterStatus, buf);
  if (result.type !== 'MessagePayload') {
    throw new Error('Expected MessagePayload');
  }
  const { data, bufferOffset } = result;

  expect(bufferOffset).toBe(buf.length);
  expect(data).toEqual(expected);
});

test('parseMessage for NoData works', () => {
  const buf = Buffer.from([0x6e, 0x00, 0x00, 0x00, 0x04]);

  const result = parseMessage(messages.noData, buf);

  const { bufferOffset } = result;

  expect(bufferOffset).toBe(buf.length);
});

test('parseMessage for Query works', () => {
  const buf = Buffer.from([
    0x51,
    0x00,
    0x00,
    0x00,
    0x16,
    0x73,
    0x65,
    0x6c,
    0x65,
    0x63,
    0x74,
    0x20,
    0x76,
    0x65,
    0x72,
    0x73,
    0x69,
    0x6f,
    0x6e,
    0x28,
    0x29,
    0x3b,
    0x00,
  ]);
  const base = buildMessage(messages.query, { query: 'select version();' });
  expect(base).toEqual(buf);
});

test('parseMessage works for sequence of ParameterStatus', () => {
  const buf = Buffer.from([
    0x53,
    0x00,
    0x00,
    0x00,
    0x19,
    0x63,
    0x6c,
    0x69,
    0x65,
    0x6e,
    0x74,
    0x5f,
    0x65,
    0x6e,
    0x63,
    0x6f,
    0x64,
    0x69,
    0x6e,
    0x67,
    0x00,
    0x55,
    0x54,
    0x46,
    0x38,
    0x00,

    0x53,
    0x00,
    0x00,
    0x00,
    0x17,
    0x44,
    0x61,
    0x74,
    0x65,
    0x53,
    0x74,
    0x79,
    0x6c,
    0x65,
    0x00,
    0x49,
    0x53,
    0x4f,
    0x2c,
    0x20,
    0x4d,
    0x44,
    0x59,
    0x00,
  ]);
  const expectedFirst = {
    name: 'client_encoding',
    value: 'UTF8',
  };
  const expectedSecond = {
    name: 'DateStyle',
    value: 'ISO, MDY',
  };
  const resultOne = parseMessage(messages.parameterStatus, buf);
  if (resultOne.type !== 'MessagePayload') {
    throw new Error('Expected MessagePayload');
  }
  const { data: dataOne, bufferOffset: offsetOne } = resultOne;

  expect(offsetOne).toBe(26);
  expect(dataOne).toEqual(expectedFirst);

  const resultTwo = parseMessage(messages.parameterStatus, buf, 26);
  if (resultTwo.type !== 'MessagePayload') {
    throw new Error('Expected MessagePayload');
  }
  const { data: dataTwo, bufferOffset: offsetTwo } = resultTwo;

  expect(offsetTwo).toBe(buf.length);
  expect(dataTwo).toEqual(expectedSecond);
});

test('parseOneOf works', () => {
  const buf = Buffer.from([
    0x53,
    0x00,
    0x00,
    0x00,
    0x19,
    0x54,
    0x69,
    0x6d,
    0x65,
    0x5a,
    0x6f,
    0x6e,
    0x65,
    0x00,
    0x45,
    0x75,
    0x72,
    0x6f,
    0x70,
    0x65,
    0x2f,
    0x4b,
    0x69,
    0x65,
    0x76,
    0x00,
  ]);
  const expected = {
    name: 'TimeZone',
    value: 'Europe/Kiev',
  };
  const result = parseOneOf(
    [messages.authenticationOk, messages.parameterStatus],
    buf,
    0,
  );
  if (result.type !== 'MessagePayload') {
    throw new Error('Expected MessagePayload');
  }
  const { data, bufferOffset } = result;
  expect(bufferOffset).toBe(buf.length);
  expect(data).toEqual(expected);
});

test('parseOneOf results in MessageMismatchError when no message matches buffer', () => {
  const buf = Buffer.from([
    0x53,
    0x00,
    0x00,
    0x00,
    0x19,
    0x54,
    0x69,
    0x6d,
    0x65,
    0x5a,
    0x6f,
    0x6e,
    0x65,
    0x00,
    0x45,
    0x75,
    0x72,
    0x6f,
    0x70,
    0x65,
    0x2f,
    0x4b,
    0x69,
    0x65,
    0x76,
    0x00,
  ]);
  const result = parseOneOf(
    [messages.authenticationOk, messages.readyForQuery],
    buf,
    0,
  );
  if (result.type !== 'MessageMismatchError') {
    throw new Error('Expected MessageMismatchError');
  }
  expect(result.messageName).toBe('AuthenticationOk | ReadyForQuery');
  expect(result.bufferOffset).toBe(buf.length);
});
