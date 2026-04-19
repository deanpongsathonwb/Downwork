// ============================================================
// APPLICATION CONFIGURATION
// ============================================================

const IS_PROD = import.meta.env.PROD

function requireEnv(key: string, fallback: string): string {
  const value = import.meta.env[key as keyof ImportMetaEnv] as string | undefined
  if (value) return value
  if (IS_PROD) throw new Error(`[Downwork] Missing required env: ${key}`)
  return fallback
}

export const APP_CONFIG = {
  name: import.meta.env.VITE_APP_NAME ?? 'Downwork',
  version: typeof __APP_VERSION__ !== 'undefined' ? __APP_VERSION__ : '0.0.0',
  mode: import.meta.env.MODE as 'development' | 'staging' | 'production',
  isProd: IS_PROD,
  isDev: import.meta.env.DEV,
  description: 'Professional Freelance Marketplace',
  baseUrl: requireEnv('VITE_APP_URL', 'http://localhost:1997'),
  apiBaseUrl: requireEnv('VITE_API_BASE_URL', 'http://localhost:3000/api/v1'),
  apiTimeout: 30_000,
  sentryDsn: import.meta.env.VITE_SENTRY_DSN ?? '',
} as const

export const AUTH_CONFIG = {
  accessTokenKey: 'fh_access_token',
  refreshTokenKey: 'fh_refresh_token',
  userKey: 'fh_user',
  tokenRefreshThresholdMs: 5 * 60 * 1000, // refresh 5 min before expiry
  sessionTtlMs: 60 * 60 * 1000, // 1 hour access token lifetime (mock)
} as const

export const PAGINATION_CONFIG = {
  defaultLimit: 12,
  limitOptions: [12, 24, 48, 96],
} as const

export const UPLOAD_CONFIG = {
  maxFileSizeMb: 50,
  allowedImageTypes: ['image/jpeg', 'image/png', 'image/webp', 'image/gif'],
  allowedDocTypes: ['application/pdf', 'application/msword', 'application/vnd.openxmlformats-officedocument.wordprocessingml.document'],
  maxFilesPerUpload: 5,
} as const

export const PLATFORM_CONFIG = {
  serviceFeePct: 20, // 20% platform fee
  minWithdrawalAmount: 50,
  currencies: ['USD', 'EUR', 'GBP', 'AUD', 'CAD'],
  defaultCurrency: 'USD',
} as const

export const TOAST_CONFIG = {
  defaultDuration: 4000,
  maxToasts: 5,
  /** Popup toasts app-wide. Opt in with `VITE_ENABLE_TOASTS=true` in env (.env.development.local, etc.). */
  enabled: import.meta.env.VITE_ENABLE_TOASTS === 'true',
} as const
