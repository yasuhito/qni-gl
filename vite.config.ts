import { VitePWA } from "vite-plugin-pwa";
import { defineConfig } from "vitest/config";
import { viteStaticCopy } from 'vite-plugin-static-copy'

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
    viteStaticCopy({
      targets: [
        {
          src: 'assets',
          dest: ''
        }
      ]
    })
  ],
  test: {
    browser: {
      enabled: false,
      name: "chrome", // browser name is required
    },
  },
});
