import { defineStore } from 'pinia'
import { ref, computed } from 'vue'
import type { AppNotification } from '@/types'
import { notificationService } from '@/services/api/notification.service'
import { logger } from '@/utils/logger'

// ============================================================
// NOTIFICATION STORE
// ============================================================

export const useNotificationStore = defineStore('notification', () => {
  const notifications = ref<AppNotification[]>([])
  const isLoading = ref(false)
  const error = ref<string | null>(null)

  const unreadCount = computed(() => notifications.value.filter((n) => !n.isRead).length)
  const hasUnread = computed(() => unreadCount.value > 0)

  async function fetchNotifications(): Promise<void> {
    isLoading.value = true
    try {
      const res = await notificationService.getAll()
      notifications.value = res.data
    } catch (err) {
      logger.warn('Failed to fetch notifications — non-critical', err, 'NotificationStore')
    } finally {
      isLoading.value = false
    }
  }

  function markAsRead(id: string): void {
    const n = notifications.value.find((n) => n.id === id)
    if (n) n.isRead = true
    notificationService.markAsRead(id).catch((err) => logger.warn('markAsRead failed', err, 'NotificationStore'))
  }

  function markAllAsRead(): void {
    notifications.value.forEach((n) => (n.isRead = true))
    notificationService.markAllAsRead().catch((err) => logger.warn('markAllAsRead failed', err, 'NotificationStore'))
  }

  async function remove(id: string): Promise<void> {
    notifications.value = notifications.value.filter((n) => n.id !== id)
    try {
      await notificationService.remove(id)
    } catch (err) {
      logger.warn('Failed to delete notification on server', err, 'NotificationStore')
    }
  }

  function addRealtime(notification: AppNotification): void {
    notifications.value.unshift(notification)
  }

  return {
    notifications,
    isLoading,
    error,
    unreadCount,
    hasUnread,
    fetchNotifications,
    markAsRead,
    markAllAsRead,
    remove,
    addRealtime,
  }
})
