import { getData } from "@logoicon/core";
import { logger } from "@logoicon/logger";
import { pascalCase } from "@logoicon/util";
import { mkdir, rm, writeFile } from "node:fs/promises";
import { join } from "node:path";
import { createReactComponent } from "./generate-component.ts.bak";
import { exportFile } from "./generate-index.js";
import { debug, log } from "node:console";

import * as iconAsset from "@logoicon/core/assets";
import { createReactComponentFxp } from "./generate-component-fxp.js";

const assets = Object.entries(iconAsset);

logger.level = "debug";

const OUT = "dist";

await rm(OUT, { recursive: true, force: true });

// log(list);
for (const [key, value] of assets) {
  log(pascalCase(key));
  const component = createReactComponentFxp(pascalCase(key), value);
}

// for (const meta of metadata) {
//   const OUTBRAND = join(OUT, meta.brand);
//   const svg = await getData(meta.path);
//
//   logger.debug(JSON.parse(svg));
//
//   // const { elements } = xml2js(svg);
//
//   // const component = createReactComponent(pascalCase(meta.title), svg);
//
//   // await mkdir(OUTBRAND, { recursive: true });
//   //
//   // await writeFile(join(OUTBRAND, meta.name + ".tsx"), component, {
//   //   encoding: "utf-8",
//   // });
// }
//
// // const script = await exportFile(metadata);
// //
// // await writeFile(join(OUT, "index.tsx"), script, {
// //   encoding: "utf-8",
// // });
