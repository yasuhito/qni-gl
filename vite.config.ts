import { VitePWA } from "vite-plugin-pwa";
import { defineConfig } from "vitest/config";

export default defineConfig({
  plugins: [
    VitePWA({
      strategies: "injectManifest",
      srcDir: "src",
      filename: "serviceWorker.ts",
      injectRegister: "auto",
      injectManifest: {
        injectionPoint: undefined,
      },
    }),
  ],
  test: {
    browser: {
      enabled: true,
      headless: true,
      name: "chrome", // browser name is required
    },
  },
});
