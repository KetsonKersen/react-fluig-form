import { defineConfig, loadEnv } from "vite"
import react from "@vitejs/plugin-react"
import path from "path"
import dotenv from "dotenv"
import { fileURLToPath } from "url"
import fs from "fs"

const __filename = fileURLToPath(import.meta.url)
const __dirname = path.dirname(__filename)

// Carrega .env
dotenv.config({ path: path.resolve(__dirname, ".env"), quiet: true })

const rootPackageJson = path.resolve(__dirname, ".", "package.json")
const pkg = JSON.parse(fs.readFileSync(rootPackageJson, "utf-8"))
const FormName = pkg.name

export default defineConfig(({ mode }) => {
  const env = loadEnv(mode, __dirname, "")
  const appRoot = __dirname

  return {
    plugins: [
      react(),
      // --- PLUGIN NOVO: Copia a extensão automaticamente ---
      {
        name: "copy-fluig-extension",
        buildStart() {
          // Caminho de origem: Onde a lib está instalada no node_modules
          const sourceDir = path.resolve(
            __dirname,
            "node_modules/@fluig-kit/extension/dist",
          )
          // Caminho de destino: A pasta que você quer criar na raiz
          const targetDir = path.resolve(__dirname, ".extension")

          if (fs.existsSync(sourceDir)) {
            // Se a pasta destino não existe, cria
            if (!fs.existsSync(targetDir)) {
              fs.mkdirSync(targetDir, { recursive: true })
            }

            // Copia todos os arquivos recursivamente
            fs.cpSync(sourceDir, targetDir, { recursive: true })

            console.log(
              `\n✅ [Fluig Kit] Extensão copiada com sucesso para: ${targetDir}\n`,
            )
          } else {
            console.warn(
              `\n⚠️ [Fluig Kit] Pasta 'dist' da extensão não encontrada em node_modules. Verifique se '@fluig-kit/extension' está instalado corretamente.\n`,
            )
          }
        },
      },
      // -----------------------------------------------------
    ],
    resolve: {
      dedupe: [
        "react",
        "react-dom",
        "react-hook-form",
        "@fluig-kit/ecm",
        "@fluig-kit/core",
        "date-fns",
      ],
      alias: {
        "@": path.resolve(appRoot, "src"),
      },
    },
    optimizeDeps: {
      include: ["@fluig-kit/extension", "react-imask", "react-datepicker"],
    },
    build: {
      outDir: `forms/${FormName}`,
      emptyOutDir: true,
      commonjsOptions: {
        transformMixedEsModules: true,
      },
      rollupOptions: {
        input: {
          bundle: path.resolve(__dirname, "src/main.jsx"),
          bridge: path.resolve(__dirname, "./bridge.js"),
        },

        output: {
          entryFileNames: (chunk) => {
            if (chunk.name === "bridge") {
              return "bridge.js"
            }
            return "bundle.js"
          },

          assetFileNames: (assetInfo) => {
            if (assetInfo.name?.endsWith(".css")) {
              return "[name].[ext]"
            }
            return "assets/[name].[ext]"
          },
        },
      },
    },
    define: {
      "import.meta.env.VITE_FLUIG_BASE_URL": JSON.stringify(
        env.VITE_FLUIG_BASE_URL,
      ),
    },
  }
})
