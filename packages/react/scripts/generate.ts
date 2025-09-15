import * as iconAsset from "@logoicon/core/assets";
import { logger } from "@logoicon/logger";
import { kebabCase, normalize, pascalCase } from "@logoicon/util";
import { createWriteStream, mkdirSync, rmSync } from "node:fs";
import { mkdir, writeFile } from "node:fs/promises";
import { join } from "node:path";
import { createReactComponent } from "../ast/create-component";
import { createIndex } from "../ast/create-index";
import { converter } from "./converter";

let assets = Object.entries(iconAsset);

const OUTDIR = ".dist";

rmSync(OUTDIR, { recursive: true, force: true });
mkdirSync(OUTDIR);

const stream = createWriteStream(join(OUTDIR, "index.ts"));

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
  stream.write(script);
}

logger.info("Generate components", "DONE");
