import { defineConfig } from "tsup";

export default defineConfig({
  entry: {
    index: "./src/index.ts",
    meta: "./build/metadata.ts",
  },
  outDir: ".dist",
  dts: true,
  format: ["cjs", "esm"],
  splitting: false,
  watch: true,
  // sourcemap: true
  // clean: true,
});
