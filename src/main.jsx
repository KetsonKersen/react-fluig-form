import React from "react"
import { createRoot } from "react-dom/client"
import "./index.css"
import App from "./App.jsx"
// import { schemaBase } from "./form/schemas/schema.js"
import {
  FluigApiProvider,
  FluigRuntimeProvider,
  SchemaRegistryProvider,
} from "@fluig-kit/ecm"
import "@tech-diefra/fluig-ui/dist/style.css"

const DEV_CONFIG = {
  // enabled: true,
  // activityId: 6,
  // previousActivityId: 40,
  // isDev: true,
  // isView: false,
  // showDebugSubmit: true,
  // showDebugLogs: true,
}

const CONFIG_API = {
  baseURL: import.meta.env.VITE_FLUIG_BASE_URL,
  localProxyURL: "http://localhost:4000/fluig-proxy-api",
}

;(function initReactApp() {
  const rootEl = document.getElementById("root")
  if (!rootEl) return

  createRoot(rootEl).render(
    <FluigRuntimeProvider devConfig={DEV_CONFIG}>
      <FluigApiProvider config={CONFIG_API}>
        <SchemaRegistryProvider baseSchema={[]}>
          <App />
        </SchemaRegistryProvider>
      </FluigApiProvider>
    </FluigRuntimeProvider>,
  )
})()
