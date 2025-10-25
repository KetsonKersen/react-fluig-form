import WebSocket, { WebSocketServer } from "ws"
import { EXTENSION_WS_PORT } from "./constants.js"
import { updateStatus } from "./status.js"
export let wsExtension = null

export function initExtensionWS(logger) {
  const wss = new WebSocketServer({ port: EXTENSION_WS_PORT })
  logger.success(`🌐 WS Extensão → ws://localhost:${EXTENSION_WS_PORT}`)

  wss.on("connection", (ws) => {
    wsExtension = ws
    ws.isAlive = true
    logger.success("🔗 Extensão conectada ao backend")

    ws.on("pong", () => (ws.isAlive = true))

    ws.on("close", () => {
      logger.warn("❌ Conexão com a extensão encerrada")
      updateStatus(false, null)
    })

    ws.on("message", async (raw) => {
      try {
        const msg = JSON.parse(raw)

        switch (msg.type) {
          case "PAGE_STATUS":
            updateStatus(msg.connected, msg.userActive)
            break
          case "FLUIG_METHOD_CALL":
            logger.info(`⚙️ Método chamado: ${msg.fluigFunctionPath}`)
            break
          case "FLUIG_METHOD_RESULT":
            logger.info(`🎯 Resultado recebido: ${msg.fluigFunctionPath}`)
            break
          default:
            logger.debug("📦 Mensagem ignorada:", msg)
        }
      } catch (err) {
        logger.error("❌ Erro ao processar mensagem WS:", err)
      }
    })
  })

  // Heartbeat
  setInterval(() => {
    wss.clients.forEach((ws) => {
      if (!ws.isAlive) {
        logger.warn("⚠️ WS da extensão inativo — desconectando...")
        ws.terminate()
        updateStatus(false, null)
      } else {
        ws.isAlive = false
        ws.ping()
      }
    })
  }, 5000)
}
