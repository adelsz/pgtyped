import { QueryParserListener } from './parser/QueryParserListener.js';
import { CharStreams, CommonTokenStream } from 'antlr4ts';
import { ParseTreeWalker } from 'antlr4ts/tree/ParseTreeWalker.js';
import { QueryLexer } from './parser/QueryLexer.js';
import {
  FormatterContext,
  ParamContext,
  ParamIndexedContext,
  ParamNamedContext,
  QueryContext,
  QueryParser,
} from './parser/QueryParser.js';
import { Logger, ParseEvent } from '../sql/logger.js';
import { Interval } from 'antlr4ts/misc/index.js';

export enum ParamType {
  Scalar = 'scalar',
  ScalarArray = 'scalar_array',
  Identifier = 'identifier', // not supported, but we give a proper error message
  Raw = 'raw', // not supported, but we give a proper error message
}

export type ParamSelection =
  | {
      type: ParamType.Scalar;
    }
  | {
      type: ParamType.ScalarArray;
    }
  | {
      type: ParamType.Identifier;
    }
  | {
      type: ParamType.Raw;
    };

export interface Param {
  name: string;
  selection: ParamSelection;
  required: boolean;
  nullable: boolean;
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

class ParserListener implements QueryParserListener {
  logger: Logger;
  query: Partial<Query> = {};
  private currentParam: Partial<Param> = {};

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

  enterParamNamed(ctx: ParamNamedContext) {
    this.currentParam = {
      name: ctx.ID().text,
      nullable: ctx.NULLABILITY_MARK() !== undefined,
      required: true,
      selection: { type: ParamType.Scalar },
    };
  }

  enterParamIndexed(ctx: ParamIndexedContext) {
    this.currentParam = {
      name: ctx.INTEGER().text,
      nullable: ctx.NULLABILITY_MARK() !== undefined,
      required: true,
      selection: { type: ParamType.Scalar },
    };
  }

  enterFormatter(ctx: FormatterContext) {
    const fmtText = ctx.ID()?.text;
    const fmtShort = ctx.FORMATTER_SHORT()?.text;
    let type: ParamType | undefined;
    switch (fmtText) {
      case 'list':
      case 'csv':
        type = ParamType.ScalarArray;
        break;
      case 'alias':
      case 'name':
        type = ParamType.Identifier;
        break;
      case 'raw':
        type = ParamType.Raw;
        break;
    }
    if (!type) {
      switch (fmtShort) {
        case '~':
          type = ParamType.Identifier;
          break;
        case '^':
          type = ParamType.Raw;
          break;
        default:
          type = ParamType.Scalar;
      }
    }
    this.currentParam.selection = {
      type,
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
    this.query.params!.push(this.currentParam as Param);
    this.currentParam = {};
  }
}

export function parseTextPgPromise(
  text: string,
  queryName: string = 'query',
): { query: Query; events: ParseEvent[] } {
  const logger = new Logger();
  const inputStream = CharStreams.fromString(text);
  const lexer = new QueryLexer(inputStream);
  lexer.removeErrorListeners();
  lexer.addErrorListener(logger);
  const tokenStream = new CommonTokenStream(lexer);
  const parser = new QueryParser(tokenStream);
  parser.removeErrorListeners();
  parser.addErrorListener(logger);

  const tree = parser.input();

  const listener = new ParserListener(queryName, logger);
  ParseTreeWalker.DEFAULT.walk(listener as QueryParserListener, tree);

  return {
    query: listener.query as Query,
    events: logger.parseEvents,
  };
}
