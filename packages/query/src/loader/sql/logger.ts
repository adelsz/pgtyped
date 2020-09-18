import chalk, { ChalkFunction } from 'chalk';
import { ANTLRErrorListener } from 'antlr4ts';
import { RecognitionException } from 'antlr4ts/RecognitionException';

interface CodeInterval {
  a: number;
  b: number;
  line: number;
  col: number;
}

export enum ParseWarningType {
  ParamNeverUsed,
}

enum ParseErrorType {
  ParseError,
}

export enum ParseEventType {
  Info,
  Warning,
  Error,
}

export type ParseEvent =
  | {
      type: ParseEventType.Warning;
      message: {
        text: string;
        type: ParseWarningType;
      };
      location?: CodeInterval;
    }
  | {
      type: ParseEventType.Error;
      critical: true;
      message: {
        text: string;
        type: ParseErrorType;
      };
      location?: CodeInterval;
    };

function styleIntervals(
  str: string,
  intervals: { a: number; b: number; style: ChalkFunction }[],
) {
  if (intervals.length === 0) {
    return str;
  }
  intervals.sort((x, y) => x.a - y.a);
  let offset = 0;
  let colored = '';
  let i = 0;
  for (const interval of intervals) {
    const a = str.slice(0, interval.a + offset);
    const b = str.slice(interval.a + offset, interval.b + offset + 1);
    const c = str.slice(interval.b + offset + 1, str.length);
    colored = a + interval.style(b) + c;
    offset += colored.length - str.length;
    str = colored;
    i++;
  }
  return colored;
}

export function prettyPrintEvents(text: string, parseEvents: ParseEvent[]) {
  let msg = chalk.underline.magenta('Parsed file:\n');
  const errors = parseEvents.filter((e) => e.type === ParseEventType.Error);
  const warnings = parseEvents.filter((e) => e.type === ParseEventType.Warning);
  const lineStyle = {} as any;
  const locsToColor = parseEvents
    .filter((w) => w.location)
    .map((w) => {
      const style =
        w.type === ParseEventType.Error
          ? chalk.underline.red
          : chalk.underline.yellow;
      if (w.location?.line) {
        lineStyle[w.location.line] = style;
      }
      return {
        ...w.location,
        style,
      };
    });
  const styledText = styleIntervals(text, locsToColor as any);
  let i = 1;
  const numberedText = styledText.replace(/^/gm, () => {
    const prefix = lineStyle[i] ? lineStyle[i]('>') : '|';
    return `${i++} ${prefix} `;
  });
  msg += numberedText;
  if (errors.length > 0) {
    msg += chalk.underline.red('\nErrors:\n');
    msg += errors
      .map(
        (w) => `- (${w.location?.line}:${w.location?.col}) ${w.message.text}`,
      )
      .join('\n');
  }
  if (warnings.length > 0) {
    msg += chalk.underline.yellow('\nWarnings:\n');
    msg += warnings
      .map(
        (w) => `- (${w.location?.line}:${w.location?.col}) ${w.message.text}`,
      )
      .join('\n');
  }
  // tslint:disable-next-line:no-console
  console.log(msg);
}

export class Logger implements ANTLRErrorListener<any> {
  public parseEvents: ParseEvent[] = [];
  private text: string;

  constructor(text: string) {
    this.text = text;
  }

  logEvent(event: ParseEvent) {
    this.parseEvents.push(event);
  }

  syntaxError(
    recognizer: any,
    symbol: any,
    line: number,
    col: number,
    msg: string,
    e: RecognitionException | undefined,
  ) {
    this.logEvent({
      type: ParseEventType.Error,
      critical: true,
      message: {
        type: ParseErrorType.ParseError,
        text: `Parse error: ${msg}`,
      },
      location: {
        a: symbol?.startIndex,
        b: symbol?.stopIndex,
        line,
        col,
      },
    });
  }
}
