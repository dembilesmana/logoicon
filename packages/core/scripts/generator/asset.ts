import { Dirent } from "node:fs";
import { mkdir, readFile, writeFile } from "node:fs/promises";
import { dirname, join } from "node:path";
import { loadConfig, optimize } from "svgo";
const config = await loadConfig();

type AssetOptions = {
  write: boolean;
};

const defautlOptions: AssetOptions = {
  write: false,
};

export async function asset(dirent: Dirent[], options = defautlOptions) {
  const { write = false } = options;

  dirent
    .filter((predicate) => predicate.isFile())
    .forEach(async ({ parentPath, name }) => {
      const path = join(parentPath, name);

      const file = await readFile(path, { encoding: "utf-8" });
      const { data } = optimize(file, config ?? undefined);

      if (write) {
        const ouputPath = `.${path}`;

        await mkdir(dirname(ouputPath), { recursive: true });
        await writeFile(ouputPath, data);
      }
    });
}
