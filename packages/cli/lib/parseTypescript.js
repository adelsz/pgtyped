import { parseTSQuery } from '@pgtyped/parser';
import ts from 'typescript';
export function parseFile(sourceFile, transformConfig) {
    const foundNodes = [];
    parseNode(sourceFile);
    function parseNode(node) {
        if ((transformConfig === null || transformConfig === void 0 ? void 0 : transformConfig.mode) === 'ts-implicit' &&
            node.kind === ts.SyntaxKind.CallExpression) {
            const callNode = node;
            const functionName = callNode.expression.getText();
            if (functionName === transformConfig.functionName) {
                const queryName = callNode.parent.getChildren()[0].getText();
                const queryText = callNode.arguments[0].getText().slice(1, -1).trim();
                foundNodes.push({
                    queryName,
                    queryText,
                });
            }
        }
        if (node.kind === ts.SyntaxKind.TaggedTemplateExpression) {
            const queryName = node.parent.getChildren()[0].getText();
            const taggedTemplateNode = node;
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
    const queries = [];
    const events = [];
    for (const node of foundNodes) {
        const { query, events: qEvents } = parseTSQuery(node.queryText, node.queryName);
        queries.push(query);
        events.push(...qEvents);
    }
    return { queries, events };
}
export const parseCode = (fileContent, fileName = 'unnamed.ts', transformConfig) => {
    const sourceFile = ts.createSourceFile(fileName, fileContent, ts.ScriptTarget.ES2015, true);
    return parseFile(sourceFile, transformConfig);
};
//# sourceMappingURL=parseTypescript.js.map