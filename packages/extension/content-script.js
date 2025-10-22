// content-script.js (este roda no contexto da extensão / content script)
try {
  const src = chrome.runtime.getURL("page-script.js")
  const s = document.createElement("script")
  s.src = src
  s.onload = () => {
    // opcional: remover após carregar para limpeza
    s.remove()
  }
  ;(document.head || document.documentElement).appendChild(s)
  console.log("[ext] page-script.js injetado:", src)
} catch (err) {
  console.error("[ext] falha ao injetar page-script.js", err)
}
