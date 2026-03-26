<template>
  <div class="min-h-screen bg-slate-950 flex">
    <!-- ADMIN SIDEBAR -->
    <aside
      :class="[
        'fixed inset-y-0 left-0 z-40 w-64 bg-slate-900 border-r border-slate-800 flex flex-col transition-transform duration-300',
        sidebarOpen ? 'translate-x-0' : '-translate-x-full lg:translate-x-0',
      ]"
    >
      <!-- Logo -->
      <div class="h-16 flex items-center px-6 border-b border-slate-800 shrink-0">
        <div class="flex flex-col">
          <AppLogo size="md" variant="admin" />
          <span class="text-red-400 text-xs font-medium mt-0.5 pl-10">Admin Panel</span>
        </div>
      </div>

      <!-- Navigation -->
      <nav class="flex-1 overflow-y-auto py-4 px-3">
        <RouterLink
          v-for="item in sidebarItems"
          :key="item.id"
          :to="item.route ?? item.to ?? '/admin'"
          class="flex items-center gap-3 px-3 py-2.5 rounded-xl text-sm font-medium text-slate-400 hover:text-white hover:bg-slate-800 transition-all mb-0.5"
          active-class="!bg-red-950 !text-red-400"
          @click="sidebarOpen = false"
        >
          <AppIcon :name="item.icon ?? ''" class="w-5 h-5 shrink-0" />
          <span class="flex-1">{{ item.label }}</span>
          <span
            v-if="item.badge"
            class="min-w-5 h-5 px-1.5 bg-red-600 text-white text-xs rounded-full flex items-center justify-center font-semibold"
          >
            {{ item.badge }}
          </span>
        </RouterLink>
      </nav>

      <!-- Admin User -->
      <div class="p-4 border-t border-slate-800">
        <div class="flex items-center gap-3 mb-3">
          <UserAvatar :name="auth.fullName" size="md" />
          <div class="flex-1 min-w-0">
            <p class="text-sm font-semibold text-white truncate">{{ auth.fullName }}</p>
            <p class="text-xs text-red-400 font-medium">Administrator</p>
          </div>
        </div>
        <button
          class="w-full flex items-center gap-2 px-3 py-2 text-sm text-slate-400 hover:text-red-400 hover:bg-red-950/30 rounded-lg transition-colors"
          @click="auth.logout()"
        >
          <svg class="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M17 16l4-4m0 0l-4-4m4 4H7m6 4v1a3 3 0 01-3 3H6a3 3 0 01-3-3V7a3 3 0 013-3h4a3 3 0 013 3v1" />
          </svg>
          Sign Out
        </button>
      </div>
    </aside>

    <!-- Mobile overlay -->
    <transition name="fade">
      <div
        v-if="sidebarOpen"
        class="fixed inset-0 z-30 bg-slate-950/80 lg:hidden"
        @click="sidebarOpen = false"
      />
    </transition>

    <!-- MAIN CONTENT -->
    <div class="flex-1 flex flex-col min-w-0 lg:pl-64">
      <header class="sticky top-0 z-20 h-16 bg-slate-900 border-b border-slate-800 flex items-center px-4 sm:px-6 gap-4">
        <button
          class="lg:hidden p-2 rounded-lg text-slate-400 hover:bg-slate-800"
          @click="sidebarOpen = !sidebarOpen"
        >
          <svg class="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M4 6h16M4 12h16M4 18h16" />
          </svg>
        </button>
        <h1 class="text-base font-semibold text-white flex-1">{{ currentPageTitle }}</h1>
        <div class="flex items-center gap-2">
          <RouterLink to="/" class="text-xs text-slate-400 hover:text-white transition-colors flex items-center gap-1">
            <svg class="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M10 6H6a2 2 0 00-2 2v10a2 2 0 002 2h10a2 2 0 002-2v-4M14 4h6m0 0v6m0-6L10 14" />
            </svg>
            View Site
          </RouterLink>
        </div>
      </header>

      <main class="flex-1 p-4 sm:p-6 lg:p-8 bg-slate-950">
        <RouterView />
      </main>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, computed } from 'vue'
import { RouterLink, RouterView, useRoute } from 'vue-router'
import { useAuthStore } from '@/stores/auth.store'
import { useSidebar } from '@/composables/useSidebar'
import AppIcon from '@/components/ui/AppIcon.vue'
import AppLogo from '@/components/common/AppLogo.vue'
import UserAvatar from '@/components/common/UserAvatar.vue'

const auth = useAuthStore()
const route = useRoute()
const { sidebarItems } = useSidebar()
const sidebarOpen = ref(false)

const currentPageTitle = computed(() => (route.meta.title as string) ?? 'Admin Panel')
</script>

<style scoped>
.fade-enter-active, .fade-leave-active { transition: opacity 0.2s; }
.fade-enter-from, .fade-leave-to { opacity: 0; }
</style>
