<template>
  <div class="bg-white rounded-2xl border border-slate-200 p-6">
    <h2 class="font-semibold text-slate-900 mb-4">Active Sessions</h2>
    <div class="space-y-3">
      <div
        v-for="session in sessions"
        :key="session.id"
        class="flex items-center justify-between p-3 bg-slate-50 rounded-xl"
      >
        <div class="flex items-center gap-3">
          <div class="w-9 h-9 bg-slate-200 rounded-lg flex items-center justify-center">
            <svg class="w-4 h-4 text-slate-600" fill="none" viewBox="0 0 24 24" stroke="currentColor" aria-hidden="true">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9.75 17L9 20l-1 1h8l-1-1-.75-3M3 13h18M5 17h14a2 2 0 002-2V5a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" />
            </svg>
          </div>
          <div>
            <p class="text-sm font-medium text-slate-900">{{ session.device }}</p>
            <p class="text-xs text-slate-500">{{ session.location }} · {{ session.lastActive }}</p>
          </div>
        </div>
        <div class="flex items-center gap-2">
          <span v-if="session.isCurrent" class="text-xs font-medium text-green-600 bg-green-50 border border-green-200 px-2 py-0.5 rounded-md">
            Current
          </span>
          <button
            v-else
            class="text-xs text-red-500 hover:text-red-700 font-medium"
            @click="revoke(session.id)"
          >
            Revoke
          </button>
        </div>
      </div>
    </div>
    <AppButton
      v-if="sessions.some(s => !s.isCurrent)"
      variant="outline"
      size="sm"
      class="mt-3 text-red-500 border-red-200 hover:bg-red-50"
      @click="revokeAll"
    >
      Revoke All Other Sessions
    </AppButton>
  </div>
</template>

<script setup lang="ts">
import { ref, onMounted } from 'vue'
import { useToastStore } from '@/stores/toast.store'
import { authService } from '@/services/api/auth.service'
import { logger } from '@/utils/logger'
import AppButton from '@/components/ui/AppButton.vue'

export interface Session {
  id: string
  device: string
  location: string
  lastActive: string
  isCurrent: boolean
}

const toast = useToastStore()

const sessions = ref<Session[]>([])

async function loadSessions(): Promise<void> {
  try {
    const res = await authService.getSessions()
    sessions.value = res.data.map(s => ({
      id: s.id,
      device: s.device,
      location: s.ip,
      lastActive: s.lastActive,
      isCurrent: s.isCurrent,
    }))
  } catch (err) {
    logger.catch(err, 'SettingsSessionsList.loadSessions')
  }
}

async function revoke(id: string): Promise<void> {
  try {
    await authService.revokeSession(id)
    sessions.value = sessions.value.filter((s) => s.id !== id)
    toast.info('Session Revoked', 'The session has been terminated.')
  } catch (err) {
    logger.catch(err, 'SettingsSessionsList.revoke')
    toast.error('Failed', 'Could not revoke session.')
  }
}

async function revokeAll(): Promise<void> {
  try {
    await authService.revokeAllSessions()
    sessions.value = sessions.value.filter((s) => s.isCurrent)
    toast.info('All Other Sessions Revoked')
  } catch (err) {
    logger.catch(err, 'SettingsSessionsList.revokeAll')
    toast.error('Failed', 'Could not revoke sessions.')
  }
}

onMounted(() => {
  loadSessions()
})
</script>
