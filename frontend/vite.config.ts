import path from "node:path";
import { copyFileSync } from "node:fs";
import { fileURLToPath } from "node:url";
import { defineConfig } from "vite";
import react from "@vitejs/plugin-react";
import tailwindcss from "@tailwindcss/vite";

const frontendDir = fileURLToPath(new URL(".", import.meta.url));

export default defineConfig({
  base: process.env.VITE_BASE_PATH || "/",
  plugins: [
    react(),
    tailwindcss(),
    {
      name: "github-pages-spa-fallback",
      writeBundle(options) {
        const outputDirectory = options.dir || path.resolve(frontendDir, "dist");
        copyFileSync(
          path.resolve(outputDirectory, "index.html"),
          path.resolve(outputDirectory, "404.html"),
        );
      },
    },
  ],
  resolve: {
    alias: [{ find: "@", replacement: path.resolve(frontendDir, "src") }],
  },
  server: {
    host: "127.0.0.1",
    port: 3000,
    strictPort: true,
    proxy: {
      "/api": { target: "http://127.0.0.1:8001", changeOrigin: true },
    },
  },
});
