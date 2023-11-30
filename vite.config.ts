import { VitePWA } from "vite-plugin-pwa";
import { defineConfig } from "vitest/config";

export default defineConfig({
  plugins: [VitePWA({ injectRegister: "auto" })],
  test: {
    browser: {
      enabled: true,
      headless: true,
      name: "chrome", // browser name is required
    },
  },
});
