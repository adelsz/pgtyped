import {
  cString,
  cStringDict,
  dictToArray,
  fixedArray,
  int32,
  sumSize,
} from '../src/helpers';

test('cString works', () => {
  const str = 'a';
  const base = cString(str);
  const expected = Buffer.from([str.charCodeAt(0), 0]);
  expect(base).toEqual(expected);
});

test('int32 works', () => {
  const base = int32(1000000);
  const expected = Buffer.from([0, 15, 66, 64]);
  expect(base).toEqual(expected);
});

test('sumSize works', () => {
  const base = sumSize([
    [1, 2],
    [3, 4],
  ]);
  expect(base).toBe(4);
});

test('dictToArray works', () => {
  const base = dictToArray({ a: 'x', b: 'y' });
  const expected = ['a', 'x', 'b', 'y'];
  expect(base).toEqual(expected);
});

test('cStringDicts works', () => {
  const base = cStringDict({ a: 'x', b: 'y' });
  const expected = Buffer.from([97, 0, 120, 0, 98, 0, 121, 0, 0]);
  expect(base).toEqual(expected);
});

test('fixedArray works', () => {
  const base = fixedArray(({ a, b }) => [int32(a), int32(b)], [
    { a: 1, b: 2 },
    { a: 3, b: 4 },
  ]);
  const expected = Buffer.from([
    0,
    2,
    0,
    0,
    0,
    1,
    0,
    0,
    0,
    2,
    0,
    0,
    0,
    3,
    0,
    0,
    0,
    4,
  ]);
  expect(base).toEqual(expected);
});
