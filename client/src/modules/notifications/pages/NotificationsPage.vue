<template>
  <div class="space-y-5 max-w-2xl">
    <div class="flex justify-between items-center">
      <h1 class="text-2xl font-bold text-slate-900">Notifications</h1>
      <button class="text-sm text-slate-500 hover:text-slate-700 font-medium" @click="notifStore.markAllAsRead()">
        Mark all as read
      </button>
    </div>

    <div class="space-y-3">
      <TransitionGroup name="list">
        <div
          v-for="notif in notifStore.notifications"
          :key="notif.id"
          :class="['bg-white rounded-2xl border p-4 flex items-start gap-4 transition-all', notif.isRead ? 'border-slate-200' : 'border-green-200 bg-green-50/50']"
        >
          <!-- Icon -->
          <div :class="['w-10 h-10 rounded-xl flex items-center justify-center shrink-0', iconBg(notif.type)]">
            <span class="text-lg">{{ iconEmoji(notif.type) }}</span>
          </div>

          <!-- Content -->
          <div class="flex-1 min-w-0">
            <div class="flex items-start justify-between gap-2">
              <p class="text-sm font-semibold text-slate-900">{{ notif.title }}</p>
              <p class="text-xs text-slate-400 shrink-0 mt-0.5">{{ timeAgo(notif.createdAt) }}</p>
            </div>
            <p class="text-sm text-slate-600 mt-0.5">{{ notif.message }}</p>
            <RouterLink
              v-if="notif.link"
              :to="notif.link"
              class="text-xs text-green-600 font-medium hover:text-green-700 mt-1.5 inline-block"
              @click="notifStore.markAsRead(notif.id)"
            >
              View →
            </RouterLink>
          </div>

          <!-- Actions -->
          <div class="flex items-center gap-2 shrink-0">
            <button
              v-if="!notif.isRead"
              class="w-2.5 h-2.5 bg-green-500 rounded-full"
              title="Mark as read"
              @click="notifStore.markAsRead(notif.id)"
            />
            <button
              class="text-slate-300 hover:text-red-400 transition-colors"
              @click="notifStore.remove(notif.id)"
            >
              <svg class="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M6 18L18 6M6 6l12 12" />
              </svg>
            </button>
          </div>
        </div>
      </TransitionGroup>

      <div v-if="!notifStore.notifications.length" class="text-center py-16">
        <p class="text-5xl mb-3">🔔</p>
        <h3 class="text-lg font-semibold text-slate-900 mb-1">All caught up!</h3>
        <p class="text-sm text-slate-500">You have no new notifications.</p>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { onMounted } from 'vue'
import { RouterLink } from 'vue-router'
import { useNotificationStore } from '@/stores/notification.store'
import type { NotificationType } from '@/types'

const notifStore = useNotificationStore()

onMounted(() => { notifStore.fetchNotifications() })

function iconBg(type: NotificationType): string {
  const map: Record<string, string> = {
    proposal: 'bg-blue-100',
    contract: 'bg-green-100',
    message: 'bg-purple-100',
    payment: 'bg-emerald-100',
    review: 'bg-amber-100',
    success: 'bg-green-100',
    error: 'bg-red-100',
    info: 'bg-blue-100',
    warning: 'bg-yellow-100',
  }
  return map[type] ?? 'bg-slate-100'
}

function iconEmoji(type: NotificationType): string {
  const map: Record<string, string> = {
    proposal: '📋',
    contract: '📄',
    message: '💬',
    payment: '💰',
    review: '⭐',
    success: '✅',
    error: '❌',
    info: 'ℹ️',
    warning: '⚠️',
  }
  return map[type] ?? '🔔'
}

function timeAgo(date: string): string {
  const diff = Date.now() - new Date(date).getTime()
  const minutes = Math.floor(diff / 60000)
  if (minutes < 60) return `${minutes}m ago`
  const hours = Math.floor(minutes / 60)
  if (hours < 24) return `${hours}h ago`
  return `${Math.floor(hours / 24)}d ago`
}
</script>

<style scoped>
.list-enter-active, .list-leave-active { transition: all 0.3s ease; }
.list-enter-from, .list-leave-to { opacity: 0; transform: translateX(20px); }
</style>
