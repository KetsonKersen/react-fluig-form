const WebSocket = require("ws")

const wss = new WebSocket.Server({ port: 4001 })
console.log("🌐 WS da extensão rodando em ws://localhost:4001")

wss.on("connection", (ws) => {
  console.log("🟢 Cliente React conectado")

  ws.on("message", async (msg) => {
    const { id, type, payload } = JSON.parse(msg)
    console.log("📩 Mensagem recebida do React:", type, payload)

    // Exemplo: apenas devolve a mensagem
    ws.send(JSON.stringify({ id, result: `Recebido na extensão: ${payload}` }))
  })

  ws.on("close", () => console.log("🔴 Cliente React desconectado"))
})
