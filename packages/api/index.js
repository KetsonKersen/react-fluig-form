import express from "express"
import cors from "cors"
import WebSocket, { WebSocketServer } from "ws"
import { createLogger } from "../utils/logger.js"

const logger = createLogger("API")
const app = express()
app.use(cors())
app.use(express.json())
app.use(express.urlencoded({ extended: true }))

const WS_PORT = 4001
const wss = new WebSocketServer({ port: WS_PORT })
logger.success(`🌐  WS server rodando em ws://localhost:${WS_PORT}`)

let wsClient = null
let extensionConnected = false

function updateExtensionStatus(connected) {
  if (extensionConnected !== connected) {
    extensionConnected = connected
    if (connected) logger.success("🟢 Extensão conectada")
    else logger.warn("🔴 Extensão desconectada. Aguardando conexão...")
  }
}

wss.on("connection", (ws) => {
  wsClient = ws
  updateExtensionStatus(true)
  ws.on("close", () => {
    wsClient = null
    updateExtensionStatus(false)
  })
  ws.on("message", (raw) => {
    if (!extensionConnected) return
    try {
      const msg = JSON.parse(raw)
      if (msg.type === "FLUIG_METHOD_CALL")
        logger.info(`Ⓜ️  Método chamado: ${msg.fluigFunctionPath}`, msg.args)
      if (msg.type === "FLUIG_METHOD_RESULT") {
        if (msg.error)
          logger.warn(`⛔ Resultado de ${msg.fluigFunctionPath}: ${msg.error}`)
        else
          logger.info(`🎯 Resultado de ${msg.fluigFunctionPath}:`, msg.result)
      }
    } catch (e) {
      logger.error("⛔ Erro ao processar mensagem WS:", e)
    }
  })
})

// HTTP Proxy
app.post("/fluig-proxy", async (req, res) => {
  const { fluigFunctionPath, args } = req.body
  if (!extensionConnected) return res.json({ error: "Extensão não conectada" })

  logger.info(`Ⓜ️  Método solicitado: ${fluigFunctionPath} - args:`, args)

  const id = Date.now() + "_" + Math.random().toString(16).slice(2)
  const msg = { type: "FLUIG_METHOD_CALL", id, fluigFunctionPath, args }

  wsClient.once("message", (raw) => {
    const m = JSON.parse(raw)
    if (m.id === id)
      res.json(m.error ? { error: m.error } : { result: m.result })
  })

  wsClient.send(JSON.stringify(msg))
})

const PORT = process.env.PORT || 4000
app.listen(
  PORT,
  () => logger.success(`✅ Fluig proxy iniciado em http://localhost:${PORT}`),
  logger.success("⚠️  Reinicie a pagina da extensão para se conectar...")
)

// Status inicial da extensão
updateExtensionStatus(false)
