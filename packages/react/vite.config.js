import { defineConfig } from "vite"
import react from "@vitejs/plugin-react"
import path from "path"
import dotenv from "dotenv"
dotenv.config()

export default defineConfig({
  plugins: [react()],
  build: {
    outDir: "dist",
    rollupOptions: {
      input: path.resolve(__dirname, "src/main.jsx"),
      output: {
        entryFileNames: "bundle.js",
        assetFileNames: (assetInfo) => {
          if (assetInfo.name && assetInfo.name.endsWith(".css")) {
            return "[name].[ext]"
          }
          return "assets/[name].[ext]"
        },
      },
    },
  },
  // server: {
  //   port: 5173,
  //   proxy: {
  //     "/api": {
  //       target: process.env.VITE_FLUIG_BASE_URL,
  //       changeOrigin: true,
  //       secure: false,
  //     },
  //     "/portal": {
  //       target: process.env.VITE_FLUIG_BASE_URL,
  //       changeOrigin: true,
  //       secure: false,
  //     },
  //   },
  // },
})
