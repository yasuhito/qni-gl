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
      strategies: "injectManifest",
      srcDir: "src",
      filename: "serviceWorker.ts",
      injectRegister: "auto",
      injectManifest: {
        injectionPoint: undefined,
      },
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
