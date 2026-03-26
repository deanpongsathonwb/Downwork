import type { SelectOption } from '@/types'

// ── Shared option lists used across Settings pages ────────────

export const TIMEZONE_OPTIONS: SelectOption[] = [
  { label: 'Eastern Time (ET)', value: 'America/New_York' },
  { label: 'Central Time (CT)', value: 'America/Chicago' },
  { label: 'Pacific Time (PT)', value: 'America/Los_Angeles' },
  { label: 'UTC', value: 'UTC' },
  { label: 'London (GMT)', value: 'Europe/London' },
  { label: 'Bangkok (ICT)', value: 'Asia/Bangkok' },
]

export const LANGUAGE_OPTIONS: SelectOption[] = [
  { label: 'English', value: 'en' },
  { label: 'Thai', value: 'th' },
  { label: 'Spanish', value: 'es' },
  { label: 'French', value: 'fr' },
]

export const PAYMENT_METHOD_OPTIONS = [
  { value: 'bank_transfer', label: 'Bank Transfer', icon: '🏦' },
  { value: 'paypal', label: 'PayPal', icon: '🅿️' },
  { value: 'payoneer', label: 'Payoneer', icon: '💳' },
  { value: 'wise', label: 'Wise', icon: '💸' },
] as const

export const CURRENCY_OPTIONS: SelectOption[] = [
  { label: 'USD ($)', value: 'USD' },
  { label: 'EUR (€)', value: 'EUR' },
  { label: 'GBP (£)', value: 'GBP' },
  { label: 'THB (฿)', value: 'THB' },
]
