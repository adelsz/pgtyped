import {
  byte1,
  byte4,
  byteN,
  cByteDict,
  cString,
  cStringUnknownLengthArray,
  int16,
  int32,
  sumSize,
  notNullTerminatedString,
} from './helpers.js';
import {
  IClientMessage,
  IServerMessage,
  messages as pgMessages,
} from './messages.js';

export const parseSimpleType = (
  type: any,
  buf: Buffer,
  offset: number,
  offsetEnd?: number,
): {
  result: any;
  offset: number;
} => {
  let result = null;
  if (type instanceof Buffer) {
    const match = type.compare(buf, offset, offset + type.length) === 0;
    offset += type.length;
    if (!match) {
      throw new Error(`Field mismatch inside message`);
    }
  } else if (type === byte1) {
    const val = buf.readInt8(offset);
    result = String.fromCharCode(val);
    offset++;
  } else if (type === byte4) {
    result = buf.slice(offset, offset + 4);
    offset += 4;
  } else if (type === cString) {
    const stringStart = offset;
    while (buf.readInt8(offset) !== 0) {
      offset++;
    }
    result = buf.toString('utf8', stringStart, offset);
    offset++;
  } else if (type === notNullTerminatedString) {
    result = buf.toString('utf8', offset, offsetEnd);
    offset += result.length;
  } else if (type === byteN) {
    const chunkSize = buf.readInt32BE(offset);
    offset += 4;
    result = buf.slice(offset, offset + chunkSize);
    offset += result.length;
  } else if (type === int32) {
    result = buf.readInt32BE(offset);
    offset += 4;
  } else if (type === int16) {
    result = buf.readInt16BE(offset);
    offset += 2;
  }
  return { result, offset };
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
  severity:
    | 'ERROR'
    | 'FATAL'
    | 'PANIC'
    | 'WARNING'
    | 'NOTICE'
    | 'DEBUG'
    | 'INFO'
    | 'LOG';
  message: string;
  bufferOffset: number;
}

export type ParseResult<Params> =
  | IMessagePayload<Params>
  | IMessageMismatchError
  | IServerError
  | IIncompleteMessageError;

const errorResponseMessageIndicator =
  pgMessages.errorResponse.indicator.charCodeAt(0);

export const parseMessage = <Params extends object>(
  message: IServerMessage<Params>,
  buf: Buffer,
  messageOffset: number = 0,
): ParseResult<Params> => {
  let bufferOffset = messageOffset;

  // Check if we have enough data to read the indicator and message size
  // The + 5 is made up of 1 byte for readInt8 and 4 bytes for readUInt32BE
  if (bufferOffset + 5 > buf.length) {
    return {
      type: 'IncompleteMessageError',
      messageName: message.name,
    };
  }

  const indicator = buf.readInt8(bufferOffset);
  const expectedIndicator = message.indicator.charCodeAt(0);
  const isUnexpectedErrorMessage =
    indicator === errorResponseMessageIndicator &&
    expectedIndicator !== errorResponseMessageIndicator;

  bufferOffset++;

  const messageSize = buf.readUInt32BE(bufferOffset);

  // Add extra one because message id isnt counted into size
  const messageEnd = messageSize + messageOffset + 1;

  if (messageEnd > buf.length) {
    return {
      type: 'IncompleteMessageError',
      messageName: message.name,
    };
  }

  if (indicator !== expectedIndicator && !isUnexpectedErrorMessage) {
    return {
      type: 'MessageMismatchError',
      messageName: message.name,
      bufferOffset: messageEnd,
    };
  }

  bufferOffset += 4;

  const pattern = isUnexpectedErrorMessage
    ? pgMessages.errorResponse.pattern
    : message.pattern;

  const result: { [key: string]: any } = {};
  const patternPairs = Object.entries(pattern);
  let pairIndex = 0;
  try {
    while (bufferOffset !== messageEnd) {
      const [key, type] = patternPairs[pairIndex];
      if (type === cByteDict) {
        const dict: { [key: string]: string } = {};
        let fieldKey;
        while (
          ({ result: fieldKey, offset: bufferOffset } = parseSimpleType(
            byte1,
            buf,
            bufferOffset,
          )).result !== '\u0000'
        ) {
          const { result: fieldValue, offset: valueOffset } = parseSimpleType(
            cString,
            buf,
            bufferOffset,
          );
          bufferOffset = valueOffset;
          dict[fieldKey] = fieldValue;
        }
        result[key] = dict;
      } else if (type === cStringUnknownLengthArray) {
        const arr: string[] = [];

        while (bufferOffset < messageEnd - 1) {
          const { result: arrayValue, offset: valueOffset } = parseSimpleType(
            cString,
            buf,
            bufferOffset,
          );
          bufferOffset = valueOffset;
          arr.push(arrayValue);
        }

        result[key] = arr;
        if (bufferOffset === messageEnd - 1) bufferOffset = messageEnd;
      } else if (type instanceof Array) {
        const arraySize = buf.readInt16BE(bufferOffset);
        bufferOffset += 2;
        const array = [];
        for (let i = 0; i < arraySize; i++) {
          const subPattern = Object.entries(type[0] as object);
          const subResult: { [key: string]: any } = {};
          for (const [subKey, subType] of subPattern) {
            const { result: fieldResult, offset: fieldOffset } =
              parseSimpleType(subType, buf, bufferOffset);
            subResult[subKey] = fieldResult;
            bufferOffset = fieldOffset;
          }
          array.push(subResult);
        }
        result[key] = array;
      } else {
        const { result: fieldResult, offset: fieldOffset } = parseSimpleType(
          type,
          buf,
          bufferOffset,
          messageEnd,
        );
        result[key] = fieldResult;
        bufferOffset = fieldOffset;
      }
      pairIndex++;
    }
  } catch (e) {
    return {
      type: 'MessageMismatchError',
      messageName: message.name,
      bufferOffset: messageEnd,
    };
  }

  if (isUnexpectedErrorMessage) {
    return {
      type: 'ServerError',
      bufferOffset,
      severity: result.fields.S,
      message: result.fields.M,
    };
  }
  return {
    type: 'MessagePayload',
    data: result as Params,
    bufferOffset,
    messageName: message.name,
  };
};

export const buildMessage = <Params extends object>(
  message: IClientMessage<Params>,
  parameters: Params,
): Buffer => {
  const bufArray = message.pattern(parameters);
  const bufferSize =
    +(message.indicator ? 1 : 0) + // indicator byte if present
    4 + // message size
    sumSize(bufArray); // payload
  const buf = Buffer.alloc(bufferSize);
  let offset = 0;
  if (message.indicator) {
    buf[0] = message.indicator.charCodeAt(0);
    offset++;
  }

  const messageSize = bufferSize - (message.indicator ? 1 : 0);
  buf.writeUInt32BE(messageSize, offset);
  offset += 4;

  bufArray.forEach((sbuf) => {
    sbuf.copy(buf, offset);
    offset = offset + sbuf.length;
  });
  return buf;
};

export const parseOneOf = (
  messages: Array<IServerMessage<any>>,
  buffer: Buffer,
  offset: number,
): ParseResult<object> => {
  const messageName = messages.map((m) => m.name).join(' | ');
  let lastBufferOffset = 0;
  for (const message of messages) {
    const parseResult = parseMessage(message, buffer, offset);
    if (parseResult.type !== 'MessageMismatchError') {
      return parseResult;
    }
    lastBufferOffset = parseResult.bufferOffset;
  }
  return {
    type: 'MessageMismatchError',
    messageName,
    bufferOffset: lastBufferOffset,
  };
};
