import { camelCase } from "@logoicon/util";
import { join } from "node:path";
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

function createExportDeclaration(meta: Metadata) {
  const exports = factory.createExportDeclaration(
    undefined,
    false,
    factory.createNamedExports([
      factory.createExportSpecifier(
        false,
        undefined,
        factory.createIdentifier(camelCase(meta.title)),
      ),
    ]),
    factory.createStringLiteral(`./${join(meta.brand, meta.name)}`),
  );

  return exports;
}

export async function createIndex(meta: Metadata) {
  const sourceFile = factory.createSourceFile(
    [createExportDeclaration(meta)],
    factory.createToken(SyntaxKind.EndOfFileToken),
    NodeFlags.None,
  );

  const printer = createPrinter({ newLine: NewLineKind.LineFeed });
  const script = printer.printFile(sourceFile);

  return script;
}
