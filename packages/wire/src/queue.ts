import * as net from 'net';
import * as util from 'util';
import * as tls from 'tls';

import {
  buildMessage,
  parseMessage,
  parseOneOf,
  ParseResult,
} from './protocol';

import { IClientMessage, TMessage, IServerMessage, messages } from './messages';

import debugBase from 'debug';
const debug = debugBase('pg-wire:socket');

type Box<T> = T extends IServerMessage<infer P> ? P : any;
type Boxified<T extends [any] | any[]> = { [P in keyof T]: Box<T[P]> };

export class AsyncQueue {
  public queue: Buffer[] = [];
  public bufferOffset: number = 0;
  public socket: net.Socket;
  public replyPending: {
    resolve: (data: any) => any;
    reject: (data: any) => any;
    parser: (buf: Buffer, offset: number) => ParseResult<object>;
  } | null = null;
  constructor() {
    this.socket = new net.Socket({});
  }
  public connect(passedOptions: {
    port: number;
    host: string;
    ssl?: tls.ConnectionOptions | boolean;
  }): Promise<void> {
    const { ssl, ...connectOptions } = passedOptions;
    const sslEnabled = ssl === true || ssl != null;

    const attachDataListener = () => {
      this.socket.on('data', (buffer: Buffer) => {
        debug('received %o bytes', buffer.length);
        this.queue.push(buffer);
        this.processQueue();
      });
    };

    return new Promise((resolve) => {
      this.socket.on('connect', () => {
        debug('socket connected');

        if (sslEnabled) {
          this.send(messages.sslRequest, {});
        } else {
          attachDataListener();
          resolve();
        }
      });

      if (sslEnabled) {
        this.socket.once('data', (buffer) => {
          const responseCode = buffer.toString('utf8');
          switch (responseCode) {
            case 'S':
              break;
            case 'N':
              this.socket.end();
              throw new Error('The server does not support SSL connections');
            default:
              this.socket.end();
              throw new Error(
                'There was an error establishing an SSL connection',
              );
          }

          const options: tls.ConnectionOptions = {
            socket: this.socket,
          };

          if (ssl !== true) {
            Object.assign(options, ssl);
          }

          if (net.isIP(connectOptions.host) === 0) {
            options.servername = connectOptions.host;
          }

          try {
            this.socket = tls.connect(options);
          } catch (err) {
            debug('ssl error', err);

            this.socket.end();
            throw new Error(
              'There was an error establishing an SSL connection',
            );
          }

          attachDataListener();
          resolve();
        });
      }

      this.socket.connect(connectOptions);
    });
  }
  public async send<Params extends object>(
    message: IClientMessage<Params>,
    params: Params,
  ): Promise<void> {
    const buf = buildMessage(message, params);
    return new Promise((resolve) => {
      this.socket.write(buf, () => resolve());
      debug('sent %o message', message.name);
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

    if (parsed.type === 'ServerError') {
      this.replyPending.reject(parsed);
    } else if (parsed.type === 'MessagePayload') {
      debug('resolved awaited %o message', parsed.messageName);
      this.replyPending.resolve(parsed.data);
    } else {
      debug('received ignored message');
      this.processQueue();
    }
  }
  /**
   * Waits for the next message to arrive and parses it, resolving with the parsed value.
   * @param serverMessages The message type to parse or an array of messages to match any of them
   * @returns The parsed params
   */
  public async reply<Messages extends Array<IServerMessage<any>>>(
    ...serverMessages: Messages
  ): Promise<Boxified<Messages>[number]> {
    let parser: (buf: Buffer, offset: number) => ParseResult<object>;
    if (serverMessages instanceof Array) {
      parser = (buf: Buffer, offset: number) =>
        parseOneOf(serverMessages, buf, offset);
    } else {
      parser = (buf: Buffer, offset: number) =>
        parseMessage(serverMessages, buf, offset);
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
