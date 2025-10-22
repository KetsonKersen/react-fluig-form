import fs from "fs-extra"
import path from "path"
import inquirer from "inquirer"

console.log("🚀 Criando novo projeto React Fluig...")

// Perguntas básicas
const answers = await inquirer.prompt([
  { name: "name", message: "Nome do projeto:", default: "my-fluig-app" },
])

const targetDir = path.join(process.cwd(), answers.name)
await fs.copy(path.join(process.cwd(), "packages/front"), targetDir)

console.log(`✅ Projeto criado em ${targetDir}`)
console.log(
  "📦 Rode npm install dentro da pasta do projeto e npm run dev para iniciar!"
)
