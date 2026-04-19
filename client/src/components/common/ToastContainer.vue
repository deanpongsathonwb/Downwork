<template>
  <Teleport v-if="TOAST_CONFIG.enabled" to="body">
    <div class="fixed top-4 right-4 z-[9999] flex flex-col gap-3 max-w-sm w-full pointer-events-none">
      <TransitionGroup name="toast">
        <div
          v-for="toast in toastStore.toasts"
          :key="toast.id"
          :class="[
            'bg-white rounded-2xl shadow-xl border pointer-events-auto flex items-start gap-3 p-4 transition-all',
            borderClass(toast.type),
          ]"
          role="alert"
        >
          <!-- Icon -->
          <div :class="['w-9 h-9 rounded-xl flex items-center justify-center shrink-0', iconBgClass(toast.type)]">
            <svg :class="['w-5 h-5', iconColorClass(toast.type)]" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" :d="iconPath(toast.type)" />
            </svg>
          </div>

          <!-- Content -->
          <div class="flex-1 min-w-0">
            <p class="text-sm font-semibold text-slate-900">{{ toast.title }}</p>
            <p v-if="toast.message" class="text-xs text-slate-500 mt-0.5 leading-relaxed">{{ toast.message }}</p>
          </div>

          <!-- Close -->
          <button
            class="shrink-0 text-slate-400 hover:text-slate-600 transition-colors"
            @click="toastStore.remove(toast.id)"
          >
            <svg class="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M6 18L18 6M6 6l12 12" />
            </svg>
          </button>
        </div>
      </TransitionGroup>
    </div>
  </Teleport>
</template>

<script setup lang="ts">
import { TOAST_CONFIG } from '@/config/app.config'
import { useToastStore } from '@/stores/toast.store'

const toastStore = useToastStore()

const borderClass = (type: string) => ({
  success: 'border-green-200',
  error: 'border-red-200',
  warning: 'border-yellow-200',
  info: 'border-blue-200',
}[type] ?? 'border-slate-200')

const iconBgClass = (type: string) => ({
  success: 'bg-green-100',
  error: 'bg-red-100',
  warning: 'bg-yellow-100',
  info: 'bg-blue-100',
}[type] ?? 'bg-slate-100')

const iconColorClass = (type: string) => ({
  success: 'text-green-600',
  error: 'text-red-600',
  warning: 'text-yellow-600',
  info: 'text-blue-600',
}[type] ?? 'text-slate-600')

const iconPath = (type: string) => ({
  success: 'M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z',
  error: 'M10 14l2-2m0 0l2-2m-2 2l-2-2m2 2l2 2m7-2a9 9 0 11-18 0 9 9 0 0118 0z',
  warning: 'M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z',
  info: 'M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z',
}[type] ?? 'M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z')
</script>

<style scoped>
.toast-enter-active { transition: all 0.3s ease; }
.toast-leave-active { transition: all 0.25s ease; }
.toast-enter-from { opacity: 0; transform: translateX(100%); }
.toast-leave-to { opacity: 0; transform: translateX(100%) scale(0.95); }
.toast-move { transition: transform 0.3s; }
</style>
