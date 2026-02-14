import { defineConfig } from "vite";
import { resolve } from "path";

// https://vitejs.dev/config/
export default defineConfig({
  // Base path for GitHub Pages deployment
  // Use root path since custom domain (bq-pace.hypercoast.org) is configured
  base: "/",
  build: {
    rollupOptions: {
      input: {
        main: resolve(__dirname, "index.html"),
        map: resolve(__dirname, "map.html"),
      },
    },
  },
});
