import { defineConfig } from "tsup";

export default defineConfig({
  entry: [".dist/**/*.{ts,tsx}"],
  outDir: "dist",
  format: ["esm", "cjs"],
  clean: true,
  bundle: false,
  dts: {
    entry: [".dist/index.ts"],
  },
});
