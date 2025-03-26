var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
var __rest = (this && this.__rest) || function (s, e) {
    var t = {};
    for (var p in s) if (Object.prototype.hasOwnProperty.call(s, p) && e.indexOf(p) < 0)
        t[p] = s[p];
    if (s != null && typeof Object.getOwnPropertySymbols === "function")
        for (var i = 0, p = Object.getOwnPropertySymbols(s); i < p.length; i++) {
            if (e.indexOf(p[i]) < 0 && Object.prototype.propertyIsEnumerable.call(s, p[i]))
                t[p[i]] = s[p[i]];
        }
    return t;
};
import * as net from 'net';
import * as tls from 'tls';
import { buildMessage, parseMessage, parseOneOf, } from './protocol.js';
import { messages } from './messages.js';
import debugBase from 'debug';
const debug = debugBase('pg-wire:socket');
export class AsyncQueue {
    constructor() {
        this.bufferOffset = 0;
        this.buffer = Buffer.alloc(0);
        this.replyPending = null;
        this.socket = new net.Socket({});
    }
    connect(passedOptions) {
        const { ssl } = passedOptions, connectOptions = __rest(passedOptions, ["ssl"]);
        const sslEnabled = ssl === true || ssl != null;
        const attachDataListener = () => {
            this.socket.on('data', (buffer) => {
                debug('received %o bytes', buffer.length);
                this.buffer = Buffer.concat([this.buffer, buffer]);
                this.processQueue();
            });
        };
        return new Promise((resolve) => {
            this.socket.on('connect', () => {
                debug('socket connected');
                if (sslEnabled) {
                    this.send(messages.sslRequest, {});
                }
                else {
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
                            throw new Error('There was an error establishing an SSL connection');
                    }
                    const options = {
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
                    }
                    catch (err) {
                        debug('ssl error', err);
                        this.socket.end();
                        throw new Error('There was an error establishing an SSL connection');
                    }
                    attachDataListener();
                    resolve();
                });
            }
            this.socket.connect(connectOptions);
        });
    }
    send(message, params) {
        return __awaiter(this, void 0, void 0, function* () {
            const buf = buildMessage(message, params);
            return new Promise((resolve) => {
                this.socket.write(buf, () => resolve());
                debug('sent %o message', message.name);
            });
        });
    }
    processQueue() {
        if (!this.replyPending || this.buffer.length === 0) {
            return;
        }
        const parsed = this.replyPending.parser(this.buffer, this.bufferOffset);
        if (parsed.type === 'IncompleteMessageError') {
            debug('received incomplete message');
            return;
        }
        // Move queue cursor in any case
        if (parsed.bufferOffset === this.buffer.length) {
            this.bufferOffset = 0;
            this.buffer = Buffer.alloc(0);
        }
        else {
            this.bufferOffset = parsed.bufferOffset;
        }
        if (parsed.type === 'ServerError') {
            this.replyPending.reject(parsed);
        }
        else if (parsed.type === 'MessagePayload') {
            debug('resolved awaited %o message', parsed.messageName);
            this.replyPending.resolve(parsed.data);
        }
        else {
            debug('received ignored message');
            this.processQueue();
        }
    }
    /**
     * Waits for the next message to arrive and parses it, resolving with the parsed value.
     * @param serverMessages The message type to parse or an array of messages to match any of them
     * @returns The parsed params
     */
    reply(...serverMessages) {
        return __awaiter(this, void 0, void 0, function* () {
            let parser;
            if (serverMessages instanceof Array) {
                parser = (buf, offset) => parseOneOf(serverMessages, buf, offset);
            }
            else {
                parser = (buf, offset) => parseMessage(serverMessages, buf, offset);
            }
            return new Promise((resolve, reject) => {
                this.replyPending = {
                    resolve,
                    reject,
                    parser,
                };
                this.processQueue();
            });
        });
    }
}
//# sourceMappingURL=queue.js.map