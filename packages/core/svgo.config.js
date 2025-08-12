/**
 * @type {import('svgo').Config}
 */
export default {
  plugins: [
    "removeDimensions",
    {
      name: "removeAttrs",
      params: {
        attrs: "class",
      },
    },
    {
      name: "preset-default",
      params: {
        overrides: {},
      },
    },
  ],
};
