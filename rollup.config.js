import commonjs from '@rollup/plugin-commonjs';
import resolve from '@rollup/plugin-node-resolve';
import typescript from "@rollup/plugin-typescript";

export default {
  input: "src/serviceWorker.ts",
  output: {
    dir: "public",
    format: "iife",
    sourcemap: true,
    name: "serviceWorker",
  },
  plugins: [
    typescript(),
    resolve(), // Node.jsの解決アルゴリズムを使用
    commonjs(), // CommonJSモジュールをES6に変換
  ],
};
