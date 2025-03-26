import { ANTLRErrorListener } from 'antlr4ts';
import { RecognitionException } from 'antlr4ts/RecognitionException.js';
interface CodeInterval {
    a: number;
    b: number;
    line: number;
    col: number;
}
export declare enum ParseWarningType {
    ParamNeverUsed = 0
}
declare enum ParseErrorType {
    ParseError = 0
}
export declare enum ParseEventType {
    Info = 0,
    Warning = 1,
    Error = 2
}
export type ParseEvent = {
    type: ParseEventType.Warning;
    message: {
        text: string;
        type: ParseWarningType;
    };
    location?: CodeInterval;
} | {
    type: ParseEventType.Error;
    critical: true;
    message: {
        text: string;
        type: ParseErrorType;
    };
    location?: CodeInterval;
};
export declare function prettyPrintEvents(text: string, parseEvents: ParseEvent[]): void;
export declare class Logger implements ANTLRErrorListener<any> {
    parseEvents: ParseEvent[];
    logEvent(event: ParseEvent): void;
    syntaxError(_recognizer: any, symbol: any, line: number, col: number, msg: string, _e: RecognitionException | undefined): void;
}
export {};
