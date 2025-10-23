import chalk from "chalk"

const levels = {
  info: chalk.cyan,
  warn: chalk.yellow,
  error: chalk.red,
  success: chalk.green,
}

export function createLogger(context = "APP") {
  function log(level, ...args) {
    const levelColor = levels[level] || ((s) => s)
    const contextColor = chalk.green

    console.log(
      contextColor(`[${context}]`),
      levelColor(`[${level.toUpperCase()}]`),
      ...args
    )
  }

  return {
    info: (...args) => log("info", ...args),
    warn: (...args) => log("warn", ...args),
    error: (...args) => log("error", ...args),
    success: (...args) => log("success", ...args),
  }
}
