import * as iconAsset from "@logoicon/core/assets";
import { logger } from "@logoicon/logger";
import { normalize, pascalCase } from "@logoicon/util";
import { createWriteStream, mkdirSync, rmSync } from "node:fs";
import { mkdir, writeFile } from "node:fs/promises";
import { join } from "node:path";
import { createReactComponent } from "../ast/create-component";
import { createIndex } from "../ast/create-index";
import { converter } from "./converter";

let assets = Object.entries(iconAsset);

// logger.level = "debug";

const OUTDIR = "dist";

rmSync(OUTDIR, { recursive: true, force: true });
mkdirSync(OUTDIR);

const stream = createWriteStream(join(OUTDIR, "index.ts"));

/**
 * INFO: Generate components
 */
assets = assets.filter((v) => v[0].includes("gitlab"));

for (const [key, value] of assets) {
  const title = normalize(key);
  const [brand, name] = title.split(" ") as [string, string];
  const OUTBRAND = join(OUTDIR, brand);

  const path = join(OUTBRAND, name + ".tsx");
  await mkdir(OUTBRAND, { recursive: true });

  const metadata = { name, title, brand, path };

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
  stream.write(script);
}

logger.info("Generate components", "DONE");
