import { createLogger } from "../utils/logger.js"
import { HTTP_PORT } from "./server/constants.js"
import app from "./server/app.js"
import { initExtensionWS } from "./server/ws-extension.js"
import { initFrontendWS } from "./server/ws-frontend.js"
import { updateStatus } from "./server/status.js"

const logger = createLogger("API")

initExtensionWS(logger)
initFrontendWS(logger)

app.listen(HTTP_PORT, () => {
  logger.success(`✅ API Fluig iniciada em http://localhost:${HTTP_PORT}`)
  updateStatus(false, null)
})
