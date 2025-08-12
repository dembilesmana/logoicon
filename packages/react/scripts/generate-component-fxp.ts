import { camelCase } from "@logoicon/util";
import { log } from "node:console";
import {
  ArrowFunction,
  createPrinter,
  factory,
  JsxAttributes,
  JsxChild,
  JsxElement,
  NewLineKind,
  NodeFlags,
  Statement,
  SyntaxKind,
} from "typescript";

/**
 *  * Convert FXP attributes (@_foo) ke object { foo: value }
 *   */
function getFxpAttributes(node: any) {
  const attrs: Record<string, string> = {};
  for (const [key, value] of Object.entries(node)) {
    if (key.startsWith("@_")) {
      attrs[key.slice(2)] = String(value);
    }
  }
  return attrs;
}

function getFxpChildren(node: any) {
  const children: Array<{ name: string; node: any }> = [];
  for (const [key, value] of Object.entries(node)) {
    if (!key.startsWith("@_")) {
      if (Array.isArray(value)) {
        value.forEach((v) => children.push({ name: key, node: v }));
      } else {
        children.push({ name: key, node: value });
      }
    }
  }
  return children;
}

function createJsxAttributesFxp(node: any): JsxAttributes {
  const attrs = getFxpAttributes(node);
  return factory.createJsxAttributes(
    Object.entries(attrs).map(([key, value]) => {
      return factory.createJsxAttribute(
        factory.createIdentifier(camelCase(key)),
        key === "style"
          ? factory.createJsxExpression(
              undefined,
              factory.createObjectLiteralExpression(
                value
                  .split(";")
                  .filter(Boolean)
                  .map((rule) => {
                    const [k, v] = rule.split(":").map((s) => s.trim());
                    return factory.createPropertyAssignment(
                      factory.createIdentifier(k),
                      factory.createStringLiteral(v || ""),
                    );
                  }),
              ),
            )
          : factory.createStringLiteral(value),
      );
    }),
  );
}

function createJsxChildFxp(name: string, node: any): JsxChild {
  const attributes = createJsxAttributesFxp(node);
  const children = getFxpChildren(node).map(({ name, node }) =>
    createJsxChildFxp(name, node),
  );

  if (children.length === 0) {
    return factory.createJsxSelfClosingElement(
      factory.createIdentifier(name),
      undefined,
      attributes,
    );
  }

  return factory.createJsxElement(
    factory.createJsxOpeningElement(
      factory.createIdentifier(name),
      undefined,
      factory.createJsxAttributes([
        factory.createJsxSpreadAttribute(factory.createIdentifier("props")),
        ...attributes.properties,
      ]),
    ),
    children,
    factory.createJsxClosingElement(factory.createIdentifier(name)),
  );
}

function createJsxFxp(rootObj: any) {
  const [rootName, rootNode] = Object.entries(rootObj)[0];
  return createJsxChildFxp(rootName, rootNode) as JsxElement;
}

function createArrowFunction(...statement: Statement[]): ArrowFunction {
  const propsParam = factory.createParameterDeclaration(
    undefined,
    undefined,
    factory.createIdentifier("props"),
    undefined,
    factory.createTypeReferenceNode(factory.createIdentifier("SVGProps"), [
      factory.createTypeReferenceNode(
        factory.createIdentifier("SVGSVGElement"),
        undefined,
      ),
    ]),
    undefined,
  );

  return factory.createArrowFunction(
    undefined,
    undefined,
    [propsParam],
    undefined,
    factory.createToken(SyntaxKind.EqualsGreaterThanToken),
    factory.createBlock(statement),
  );
}

export function createReactComponentFxp(name: string, fxpRoot: any) {
  const importTypeReact = factory.createImportDeclaration(
    undefined,
    factory.createImportClause(
      true,
      undefined,
      factory.createNamedImports([
        factory.createImportSpecifier(
          false,
          undefined,
          factory.createIdentifier("SVGProps"),
        ),
      ]),
    ),
    factory.createStringLiteral("react"),
  );

  const exportNamed = factory.createVariableStatement(
    [factory.createModifier(SyntaxKind.ExportKeyword)],
    factory.createVariableDeclarationList(
      [
        factory.createVariableDeclaration(
          factory.createIdentifier(name),
          undefined,
          undefined,
          createArrowFunction(
            factory.createReturnStatement(
              factory.createParenthesizedExpression(createJsxFxp(fxpRoot)),
            ),
          ),
        ),
      ],
      NodeFlags.Const,
    ),
  );

  const exportDefault = factory.createExportAssignment(
    undefined,
    undefined,
    factory.createIdentifier(name),
  );

  const sourceFile = factory.createSourceFile(
    [importTypeReact, exportNamed, exportDefault],
    factory.createToken(SyntaxKind.EndOfFileToken),
    NodeFlags.None,
  );

  const printer = createPrinter({ newLine: NewLineKind.LineFeed });
  const script = printer.printFile(sourceFile);

  log(script);
  return script;
}
