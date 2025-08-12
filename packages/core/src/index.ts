import { logger } from "@logoicon/logger";
import { readFile } from "node:fs/promises";
import { dirname, resolve } from "node:path";
import { fileURLToPath } from "node:url";

const __dirname = dirname(fileURLToPath(import.meta.url));

export async function getData(path: string) {
  const p = resolve(__dirname, "..", path);
  logger.debug(p);
  return await readFile(resolve(__dirname, "..", path), "utf-8");
}
