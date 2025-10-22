const express = require("express")
const cors = require("cors")
const WebSocket = require("ws")

const app = express()
app.use(cors())
app.use(express.json())
app.use(express.urlencoded({ extended: true })) // Express já tem
// --- WS CONFIG ---
const WS_PORT = 4001
const wss = new WebSocket.Server({ port: WS_PORT })
console.log(`🌐 WS server rodando em ws://localhost:${WS_PORT}`)

const clients = new Set()

// --- WS CONNECTION ---
wss.on("connection", (ws) => {
  clients.add(ws)
  console.log("🟢 Cliente conectado via WS")

  ws.on("close", () => {
    clients.delete(ws)
    console.log("🔴 Cliente desconectado")
  })

  ws.on("message", (raw) => {
    try {
      const msg = JSON.parse(raw)

      // Logs para debug
      if (msg.type === "WCMAPI_CALL") {
        console.log(`📌 Método chamado: ${msg.method}`, msg.args)
      }

      if (msg.type === "WCMAPI_RESULT") {
        console.log("📨 Resultado recebido da extensão:", msg)

        // Broadcast para todos os clientes React
        clients.forEach((client) => {
          if (client.readyState === WebSocket.OPEN) {
            client.send(JSON.stringify(msg.result)) // envia apenas o payload
          }
        })
      }
    } catch (err) {
      console.error("❌ Erro ao processar mensagem WS:", err)
    }
  })
})

// --- FUNÇÃO PARA CHAMAR EXTENSÃO VIA WS ---
async function sendToExtension(method, args = []) {
  return new Promise((resolve, reject) => {
    const ws = [...clients][0] // pega o primeiro cliente (extensão)
    if (!ws || ws.readyState !== WebSocket.OPEN)
      return reject(new Error("Extensão não conectada"))

    const id = Date.now() + "_" + Math.random().toString(16).slice(2)
    const msg = { type: "WCMAPI_CALL", id, method, args }

    const handleMessage = (raw) => {
      try {
        const m = JSON.parse(raw)
        if (m.type === "WCMAPI_RESULT" && m.id === id) {
          ws.off("message", handleMessage)
          if (m.error) reject(new Error(m.error))
          else resolve(m.result)
        }
      } catch (err) {
        console.error("❌ Erro ao parsear resposta WS:", err)
      }
    }

    ws.on("message", handleMessage)
    ws.send(JSON.stringify(msg))
  })
}

// --- ROTAS HTTP ---
app.post("/wcmapi", async (req, res) => {
  const { method, args } = req.body
  console.log(`📌 [HTTP] Método solicitado: ${method}`, args)

  try {
    const result = await sendToExtension(method, args)
    res.json({ result })
  } catch (err) {
    console.error(`❌ Erro ao processar ${method}:`, err)
    res.json({ error: err.message })
  }
})

// --- INICIALIZAÇÃO DO HTTP SERVER ---
const PORT = process.env.PORT || 4000
app.listen(PORT, () => {
  console.log(`✅ Fluig proxy iniciado em http://localhost:${PORT}`)
})
