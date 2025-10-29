import express from "express"
import cors from "cors"
import axios from "axios"
import OAuth from "oauth-1.0a"
import crypto from "crypto"
import { wsExtension } from "./ws-extension.js"
import { getStatus } from "./status.js"
import dotenv from "dotenv"
import { fileURLToPath } from "url"
import path from "path"

const __filename = fileURLToPath(import.meta.url)
const __dirname = path.dirname(__filename)
const envPath = path.resolve(__dirname, "../../../.env")
dotenv.config({ path: envPath })

const app = express()
app.use(cors())
app.use(express.json())
app.use(express.urlencoded({ extended: true }))

///////////////////////
// CONFIGURAÇÃO OAUTH
///////////////////////
const FLUIG_BASE_URL = process.env.VITE_FLUIG_BASE_URL
const CONSUMER_KEY = process.env.CONSUMER_KEY
const CONSUMER_SECRET = process.env.CONSUMER_SECRET
const ACCESS_TOKEN = process.env.ACCESS_TOKEN
const TOKEN_SECRET = process.env.TOKEN_SECRET

console.log("FLUIG_BASE_URL", FLUIG_BASE_URL)

const oauth = OAuth({
  consumer: { key: CONSUMER_KEY, secret: CONSUMER_SECRET },
  signature_method: "HMAC-SHA1",
  hash_function(base_string, key) {
    return crypto.createHmac("sha1", key).update(base_string).digest("base64")
  },
})

const token = { key: ACCESS_TOKEN, secret: TOKEN_SECRET }

///////////////////////
// ENDPOINT 1: WebSocket/Extensão
///////////////////////
app.post("/fluig-proxy-ext", async (req, res) => {
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

///////////////////////
// ENDPOINT 2: HTTP OAuth para API do Fluig
///////////////////////
app.post("/fluig-proxy-api", async (req, res) => {
  const { path, method = "GET", body: requestBody } = req.body
  if (!path)
    return res.status(400).json({ error: "Informe o 'path' da API Fluig" })

  try {
    const targetUrl = `${FLUIG_BASE_URL}${
      path.startsWith("/") ? path : "/" + path
    }`

    const requestData = { url: targetUrl, method }
    const authHeader = oauth.toHeader(
      oauth.authorize(requestData, token)
    ).Authorization

    const response = await axios({
      url: targetUrl,
      method,
      headers: {
        Authorization: authHeader,
        "Content-Type": "application/json",
      },
      data: requestBody,
      validateStatus: () => true,
      timeout: 30000,
    })

    res.status(response.status).json(response.data)
  } catch (err) {
    console.error("Erro no proxy HTTP:", err.message)
    res.status(500).json({ error: err.message })
  }
})

export default app
