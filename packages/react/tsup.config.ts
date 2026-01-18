import { defineConfig } from "tsup";

export default defineConfig({
  entry: [".dist/index.ts"],
  outDir: "dist",
  format: ["esm", "cjs"],
  clean: true,
  dts: true,
  bundle: true,
});
