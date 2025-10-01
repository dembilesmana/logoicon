import {
  createPrinter,
  EmitHint,
  factory,
  NewLineKind,
  NodeFlags,
  SyntaxKind,
  TypeNode,
} from "typescript";

export type IconMeta = {
  name: string;
  color: string;
  mode: string;
  category: string;
  title: string;
  brand: string;
  path: string;
};

function literal(value: string) {
  return factory.createStringLiteral(value);
}

function createIconMetaTypeAlias() {
  const members = [
    ["name", "string"],
    ["color", "string"],
    ["mode", "string"],
    ["category", "string"],
    ["title", "string"],
    ["brand", "string"],
    ["path", "string"],
  ].map(([key, type]) =>
    factory.createPropertySignature(
      undefined,
      factory.createIdentifier(key!),
      undefined,
      factory.createKeywordTypeNode(SyntaxKind.StringKeyword),
    ),
  );

  const typeLiteral = factory.createTypeLiteralNode(members);

  return factory.createTypeAliasDeclaration(
    [factory.createModifier(SyntaxKind.ExportKeyword)],
    factory.createIdentifier("IconMeta"),
    undefined,
    typeLiteral,
  );
}

function createMetadataArray(metaArray: readonly IconMeta[]) {
  const elements = metaArray.map((m) =>
    factory.createObjectLiteralExpression(
      Object.entries(m).map(([k, v]) =>
        factory.createPropertyAssignment(literal(k), literal(String(v))),
      ),
      false,
    ),
  );

  const arr = factory.createArrayLiteralExpression(elements, true);

  // as const
  const asConst = factory.createAsExpression(
    arr,
    factory.createTypeReferenceNode(
      factory.createIdentifier("const"),
      undefined,
    ),
  );

  return factory.createVariableStatement(
    [factory.createModifier(SyntaxKind.ExportKeyword)],
    factory.createVariableDeclarationList(
      [
        factory.createVariableDeclaration(
          factory.createIdentifier("metadata"),
          undefined,
          undefined,
          asConst,
        ),
      ],
      NodeFlags.Const,
    ),
  );
}

function createIconMetaConstType() {
  return factory.createTypeAliasDeclaration(
    [factory.createModifier(SyntaxKind.ExportKeyword)],
    factory.createIdentifier("IconMetaConst"),
    undefined,
    factory.createIndexedAccessTypeNode(
      factory.createTypeQueryNode(
        factory.createIdentifier("metadata"),
        undefined,
      ),
      factory.createLiteralTypeNode(factory.createNumericLiteral("number")),
    ),
  );
}

function id(name: string) {
  return factory.createIdentifier(name);
}

function createListHelperFns() {
  // function listBrands(): string[] { return Array.from(new Set(metadata.map(m => m.brand))).sort(); }
  const paramM = id("m");
  const brandBody = factory.createBlock(
    [
      factory.createReturnStatement(
        factory.createCallExpression(
          factory.createPropertyAccessExpression(
            factory.createCallExpression(
              factory.createPropertyAccessExpression(
                factory.createIdentifier("Array"),
                id("from"),
              ),
              undefined,
              [
                factory.createNewExpression(id("Set"), undefined, [
                  factory.createCallExpression(
                    factory.createPropertyAccessExpression(
                      id("metadata"),
                      id("map"),
                    ),
                    undefined,
                    [
                      factory.createArrowFunction(
                        undefined,
                        undefined,
                        [
                          factory.createParameterDeclaration(
                            undefined,
                            undefined,
                            paramM,
                          ),
                        ],
                        undefined,
                        factory.createToken(SyntaxKind.EqualsGreaterThanToken),
                        factory.createPropertyAccessExpression(
                          paramM,
                          id("brand"),
                        ),
                      ),
                    ],
                  ),
                ]),
              ],
            ),
            id("sort"),
          ),
          undefined,
          [],
        ),
      ),
    ],
    true,
  );

  const listBrands = factory.createFunctionDeclaration(
    [factory.createModifier(SyntaxKind.ExportKeyword)],
    undefined,
    id("listBrands"),
    undefined,
    [],
    factory.createArrayTypeNode(
      factory.createKeywordTypeNode(SyntaxKind.StringKeyword),
    ),
    brandBody,
  );

  // listCategories similar
  const catBody = factory.createBlock(
    [
      factory.createReturnStatement(
        factory.createCallExpression(
          factory.createPropertyAccessExpression(
            factory.createCallExpression(
              factory.createPropertyAccessExpression(
                factory.createIdentifier("Array"),
                id("from"),
              ),
              undefined,
              [
                factory.createNewExpression(id("Set"), undefined, [
                  factory.createCallExpression(
                    factory.createPropertyAccessExpression(
                      id("metadata"),
                      id("map"),
                    ),
                    undefined,
                    [
                      factory.createArrowFunction(
                        undefined,
                        undefined,
                        [
                          factory.createParameterDeclaration(
                            undefined,
                            undefined,
                            paramM,
                          ),
                        ],
                        undefined,
                        factory.createToken(SyntaxKind.EqualsGreaterThanToken),
                        factory.createPropertyAccessExpression(
                          paramM,
                          id("category"),
                        ),
                      ),
                    ],
                  ),
                ]),
              ],
            ),
            id("sort"),
          ),
          undefined,
          [],
        ),
      ),
    ],
    true,
  );

  const listCategories = factory.createFunctionDeclaration(
    [factory.createModifier(SyntaxKind.ExportKeyword)],
    undefined,
    id("listCategories"),
    undefined,
    [],
    factory.createArrayTypeNode(
      factory.createKeywordTypeNode(SyntaxKind.StringKeyword),
    ),
    catBody,
  );

  // getAll(): readonly IconMeta[] { return metadata; }
  const getAll = factory.createFunctionDeclaration(
    [factory.createModifier(SyntaxKind.ExportKeyword)],
    undefined,
    id("getAll"),
    undefined,
    [],
    factory.createTypeReferenceNode(id("ReadonlyArray"), [
      id("IconMeta") as unknown as TypeNode,
    ]),
    factory.createBlock([factory.createReturnStatement(id("metadata"))], true),
  );

  return { listBrands, listCategories, getAll };
}

function createPaginateFn() {
  // export function paginate<T>(items: readonly T[], page: number, perPage: number) { ... }
  const T = factory.createTypeParameterDeclaration(
    undefined,
    id("T"),
    undefined,
    undefined,
  );
  const itemsParam = factory.createParameterDeclaration(
    undefined,
    undefined,
    id("items"),
    undefined,
    factory.createTypeReferenceNode(id("ReadonlyArray"), [
      id("T") as unknown as TypeNode,
    ]),
    undefined,
  );
  const pageParam = factory.createParameterDeclaration(
    undefined,
    undefined,
    id("page"),
    undefined,
    factory.createKeywordTypeNode(SyntaxKind.NumberKeyword),
    undefined,
  );
  const perPageParam = factory.createParameterDeclaration(
    undefined,
    undefined,
    id("perPage"),
    undefined,
    factory.createKeywordTypeNode(SyntaxKind.NumberKeyword),
    undefined,
  );

  const totalDecl = factory.createVariableStatement(
    undefined,
    factory.createVariableDeclarationList(
      [
        factory.createVariableDeclaration(
          id("total"),
          undefined,
          undefined,
          factory.createPropertyAccessExpression(id("items"), id("length")),
        ),
      ],
      NodeFlags.Const,
    ),
  );

  const pagesDecl = factory.createVariableStatement(
    undefined,
    factory.createVariableDeclarationList(
      [
        factory.createVariableDeclaration(
          id("pages"),
          undefined,
          undefined,
          factory.createCallExpression(
            factory.createPropertyAccessExpression(id("Math"), id("max")),
            undefined,
            [
              factory.createNumericLiteral("1"),
              factory.createCallExpression(
                factory.createPropertyAccessExpression(id("Math"), id("ceil")),
                undefined,
                [
                  factory.createBinaryExpression(
                    factory.createBinaryExpression(
                      id("total"),
                      factory.createToken(SyntaxKind.SlashToken),
                      id("perPage"),
                    ),
                    factory.createToken(SyntaxKind.BarBarToken),
                    factory.createNumericLiteral("0"),
                  ),
                ],
              ),
            ],
          ),
        ),
      ],
      NodeFlags.Const,
    ),
  );

  const currentDecl = factory.createVariableStatement(
    undefined,
    factory.createVariableDeclarationList(
      [
        factory.createVariableDeclaration(
          id("current"),
          undefined,
          undefined,
          factory.createCallExpression(
            factory.createPropertyAccessExpression(id("Math"), id("min")),
            undefined,
            [
              factory.createCallExpression(
                factory.createPropertyAccessExpression(id("Math"), id("max")),
                undefined,
                [factory.createNumericLiteral("1"), id("page")],
              ),
              id("pages"),
            ],
          ),
        ),
      ],
      NodeFlags.Const,
    ),
  );

  const startDecl = factory.createVariableStatement(
    undefined,
    factory.createVariableDeclarationList(
      [
        factory.createVariableDeclaration(
          id("start"),
          undefined,
          undefined,
          factory.createBinaryExpression(
            factory.createBinaryExpression(
              id("current"),
              factory.createToken(SyntaxKind.MinusToken),
              factory.createNumericLiteral("1"),
            ),
            factory.createToken(SyntaxKind.AsteriskToken),
            id("perPage"),
          ),
        ),
      ],
      NodeFlags.Const,
    ),
  );

  const endDecl = factory.createVariableStatement(
    undefined,
    factory.createVariableDeclarationList(
      [
        factory.createVariableDeclaration(
          id("end"),
          undefined,
          undefined,
          factory.createBinaryExpression(
            id("start"),
            factory.createToken(SyntaxKind.PlusToken),
            id("perPage"),
          ),
        ),
      ],
      NodeFlags.Const,
    ),
  );

  const returnStmt = factory.createReturnStatement(
    factory.createObjectLiteralExpression(
      [
        factory.createPropertyAssignment(id("page"), id("current")),
        factory.createPropertyAssignment(id("perPage"), id("perPage")),
        factory.createPropertyAssignment(id("total"), id("total")),
        factory.createPropertyAssignment(id("pages"), id("pages")),
        factory.createPropertyAssignment(
          id("items"),
          factory.createCallExpression(
            factory.createPropertyAccessExpression(id("items"), id("slice")),
            undefined,
            [id("start"), id("end")],
          ),
        ),
      ],
      true,
    ),
  );

  return factory.createFunctionDeclaration(
    [factory.createModifier(SyntaxKind.ExportKeyword)],
    undefined,
    id("paginate"),
    [T],
    [itemsParam, pageParam, perPageParam],
    undefined,
    factory.createBlock(
      [totalDecl, pagesDecl, currentDecl, startDecl, endDecl, returnStmt],
      true,
    ),
  );
}

export function createReactMetadata(metaArray: readonly IconMeta[]) {
  const source = factory.createSourceFile(
    [
      createIconMetaTypeAlias(),
      createMetadataArray(metaArray),
      createIconMetaConstType(),
      ...Object.values(createListHelperFns()),
      createPaginateFn(),
    ],
    factory.createToken(SyntaxKind.EndOfFileToken),
    NodeFlags.None,
  );

  const printer = createPrinter({ newLine: NewLineKind.LineFeed });
  return printer.printFile(source);
}
