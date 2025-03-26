/// <reference types="node" resolution-mode="require"/>
/// <reference types="node" resolution-mode="require"/>
interface ISized {
    length: number;
}
export declare const sumSize: (array: ISized[]) => number;
export declare const dictToArray: (dict: {
    [key: string]: string;
}) => string[];
export declare const int16: (val: number) => Buffer;
export declare const int32: (val: number) => Buffer;
export declare const cByteDict: (dict: {
    [key: string]: string;
}) => Buffer;
export declare const cStringDict: (dict: {
    [key: string]: string;
}) => Buffer;
export declare const cStringUnknownLengthArray: (array: string[]) => Buffer;
export declare const byte1: (num: string) => Buffer;
export declare const byte4: () => Buffer;
export declare const byteN: (buf: Buffer) => Buffer;
export declare const cString: (str: string) => Buffer;
export declare const notNullTerminatedString: (str: string) => Buffer;
export declare const fixedArray: <Item>(builder: (item: Item) => Buffer[], items: Item[]) => Buffer;
export {};
