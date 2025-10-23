async function searchFluigExtension(fluigFunctionPath, args = []) {
  try {
    const res = await fetch("http://localhost:4000/fluig-proxy", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ fluigFunctionPath, args }),
    })
    const data = await res.json()
    if (data.error) throw new Error(data.error)
    return data.result
  } catch (err) {
    console.error(`[parentProxy] Erro ao chamar ${fluigFunctionPath}:`, err)
    return null
  }
}

function getFunctionContext(rootContext, path) {
  if (path.length < 2) return rootContext
  return (
    path.slice(0, -1).reduce((acc, key) => acc?.[key], rootContext) ||
    rootContext
  )
}

function findTargetInContexts(path) {
  const contexts = [window]
  if (parent?.window) contexts.push(parent.window)

  for (const ctx of contexts) {
    let target = ctx
    for (const segment of path) {
      target = target?.[segment]
      if (!target) break
    }
    if (target) return { target, ctx }
  }
  return { target: undefined, ctx: undefined }
}

function createDynamicProxy(path = []) {
  const proxyHandler = {
    get(_, prop) {
      return createDynamicProxy([...path, prop])
    },
    async apply(_, __, args) {
      const functionPath = path.join(".")
      const isLocalhost =
        typeof window !== "undefined" &&
        (window.location.hostname === "localhost" ||
          window.location.hostname === "127.0.0.1")

      if (isLocalhost) {
        console.log(
          `[parentProxy] Dev local - chamando extensão: ${functionPath}`,
          args
        )
        return await searchFluigExtension(functionPath, args)
      }

      const { target, ctx } = findTargetInContexts(path)
      if (!target) {
        console.warn(`[parentProxy] Função não encontrada: ${functionPath}`)
        return undefined
      }

      if (typeof target === "function") {
        try {
          const context = getFunctionContext(ctx, path)
          return target.apply(context, args)
        } catch (err) {
          console.warn(`[parentProxy] Erro ao executar ${functionPath}:`, err)
          return undefined
        }
      }

      console.warn(
        `[parentProxy] Valor acessado não é função: ${functionPath}`,
        target
      )
      return target
    },
  }

  return new Proxy(function () {}, proxyHandler)
}

export const parentProxy = createDynamicProxy()
if (typeof window !== "undefined" && !window.parentProxy)
  window.parentProxy = parentProxy
