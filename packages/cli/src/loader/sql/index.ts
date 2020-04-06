import {SQLParserListener} from "./parser/SQLParserListener";
import {CharStreams, CommonTokenStream} from 'antlr4ts';
import {ParseTreeWalker} from 'antlr4ts/tree/ParseTreeWalker';
import {SQLLexer} from "./parser/SQLLexer";
import {
  KeyContext,
  ParamIdContext,
  ParamNameContext,
  QueryNameContext,
  SQLParser,
  StatementBodyContext
} from "./parser/SQLParser";
import {Logger, ParseEvent, ParseEventType, ParseWarningType} from "./logger";

enum TransformType {
  Scalar = 'scalar',
  PickTuple = 'pick_tuple',
  ArraySpread = 'array_spread',
  PickArraySpread = 'pick_array_spread',
}

type ParamTransform = {
  type: TransformType.Scalar,
} | {
  type: TransformType.PickTuple | TransformType.ArraySpread | TransformType.PickArraySpread,
  keys: string[];
};

interface Param {
  name: string;
  transform: ParamTransform;
  codeRefs: {
    defined?: CodeInterval;
    used?: CodeInterval;
  },
}

interface CodeInterval {
  a: number;
  b: number;
  line: number;
  col: number;
}

interface Query {
  name: string;
  params: Param[];
  statement: string;
  usedParamSet: Set<string>;
}

interface ParseTree {
  queries: Query[];
}

function assert(condition: any): asserts condition {
  if (!condition) {
    throw new Error("Assertion Failed");
  }
}

class ParseListener implements SQLParserListener {
  logger: Logger;
  public parseTree: ParseTree = {queries: []};
  private currentQuery: Partial<Query> = {};
  private currentParam: Partial<Param> = {};
  private currentTransform: Partial<ParamTransform> = {};

  constructor(logger: Logger) {
    this.logger = logger;
  }

  exitQuery() {
    const currentQuery = this.currentQuery as Query;
    currentQuery.params.forEach(p => {
      const paramUsed = currentQuery.usedParamSet.has(p.name);
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
      usedParamSet: new Set(),
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
    this.currentTransform.keys.push(ctx.text)
  }

  enterStatementBody(ctx: StatementBodyContext) {
    const statementBody = ctx.children?.map(n => n.text).join(' ');
    this.currentQuery.statement = statementBody;
  }

  enterParamId(ctx: ParamIdContext) {
    const paramName = ctx.text;
    assert(this.currentQuery.params);
    assert(this.currentQuery.usedParamSet);
    this.currentQuery.usedParamSet.add(paramName);
    const reference = this.currentQuery.params.find(p => p.name === paramName);
    const useLoc = {
      a: ctx.start.startIndex,
      b: ctx.start.stopIndex,
      line: ctx.start.line,
      col: ctx.start.charPositionInLine,
    };
    if (!reference) {
      this.currentQuery.params.push({
        name: paramName,
        transform: {type: TransformType.Scalar},
        codeRefs: {
          used: useLoc,
        },
      });
    } else {
      reference.codeRefs.used = useLoc;
    }
  }
}


function parseText(text: string): { parseTree: ParseTree, events: ParseEvent[] } {
  const logger = new Logger(text);
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
    parseTree: listener.parseTree,
    events: logger.parseEvents,
  };
}

export default parseText;
