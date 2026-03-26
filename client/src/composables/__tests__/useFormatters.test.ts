import { describe, it, expect } from 'vitest'
import { useFormatters } from '../useFormatters'

describe('useFormatters', () => {
  const { formatBudget, formatFileSize, timeAgo, formatDate } = useFormatters()

  describe('formatBudget', () => {
    it('formats a fixed-price budget', () => {
      const result = formatBudget({ type: 'fixed', amount: 1500, currency: 'USD' })
      expect(result).toBe('$1,500')
    })

    it('formats an hourly range budget', () => {
      const result = formatBudget({ type: 'hourly', min: 25, max: 50, currency: 'USD' })
      expect(result).toBe('$25–$50/hr')
    })

    it('formats a min-only hourly budget', () => {
      const result = formatBudget({ type: 'hourly', min: 30, currency: 'USD' })
      expect(result).toBe('From $30/hr')
    })

    it('returns Negotiable when no amount provided', () => {
      const result = formatBudget({ type: 'fixed', currency: 'USD' })
      expect(result).toBe('Negotiable')
    })
  })

  describe('formatFileSize', () => {
    it('formats bytes', () => {
      expect(formatFileSize(500)).toBe('500 B')
    })

    it('formats kilobytes', () => {
      expect(formatFileSize(1024)).toBe('1.0 KB')
    })

    it('formats megabytes', () => {
      expect(formatFileSize(1048576)).toBe('1.0 MB')
    })

    it('returns empty for zero', () => {
      expect(formatFileSize(0)).toBe('')
    })
  })

  describe('timeAgo', () => {
    it('returns "just now" for recent dates', () => {
      const now = new Date().toISOString()
      expect(timeAgo(now)).toBe('just now')
    })

    it('returns minutes ago with short format', () => {
      const fiveMinAgo = new Date(Date.now() - 5 * 60 * 1000).toISOString()
      expect(timeAgo(fiveMinAgo)).toBe('5m ago')
    })

    it('returns hours ago', () => {
      const twoHoursAgo = new Date(Date.now() - 2 * 60 * 60 * 1000).toISOString()
      expect(timeAgo(twoHoursAgo)).toBe('2h ago')
    })

    it('returns days ago', () => {
      const threeDaysAgo = new Date(Date.now() - 3 * 24 * 60 * 60 * 1000).toISOString()
      expect(timeAgo(threeDaysAgo)).toBe('3d ago')
    })

    it('returns empty for falsy input', () => {
      expect(timeAgo('')).toBe('')
    })
  })

  describe('formatDate', () => {
    it('formats a date string', () => {
      const result = formatDate('2025-02-01T00:00:00Z')
      expect(result).toMatch(/Feb/)
      expect(result).toMatch(/2025/)
    })

    it('returns dash for empty input', () => {
      expect(formatDate('')).toBe('—')
    })
  })
})
