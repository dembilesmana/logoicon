import { logger } from "@logoicon/logger";
import {
  createPrinter,
  factory,
  NewLineKind,
  NodeFlags,
  SyntaxKind,
} from "typescript";

export type Metadata = {
  name: string;
  brand: string;
  title: string;
  path: string;
};

function createObjectLiteralExpression(item: Metadata) {
  return factory.createObjectLiteralExpression(
    Object.entries(item).map(([index, value]) => {
      return factory.createPropertyAssignment(
        factory.createIdentifier(index),
        factory.createStringLiteral(value),
      );
    }),
  );
}

export async function createMetadata(data: Metadata[]) {
  const arrayLiteral = factory.createArrayLiteralExpression(
    data.map((item) => createObjectLiteralExpression(item)),
    true,
  );

  const exportVariable = factory.createVariableStatement(
    [factory.createModifier(SyntaxKind.ExportKeyword)],
    factory.createVariableDeclarationList(
      [
        factory.createVariableDeclaration(
          factory.createIdentifier("metadata"),
          undefined,
          undefined,
          factory.createAsExpression(
            arrayLiteral,
            factory.createTypeReferenceNode(factory.createIdentifier("const")),
          ),
        ),
      ],
      NodeFlags.Const,
    ),
  );

  const exportType = factory.createTypeAliasDeclaration(
    [factory.createModifier(SyntaxKind.ExportKeyword)],
    factory.createIdentifier("IconMeta"),
    undefined,
    factory.createIndexedAccessTypeNode(
      factory.createTypeQueryNode(
        factory.createIdentifier("metadata"),
        undefined,
      ),
      factory.createLiteralTypeNode(factory.createNumericLiteral("number")),
    ),
  );

  const sourceFile = factory.createSourceFile(
    [exportVariable, exportType],
    factory.createToken(SyntaxKind.EndOfFileToken),
    NodeFlags.None,
  );

  const printer = createPrinter({ newLine: NewLineKind.LineFeed });
  const tsCode = printer.printFile(sourceFile);

  logger.debug(tsCode);

  // Tulis sementara ke file input
  // const buildDir = await mkdir("build", { recursive: true });
  // log(buildDir);
  // if (buildDir) {
  //   await writeFile(join(buildDir, "metadata.ts"), tsCode);
  // }

  // 🔧 Compile menggunakan TypeScript Program API
  // const program = createProgram(["tmp/metadata.], {
  //   outDir: "dist", // Folder output
  //   declaration: true,
  //   emitDeclarationOnly: false,
  //   module: ModuleKind.ESNext,
  //   target: ScriptTarget.ES2020,
  //   moduleResolution: ModuleResolutionKind.Node10,
  //   esModuleInterop: true,
  //   resolveJsonModule: true,
  // });
  //
  // const result = program.emit();
  logger.info("✅ AST-built metadata compiled to JS + D");
  return tsCode;
}
