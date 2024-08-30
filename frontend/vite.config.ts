import { VitePWA } from "vite-plugin-pwa";
import { defineConfig } from "vitest/config";
import { viteStaticCopy } from "vite-plugin-static-copy";

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
      registerType: "autoUpdate",
      injectRegister: "auto",
      srcDir: "src",
      filename: "serviceWorker.ts",
    }),
    viteStaticCopy({
      targets: [
        {
          src: "assets",
          dest: "",
        },
      ],
    }),
  ],
  test: {
    coverage: {
      provider: "istanbul",
      reporter: ["json", "html"],
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
