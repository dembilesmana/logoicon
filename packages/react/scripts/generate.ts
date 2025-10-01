import * as iconAsset from "@logoicon/core/assets";
import { logger } from "@logoicon/logger";
import { kebabCase, normalize, pascalCase } from "@logoicon/util";
import { createWriteStream, mkdirSync, rmSync } from "node:fs";
import { mkdir, readFile, writeFile } from "node:fs/promises";
import { dirname, join } from "node:path";
import { fileURLToPath } from "node:url";
import { createReactComponent } from "../ast/create-component";
import { createIndex } from "../ast/create-index";
import { createReactMetadata } from "../ast/create-metadata";
import { converter } from "./converter";

let assets = Object.entries(iconAsset);

const OUTDIR = ".dist";

rmSync(OUTDIR, { recursive: true, force: true });
mkdirSync(OUTDIR);

const indexStream = createWriteStream(join(OUTDIR, "index.ts"));

/**
 * INFO: Generate components
 */
for (const [key, value] of assets) {
  const title = normalize(key);
  const [brand, ...name] = title.split(" ") as [string, string];
  const OUTBRAND = join(OUTDIR, brand);

  const path = join(OUTBRAND, kebabCase(name.join(" ")) + ".tsx");
  await mkdir(OUTBRAND, { recursive: true });

  const metadata = { name: kebabCase(name.join(" ")), title, brand, path };

  const convertion = converter(value);
  logger.debug(convertion);

  const component = createReactComponent(pascalCase(key), convertion);
  await writeFile(path, component, {
    encoding: "utf-8",
  });

  /**
   * INFO: Generate index of components
   */
  const script = await createIndex(metadata);
  indexStream.write(script);
}

/**
 * INFO: Generate React metadata from core NDJSON
 */
const __dirname = dirname(fileURLToPath(import.meta.url));
const coreMetaPath = join(__dirname, "../../core/.assets/metadata.ndjson");

try {
  const ndjson = await readFile(coreMetaPath, "utf-8");
  const lines = ndjson
    .split(/\r?\n/)
    .map(l => l.trim())
    .filter(Boolean);
  const metaArray = lines.map(line => JSON.parse(line));

  const script = createReactMetadata(metaArray as any);
  await writeFile(join(OUTDIR, "metadata.ts"), script, { encoding: "utf-8" });

  // Append exports to index.ts
  indexStream.write('\n');
  indexStream.write('export { metadata, listBrands, listCategories, getAll, paginate } from "./metadata";\n');
  indexStream.write('export type { IconMeta, IconMetaConst } from "./metadata";\n');

  logger.info("Generate components & metadata", "DONE");
} catch (err) {
  logger.error({ err }, "Failed to generate React metadata");
  throw err;
}
