import { defineConfig } from "astro/config";
import starlight from "@astrojs/starlight";
import react from "@astrojs/react";

// https://astro.build/config
export default defineConfig({
  integrations: [
    react(),
    starlight({
      title: "Interactive Documentation POC",
      social: {
        github: "https://github.com/withastro/starlight",
      },
      favicon: "/favicon.ico",
      head: [
        {
          tag: "meta",
          attrs: {
            name: "description",
            content:
              "Interactive documentation POC with Starlight and Sandpack",
          },
        },
      ],
      sidebar: [
        {
          label: "Guides",
          items: [
            // Each item here is one entry in the navigation menu.
            { label: "Getting Started", link: "/guides/getting-started/" },
            { label: "Interactive Code", link: "/guides/interactive-code/" },
          ],
        },
      ],
    }),
  ],
});
