import { defineConfig } from "vite";
import solid from "vite-plugin-solid";
import path from "path";

export default defineConfig({
  plugins: [solid()],
  resolve: {
    alias: {
      "@git-tracker/functions": path.resolve(__dirname, "../../functions/src"),
      "@git-tracker/core": path.resolve(__dirname, "../../core/src"),
      "~": path.resolve(__dirname, "./src"),
    },
  },
});
