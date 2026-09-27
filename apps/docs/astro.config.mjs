// @ts-check
import starlight from "@astrojs/starlight";
import { defineConfig } from "astro/config";

// https://astro.build/config
export default defineConfig({
  base: "/logoicon/docs",
  integrations: [
    starlight({
      title: "LogoIcon",
      social: [
        {
          icon: "github",
          label: "GitHub",
          href: "https://github.com/dembilesmana/logoicon",
        },
      ],
      sidebar: [
        {
          label: "Memulai",
          items: [{ slug: "index" }, { slug: "general/welcome" }],
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
