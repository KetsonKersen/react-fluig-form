;(function () {
  if (!parent) return

  const WS_URL = "ws://localhost:4001"
  const ws = new WebSocket(WS_URL)

  ws.onopen = () =>
    console.log(`🟢 Extensão conectada ao WS backend (${WS_URL})`)

  async function parseMessageSafely(data) {
    try {
      if (!data) return null
      if (typeof data === "string" && data.trim()) return JSON.parse(data)
      if (data instanceof Blob && data.size > 0) {
        const text = await data.text()
        return JSON.parse(text)
      }
      return null
    } catch (err) {
      console.warn("⚠️ Mensagem WS inválida ou incompleta:", data)
      return null
    }
  }

  function getNestedProperty(obj, path) {
    return path.split(".").reduce((acc, key) => acc?.[key], obj)
  }

  async function executeFluigFunction(fluigFunctionPath, args = []) {
    const fn = getNestedProperty(parent, fluigFunctionPath)
    if (typeof fn !== "function") {
      throw new Error(`${fluigFunctionPath} não é uma função`)
    }

    const context = fluigFunctionPath.includes("WCMAPI.")
      ? getNestedProperty(
          parent,
          fluigFunctionPath.split(".").slice(0, -1).join(".")
        )
      : parent

    return await fn.apply(context, args)
  }

  async function handleWSMessage(event) {
    const msg = await parseMessageSafely(event.data)
    if (!msg || !msg.type) return

    if (msg.type === "FLUIG_METHOD_CALL") {
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
          result,
          error,
        })
      )
    }
  }

  ws.onmessage = handleWSMessage
})()
