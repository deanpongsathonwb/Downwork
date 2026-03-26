<template>
  <div class="min-h-screen bg-slate-50 flex">
    <!-- SIDEBAR -->
    <aside
      :class="[
        'fixed inset-y-0 left-0 z-40 w-64 bg-white border-r border-slate-200 flex flex-col transition-transform duration-300',
        sidebarOpen ? 'translate-x-0' : '-translate-x-full lg:translate-x-0',
      ]"
    >
      <!-- Logo -->
      <div class="h-16 flex items-center px-6 border-b border-slate-200 shrink-0">
        <AppLogo size="md" />
      </div>

      <!-- Navigation -->
      <nav class="flex-1 overflow-y-auto py-4 px-3">
        <RouterLink
          v-for="item in sidebarItems"
          :key="item.id"
          :to="item.route ?? item.to ?? '/'"
          class="flex items-center gap-3 px-3 py-2.5 rounded-xl text-sm font-medium text-slate-600 hover:text-slate-900 hover:bg-slate-100 transition-all mb-0.5 group"
          active-class="!bg-green-50 !text-green-700"
          @click="sidebarOpen = false"
        >
          <AppIcon :name="item.icon ?? ''" class="w-5 h-5 shrink-0" />
          <span class="flex-1">{{ item.label }}</span>
          <span
            v-if="item.badge"
            class="min-w-5 h-5 px-1.5 bg-red-500 text-white text-xs rounded-full flex items-center justify-center font-semibold"
          >
            {{ item.badge }}
          </span>
        </RouterLink>
      </nav>

      <!-- User Profile -->
      <div class="p-4 border-t border-slate-200">
        <div class="flex items-center gap-3 mb-3">
          <UserAvatar :name="auth.fullName" :src="auth.user?.avatar" size="md" />
          <div class="flex-1 min-w-0">
            <p class="text-sm font-semibold text-slate-900 truncate">{{ auth.fullName }}</p>
            <p class="text-xs text-slate-500 capitalize">{{ auth.role }}</p>
          </div>
        </div>
        <button
          class="w-full flex items-center gap-2 px-3 py-2 text-sm text-red-600 hover:bg-red-50 rounded-lg transition-colors"
          @click="auth.logout()"
        >
          <svg class="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M17 16l4-4m0 0l-4-4m4 4H7m6 4v1a3 3 0 01-3 3H6a3 3 0 01-3-3V7a3 3 0 013-3h4a3 3 0 013 3v1" />
          </svg>
          Sign Out
        </button>
      </div>
    </aside>

    <!-- OVERLAY for mobile -->
    <transition name="fade">
      <div
        v-if="sidebarOpen"
        class="fixed inset-0 z-30 bg-slate-900/50 lg:hidden"
        @click="sidebarOpen = false"
      />
    </transition>

    <!-- MAIN CONTENT -->
    <div class="flex-1 flex flex-col min-w-0 lg:pl-64">
      <!-- Top Header -->
      <header class="sticky top-0 z-20 h-16 bg-white border-b border-slate-200 flex items-center px-4 sm:px-6 gap-4">
        <!-- Mobile menu button -->
        <button
          class="lg:hidden p-2 rounded-lg text-slate-500 hover:bg-slate-100"
          @click="sidebarOpen = !sidebarOpen"
        >
          <svg class="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M4 6h16M4 12h16M4 18h16" />
          </svg>
        </button>

        <!-- Breadcrumb -->
        <div class="flex-1">
          <h1 class="text-base font-semibold text-slate-900">{{ currentPageTitle }}</h1>
        </div>

        <!-- Header Actions -->
        <div class="flex items-center gap-2">
          <!-- Notification Bell -->
          <RouterLink
            :to="notificationRoute"
            class="relative p-2 rounded-lg text-slate-500 hover:bg-slate-100 transition-colors"
          >
            <svg class="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M15 17h5l-1.405-1.405A2.032 2.032 0 0118 14.158V11a6.002 6.002 0 00-4-5.659V5a2 2 0 10-4 0v.341C7.67 6.165 6 8.388 6 11v3.159c0 .538-.214 1.055-.595 1.436L4 17h5m6 0v1a3 3 0 11-6 0v-1m6 0H9" />
            </svg>
            <span
              v-if="notifications.hasUnread"
              class="absolute top-1.5 right-1.5 w-2 h-2 bg-red-500 rounded-full"
            />
          </RouterLink>

          <!-- Messages -->
          <RouterLink
            :to="messagesRoute"
            class="relative p-2 rounded-lg text-slate-500 hover:bg-slate-100 transition-colors"
          >
            <svg class="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M8 12h.01M12 12h.01M16 12h.01M21 12c0 4.418-4.03 8-9 8a9.863 9.863 0 01-4.255-.949L3 20l1.395-3.72C3.512 15.042 3 13.574 3 12c0-4.418 4.03-8 9-8s9 3.582 9 8z" />
            </svg>
            <span
              v-if="chat.totalUnread > 0"
              class="absolute top-1 right-1 min-w-4 h-4 px-1 bg-red-500 text-white text-xs rounded-full flex items-center justify-center"
            >
              {{ chat.totalUnread }}
            </span>
          </RouterLink>

          <!-- Avatar Dropdown -->
          <AppDropdown align-right width="md">
            <template #trigger>
              <UserAvatar :name="auth.fullName" :src="auth.user?.avatar" size="sm" class="cursor-pointer" />
            </template>
            <RouterLink
              :to="`/${auth.role}/profile`"
              class="block px-4 py-2 text-sm text-slate-700 hover:bg-slate-100 transition-colors"
            >
              My Profile
            </RouterLink>
            <RouterLink
              :to="`/${auth.role}/settings`"
              class="block px-4 py-2 text-sm text-slate-700 hover:bg-slate-100 transition-colors"
            >
              Settings
            </RouterLink>
            <div class="border-t border-slate-200 my-1" />
            <button
              class="w-full text-left px-4 py-2 text-sm text-red-600 hover:bg-red-50 transition-colors"
              @click="auth.logout()"
            >
              Sign Out
            </button>
          </AppDropdown>
        </div>
      </header>

      <!-- Page -->
      <main class="flex-1 p-4 sm:p-6 lg:p-8">
        <RouterView />
      </main>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, computed } from 'vue'
import { RouterLink, RouterView, useRoute } from 'vue-router'
import { useAuthStore } from '@/stores/auth.store'
import { useNotificationStore } from '@/stores/notification.store'
import { useChatStore } from '@/stores/chat.store'
import { useSidebar } from '@/composables/useSidebar'
import AppIcon from '@/components/ui/AppIcon.vue'
import AppDropdown from '@/components/ui/AppDropdown.vue'
import AppLogo from '@/components/common/AppLogo.vue'
import UserAvatar from '@/components/common/UserAvatar.vue'

const auth = useAuthStore()
const notifications = useNotificationStore()
const chat = useChatStore()
const route = useRoute()
const { sidebarItems } = useSidebar()
const sidebarOpen = ref(false)

const currentPageTitle = computed(() => (route.meta.title as string) ?? 'Dashboard')

const notificationRoute = computed(() =>
  auth.role === 'guest' ? '/' : `/${auth.role}/notifications`,
)
const messagesRoute = computed(() =>
  auth.role === 'guest' ? '/' : `/${auth.role}/messages`,
)
</script>

<style scoped>
.fade-enter-active,
.fade-leave-active {
  transition: opacity 0.2s;
}
.fade-enter-from,
.fade-leave-to {
  opacity: 0;
}
</style>
