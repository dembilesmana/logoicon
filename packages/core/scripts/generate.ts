import { logger } from "@logoicon/logger";
import { normalize } from "@logoicon/util";
import { XMLParser } from "fast-xml-parser";
import { createWriteStream, mkdirSync, rmSync } from "node:fs";
import { mkdir, opendir, readFile, writeFile } from "node:fs/promises";
import { basename, dirname, extname, join } from "node:path";
import pluralize from "pluralize";
import { loadConfig, optimize } from "svgo";
import { createExport } from "../ast/create-export";
import { createMetadata, createObjectMetadata } from "../ast/create-metadata";
import { createTS } from "../ast/create-svg";

export type Metadata = {
  category: string;
  name: string;
  brand: string;
  title: string;
  path: string;
};

const SRCDIR = "assets";
const OUTDIR = ".assets";

rmSync(OUTDIR, { recursive: true, force: true });
mkdirSync(OUTDIR);

const assets = await opendir(SRCDIR, { recursive: true });

const createDirs = new Set();

const xmlParser = new XMLParser({
  ignoreAttributes: false,
});

const streamIndex = createWriteStream(join(OUTDIR, "index.ts"));
const streamMetadata = createWriteStream(join(OUTDIR, "metadata.json"));

streamMetadata.write("[\n");
// Tambahkan flag untuk menyisipkan koma antar item
let isFirstMetadata = true;

for await (const asset of assets) {
  if (asset.isFile()) {
    const name = basename(asset.name, extname(asset.name));
    const category = pluralize(name.split("-").at(0)!);
    const brand = asset.parentPath.split("/").at(-1)!;
    const title = [brand, normalize(name)].join(" ");
    const inputPath = join(asset.parentPath, asset.name);
    const outputPath = `.${dirname(inputPath)}`;
    const path = `${join(outputPath, name)}.ts`;

    const metadata: Metadata = { name, category, title, brand, path };

    const xmlData = await readFile(inputPath, { encoding: "utf-8" }).catch(
      (error) => {
        logger.trace(error, "read file", inputPath);
        throw new Error(error);
      },
    );

    if (!createDirs.has(outputPath)) {
      await mkdir(outputPath, { recursive: true });
      createDirs.add(outputPath);
    }

    const svgoConfig = await loadConfig();
    const optimized = optimize(xmlData, svgoConfig!);
    let parsed = xmlParser.parse(optimized.data);

    /**
     * INFO: create SVG in json
     */
    writeFile(`${join(outputPath, name)}.json`, JSON.stringify(parsed)).catch(
      (error) => {
        logger.trace(error, "write file", outputPath, parsed);
        throw new Error(error);
      },
    );

    /**
     * INFO: create SVG in ts
     */
    const createTSFile = createTS(title, parsed);
    writeFile(`${join(outputPath, name)}.ts`, createTSFile);

    /**
     * INFO: create Index of SVG
     */
    const createIndexFile = await createExport(metadata);
    streamIndex.write(createIndexFile);

    /**
     * INFO: create metadata of SVG
     * Sisipkan koma sebelum item kecuali untuk item pertama
     */
    if (!isFirstMetadata) {
      streamMetadata.write(",\n");
    }
    const metaObject = createMetadata(metadata);
    streamMetadata.write(metaObject);
    isFirstMetadata = false;
  }
}

streamMetadata.write("\n]");
streamMetadata.end();

streamIndex.end();

logger.info("generate finish");
