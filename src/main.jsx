import { createRoot } from "react-dom/client"
import App from "./App.jsx"
import "./index.css"
import {
  FluigApiProvider,
  FluigRuntimeProvider,
  SchemaRegistryProvider,
} from "@fluig-kit/ecm"

import "diefra_ecm_ui/style.css"
import { schemaBase } from "./form/schemas/schema.js"

const DEV_CONFIG = {
  enabled: true,
  activityId: 0,
  isDev: true,
  isView: false,
  // previousActivityId: 0,
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
        <SchemaRegistryProvider>
          <App />
        </SchemaRegistryProvider>
      </FluigApiProvider>
    </FluigRuntimeProvider>,
  )
})()
