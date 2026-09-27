import type { NextConfig } from "next";

const docsUrl =
  process.env.DOCS_URL ??
  (process.env.NODE_ENV === "development"
    ? "http://localhost:4321"
    : "https://dembilesmana.github.io/logoicon");

const nextConfig: NextConfig = {
  async rewrites() {
    return [
      {
        source: "/",
        destination: `${docsUrl}/`,
      },
      {
        source: "/:path*",
        destination: `${docsUrl}/:path*`,
      },
      {
        source: "/_astro/:path*",
        destination: `${docsUrl}/_astro/:path*`,
      },
    ];
  },
};

export default nextConfig;
