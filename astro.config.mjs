import { defineConfig, svgoOptimizer } from "astro/config";
import tailwindcss from "@tailwindcss/vite";

export default defineConfig({
  experimental: {
    svgOptimizer: svgoOptimizer({
      plugins: [
        { name: "preset-default", params: { overrides: { mergePaths: false } } },
      ],
    }),
  },
  vite: {
    plugins: [tailwindcss()],
  },
});
