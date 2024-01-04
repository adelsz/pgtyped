import { SQLParserListener } from './parser/SQLParserListener.js';
import { CharStreams, CommonTokenStream } from 'antlr4ts';
import { ParseTreeWalker } from 'antlr4ts/tree/ParseTreeWalker.js';
import { SQLLexer } from './parser/SQLLexer.js';
import {
  IgnoredCommentContext,
  KeyContext,
  ParamIdContext,
  ParamNameContext,
  QueryNameContext,
  SQLParser,
  StatementBodyContext,
} from './parser/SQLParser.js';
import {
  Logger,
  ParseEvent,
  ParseEventType,
  ParseWarningType,
} from './logger.js';
import { Interval } from 'antlr4ts/misc/index.js';

export enum TransformType {
  Scalar = 'scalar',
  PickTuple = 'pick_tuple',
  ArraySpread = 'array_spread',
  PickArraySpread = 'pick_array_spread',
}

export interface ParamKey {
  name: string;
  required: boolean;
  nullable?: boolean;
}

export type ParamTransform =
  | {
      type: TransformType.Scalar;
    }
  | {
      type: TransformType.ArraySpread;
    }
  | {
      type: TransformType.PickTuple | TransformType.PickArraySpread;
      keys: ParamKey[];
    };

export interface Param {
  name: string;
  transform: ParamTransform;
  required: boolean;
  codeRefs: {
    defined?: CodeInterval;
    used: CodeInterval[];
  };
}
interface CodeInterval {
  a: number;
  b: number;
  line: number;
  col: number;
}

interface Statement {
  loc: CodeInterval;
  body: string;
}

export interface QueryAST {
  name: string;
  params: Param[];
  statement: Statement;
  usedParamSet: { [paramName: string]: true };
}

export interface ParamIR {
  name: string;
  transform: ParamTransform;
  required: boolean;
  locs: {
    a: number;
    b: number;
  }[];
}
export interface QueryIR {
  params: ParamIR[];
  statement: string;
  usedParamSet: QueryAST['usedParamSet'];
}

interface ParseTree {
  queries: QueryAST[];
}

export function assert(condition: any): asserts condition {
  if (!condition) {
    throw new Error('Assertion Failed');
  }
}

class ParseListener implements SQLParserListener {
  logger: Logger;
  public parseTree: ParseTree = { queries: [] };
  private currentQuery: Partial<QueryAST> = {};
  private currentParam: Partial<Param> = {};
  private currentTransform: Partial<ParamTransform> = {};

  constructor(logger: Logger) {
    this.logger = logger;
  }

  exitQuery() {
    const currentQuery = this.currentQuery as QueryAST;
    currentQuery.params.forEach((p) => {
      const paramUsed = p.name in currentQuery.usedParamSet;
      if (!paramUsed) {
        this.logger.logEvent({
          type: ParseEventType.Warning,
          message: {
            type: ParseWarningType.ParamNeverUsed,
            text: `Parameter "${p.name}" is defined but never used`,
          },
          location: p.codeRefs.defined,
        });
      }
    });
    this.parseTree.queries.push(currentQuery);
  }

  enterQueryName(ctx: QueryNameContext) {
    this.currentQuery = {
      name: ctx.text,
      params: [],
      usedParamSet: {},
    };
  }

  enterParamName(ctx: ParamNameContext) {
    const defLoc = {
      a: ctx.start.startIndex,
      b: ctx.start.stopIndex,
      line: ctx.start.line,
      col: ctx.start.charPositionInLine,
    };
    this.currentParam = {
      name: ctx.text,
      codeRefs: {
        defined: defLoc,
        used: [],
      },
    };
  }

  exitParamTag() {
    assert(this.currentQuery.params);
    this.currentQuery.params.push(this.currentParam as Param);
  }

  exitTransformRule() {
    this.currentParam.transform = this.currentTransform as ParamTransform;
  }

  enterTransformRule() {
    this.currentTransform = {};
  }

  enterSpreadTransform() {
    this.currentTransform = {
      type: TransformType.ArraySpread,
    };
  }

  enterSpreadPickTransform() {
    this.currentTransform = {
      type: TransformType.PickArraySpread,
      keys: [],
    };
  }

  enterPickTransform() {
    if (this.currentTransform.type === TransformType.PickArraySpread) {
      return;
    }
    this.currentTransform = {
      type: TransformType.PickTuple,
      keys: [],
    };
  }

  enterKey(ctx: KeyContext) {
    assert('keys' in this.currentTransform && this.currentTransform.keys);

    const required = !!ctx.C_REQUIRED_MARK();
    const name = ctx.ID().text;

    this.currentTransform.keys.push({ name, required });
  }

  enterStatementBody(ctx: StatementBodyContext) {
    const { inputStream } = ctx.start;
    assert(inputStream);
    const a = ctx.start.startIndex;
    const b = ctx.stop?.stopIndex;
    assert(b);
    const interval = new Interval(a, b);
    const body = inputStream.getText(interval);
    const loc = {
      a,
      b,
      line: ctx.start.line,
      col: ctx.start.charPositionInLine,
    };
    this.currentQuery.statement = {
      body,
      loc,
    };
  }

  /** strip JS-like comments from SQL statements */
  exitIgnoredComment(ctx: IgnoredCommentContext) {
    if (!this.currentQuery.statement) {
      return;
    }
    assert(this.currentQuery.statement);
    const statement = this.currentQuery.statement;
    const a = ctx.start.startIndex - statement.loc.a;
    const b = ctx.stop!.stopIndex - statement.loc.a + 1;
    const body = statement.body;
    assert(b);
    const [partA, , partB] = [
      body.slice(0, a),
      body.slice(a, b),
      body.slice(b),
    ];
    const strippedStatement = partA + ' '.repeat(b - a) + partB;
    this.currentQuery.statement.body = strippedStatement;
  }

  enterParamId(ctx: ParamIdContext) {
    assert(this.currentQuery.params);
    assert(this.currentQuery.usedParamSet);

    const paramName = ctx.ID().text;
    const required = !!ctx.S_REQUIRED_MARK();

    this.currentQuery.usedParamSet[paramName] = true;
    const reference = this.currentQuery.params.find(
      (p) => p.name === paramName,
    );
    const useLoc = {
      a: ctx.start.startIndex,
      b: ctx.stop?.stopIndex ?? ctx.start.stopIndex,
      line: ctx.start.line,
      col: ctx.start.charPositionInLine,
    };

    if (!reference) {
      this.currentQuery.params.push({
        name: paramName,
        required,
        transform: { type: TransformType.Scalar },
        codeRefs: {
          used: [useLoc],
        },
      });
    } else {
      reference.required = reference.required || required;
      reference.codeRefs.used.push(useLoc);
    }
  }
}

export type SQLParseResult = { queries: QueryAST[]; events: ParseEvent[] };

function parseText(text: string): SQLParseResult {
  const logger = new Logger();
  const inputStream = CharStreams.fromString(text);
  const lexer = new SQLLexer(inputStream);
  lexer.removeErrorListeners();
  lexer.addErrorListener(logger);
  const tokenStream = new CommonTokenStream(lexer);
  const parser = new SQLParser(tokenStream);
  parser.removeErrorListeners();
  parser.addErrorListener(logger);

  const tree = parser.input();

  const listener = new ParseListener(logger);
  ParseTreeWalker.DEFAULT.walk(listener as SQLParserListener, tree);
  return {
    queries: listener.parseTree.queries,
    events: logger.parseEvents,
  };
}

export function queryASTToIR(query: SQLQueryAST): SQLQueryIR {
  const { a: statementStart } = query.statement.loc;

  return {
    usedParamSet: query.usedParamSet,
    params: query.params.map((param) => ({
      name: param.name,
      required: param.required,
      transform: param.transform,
      locs: param.codeRefs.used.map((codeRef) => ({
        a: codeRef.a - statementStart - 1,
        b: codeRef.b - statementStart,
      })),
    })),
    statement: query.statement.body,
  };
}

export { prettyPrintEvents, ParseEvent } from './logger.js';
export type SQLQueryAST = QueryAST;
export type SQLQueryIR = QueryIR;
export default parseText;
