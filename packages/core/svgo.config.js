/**
 * @type {import('svgo').Config}
 */
export default {
  plugins: [
    // INFO: Ok
    "removeDoctype",
    "removeXMLProcInst",
    "removeComments",
    "removeMetadata",
    "removeEditorsNSData",
    "removeEmptyAttrs",

    "cleanupAttrs",
    {
      name: "inlineStyles", // WARN: Ada kemungkinan jangan digunakan karena defs class akan ditulis sebagai inline style
      params: {
        onlyMatchedOnce: false,
      },
    },

    {
      name: "convertStyleToAttrs",
      params: {
        keepImportant: true,
      },
    },
    {
      name: "prefixIds",
      params: {
        prefix: true,
      },
    },
    { name: "removeAttrs", params: { attrs: ["data-name"] } },
    // {
    //   name: "cleanupIds", // WARN: changed id for minify but maked error
    //   params: {
    //     force: true,
    //   },
    // },
    "removeUnusedNS",
    // "mergePaths",
    "sortAttrs",
    "sortDefsChildren",
    "removeDesc",
    "removeDimensions",
  ],
};
