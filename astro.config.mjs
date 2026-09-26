import react from "@astrojs/react";
import sitemap from "@astrojs/sitemap";
import tailwindcss from "@tailwindcss/vite";
import { defineConfig } from "astro/config";

const site = process.env.SITE_URL || "https://nikhiladiga.pages.dev";

export default defineConfig({
  site,
  output: "static",
  integrations: [react(), sitemap()],
  vite: { plugins: [tailwindcss()] },
});
