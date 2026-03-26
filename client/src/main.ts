import { createApp } from 'vue'
import * as Sentry from '@sentry/vue'
import App from './App.vue'
import router from './router'
import { installPinia } from './plugins/pinia.plugin'
import { validateEnv } from './utils/env'
import { logger } from './utils/logger'
import { APP_CONFIG } from './config/app.config'

// ── Global CSS ───────────────────────────────────────────────
import './assets/main.css'

// ============================================================
// APPLICATION BOOTSTRAP
// ============================================================

// 0. Environment validation — fail fast if mis-configured
validateEnv()

const app = createApp(App)

// ── Sentry ────────────────────────────────────────────────────
if (APP_CONFIG.sentryDsn) {
  Sentry.init({
    app,
    dsn: APP_CONFIG.sentryDsn,
    integrations: [Sentry.browserTracingIntegration({ router })],
    tracesSampleRate: APP_CONFIG.isProd ? 0.2 : 1.0,
    replaysSessionSampleRate: 0,
    replaysOnErrorSampleRate: APP_CONFIG.isProd ? 1.0 : 0,
    environment: APP_CONFIG.mode,
    release: `downwork-client@${APP_CONFIG.version}`,
  })
}

// ── Global error handler ─────────────────────────────────────
app.config.errorHandler = (err, instance, info) => {
  logger.error(
    `Unhandled error: ${err instanceof Error ? err.message : String(err)}`,
    { err, component: instance?.$options?.name, info },
    'Vue:ErrorHandler',
  )
}

if (APP_CONFIG.isDev) {
  app.config.performance = true
}

// 1. Pinia (must be before router since guards use stores)
installPinia(app)

// 2. Router
app.use(router)

// 3. Mount
app.mount('#app')

if (APP_CONFIG.isDev) {
  logger.info(`Downwork v${APP_CONFIG.version} [${APP_CONFIG.mode}]`, undefined, 'Bootstrap')
}
