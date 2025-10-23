import fs from "fs"
import path from "path"
import React from "react"
import { renderToStaticMarkup } from "react-dom/server"
import App from "../src/App.jsx"

const renderApp = () => renderToStaticMarkup(React.createElement(App))

const buildHTML = (appHTML) => `<!DOCTYPE html>
<html lang="pt-br">
<head>
  <link rel="stylesheet" href="/portal/style-guide/css/fluig-style-guide.min.css">
  <script src="/portal/resources/js/jquery/jquery.js"></script>
  <script src="/portal/resources/js/jquery/jquery-ui.min.js"></script>
  <script src="/portal/resources/js/mustache/mustache-min.js"></script>
  <script src="/style-guide/js/fluig-style-guide.min.js" charset="utf-8"></script>
  <link rel="stylesheet" crossorigin href="./main.css">
</head>
<body>
  <div id="root">${appHTML}</div>
  <script src="./bundle.js"></script>
</body>
</html>`

const distPath = path.resolve("dist/form.html")
fs.mkdirSync(path.dirname(distPath), { recursive: true })
fs.writeFileSync(distPath, buildHTML(renderApp()))

console.log("✅ form.html gerado com sucesso!")
