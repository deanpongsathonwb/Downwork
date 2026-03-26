// ============================================================
// ENVIRONMENT VALIDATION
// Runs once at app startup — fails fast if config is invalid.
// ============================================================

const IS_PROD = import.meta.env.PROD
const MODE = import.meta.env.MODE

interface EnvRule {
  key: string
  required: boolean
  validate?: (value: string | undefined) => string | null
}

const rules: EnvRule[] = [
  { key: 'VITE_APP_URL', required: true },
  { key: 'VITE_APP_NAME', required: true },
  {
    key: 'VITE_API_BASE_URL',
    required: true,
    validate: (v) => {
      if (IS_PROD && v && /localhost|127\.0\.0\.1/.test(v)) {
        return 'must not point to localhost in production'
      }
      return null
    },
  },
  {
    key: 'VITE_USE_MOCK',
    required: false,
    validate: (v) => {
      if (IS_PROD && v === 'true') {
        console.warn('[Downwork] Mock API is enabled in production — disable when backend is ready')
      }
      return null
    },
  },
]

export function validateEnv(): void {
  const errors: string[] = []

  for (const rule of rules) {
    const value = import.meta.env[rule.key as keyof ImportMetaEnv] as string | undefined

    if (rule.required && !value) {
      errors.push(`${rule.key} is required but not set`)
      continue
    }

    if (rule.validate) {
      const msg = rule.validate(value)
      if (msg) errors.push(`${rule.key}: ${msg}`)
    }
  }

  if (errors.length > 0) {
    const banner = `[Downwork] Environment validation failed (mode=${MODE}):\n  - ${errors.join('\n  - ')}`

    if (IS_PROD) {
      throw new Error(banner)
    }

    console.warn(banner)
  }
}
