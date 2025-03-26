export const sumSize = (array) => array.reduce((acc, e) => acc + e.length, 0);
export const dictToArray = (dict) => Object.entries(dict).reduce((acc, [key, val]) => [...acc, key, val], []);
export const int16 = (val) => {
    const buf = Buffer.alloc(2);
    buf.writeUInt16BE(val, 0);
    return buf;
};
export const int32 = (val) => {
    const buf = Buffer.alloc(4);
    buf.writeUInt32BE(val, 0);
    return buf;
};
export const cByteDict = (dict) => null;
export const cStringDict = (dict) => {
    const dictArray = dictToArray(dict);
    const count = sumSize(dictArray) + dictArray.length;
    // extra byte for dict terminator
    const buf = Buffer.alloc(count + 1, 0);
    let offset = 0;
    dictArray.forEach((str) => {
        offset = offset + buf.write(str, offset) + 1;
    });
    return buf;
};
export const cStringUnknownLengthArray = (array) => null;
export const byte1 = (num) => Buffer.from(num);
export const byte4 = () => null;
export const byteN = (buf) => null;
export const cString = (str) => {
    const buf = Buffer.concat([Buffer.from(str, 'utf8'), Buffer.from([0])]);
    return buf;
};
export const notNullTerminatedString = (str) => {
    const buf = Buffer.alloc(str.length, 0);
    buf.write(str);
    return buf;
};
export const fixedArray = (builder, items) => {
    const builtItems = items.map(builder);
    const size = builtItems.reduce((acc, item) => acc + sumSize(item), 2);
    const result = Buffer.alloc(size, 0);
    result.writeUInt16BE(items.length, 0);
    let offset = 2;
    builtItems.forEach((bufferArray) => bufferArray.forEach((buffer) => {
        buffer.copy(result, offset);
        offset = offset + buffer.length;
    }));
    return result;
};
//# sourceMappingURL=helpers.js.map