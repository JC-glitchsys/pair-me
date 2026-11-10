import { defineConfig } from "vite";

export default defineConfig({
  // This is the repository path for the GitHub Pages project site.
  base: "/pair-me/",
  build: {
    outDir: "dist",
    emptyOutDir: true,
  },
});
