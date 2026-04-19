import { defineStore } from 'pinia'
import { ref } from 'vue'
import type { Toast } from '@/types'
import { TOAST_CONFIG } from '@/config/app.config'

// ============================================================
// TOAST / NOTIFICATION STORE
// ============================================================

export const useToastStore = defineStore('toast', () => {
  const toasts = ref<Toast[]>([])

  function add(toast: Omit<Toast, 'id'>): string {
    if (!TOAST_CONFIG.enabled) {
      return ''
    }
    const id = `toast_${Date.now()}_${Math.random().toString(36).slice(2)}`
    const newToast: Toast = { id, duration: TOAST_CONFIG.defaultDuration, ...toast }
    toasts.value.push(newToast)

    if (toasts.value.length > TOAST_CONFIG.maxToasts) {
      toasts.value.shift()
    }

    if (!newToast.persistent && newToast.duration) {
      setTimeout(() => remove(id), newToast.duration)
    }

    return id
  }

  function remove(id: string): void {
    const idx = toasts.value.findIndex((t) => t.id === id)
    if (idx !== -1) toasts.value.splice(idx, 1)
  }

  function clear(): void {
    toasts.value = []
  }

  function success(title: string, message?: string): string {
    return add({ type: 'success', title, message })
  }

  function error(title: string, message?: string): string {
    return add({ type: 'error', title, message, duration: 6000 })
  }

  function warning(title: string, message?: string): string {
    return add({ type: 'warning', title, message })
  }

  function info(title: string, message?: string): string {
    return add({ type: 'info', title, message })
  }

  return { toasts, add, remove, clear, success, error, warning, info }
})
