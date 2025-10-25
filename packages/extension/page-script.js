;(function () {
  if (!parent) return

  const WS_URL = "ws://localhost:4001"
  const ws = new WebSocket(WS_URL)

  ws.onopen = () => {
    console.log("🟢 Extensão conectada ao backend")
    const userActive = window.WCMAPI.getUser()
    ws.send(
      JSON.stringify({
        type: "PAGE_STATUS",
        connected: true,
        userActive,
      })
    )
  }

  ws.onclose = () => {
    console.log("🔴 Conexão WS encerrada")
  }

  // antes da aba fechar, informa desconexão
  window.addEventListener("beforeunload", () => {
    ws.send(JSON.stringify({ type: "PAGE_STATUS", connected: false }))
  })

  async function parseMessageSafely(data) {
    try {
      if (!data) return null
      if (typeof data === "string") return JSON.parse(data)
      if (data instanceof Blob) return JSON.parse(await data.text())
    } catch {
      return null
    }
  }

  function getNestedProperty(obj, path) {
    return path ? path.split(".").reduce((acc, key) => acc?.[key], obj) : obj
  }

  async function executeFluigFunction(fluigFunctionPath, args = []) {
    const fn = getNestedProperty(parent, fluigFunctionPath)
    if (typeof fn !== "function")
      throw new Error("Função inválida ou inexistente")

    const contextPath = fluigFunctionPath.split(".").slice(0, -1).join(".")
    const context = getNestedProperty(parent, contextPath)

    return await fn.apply(context, args)
  }

  ws.onmessage = async (event) => {
    const msg = await parseMessageSafely(event.data)
    if (!msg || msg.type !== "FLUIG_METHOD_CALL") return

    const { id, fluigFunctionPath, args } = msg
    let result, error

    try {
      result = await executeFluigFunction(fluigFunctionPath, args)
    } catch (err) {
      error = err.message
    }

    ws.send(
      JSON.stringify({
        type: "FLUIG_METHOD_RESULT",
        id,
        fluigFunctionPath,
        args,
        result,
        error,
      })
    )
  }
})()
