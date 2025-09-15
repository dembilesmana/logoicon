import type { Metadata } from "../ast/create-index";

import { logger } from "@logoicon/logger";
import { XMLParser } from "fast-xml-parser";
import { createWriteStream, mkdirSync, rmSync } from "node:fs";
import { mkdir, opendir, readFile, writeFile } from "node:fs/promises";
import { basename, dirname, extname, join } from "node:path";
import { createIndex } from "../ast/create-index";
import { createTS } from "../ast/create-svg";
import { optimize } from "svgo";

const SRCDIR = "assets";
const OUTDIR = ".assets";

rmSync(OUTDIR, { recursive: true, force: true });
mkdirSync(OUTDIR);

const assets = await opendir(SRCDIR, { recursive: true });

const stream = createWriteStream(join(OUTDIR, "index.ts"));

const createDirs = new Set();

const xmlParser = new XMLParser({
  ignoreAttributes: false,
});

for await (const asset of assets) {
  if (asset.isFile()) {
    const name = basename(asset.name, extname(asset.name));
    const brand = asset.parentPath.split("/").at(-1)!;
    const title = [brand, name].join(" ");
    const inputPath = join(asset.parentPath, asset.name);
    const outputPath = `.${dirname(inputPath)}`;
    const path = `${join(outputPath, name)}.ts`;

    const metadata: Metadata = { name, title, brand, path };

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

    const optimized = optimize(xmlData, {
      plugins: [
        // INFO: Ok
        "removeDoctype",
        "removeXMLProcInst",
        "removeComments",
        "removeMetadata",
        "removeEditorsNSData",
        "removeEmptyAttrs",

        "cleanupAttrs",
        {
          name: "inlineStyles", // WARN: Ada kemungkinan jangan digunakan karena defs class akan ditulis sebagai inline style
          params: {
            onlyMatchedOnce: false,
          },
        },

        {
          name: "convertStyleToAttrs",
          params: {
            keepImportant: true,
          },
        },
        {
          name: "prefixIds",
          params: {
            prefix: true,
          },
        },
        { name: "removeAttrs", params: { attrs: ["data-name"] } },
        // {
        //   name: "cleanupIds", // WARN: changed id for minify but maked error
        //   params: {
        //     force: true,
        //   },
        // },
        "removeUnusedNS",
        // "mergePaths",
        "sortAttrs",
        "sortDefsChildren",
        "removeDesc",
        "removeDimensions",
      ],
    });
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
    const createIndexFile = await createIndex(metadata);
    stream.write(createIndexFile);

    /**
     * INFO: create metadata of SVG
     */
    // log({
    //   name,
    //   title,
    //   brand,
    //   path,
    // });

    // await metadata(pathList, { write: true, extensions: ["ts"] });
  }
}

stream.end();

logger.info("generate finish");
