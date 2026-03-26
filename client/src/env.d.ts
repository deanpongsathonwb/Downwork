/// <reference types="vite/client" />

interface ImportMetaEnv {
  /** App public URL (e.g. https://downwork.com) */
  readonly VITE_APP_URL: string
  /** Display name shown in UI chrome */
  readonly VITE_APP_NAME: string
  /** Backend REST API base URL */
  readonly VITE_API_BASE_URL: string

  /** Enable mock interceptor — MUST be "false" in production */
  readonly VITE_USE_MOCK: 'true' | 'false'
  /** Use httpOnly cookie auth instead of localStorage tokens */
  readonly VITE_USE_COOKIE_AUTH: 'true' | 'false'

  /** Feature: two-factor authentication */
  readonly VITE_ENABLE_2FA: 'true' | 'false'
  /** Feature: analytics / tracking */
  readonly VITE_ENABLE_ANALYTICS: 'true' | 'false'

  /** Sentry DSN — leave empty to disable error tracking */
  readonly VITE_SENTRY_DSN?: string
}

interface ImportMeta {
  readonly env: ImportMetaEnv
}

declare const __APP_VERSION__: string
declare const __APP_MODE__: string

declare module '*.vue' {
  import type { DefineComponent } from 'vue'
  const component: DefineComponent<Record<string, unknown>, Record<string, unknown>, unknown>
  export default component
}
