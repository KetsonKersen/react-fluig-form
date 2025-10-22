;(function () {
  if (!parent) return

  const ws = new WebSocket("ws://localhost:4001")

  ws.onopen = () => console.log("🟢 Extensão conectada ao WS backend")

  async function safeParseMessage(data) {
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

  ws.onmessage = async (event) => {
    const msg = await safeParseMessage(event.data)
    if (!msg || !msg.type) return

    try {
      if (msg.type === "WCMAPI_CALL") {
        const { id, method, args } = msg
        let result, error

        try {
          const fn = getNestedProperty(parent, method)
          console.log("🧩 Método solicitado:", method)
          console.log("🔍 Função resolvida:", fn)
          console.log("chamada direta:", parent.window.WCMAPI.getUser())

          if (typeof fn !== "function")
            throw new Error(`${method} não é uma função`)

          // 🔹 Corrige o contexto de execução (this)
          const context = method.includes("WCMAPI.")
            ? getNestedProperty(
                parent,
                method.split(".").slice(0, -1).join(".")
              )
            : parent

          result = await fn.apply(context, args || [])
        } catch (err) {
          error = err.message
        }

        console.log("📤 Enviando resultado ao backend:", { id, result, error })
        ws.send(JSON.stringify({ type: "WCMAPI_RESULT", id, result, error }))
      }
    } catch (err) {
      console.error("❌ Erro no WS da extensão:", err)
    }
  }
})()
