import { defineConfig } from "vite";
import { macaronVitePlugin } from "@macaron-css/vite";
import solid from "vite-plugin-solid";
import path from "path";

export default defineConfig({
  plugins: [solid(), macaronVitePlugin()],
  optimizeDeps: {
    esbuildOptions: {
      target: "es2020",
    },
  },
  build: {
    target: "esnext",
  },
  resolve: {
    alias: {
      "@console/functions": path.resolve(__dirname, "../../functions/src"),
      "@console/core": path.resolve(__dirname, "../../core/src"),
      $: path.resolve(__dirname, "./src"),
    },
  },
});
