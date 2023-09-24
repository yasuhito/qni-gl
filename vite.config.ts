import { defineConfig } from "vite";
import path from "path";

export default defineConfig({
  test: {
    globals: true,
    browser: {
      enabled: true,
      name: "chrome", // browser name is required
    },
  },
});
