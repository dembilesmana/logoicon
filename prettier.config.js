/**
 * @see https://prettier.io/docs/configuration
 * @type {import("prettier").Config}
 */
const config = {
  overrides: [
    {
      files: ["*.md", "*.mdx"],
    },
  ],
  plugins: ["prettier-plugin-packagejson"],
};

export default config;
