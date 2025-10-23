import { defineConfig, loadEnv } from "vite"
import react from "@vitejs/plugin-react"
import path from "path"
import dotenv from "dotenv"

dotenv.config({ path: path.resolve(__dirname, "../../.env"), quiet: true })

const env = loadEnv(process.env.NODE_ENV, path.resolve(__dirname, "../../"), "")

export default defineConfig({
  plugins: [react()],
  logLevel: "info",
  define: {
    "import.meta.env.VITE_FLUIG_BASE_URL": JSON.stringify(
      env.VITE_FLUIG_BASE_URL
    ),
  },
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
})
