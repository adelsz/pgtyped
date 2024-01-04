/* tslint:disable:no-bitwise */
import {
  ParseEvent,
  parseTextPgPromise,
  PgPromiseParam,
  PgPromiseParamType,
  PgPromiseQueryAST,
} from '@pgtyped/parser';
import ts from 'typescript';
import path from 'path';
import { TSPgPromiseTransformConfig } from './config.js';

export enum MethodReturnMultiplicity {
  None,
  OneOrNone,
  One,
  ManyOrNone,
  Many,
}

interface INode {
  queryName: string;
  methodName: string;
  queryType: string | string[];
  node: ts.Node;
  methodReturnMultiplicity: MethodReturnMultiplicity;
  pos: ts.LineAndCharacter;
}

export interface TSQueryASTWithTypeInfo extends PgPromiseQueryAST {
  type: string | string[];
  methodName: string;
  methodReturnMultiplicity: MethodReturnMultiplicity;
  pos: ts.LineAndCharacter;
}

interface TSParseResult {
  queries: TSQueryASTWithTypeInfo[];
  events: ParseEvent[];
}

const getMethodReturnMultiplicity = (methodName: string) => {
  switch (methodName) {
    case 'none':
      return MethodReturnMultiplicity.None;
    case 'oneOrNone':
      return MethodReturnMultiplicity.OneOrNone;
    case 'manyOrNone':
      return MethodReturnMultiplicity.ManyOrNone;
    case 'any':
      return MethodReturnMultiplicity.ManyOrNone;
    case 'one':
      return MethodReturnMultiplicity.One;
    case 'many':
      return MethodReturnMultiplicity.Many;
  }
};

function getNameFromNode(node: ts.Node, baseName: string) {
  if (ts.isVariableDeclaration(node)) {
    if (
      ts.isIdentifier(node.name) &&
      node.initializer &&
      ts.isArrowFunction(node.initializer)
    ) {
      return node.name.text;
    }
  } else if (ts.isFunctionDeclaration(node) && node.name) {
    return node.name.text;
  }
  return baseName;
}

function finishParse(foundNodes: INode[], config: TSPgPromiseTransformConfig) {
  const queries: TSQueryASTWithTypeInfo[] = [];
  const events: ParseEvent[] = [];
  for (const node of foundNodes) {
    const result = getQueryTextFromType(node);
    if (!result) {
      continue;
    }
    if (
      result.query.params.some(
        (p) =>
          p.selection.type === PgPromiseParamType.Identifier ||
          p.selection.type === PgPromiseParamType.Raw,
      )
    ) {
      if (config.parameterKindWarning ?? true) {
        // tslint:disable-next-line:no-console
        console.log(
          `${getLineInfo(
            node.node,
          )}: Identifier or raw parameters are not supported`,
        );
      }
      continue;
    }
    queries.push({
      ...result.query,
      type: node.queryType,
      methodName: node.methodName,
      methodReturnMultiplicity: node.methodReturnMultiplicity,
      pos: node.pos,
    });
    events.push(...result.events);
  }

  return { queries, events };
}

function getQueryArgument(node: ts.Node, variableNames: string[]) {
  if (ts.isCallExpression(node)) {
    const expression = node.expression;
    if (
      ts.isPropertyAccessExpression(expression) &&
      ts.isIdentifier(expression.expression)
    ) {
      if (variableNames.includes(expression.expression.text)) {
        const queryArgument = node.arguments[0];
        const methodName = expression.name.text;
        const multiplicity = getMethodReturnMultiplicity(methodName);
        if (queryArgument && multiplicity) {
          return {
            queryArgument,
            methodName,
            multiplicity,
          };
        }
      }
    }
  }
}

function isStringOrNoSubstitutionTemplateLiteral(
  node: ts.Expression,
): node is ts.NoSubstitutionTemplateLiteral | ts.StringLiteral {
  return ts.isNoSubstitutionTemplateLiteral(node) || ts.isStringLiteral(node);
}

function parseFile(
  sourceFile: ts.SourceFile,
  config: TSPgPromiseTransformConfig,
  tsProgramGetter: () => ts.Program,
): TSParseResult {
  const foundNodes: INode[] = [];
  const filepath = sourceFile.fileName.split('/');
  const fileName = filepath[filepath.length - 1].split('.')[0];
  let hasDynamicQueries = false;
  parseNodeAstOnly(sourceFile, fileName);
  if (hasDynamicQueries) {
    const program = tsProgramGetter();
    parseNodeTyped(
      program.getSourceFile(sourceFile.fileName)!,
      fileName,
      program.getTypeChecker(),
    );
  }

  function parseNodeAstOnly(node: ts.Node, baseName: string) {
    const res = getQueryArgument(node, config.variableNames);
    if (res) {
      if (isStringOrNoSubstitutionTemplateLiteral(res.queryArgument)) {
        foundNodes.push({
          queryName: baseName,
          queryType: res.queryArgument.text,
          node: res.queryArgument,
          methodName: res.methodName,
          methodReturnMultiplicity: res.multiplicity,
          pos: sourceFile.getLineAndCharacterOfPosition(
            res.queryArgument.getStart(),
          ),
        });
      } else {
        hasDynamicQueries = true;
      }
    }
    baseName = getNameFromNode(node, baseName);
    ts.forEachChild(node, (n) => parseNodeAstOnly(n, baseName));
  }

  function parseNodeTyped(
    node: ts.Node,
    baseName: string,
    checker: ts.TypeChecker,
  ) {
    const res = getQueryArgument(node, config.variableNames);
    if (res) {
      if (!isStringOrNoSubstitutionTemplateLiteral(res.queryArgument)) {
        const queryType = checker.getTypeAtLocation(res.queryArgument);
        // TS computes a template literal containing only union literal placeholders to a union of literals
        if (
          queryType.flags & ts.TypeFlags.Union &&
          (queryType as ts.UnionType).types.every(
            (t) => t.flags & ts.TypeFlags.StringLiteral,
          )
        ) {
          foundNodes.push({
            queryName: baseName,
            queryType: typeToStringOrStringArray(queryType),
            node: res.queryArgument,
            methodName: res.methodName,
            methodReturnMultiplicity: res.multiplicity,
            pos: sourceFile.getLineAndCharacterOfPosition(
              res.queryArgument.getStart(),
            ),
          });
        } else if (config.argumentTypeWarning ?? true) {
          // tslint:disable-next-line:no-console
          console.log(
            `${getLineInfo(
              res.queryArgument,
            )}: Argument type is not a string literal or a union of string literals`,
          );
        }
      }
    }
    baseName = getNameFromNode(node, baseName);
    ts.forEachChild(node, (n) => parseNodeTyped(n, baseName, checker));
  }

  return finishParse(foundNodes, config);
}

function typeToStringOrStringArray(type: ts.Type) {
  if (type.flags & ts.TypeFlags.Union) {
    const r = type as ts.UnionType;
    if (r.types.every((t) => t.flags & ts.TypeFlags.StringLiteral)) {
      return r.types.map((t) => (t as ts.StringLiteralType).value);
    }
  } else if (type.flags & ts.TypeFlags.StringLiteral) {
    return (type as ts.StringLiteralType).value;
  }
  throw Error(
    'Expected type to be either a string literal or a union of string literals',
  );
}

export function formatLineInfo(fileName: string, pos: ts.LineAndCharacter) {
  return `${formatPath(fileName)}:${pos.line + 1}:${pos.character + 1}`;
}

function getLineInfo(node: ts.Node) {
  const sourceFile = node.getSourceFile();
  const pos = sourceFile.getLineAndCharacterOfPosition(node.getStart());
  const fileName = sourceFile.fileName;
  return formatLineInfo(fileName, pos);
}

function formatPath(fileName: string) {
  return `${path.relative(process.cwd(), fileName)}`;
}

function paramsToSet(params: PgPromiseParam[]) {
  const maxParamNameSet = new Set<string>();
  params.forEach((p) => maxParamNameSet.add(p.name));
  return maxParamNameSet;
}

function getQueryTextFromType(node: INode) {
  if (typeof node.queryType === 'string') {
    return parseTextPgPromise(node.queryType, node.queryName);
  }
  const parsedQueries = node.queryType.map((q) =>
    parseTextPgPromise(q, node.queryName),
  );
  const maxParams = Math.max(
    ...parsedQueries.map((q) => q.query.params.length),
  );
  if (maxParams === 0) {
    // tslint:disable-next-line:no-console
    console.log(
      `${getLineInfo(node.node)}: No parameters in union of literals`,
    );
    return undefined;
  }
  const queriesWithMaxParams = parsedQueries.filter(
    (q) => q.query.params.length === maxParams,
  );
  const queryWithMaxParam = queriesWithMaxParams[0];
  const maxSet = paramsToSet(queryWithMaxParam.query.params);
  const maxSetAll = paramsToSet(parsedQueries.flatMap((q) => q.query.params));
  if (maxSet.size !== maxSetAll.size) {
    // tslint:disable-next-line:no-console
    console.log(
      `${getLineInfo(
        node.node,
      )}: The set of parameters among all union literals is not contained by any single literal`,
    );
    return undefined;
  }
  return queryWithMaxParam;
}

export const parseTsPgPromise = (
  fileName: string,
  fileContent: string,
  config: TSPgPromiseTransformConfig,
  tsProgramGetter: () => ts.Program,
) => {
  const sourceFile = ts.createSourceFile(
    fileName,
    fileContent,
    ts.ScriptTarget.ES2022,
    true,
    ts.ScriptKind.TS,
  );
  return parseFile(sourceFile, config, tsProgramGetter);
};
