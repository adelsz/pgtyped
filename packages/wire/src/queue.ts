import * as net from "net";
import * as util from "util";

import {
  buildMessage,
  parseMessage,
  parseOneOf,
  ParseResult,
} from "./protocol";

import {
  IClientMessage,
  TMessage,
  IServerMessage,
} from "./messages";

import debugBase from "debug";
const debug = debugBase("pg-wire:socket");

type Box<T> = T extends IServerMessage<infer P> ? P : any;
type Boxified<T extends [any] | any[]> = { [P in keyof T]: Box<T[P]> };

export class AsyncQueue {
  public queue: Buffer[] = [];
  public bufferOffset: number = 0;
  public socket: net.Socket;
  public replyPending: {
    resolve: (data: any) => any,
    reject: (data: any) => any,
    parser: (buf: Buffer, offset: number) => ParseResult<object>,
  } | null = null;
  constructor() {
    this.socket = new net.Socket({});
    this.socket.on("data", (buffer: Buffer) => {
      debug("received %o bytes", buffer.length);
      this.queue.push(buffer);
      this.processQueue();
    });
  }
  public connect(passedOptions?: {
    port?: number, host?: string,
  }): Promise<void> {
    return new Promise((resolve) => {
      this.socket.on("connect", () => {
        debug("socket connected");
        resolve();
      });
      const defaultOptions = {
        port: 5432,
        host: "localhost",
      };
      const options = Object.assign(
        {},
        defaultOptions,
        passedOptions || {},
      );
      this.socket.connect(options);
    });
  }
  public async send<Params extends object>(
    message: IClientMessage<Params>,
    params: Params,
  ): Promise<void> {
    const buf = buildMessage(message, params);
    return new Promise((resolve) => {
      this.socket.write(buf, () => resolve());
      debug("sent %o message", message.name);
    });
  }
  public processQueue() {
    if (!this.replyPending || this.queue.length === 0) {
      return;
    }
    const buf = this.queue[0];
    const parsed = this.replyPending.parser(buf, this.bufferOffset);

    // Move queue cursor in any case
    if (parsed.bufferOffset >= buf.length) {
      this.bufferOffset = 0;
      this.queue.pop();
    } else {
      this.bufferOffset = parsed.bufferOffset;
    }

    if (parsed.type === "ServerError") {
      this.replyPending.reject(parsed);
    } else if (parsed.type === "MessagePayload") {
      debug("resolved awaited %o message", parsed.messageName);
      this.replyPending.resolve(parsed.data);
    } else {
      debug("received ignored message");
      this.processQueue();
    }
  }
  /**
   * Waits for the next message to arrive and parses it, resolving with the parsed value.
   * @param messages The message type to parse or an array of messages to match any of them
   * @returns The parsed params
   */
  public async reply<Messages extends Array<IServerMessage<any>>>(
    ...messages: Messages
  ): Promise<Boxified<Messages>[number]> {
    let parser: (buf: Buffer, offset: number) => ParseResult<object>;
    if (messages instanceof Array) {
      parser = (buf: Buffer, offset: number) => parseOneOf(messages, buf, offset);
    } else {
      parser = (buf: Buffer, offset: number) => parseMessage(messages, buf, offset);
    }
    return new Promise((resolve, reject) => {
      this.replyPending = {
        resolve,
        reject,
        parser,
      };
      this.processQueue();
    });
  }
}
