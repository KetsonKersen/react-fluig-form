import WebSocket from "ws"

let fluigPageActive = false
let userActive = null
let frontWss = null
let logger = null

export function setFrontWss(wss, _logger) {
  frontWss = wss
  logger = _logger
}

export function updateStatus(connected, user) {
  const changed = fluigPageActive !== connected || userActive !== user
  if (!changed) return

  fluigPageActive = connected
  userActive = user

  logger.info(
    `${connected ? "🟢 Página Fluig ativada" : "🟢 Página Fluig desativada"}`
  )
  logger.info(`Usuário conectado: ${userActive || "nenhum"}`)

  broadcastStatus()
}

export function broadcastStatus() {
  if (!frontWss) return

  const payload = JSON.stringify({
    type: "EXTENSION_STATUS",
    connected: fluigPageActive,
    userActive,
  })

  frontWss.clients.forEach((client) => {
    if (client.readyState === WebSocket.OPEN) client.send(payload)
  })
}

export function getStatus() {
  return { fluigPageActive, userActive }
}
