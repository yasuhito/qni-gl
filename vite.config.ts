import { defineConfig } from "vite";

export default defineConfig({
  test: {
    globals: true,
    browser: {
      enabled: true,
      name: "chrome", // browser name is required
    },
  },
});
