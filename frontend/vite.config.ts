import { VitePWA } from "vite-plugin-pwa";
import {
  configDefaults,
  coverageConfigDefaults,
  defineConfig,
} from "vitest/config";

export default defineConfig({
  build: {
    rollupOptions: {
      output: {
        manualChunks(id) {
          if (id.includes("node_modules")) {
            return id
              .toString()
              .split("node_modules/")[1]
              .split("/")[0]
              .toString();
          }
        },
      },
    },
  },
  plugins: [
    VitePWA({
      strategies: "injectManifest",
      registerType: "autoUpdate",
      injectRegister: "auto",
      srcDir: "src",
      filename: "serviceWorker.ts",
      injectManifest: {
        injectionPoint: undefined,
      },
    }),
  ],
  test: {
    coverage: {
      provider: "istanbul",
      reporter: ["json", "html"],
      include: ["src/**"],
    },
    browser: {
      provider: "playwright", // or 'webdriverio'
      enabled: true,
      name: "chromium", // browser name is required
      headless: true,
    },
  },
  optimizeDeps: {
    exclude: ["fsevents"],
  },
});
