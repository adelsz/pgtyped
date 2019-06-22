import ts from "typescript";

interface INode {
  tagName: string;
  tagContent: string;
}

export function parseFile(sourceFile: ts.SourceFile) {
  const foundNodes: Array<INode> = [];
  parseNode(sourceFile);

  function parseNode(node: ts.Node) {
    if (node.kind === ts.SyntaxKind.TaggedTemplateExpression) {
      const taggedTemplateNode = node as ts.TaggedTemplateExpression;
      const tagName = taggedTemplateNode.tag.getText();
      const tagContent = taggedTemplateNode.template
        .getText()
        .replace('\n', '')
        .slice(1,-1)
        .trim();
      foundNodes.push({
        tagName,
        tagContent,
      });
    }

    ts.forEachChild(node, parseNode);
  }

  return foundNodes;
}

export const parseCode = (
  fileContent: string,
  fileName = 'unnamed.ts',
) => {
  const sourceFile = ts.createSourceFile(
    fileName,
    fileContent,
    ts.ScriptTarget.ES2015,
    true
  );
  return parseFile(sourceFile);
};