import { BaseService } from '@/services/http/base.service'
import type { AppNotification } from '@/types'

class NotificationService extends BaseService {
  constructor() {
    super('/notifications')
  }

  getAll(params?: { page?: number; limit?: number }) {
    return this.get<AppNotification[]>('', { params })
  }

  getUnreadCount() {
    return this.get<{ count: number }>('/unread-count')
  }

  markAsRead(id: string) {
    return this.patch<void>(`/${id}/read`)
  }

  markAllAsRead() {
    return this.patch<void>('/read-all')
  }

  remove(id: string) {
    return this.delete<void>(`/${id}`)
  }

  updatePreferences(preferences: Record<string, boolean>) {
    return this.put<void>('/preferences', preferences)
  }
}

export const notificationService = new NotificationService()
