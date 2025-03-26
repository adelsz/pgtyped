/// <reference types="node" resolution-mode="require"/>
/// <reference types="node" resolution-mode="require"/>
/// <reference types="node" resolution-mode="require"/>
/// <reference types="node" resolution-mode="require"/>
import * as net from 'net';
import * as tls from 'tls';
import { ParseResult } from './protocol.js';
import { IClientMessage, IServerMessage } from './messages.js';
type Box<T> = T extends IServerMessage<infer P> ? P : any;
type Boxified<T extends [any] | any[]> = {
    [P in keyof T]: Box<T[P]>;
};
export declare class AsyncQueue {
    bufferOffset: number;
    buffer: Buffer;
    socket: net.Socket;
    replyPending: {
        resolve: (data: any) => any;
        reject: (data: any) => any;
        parser: (buf: Buffer, offset: number) => ParseResult<object>;
    } | null;
    constructor();
    connect(passedOptions: {
        port: number;
        host: string;
        ssl?: tls.ConnectionOptions | boolean;
    }): Promise<void>;
    send<Params extends object>(message: IClientMessage<Params>, params: Params): Promise<void>;
    processQueue(): void;
    /**
     * Waits for the next message to arrive and parses it, resolving with the parsed value.
     * @param serverMessages The message type to parse or an array of messages to match any of them
     * @returns The parsed params
     */
    reply<Messages extends Array<IServerMessage<any>>>(...serverMessages: Messages): Promise<Boxified<Messages>[number]>;
}
export {};
