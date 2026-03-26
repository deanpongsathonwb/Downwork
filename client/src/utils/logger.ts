type LogLevel = 'debug' | 'info' | 'warn' | 'error'

interface LogEntry {
  level: LogLevel
  message: string
  context?: string
  data?: unknown
  timestamp: string
}

const IS_DEV = import.meta.env.DEV
const IS_PROD = import.meta.env.PROD

// ── External error-tracking hook ────────────────────────────
// Set via `logger.setExternalHandler()` during app bootstrap
// so Sentry / Datadog / LogRocket can capture warn + error.
type ExternalLogHandler = (entry: LogEntry) => void
let externalHandler: ExternalLogHandler | null = null

function formatEntry(entry: LogEntry): string {
  const prefix = entry.context ? `[${entry.context}]` : ''
  return `${entry.timestamp} ${entry.level.toUpperCase()} ${prefix} ${entry.message}`
}

function createEntry(level: LogLevel, message: string, context?: string, data?: unknown): LogEntry {
  return { level, message, context, data, timestamp: new Date().toISOString() }
}

function send(entry: LogEntry): void {
  const formatted = formatEntry(entry)

  if (!IS_PROD) {
    switch (entry.level) {
      case 'debug':
        if (IS_DEV) console.debug(formatted, entry.data ?? '')
        break
      case 'info':
        console.info(formatted, entry.data ?? '')
        break
      case 'warn':
        console.warn(formatted, entry.data ?? '')
        break
      case 'error':
        console.error(formatted, entry.data ?? '')
        break
    }
  }

  if (externalHandler && (entry.level === 'warn' || entry.level === 'error')) {
    externalHandler(entry)
  }
}

export const logger = {
  debug(message: string, data?: unknown, context?: string): void {
    send(createEntry('debug', message, context, data))
  },

  info(message: string, data?: unknown, context?: string): void {
    send(createEntry('info', message, context, data))
  },

  warn(message: string, data?: unknown, context?: string): void {
    send(createEntry('warn', message, context, data))
  },

  error(message: string, data?: unknown, context?: string): void {
    send(createEntry('error', message, context, data))
  },

  /** Convenience: log a caught error with optional context label */
  catch(err: unknown, context?: string): void {
    const message = err instanceof Error ? err.message : String(err)
    send(createEntry('error', message, context, err))
  },

  /**
   * Register an external handler (e.g. Sentry) that receives
   * warn and error entries in production.
   */
  setExternalHandler(handler: ExternalLogHandler): void {
    externalHandler = handler
  },
}
