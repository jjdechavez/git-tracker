import { defineConfig } from "vite";
import solid from "vite-plugin-solid";
import path from "path";
import devtools from "solid-devtools/vite";

export default defineConfig({
  plugins: [devtools({ autoname: true }), solid()],
  resolve: {
    alias: {
      "@git-tracker/functions": path.resolve(__dirname, "../../functions/src"),
      "@git-tracker/core": path.resolve(__dirname, "../../core/src"),
      "~": path.resolve(__dirname, "./src"),
    },
  },
});
