import { defineConfig } from "vite";
import react from "@vitejs/plugin-react";
import tsConfigPaths from "vite-tsconfig-paths";
import { NodeGlobalsPolyfillPlugin } from "@esbuild-plugins/node-globals-polyfill";
import { VitePWA } from "vite-plugin-pwa";
import { visualizer } from "rollup-plugin-visualizer";

export default defineConfig({
  build: {
    outDir: "build"
  },
  server: {
    port: 3000
  },
  optimizeDeps: {
    esbuildOptions: {
      define: {
        global: "globalThis"
      },
      plugins: [
        NodeGlobalsPolyfillPlugin({
          buffer: true
        })
      ]
    }
  },
  plugins: [
    react({
      jsxRuntime: "classic",
      babel: {
        babelrc: false,
        plugins: [
          ["@babel/plugin-proposal-decorators", { legacy: true }],
          [
            "babel-plugin-direct-import",
            {
              modules: [
                "@material-ui/lab",
                "@material-ui/core",
                "@material-ui/icons"
              ]
            }
          ]
        ]
      }
    }),
    tsConfigPaths(),
    VitePWA({
      injectRegister: null,
      strategies: "injectManifest",
      srcDir: "src",
      filename: "service-worker.ts",
      devOptions: {
        enabled: true
      }
    }),
    visualizer({ gzipSize: true })
  ]
});
