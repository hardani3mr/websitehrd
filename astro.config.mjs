import { defineConfig } from "astro/config";

export default defineConfig({
  site: "https://omarhardani.com",
  // Pages are written as videos.html, blog/my-post.html … so every link stays relative.
  build: { format: "file" },
  compressHTML: false,
  devToolbar: { enabled: false },
});
