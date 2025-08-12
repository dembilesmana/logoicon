import type { Dirent } from "node:fs";

import { capitalize } from "@logoicon/util";
import deepmerge from "deepmerge";
import { writeFile } from "node:fs/promises";
import { basename, extname, join } from "node:path";
import { createMetadata } from "../../ast/createMetadata";

type MetadataOptions = {
  write: boolean;
  extensions: ("json" | "ts")[];
};

const defaultOptions: Partial<MetadataOptions> = {
  write: false,
  extensions: ["json"],
};

export async function metadata(
  dirent: Dirent[],
  options?: Partial<MetadataOptions>,
) {
  const { write, extensions } = deepmerge(defaultOptions, options ?? {});

  const meta = dirent
    .filter((item) => item.isFile())
    .map((value) => {
      const { name: nameWithExt, parentPath } = value;

      const name = basename(nameWithExt, extname(nameWithExt));
      const brand = parentPath.split("/").at(-1)!;
      const title = capitalize([brand, name].join(" "));
      const path = `.${join(parentPath, name)}.json`;

      return {
        name,
        title,
        brand,
        path,
      };
    });

  if (write) {
    const ouputPath = ".assets";

    for (const extension of extensions) {
      switch (extension) {
        case "ts":
          await writeFile(
            join(ouputPath, "metadata.ts"),
            await createMetadata(meta),
            {
              encoding: "utf-8",
            },
          );
          break;

        default:
          await writeFile(
            join(ouputPath, "metadata.json"),
            JSON.stringify(meta),
            { encoding: "utf-8" },
          );
          break;
      }
    }
  }
}
