require("ignore-styles")

require("@babel/register")({
  extensions: [".js", ".jsx", ".ts", ".tsx"],
  presets: [
    ["@babel/preset-env", { targets: { node: "current" } }],
    "@babel/preset-react",
  ],
  cache: false,
})
// ❗ Ignora imports de CSS
require.extensions[".css"] = () => {}

// ❗ Faz stub de componentes React no build (Node não precisa deles)
require.extensions[".jsx"] = function (module, filename) {
  module._compile("module.exports = () => null;", filename)
}
require.extensions[".tsx"] = require.extensions[".jsx"]

const fs = require("fs")
const path = require("path")

const { SECTIONS_REGISTRY } = require("./src/workflow/workflowStructure")
const { generateHtmlTemplate } = require("@fluig-kit/ecm/node")

const rootPackageJson = path.resolve(__dirname, ".", "package.json")
const pkg = JSON.parse(fs.readFileSync(rootPackageJson, "utf-8"))
const FormName = pkg.name

try {
  const ALL_SCHEMAS = Object.values([])
    .map((s) => s.schema)
    .filter(Boolean)

  const finalHtml = generateHtmlTemplate(ALL_SCHEMAS)
  const distPath = path.resolve(__dirname, `./forms/${FormName}/form.html`)

  fs.mkdirSync(path.dirname(distPath), { recursive: true })
  fs.writeFileSync(distPath, finalHtml)

  console.log("✅ form.html gerado com sucesso!")
} catch (error) {
  console.error("❌ Erro ao gerar o HTML:", error)
  process.exit(1)
}
