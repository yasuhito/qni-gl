import { VitePWA } from "vite-plugin-pwa";
import { defineConfig } from "vitest/config";
import { loadEnv } from "vite";

export default defineConfig(({ mode }) => {
  loadEnv(mode, process.cwd());

  return {
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
        srcDir: "src",
        filename: "service-worker.js",
        strategies: "injectManifest",
        registerType: "autoUpdate",
        injectRegister: false,
        manifest: false,
        injectManifest: {
          injectionPoint: undefined,
        },
        devOptions: {
          enabled: true,
          type: "module",
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
  };
});
