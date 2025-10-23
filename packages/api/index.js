import express from "express"
import cors from "cors"
import WebSocket, { WebSocketServer } from "ws"

const app = express()
app.use(cors())
app.use(express.json())
app.use(express.urlencoded({ extended: true }))

const WS_PORT = 4001
const wss = new WebSocketServer({ port: 4001 })
console.log(`🌐 WS server rodando em ws://localhost:${WS_PORT}`)

let wsClient = null

wss.on("connection", (ws) => {
  wsClient = ws
  console.log("🟢 Extensão conectada via WS")

  ws.on("close", () => {
    wsClient = null
    console.log("🔴 Extensão desconectada")
  })

  ws.on("message", (raw) => handleWSMessage(raw))
})

function handleWSMessage(raw) {
  try {
    const msg = JSON.parse(raw)
    if (!msg.type) return

    if (msg.type === "FLUIG_METHOD_CALL") {
      console.log(`📌 Método chamado: ${msg.fluigFunctionPath}`, msg.args)
    }

    if (msg.type === "FLUIG_METHOD_RESULT") {
      console.log("📨 Resultado recebido da extensão:", msg)
      // Com cliente único, não precisamos broadcast
    }
  } catch (err) {
    console.error("❌ Erro ao processar mensagem WS:", err)
  }
}

async function callFluigMethod(fluigFunctionPath, args = []) {
  if (!wsClient || wsClient.readyState !== WebSocket.OPEN)
    throw new Error("Extensão não conectada")

  return new Promise((resolve, reject) => {
    const id = Date.now() + "_" + Math.random().toString(16).slice(2)
    const msg = { type: "FLUIG_METHOD_CALL", id, fluigFunctionPath, args }

    const handleMessage = (raw) => {
      try {
        const m = JSON.parse(raw)
        if (m.type === "FLUIG_METHOD_RESULT" && m.id === id) {
          wsClient.off("message", handleMessage)
          if (m.error) reject(new Error(m.error))
          else resolve(m.result)
        }
      } catch (err) {
        console.error("❌ Erro ao parsear resposta WS:", err)
      }
    }

    wsClient.on("message", handleMessage)
    wsClient.send(JSON.stringify(msg))
  })
}

app.post("/fluig-proxy", async (req, res) => {
  const { fluigFunctionPath, args } = req.body
  console.log(`📌 [HTTP] Método solicitado: ${fluigFunctionPath}`, args)

  try {
    const result = await callFluigMethod(fluigFunctionPath, args)
    res.json({ result })
  } catch (err) {
    console.error(`❌ Erro ao processar ${fluigFunctionPath}:`, err)
    res.json({ error: err.message })
  }
})

const PORT = process.env.PORT || 4000
app.listen(PORT, () => {
  console.log(`✅ Fluig proxy iniciado em http://localhost:${PORT}`)
})
