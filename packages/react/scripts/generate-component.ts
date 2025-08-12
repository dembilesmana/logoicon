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
import type { Element } from "xml-js";

function createJsxAttributes(node: Element): JsxAttributes {
  return factory.createJsxAttributes(
    Object.entries(node.attributes || {}).map(([key, value]) => {
      return factory.createJsxAttribute(
        factory.createIdentifier(camelCase(key)),
        key === "style"
          ? factory.createJsxExpression(
              undefined,
              factory.createObjectLiteralExpression(
                value
                  ?.toString()
                  .split(";")
                  .map(([key, value]) =>
                    factory.createPropertyAssignment(
                      factory.createIdentifier(key!),
                      factory.createStringLiteral(value?.toString()!),
                    ),
                  ),
              ),
            )
          : factory.createStringLiteral(value?.toString()!),
      );
    }),
  );
}

function createJsxChild(node: Element): JsxChild {
  const attributes = createJsxAttributes(node);

  const children = (node.elements || []).map((element) => {
    return createJsxChild(element);
  });

  if (!node.elements) {
    return factory.createJsxSelfClosingElement(
      factory.createIdentifier(node.name!),
      undefined,
      attributes,
    );
  }

  return factory.createJsxElement(
    factory.createJsxOpeningElement(
      factory.createIdentifier(node.name!),
      undefined,
      factory.createJsxAttributes([
        factory.createJsxSpreadAttribute(factory.createIdentifier("props")),
        ...attributes.properties,
      ]),
    ),
    children,
    factory.createJsxClosingElement(factory.createIdentifier(node.name!)),
  );
}

function createJsx(elemets: Element[]) {
  const children = elemets.map((element) => createJsxChild(element));

  /**
   * INFO: Maybe never used
   */
  if (elemets && elemets.length > 1) {
    return factory.createJsxFragment(
      factory.createJsxOpeningFragment(),
      children,
      factory.createJsxJsxClosingFragment(),
    );
  }

  return children[0] as JsxElement;
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

export function createReactComponent(name: string, elements) {
  /**
   * INFO: import type {SVGProps} from "react"
   */
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

  /**
   * INFO: export const Name = () => {return <></>}
   */
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
              factory.createParenthesizedExpression(createJsx(elements)),
            ),
          ),
        ),
      ],
      NodeFlags.Const,
    ),
  );

  /**
   * INFO: export default Name
   */
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
