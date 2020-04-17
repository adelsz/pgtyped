import ts from 'typescript';

interface INode {
  queryName: string;
  tagName: string;
  tagContent: string;
}

export function parseFile(sourceFile: ts.SourceFile): INode[] {
  const foundNodes: INode[] = [];
  parseNode(sourceFile);

  function parseNode(node: ts.Node) {
    if (node.kind === ts.SyntaxKind.TaggedTemplateExpression) {
      const queryName = node.parent.getChildren()[0].getText();
      const taggedTemplateNode = node as ts.TaggedTemplateExpression;
      const tagName = taggedTemplateNode.tag.getText();
      const tagContent = taggedTemplateNode.template
        .getText()
        .replace('\n', '')
        .slice(1, -1)
        .trim();
      foundNodes.push({
        queryName,
        tagName,
        tagContent,
      });
    }

    ts.forEachChild(node, parseNode);
  }

  return foundNodes;
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
