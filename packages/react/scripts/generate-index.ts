import type { IconMeta, metadata } from "@logoicon/core/meta";
import { pascalCase } from "@logoicon/util";
import { join } from "node:path";
import {
  createPrinter,
  factory,
  NewLineKind,
  NodeFlags,
  SyntaxKind,
} from "typescript";

function recursive(meta: IconMeta) {
  const exports = factory.createExportDeclaration(
    undefined,
    false,
    factory.createNamedExports([
      factory.createExportSpecifier(
        false,
        undefined,
        factory.createIdentifier(pascalCase(meta.title)),
      ),
    ]),
    factory.createStringLiteral(`./${join(meta.brand, meta.name)}`),
  );

  return exports;
}

export async function exportFile(some: typeof metadata) {
  const a = some.map((v) => {
    return recursive(v);
  });

  const sourceFile = factory.createSourceFile(
    a,
    factory.createToken(SyntaxKind.EndOfFileToken),
    NodeFlags.None,
  );

  const printer = createPrinter({ newLine: NewLineKind.LineFeed });
  const script = printer.printFile(sourceFile);

  return script;
}
