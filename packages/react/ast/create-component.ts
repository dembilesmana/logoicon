import { logger } from "@logoicon/logger";
import { camelCase } from "@logoicon/util";
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
import { ElementNode } from "../scripts/converter";

// -------------------------------------------
// Buat JSX Attribute dari attributes
// -------------------------------------------
function createJsxAttribute(key: string, value: string) {
  if (key === "style") {
    return factory.createJsxExpression(
      undefined,
      factory.createObjectLiteralExpression(
        value
          .split(";")
          .filter(Boolean)
          .map((rule) => {
            const [k, v] = rule.split(":").map((s) => s.trim()) as [
              string,
              string,
            ];
            return factory.createPropertyAssignment(
              factory.createIdentifier(camelCase(k)),
              factory.createStringLiteral(v),
            );
          }),
      ),
    );
  }

  return factory.createStringLiteral(value);
}

// -------------------------------------------
// Buat JSX Attributes dari attributes AST
// -------------------------------------------
function createJsxAttributes(
  attributes: Record<string, string> = {},
): JsxAttributes {
  return factory.createJsxAttributes(
    Object.entries(attributes).map(([key, value]) => {
      return factory.createJsxAttribute(
        factory.createIdentifier(camelCase(key !== "class" ? key : "style")),
        createJsxAttribute(key, value),
      );
    }),
  );
}

// -------------------------------------------
// Buat JSX Child dari ElementNode
// -------------------------------------------
function createJsxChild(node: ElementNode): JsxChild {
  logger.debug(node, "Creating JSX Child for node:");

  if (node.type === "Text") {
    return factory.createJsxText(node.value ?? "");
  }

  const attributes = createJsxAttributes(node.attributes);

  const children =
    node.children
      // INFO: Don't write style
      ?.filter((v) => v.name !== "style")
      ?.map((v) => createJsxChild(v)) ?? [];

  if (children.length === 0) {
    return factory.createJsxSelfClosingElement(
      factory.createIdentifier(node.name ?? "Unknown"),
      undefined,
      attributes,
    );
  }

  const externalProps =
    node.name === "svg"
      ? [factory.createJsxSpreadAttribute(factory.createIdentifier("props"))]
      : [];

  return factory.createJsxElement(
    factory.createJsxOpeningElement(
      factory.createIdentifier(node.name ?? "Unknown"),
      undefined,
      factory.createJsxAttributes([...externalProps, ...attributes.properties]),
    ),
    children,
    factory.createJsxClosingElement(
      factory.createIdentifier(node.name ?? "Unknown"),
    ),
  );
}

// -------------------------------------------
// Buat JSX dari root AST
// -------------------------------------------
function createJsx(root: ElementNode): JsxElement {
  logger.debug(root, "Creating JSX for root:");

  return createJsxChild(root) as JsxElement;
}

// -------------------------------------------
// Arrow function React component
// -------------------------------------------
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

// -------------------------------------------
// Generate React Component dari AST
// -------------------------------------------
export function createReactComponent(name: string, root: ElementNode) {
  logger.debug({ name }, "Generating React component:");
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
   * FIX: harusnya ketika class tidak ada pada element
   * jangan sampai membuat variable (saat ini masih ada variable varian pada hasil)
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
              factory.createParenthesizedExpression(createJsx(root)),
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

  return printer.printFile(sourceFile);
}
