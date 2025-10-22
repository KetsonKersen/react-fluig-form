// src/WCMAPI.js
async function sendToExtension(method, args = []) {
  try {
    const res = await fetch("http://localhost:4000/wcmapi", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ method, args }),
    })
    const data = await res.json()
    if (data.error) throw new Error(data.error)
    return data.result
  } catch (err) {
    console.error(`[parentProxy] Erro ao chamar ${method}:`, err)
    return null
  }
}

function createDynamicProxy(path = []) {
  return new Proxy(function () {}, {
    get(_, prop) {
      return createDynamicProxy([...path, prop])
    },
    async apply(_, __, args) {
      const methodPath = path.join(".")
      const isBrowser = typeof window !== "undefined"
      const isLocalhost =
        isBrowser &&
        (window.location.hostname === "localhost" ||
          window.location.hostname === "127.0.0.1")

      // 1️⃣ Dev local → envia para extensão Node
      if (isLocalhost) {
        console.log(
          `[parentProxy] Dev local - chamando extensão: ${methodPath}`,
          args
        )
        return await sendToExtension(methodPath, args)
      }

      // 2️⃣ Fluig → tenta window e parent.window
      const contexts = [window]
      if (parent?.window) contexts.push(parent.window)

      let target, ctxUsed
      for (const ctx of contexts) {
        ctxUsed = ctx
        target = ctx
        // console.log(
        //   `[parentProxy] Tentando contexto: ${
        //     ctx === window ? "window" : "parent.window"
        //   }`
        // )

        for (const segment of path) {
          target = target?.[segment]
          if (!target) break
        }

        // if (target) {
        //   console.log(
        //     `[parentProxy] Contexto válido encontrado em: ${
        //       ctx === window ? "window" : "parent.window"
        //     }`
        //   )
        //   break
        // }
      }

      if (!target) {
        console.warn(`[parentProxy] Propriedade não encontrada: ${methodPath}`)
        return undefined
      }

      if (typeof target === "function") {
        try {
          // 🔹 Corrige contexto para funções (this)
          const context =
            path.length > 1 ? ctxUsed?.[path[path.length - 2]] : ctxUsed
          return target.apply(context, args)
        } catch (err) {
          console.warn(`[parentProxy] Erro ao executar ${methodPath}:`, err)
          return undefined
        }
      }

      return target
    },
  })
}

// Exporta o proxy principal
export const parentProxy = createDynamicProxy()

if (typeof window !== "undefined" && !window.parentProxy) {
  window.parentProxy = parentProxy
}
