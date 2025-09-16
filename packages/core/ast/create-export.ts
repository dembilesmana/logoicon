import { camelCase } from "@logoicon/util";
import { join } from "node:path";
import {
  createPrinter,
  factory,
  NewLineKind,
  NodeFlags,
  SyntaxKind,
} from "typescript";
import { Metadata } from "../scripts/generate";
import { logger } from "@logoicon/logger";

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

export async function createExport(meta: Metadata) {
  const sourceFile = factory.createSourceFile(
    [createExportDeclaration(meta)],
    factory.createToken(SyntaxKind.EndOfFileToken),
    NodeFlags.None,
  );

  const printer = createPrinter({ newLine: NewLineKind.LineFeed });
  const script = printer.printFile(sourceFile);

  logger.debug(script);
  logger.info("Create export");
  return script;
}
