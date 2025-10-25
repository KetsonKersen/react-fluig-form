import express from "express"
import cors from "cors"
import { wsExtension } from "./ws-extension.js"
import { getStatus } from "./status.js"

const app = express()
app.use(cors())
app.use(express.json())
app.use(express.urlencoded({ extended: true }))

app.post("/fluig-proxy", async (req, res) => {
  const { fluigFunctionPath, args } = req.body
  const { fluigPageActive } = getStatus()

  if (!fluigPageActive)
    return res.json({ error: "Página Fluig não está aberta" })

  const id = Date.now() + "_" + Math.random().toString(16).slice(2)
  const msg = { type: "FLUIG_METHOD_CALL", id, fluigFunctionPath, args }

  wsExtension.once("message", (raw) => {
    const m = JSON.parse(raw)
    if (m.id === id)
      res.json(m.error ? { error: m.error } : { result: m.result })
  })

  wsExtension.send(JSON.stringify(msg))
})

export default app
