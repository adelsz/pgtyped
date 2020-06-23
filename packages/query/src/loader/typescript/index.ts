import ts from 'typescript';
import parseQuery, { Query } from './query';
import { ParseEvent } from '../sql/logger';

export const parseTSQuery = parseQuery;

export type TSQueryAST = Query;

interface INode {
  queryName: string;
  queryText: string;
}

export type TSParseResult = { queries: TSQueryAST[]; events: ParseEvent[] };

export function parseFile(sourceFile: ts.SourceFile): TSParseResult {
  const foundNodes: INode[] = [];
  parseNode(sourceFile);

  function parseNode(node: ts.Node) {
    if (node.kind === ts.SyntaxKind.TaggedTemplateExpression) {
      const queryName = node.parent.getChildren()[0].getText();
      const taggedTemplateNode = node as ts.TaggedTemplateExpression;
      const tagName = taggedTemplateNode.tag.getText();
      const queryText = taggedTemplateNode.template
        .getText()
        .replace('\n', '')
        .slice(1, -1)
        .trim();
      if (tagName === 'sql') {
        foundNodes.push({
          queryName,
          queryText,
        });
      }
    }

    ts.forEachChild(node, parseNode);
  }

  const queries: TSQueryAST[] = [];
  const events: ParseEvent[] = [];
  for (const node of foundNodes) {
    const { query, events: qEvents } = parseQuery(
      node.queryText,
      node.queryName,
    );
    queries.push(query);
    events.push(...qEvents);
  }

  return { queries, events };
}

const parseCode = (fileContent: string, fileName = 'unnamed.ts') => {
  const sourceFile = ts.createSourceFile(
    fileName,
    fileContent,
    ts.ScriptTarget.ES2015,
    true,
  );
  return parseFile(sourceFile);
};

export default parseCode;
