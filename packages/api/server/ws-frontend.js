import { WebSocketServer } from "ws"
import { FRONT_WS_PORT } from "./constants.js"
import { getStatus, setFrontWss } from "./status.js"

export function initFrontendWS(logger) {
  const wss = new WebSocketServer({ port: FRONT_WS_PORT })
  setFrontWss(wss, logger)

  logger.success(`🧭 WS Frontend → ws://localhost:${FRONT_WS_PORT}`)

  wss.on("connection", (ws) => {
    logger.info("💻 Frontend conectado")

    const { fluigPageActive, userActive } = getStatus()
    ws.send(
      JSON.stringify({
        type: "EXTENSION_STATUS",
        connected: fluigPageActive,
        userActive,
      })
    )
  })

  return wss
}
