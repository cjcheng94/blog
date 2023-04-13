import { defineConfig, PluginOption, splitVendorChunkPlugin } from "vite";
import react from "@vitejs/plugin-react";
import tsConfigPaths from "vite-tsconfig-paths";
import { NodeGlobalsPolyfillPlugin } from "@esbuild-plugins/node-globals-polyfill";
import { VitePWA } from "vite-plugin-pwa";
import { visualizer } from "rollup-plugin-visualizer";
import { babelOptimizerPlugin } from "@graphql-codegen/client-preset";

export default defineConfig({
  build: {
    outDir: "build",
    rollupOptions: {
      output: {
        manualChunks: {
          react: ["react", "react-router-dom", "react-dom"],
          mui: ["@mui/material"],
          muiIcons: ["@mui/icons-material"],
          muiStyles: ["@mui/styles"],
          lexical: ["lexical"],
          apollo: ["@apollo/client"],
          lodash: ["lodash"],
          graphql: ["graphql"],
          prismjs: ["prismjs"]
        }
      }
    }
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
              modules: ["@mui/material", "@mui/icons-material"]
            }
          ],
          [
            babelOptimizerPlugin,
            { artifactDirectory: "./src/gql", gqlTagName: "gql" }
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
    splitVendorChunkPlugin(),
    visualizer({ gzipSize: true }) as PluginOption
  ]
});
