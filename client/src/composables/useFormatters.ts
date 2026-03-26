import type { JobBudget } from '@/types'

// ============================================================
// SHARED FORMATTING UTILITIES
// Centralises formatBudget, timeAgo, formatFileSize, formatTime
// to eliminate duplication across JobCard, JobDetailPage,
// MessagesPage, and any future consumers.
// ============================================================

export function useFormatters() {
  /**
   * Formats a job budget object into a human-readable string.
   * Handles fixed-price, hourly range, and negotiable budgets.
   */
  function formatBudget(budget: JobBudget): string {
    const sym = budget.currency === 'USD' ? '$' : budget.currency
    if (budget.type === 'fixed' && budget.amount) {
      return `${sym}${budget.amount.toLocaleString()}`
    }
    if (budget.min != null && budget.max != null) {
      return `${sym}${budget.min.toLocaleString()}–${sym}${budget.max.toLocaleString()}/hr`
    }
    if (budget.min != null) return `From ${sym}${budget.min.toLocaleString()}/hr`
    if (budget.amount) return `${sym}${budget.amount.toLocaleString()}`
    return 'Negotiable'
  }

  /**
   * Returns a relative time string (e.g. "3d ago", "2 hours ago").
   * Granularity: minutes → hours → days → weeks.
   */
  function timeAgo(date: string): string {
    if (!date) return ''
    const diff = Date.now() - new Date(date).getTime()
    const minutes = Math.floor(diff / 60_000)
    if (minutes < 1) return 'just now'
    if (minutes < 60) return `${minutes}m ago`
    const hours = Math.floor(minutes / 60)
    if (hours < 24) return `${hours}h ago`
    const days = Math.floor(hours / 24)
    if (days < 7) return `${days}d ago`
    return `${Math.floor(days / 7)}w ago`
  }

  /**
   * Converts raw bytes to a human-readable size string.
   */
  function formatFileSize(bytes: number): string {
    if (!bytes || bytes < 0) return ''
    if (bytes < 1_024) return `${bytes} B`
    if (bytes < 1_048_576) return `${(bytes / 1_024).toFixed(1)} KB`
    return `${(bytes / 1_048_576).toFixed(1)} MB`
  }

  /**
   * Formats an ISO date string for chat timestamps.
   * Shows HH:mm for today, or "Mon DD" for older messages.
   */
  function formatTime(date: string): string {
    if (!date) return ''
    const d = new Date(date)
    const diff = Date.now() - d.getTime()
    if (diff < 86_400_000) {
      return d.toLocaleTimeString('en-US', { hour: '2-digit', minute: '2-digit' })
    }
    return d.toLocaleDateString('en-US', { month: 'short', day: 'numeric' })
  }

  /**
   * Formats an ISO date string as a full readable date.
   * e.g. "Feb 1, 2025"
   */
  function formatDate(date: string): string {
    if (!date) return '—'
    return new Date(date).toLocaleDateString('en-US', { year: 'numeric', month: 'short', day: 'numeric' })
  }

  return { formatBudget, timeAgo, formatFileSize, formatTime, formatDate }
}
