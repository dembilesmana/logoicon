import { defineConfig } from "tsup";

export default defineConfig({
  entry: [".dist/**/*.{ts,tsx}"],
  outDir: "dist",
  format: ["esm", "cjs"],
  clean: true,
  dts: true,
  bundle: false,
});
