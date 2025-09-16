import { logger } from "@logoicon/logger";
import {
  createPrinter,
  EmitHint,
  factory,
  NewLineKind,
  NodeFlags,
  SyntaxKind,
} from "typescript";
import { Metadata } from "../scripts/generate";

export function createObjectMetadata(item: Metadata) {
  return factory.createObjectLiteralExpression(
    Object.entries(item).map(([index, value]) =>
      factory.createPropertyAssignment(
        factory.createStringLiteral(index),
        factory.createStringLiteral(value),
      ),
    ),
    true,
  );
}

export function createMetadata(meta: Metadata) {
  const objectMetadata = createObjectMetadata(meta);

  const sourceFile = factory.createSourceFile(
    [],
    factory.createToken(SyntaxKind.EndOfFileToken),
    NodeFlags.None,
  );

  const printer = createPrinter({ newLine: NewLineKind.LineFeed });
  const script = printer.printNode(
    EmitHint.Expression,
    objectMetadata,
    sourceFile,
  );

  logger.info("Metadata ast created");

  return script;
}

// export function createMetadataList(data: Metadata[]) {
//   const arrayLiteral = factory.createArrayLiteralExpression(
//     data.map((item) => createObjectMetadata(item)),
//     true,
//   );
//
//   const exportVariable = factory.createVariableStatement(
//     [factory.createModifier(SyntaxKind.ExportKeyword)],
//     factory.createVariableDeclarationList(
//       [
//         factory.createVariableDeclaration(
//           factory.createIdentifier("metadata"),
//           undefined,
//           undefined,
//           factory.createAsExpression(
//             arrayLiteral,
//             factory.createTypeReferenceNode(factory.createIdentifier("const")),
//           ),
//         ),
//       ],
//       NodeFlags.Const,
//     ),
//   );
//
//   const exportType = factory.createTypeAliasDeclaration(
//     [factory.createModifier(SyntaxKind.ExportKeyword)],
//     factory.createIdentifier("IconMeta"),
//     undefined,
//     factory.createIndexedAccessTypeNode(
//       factory.createTypeQueryNode(
//         factory.createIdentifier("metadata"),
//         undefined,
//       ),
//       factory.createLiteralTypeNode(factory.createNumericLiteral("number")),
//     ),
//   );
//
//   const sourceFile = factory.createSourceFile(
//     [exportVariable, exportType],
//     factory.createToken(SyntaxKind.EndOfFileToken),
//     NodeFlags.None,
//   );
//
//   const printer = createPrinter({ newLine: NewLineKind.LineFeed });
//   const script = printer.printFile(sourceFile);
//
//   logger.debug(script);
//   logger.info("Created metadata");
//   return script;
// }
