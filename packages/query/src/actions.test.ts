import { generateHash, reduceTypeRows } from './actions';

test('test postgres md5 hash generation', () => {
  const salt = [0x81, 0xcc, 0x95, 0x8b];
  const result = generateHash('test', 'example', Buffer.from(salt));
  expect(result).toEqual('md5b73f398d18e98f8e2d46a7f1c548dea3');
});

test('reduce type rows to MappableTypes', () => {
  expect(
    reduceTypeRows([
      {
        oid: '25',
        typeName: 'text',
        typeKind: 'b',
        enumLabel: '',
      },
      {
        oid: '23',
        typeName: 'int4',
        typeKind: 'b',
        enumLabel: '',
      },
    ]),
  ).toMatchSnapshot();

  expect(
    reduceTypeRows([
      {
        oid: '16398',
        typeName: 'notification_type',
        typeKind: 'e',
        enumLabel: 'notification',
      },
      {
        oid: '16398',
        typeName: 'notification_type',
        typeKind: 'e',
        enumLabel: 'reminder',
      },
      {
        oid: '16398',
        typeName: 'notification_type',
        typeKind: 'e',
        enumLabel: 'deadline',
      },
      {
        oid: '23',
        typeName: 'int4',
        typeKind: 'b',
        enumLabel: '',
      },
      {
        oid: '3802',
        typeName: 'jsonb',
        typeKind: 'b',
        enumLabel: '',
      },
    ]),
  ).toMatchSnapshot();

  expect(
    reduceTypeRows([
      {
        oid: '16398',
        typeName: 'notification_type',
        typeKind: 'e',
        enumLabel: 'notification',
      },
      {
        oid: '16398',
        typeName: 'notification_type',
        typeKind: 'e',
        enumLabel: 'reminder',
      },
      {
        oid: '16398',
        typeName: 'notification_type',
        typeKind: 'e',
        enumLabel: 'deadline',
      },
      {
        oid: '23',
        typeName: 'int4',
        typeKind: 'b',
        enumLabel: '',
      },
      {
        oid: '3802',
        typeName: 'jsonb',
        typeKind: 'b',
        enumLabel: '',
      },
    ]),
  ).toMatchSnapshot();

  expect(
    reduceTypeRows([
      {
        oid: '16398',
        typeName: 'notification_type',
        typeKind: 'e',
        enumLabel: 'notification',
      },
      {
        oid: '16398',
        typeName: 'notification_type',
        typeKind: 'e',
        enumLabel: 'reminder',
      },
      {
        oid: '16398',
        typeName: 'notification_type',
        typeKind: 'e',
        enumLabel: 'deadline',
      },
      {
        oid: '25',
        typeName: 'text',
        typeKind: 'b',
        enumLabel: '',
      },
      {
        oid: '23',
        typeName: 'int4',
        typeKind: 'b',
        enumLabel: '',
      },
      {
        oid: '3802',
        typeName: 'jsonb',
        typeKind: 'b',
        enumLabel: '',
      },
    ]),
  ).toMatchSnapshot();

  expect(
    reduceTypeRows([
      {
        oid: '20',
        typeName: 'int8',
        typeKind: 'b',
        enumLabel: '',
      },
      {
        oid: '25',
        typeName: 'text',
        typeKind: 'b',
        enumLabel: '',
      },
      {
        oid: '1082',
        typeName: 'date',
        typeKind: 'b',
        enumLabel: '',
      },
      {
        oid: '23',
        typeName: 'int4',
        typeKind: 'b',
        enumLabel: '',
      },
    ]),
  ).toMatchSnapshot();
});
