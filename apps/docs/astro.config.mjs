// @ts-check
import starlight from "@astrojs/starlight";
import { defineConfig } from "astro/config";

// https://astro.build/config
export default defineConfig({
  site: "https://dembilesmana.github.io",
  base: "/logoicon/",
  // base: process.env.NODE_ENV === "development" ? undefined : "/logoicon/",
  integrations: [
    starlight({
      title: "Docs",
      components: {
        // Timpa komponen judul/logo bawaan Starlight
        SiteTitle: "./src/components/logo.astro",
      },
      social: [
        {
          icon: "github",
          label: "GitHub",
          href: "https://github.com/dembilesmana/logoicon",
        },
      ],
      head: [{ tag: "base", attrs: { href: "/logoicon/" } }],
      sidebar: [
        {
          label: "Memulai",
          items: [{ slug: "index" }, { slug: "general/started" }],
        },
        { slug: "guides/basics" },
        {
          label: "React",
          items: [
            { autogenerate: { directory: "guides/react" } },
            { slug: "guides/metadata" },
            { slug: "reference/react-api" },
          ],
        },
        {
          label: "Kontribusi",
          items: [
            {
              label: "Pengembangan",
              items: [
                { slug: "general/concepts" },
                { slug: "guides/add-assets" },
                { slug: "guides/development" },
              ],
            },
            {
              label: "Referensi proyek",
              items: [
                { slug: "reference/core-api" },
                { slug: "reference/commands" },
                { slug: "reference/repository" },
              ],
            },
          ],
        },
      ],
    }),
  ],
});
