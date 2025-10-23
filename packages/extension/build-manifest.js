import fs from "fs"
import path from "path"
import dotenv from "dotenv"

const rootEnv = path.resolve(process.cwd(), ".env")
dotenv.config({ path: rootEnv, debug: false })

const extRoot = path.resolve("packages/extension")
const templatePath = path.join(extRoot, "manifest.template.json")
const outputPath = path.join(extRoot, "manifest.json")

if (!fs.existsSync(path.dirname(outputPath))) {
  fs.mkdirSync(path.dirname(outputPath), { recursive: true })
}

const template = fs.readFileSync(templatePath, "utf-8")
const result = template.replaceAll(
  "{{FLUIG_DOMAIN}}",
  process.env.VITE_FLUIG_DOMAIN
)

fs.writeFileSync(outputPath, result)

console.log(
  `✅ [extension] manifest.json gerado para ${process.env.VITE_FLUIG_DOMAIN}`
)
