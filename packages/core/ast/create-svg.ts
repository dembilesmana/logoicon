import { camelCase } from "@logoicon/util";
import {
  createPrinter,
  Expression,
  factory,
  NewLineKind,
  NodeFlags,
  SyntaxKind,
} from "typescript";

// 🔁 Fungsi untuk konversi object JS ke AST Expression
function objectToAst(obj: any): Expression {
  if (typeof obj === "string") {
    return factory.createStringLiteral(obj);
  } else if (typeof obj === "number") {
    return factory.createNumericLiteral(obj.toString());
  } else if (typeof obj === "boolean") {
    return obj ? factory.createTrue() : factory.createFalse();
  } else if (Array.isArray(obj)) {
    return factory.createArrayLiteralExpression(obj.map(objectToAst), false);
  } else if (typeof obj === "object" && obj !== null) {
    const props = Object.entries(obj).map(([key, value]) =>
      factory.createPropertyAssignment(
        factory.createStringLiteral(key),
        objectToAst(value),
      ),
    );
    return factory.createObjectLiteralExpression(props, true);
  } else {
    return factory.createNull();
  }
}

export function createTS(name: string, data: any) {
  // 🔧 Buat deklarasi export const iconData = {...};
  name = camelCase(name);

  /**
   * INFO: export const name
   */
  const exportNamed = factory.createVariableStatement(
    [factory.createModifier(SyntaxKind.ExportKeyword)],
    factory.createVariableDeclarationList(
      [
        factory.createVariableDeclaration(
          factory.createIdentifier(name),
          undefined,
          undefined,
          objectToAst(data),
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
    [exportNamed, exportDefault],
    factory.createToken(SyntaxKind.EndOfFileToken),
    NodeFlags.None,
  );

  // ✨ Cetak AST ke string
  const printer = createPrinter({
    newLine: NewLineKind.LineFeed,
  });
  const script = printer.printFile(sourceFile);

  return script;
}
