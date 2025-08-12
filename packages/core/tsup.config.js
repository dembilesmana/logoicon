import { defineConfig } from "tsup";

export default defineConfig((options) => ({
  entry: {
    index: "./src/index.ts",
    meta: "./build/metadata.ts",
  },
  dts: true,
  format: ["cjs", "esm"],
  splitting: false,
  watch: true,
  // sourcemap: true
  // clean: true,
}));
