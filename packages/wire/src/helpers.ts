import { SSL_OP_TLS_D5_BUG } from 'constants';

interface ISized {
  length: number;
}
export const sumSize = (array: ISized[]): number =>
  array.reduce((acc, e) => acc + e.length, 0);

export const dictToArray = (dict: { [key: string]: string }): string[] =>
  Object.entries(dict).reduce(
    (acc, [key, val]) => [...acc, key, val],
    [] as string[],
  );

export const int16 = (val: number): Buffer => {
  const buf = Buffer.alloc(2);
  buf.writeUInt16BE(val, 0);
  return buf;
};

export const int32 = (val: number): Buffer => {
  const buf = Buffer.alloc(4);
  buf.writeUInt32BE(val, 0);
  return buf;
};

export const cByteDict = (dict: { [key: string]: string }): Buffer =>
  null as any;

export const cStringDict = (dict: { [key: string]: string }): Buffer => {
  const dictArray = dictToArray(dict);
  const count: number = sumSize(dictArray) + dictArray.length;

  // extra byte for dict terminator
  const buf = Buffer.alloc(count + 1, 0);

  let offset = 0;
  dictArray.forEach((str) => {
    offset = offset + buf.write(str, offset) + 1;
  });
  return buf;
};

export const byte1 = (num: string): Buffer => Buffer.from(num);

export const byte4 = (): Buffer => null as any;

export const byteN = (buf: Buffer): Buffer => null as any;

export const cString = (str: string): Buffer => {
  const buf = Buffer.alloc(str.length + 1, 0);
  buf.write(str);
  return buf;
};

export const fixedArray = <Item>(
  builder: (item: Item) => Buffer[],
  items: Item[],
): Buffer => {
  const builtItems = items.map(builder);
  const size = builtItems.reduce(
    (acc, item) => acc + sumSize(item),
    2, // Two extra bytes for the int16 item count indicator
  );
  const result = Buffer.alloc(size, 0);
  result.writeUInt16BE(items.length, 0);
  let offset = 2;
  builtItems.forEach((bufferArray) =>
    bufferArray.forEach((buffer) => {
      buffer.copy(result, offset);
      offset = offset + buffer.length;
    }),
  );
  return result;
};
