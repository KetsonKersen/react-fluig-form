require("@babel/register")({
  extensions: [".js", ".jsx"],
  presets: ["@babel/preset-env", "@babel/preset-react"],
})

const fs = require("fs")
const path = require("path")
const React = require("react")
const { renderToStaticMarkup } = require("react-dom/server")
const App = require("../src/App.jsx").default

// Lê o package.json raiz
const rootPackageJson = path.resolve(__dirname, "../../..", "package.json")
const pkg = JSON.parse(fs.readFileSync(rootPackageJson, "utf-8"))
const FormName = pkg.name

const formHTML = renderToStaticMarkup(React.createElement(App))

const finalHtml = `
<html lang="pt-br">
  <head>
    <link rel="stylesheet" href="/portal/style-guide/css/fluig-style-guide.min.css">
    <script type="text/javascript" src="/portal/resources/js/jquery/jquery.js"></script>
    <script type="text/javascript" src="/portal/resources/js/jquery/jquery-ui.min.js"></script>
    <script type="text/javascript" src="/portal/resources/js/mustache/mustache-min.js"></script>
    <script type="text/javascript" src="/style-guide/js/fluig-style-guide.min.js" charset="utf-8"></script>
    <link rel="stylesheet" crossorigin href="./main.css">
  </head>
  <body>
    <div id="root">${formHTML}</div>
    <script type="text/javascript" src="./bundle.js"></script>
  </body>
</html>
`

const distPath = path.resolve(__dirname, `../../../forms/${FormName}/form.html`)

fs.mkdirSync(path.dirname(distPath), { recursive: true })
fs.writeFileSync(distPath, finalHtml)

console.log("form.html gerado com sucesso!")
console.log("✅ Build realizado com sucesso!")
