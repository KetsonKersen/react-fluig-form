import { defineConfig, loadEnv } from "vite"
import react from "@vitejs/plugin-react"
import path from "path"
import dotenv from "dotenv"
import fs from "fs"

dotenv.config({ path: path.resolve(__dirname, "../../.env"), quiet: true })

const env = loadEnv(process.env.NODE_ENV, path.resolve(__dirname, "../../"), "")

// Lê o package.json raiz
const rootPackageJson = path.resolve(__dirname, "../..", "package.json")
const pkg = JSON.parse(fs.readFileSync(rootPackageJson, "utf-8"))
const FormName = pkg.name

export default defineConfig({
  plugins: [react()],
  logLevel: "info",
  resolve: {
    alias: {
      "@": path.resolve(__dirname, "src"),
      "@fluig-configs": path.resolve(__dirname, "fluig-configs"),
    },
  },

  define: {
    "import.meta.env.VITE_FLUIG_BASE_URL": JSON.stringify(
      env.VITE_FLUIG_BASE_URL
    ),
  },

  server: {
    fs: {
      allow: [
        path.resolve(__dirname),
        path.resolve(__dirname, "src"),
        path.resolve(__dirname, "fluig-configs"),
      ],
    },
  },

  build: {
    outDir: `../../forms/${FormName}`,
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
