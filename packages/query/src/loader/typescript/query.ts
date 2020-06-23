import { QueryParserListener } from './parser/QueryParserListener';
import { CharStreams, CommonTokenStream } from 'antlr4ts';
import { ParseTreeWalker } from 'antlr4ts/tree/ParseTreeWalker';
import { QueryLexer } from './parser/QueryLexer';
import {
  ParamContext,
  ParamNameContext,
  PickKeyContext,
  QueryContext,
  QueryParser,
} from './parser/QueryParser';
import {
  Logger,
  ParseEvent,
  ParseEventType,
  ParseWarningType,
} from '../sql/logger';
import { Interval } from 'antlr4ts/misc';

export enum ParamType {
  Scalar = 'scalar',
  Object = 'object',
  ScalarArray = 'scalar_array',
  ObjectArray = 'object_array',
}

export type ParamSelection =
  | {
      type: ParamType.Scalar;
    }
  | {
      type: ParamType.ScalarArray;
    }
  | {
      type: ParamType.Object | ParamType.ObjectArray;
      keys: string[];
    };

export interface Param {
  name: string;
  selection: ParamSelection;
  location: CodeInterval;
}

interface CodeInterval {
  a: number;
  b: number;
  line: number;
  col: number;
}

export interface Query {
  name: string;
  params: Param[];
  text: string;
}

export function assert(condition: any): asserts condition {
  if (!condition) {
    throw new Error('Assertion Failed');
  }
}

class ParseListener implements QueryParserListener {
  logger: Logger;
  query: Partial<Query> = {};
  private currentParam: Partial<Param> = {};
  private currentSelection: Partial<ParamSelection> = {};

  constructor(queryName: string, logger: Logger) {
    this.query.name = queryName;
    this.logger = logger;
  }

  enterQuery(ctx: QueryContext) {
    const { inputStream } = ctx.start;
    const end = ctx.stop!.stopIndex;

    const interval = new Interval(0, end);
    const text = inputStream!.getText(interval);
    this.query = {
      name: this.query.name,
      text,
      params: [],
    };
  }

  enterParamName(ctx: ParamNameContext) {
    this.currentParam = {
      name: ctx.text,
      selection: undefined,
    };
  }

  exitParam(ctx: ParamContext) {
    const defLoc = {
      a: ctx.start.startIndex,
      b: ctx.stop!.stopIndex,
      line: ctx.start.line,
      col: ctx.start.charPositionInLine,
    };
    this.currentParam.location = defLoc;
    this.currentParam.selection = this.currentSelection as ParamSelection;
    this.query.params!.push(this.currentParam as Param);
    this.currentSelection = {};
    this.currentParam = {};
  }

  enterScalarParam() {
    this.currentSelection = {
      type: ParamType.Scalar,
    };
  }

  enterPickParam() {
    this.currentSelection = {
      type: ParamType.Object,
      keys: [],
    };
  }

  enterArrayPickParam() {
    this.currentSelection = {
      type: ParamType.ObjectArray,
      keys: [],
    };
  }

  enterArrayParam() {
    this.currentSelection = {
      type: ParamType.ScalarArray,
    };
  }

  enterPickKey(ctx: PickKeyContext) {
    assert('keys' in this.currentSelection);
    this.currentSelection.keys!.push(ctx.text);
  }
}

function parseText(
  text: string,
  queryName: string = 'query',
): { query: Query; events: ParseEvent[] } {
  const logger = new Logger(text);
  const inputStream = CharStreams.fromString(text);
  const lexer = new QueryLexer(inputStream);
  lexer.removeErrorListeners();
  lexer.addErrorListener(logger);
  const tokenStream = new CommonTokenStream(lexer);
  const parser = new QueryParser(tokenStream);
  parser.removeErrorListeners();
  parser.addErrorListener(logger);

  const tree = parser.input();

  const listener = new ParseListener(queryName, logger);
  ParseTreeWalker.DEFAULT.walk(listener as QueryParserListener, tree);

  return {
    query: listener.query as any,
    events: logger.parseEvents,
  };
}

export default parseText;
