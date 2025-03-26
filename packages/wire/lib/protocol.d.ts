/// <reference types="node" resolution-mode="require"/>
/// <reference types="node" resolution-mode="require"/>
import { IClientMessage, IServerMessage } from './messages.js';
export declare const parseSimpleType: (type: any, buf: Buffer, offset: number, offsetEnd?: number) => {
    result: any;
    offset: number;
};
export interface IMessagePayload<Params> {
    type: 'MessagePayload';
    data: Params;
    messageName: string;
    bufferOffset: number;
}
interface IMessageMismatchError {
    type: 'MessageMismatchError';
    messageName: string;
    bufferOffset: number;
}
interface IIncompleteMessageError {
    type: 'IncompleteMessageError';
    messageName: string;
}
interface IServerError {
    type: 'ServerError';
    severity: 'ERROR' | 'FATAL' | 'PANIC' | 'WARNING' | 'NOTICE' | 'DEBUG' | 'INFO' | 'LOG';
    message: string;
    bufferOffset: number;
}
export type ParseResult<Params> = IMessagePayload<Params> | IMessageMismatchError | IServerError | IIncompleteMessageError;
export declare const parseMessage: <Params extends object>(message: IServerMessage<Params>, buf: Buffer, messageOffset?: number) => ParseResult<Params>;
export declare const buildMessage: <Params extends object>(message: IClientMessage<Params>, parameters: Params) => Buffer;
export declare const parseOneOf: (messages: Array<IServerMessage<any>>, buffer: Buffer, offset: number) => ParseResult<object>;
export {};
