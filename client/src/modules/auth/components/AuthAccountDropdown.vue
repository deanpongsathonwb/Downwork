<template>
  <AppDropdown align-right width="2xl" plain>
    <template #trigger>
      <button
        type="button"
        class="inline-flex h-10 w-10 cursor-pointer items-center justify-center rounded-full border border-neutral-700 text-neutral-800 transition hover:bg-neutral-100"
        aria-label="Open account menu"
      >
        <svg class="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor" stroke-width="1.8">
          <path
            stroke-linecap="round"
            stroke-linejoin="round"
            d="M15.75 8.25a3.75 3.75 0 1 1-7.5 0 3.75 3.75 0 0 1 7.5 0zM4.5 20.12a7.5 7.5 0 0 1 15 0"
          />
        </svg>
      </button>
    </template>

    <div class="w-full rounded-2xl border border-[#c7d0da] bg-[#efefef] px-5 py-5">
      <div class="mb-4 flex flex-col items-center text-center">
        <div class="mb-2 flex h-[64px] w-[64px] items-center justify-center rounded-full border-2 border-[#303030] text-[#303030]">
          <svg class="h-[42px] w-[42px]" fill="none" viewBox="0 0 24 24" stroke="currentColor" stroke-width="1.4">
            <path
              stroke-linecap="round"
              stroke-linejoin="round"
              d="M15.75 8.25a3.75 3.75 0 1 1-7.5 0 3.75 3.75 0 0 1 7.5 0zM4.5 20.12a7.5 7.5 0 0 1 15 0"
            />
          </svg>
        </div>
        <p class="text-xl font-medium leading-tight text-black">{{ auth.fullName || 'Account' }}</p>
        <p class="mt-0.5 text-sm leading-none text-slate-600 capitalize">{{ accountRoleLabel }}</p>
      </div>

      <RouterLink
        v-if="roleSettingsName"
        :to="{ name: roleSettingsName }"
        class="mb-1.5 flex items-center gap-3 rounded-lg px-1 py-2 text-base font-normal leading-none text-neutral-900 transition hover:bg-[#e5e8eb]"
      >
        <svg class="h-5 w-5 shrink-0" fill="none" viewBox="0 0 24 24" stroke="currentColor" stroke-width="1.8">
          <path
            stroke-linecap="round"
            stroke-linejoin="round"
            d="M9.594 3.94c.09-.542.56-.94 1.11-.94h2.592c.55 0 1.02.398 1.11.94l.213 1.28a1.125 1.125 0 0 0 1.484.866l1.22-.49a1.125 1.125 0 0 1 1.312.437l1.296 2.244c.275.476.19 1.082-.202 1.46l-.995.96a1.125 1.125 0 0 0 0 1.618l.995.96c.392.378.477.984.202 1.46l-1.296 2.244a1.125 1.125 0 0 1-1.312.437l-1.22-.49a1.125 1.125 0 0 0-1.484.866l-.213 1.28c-.09.542-.56.94-1.11.94h-2.592a1.125 1.125 0 0 1-1.11-.94l-.213-1.28a1.125 1.125 0 0 0-1.484-.866l-1.22.49a1.125 1.125 0 0 1-1.312-.437L2.7 16.66a1.125 1.125 0 0 1 .202-1.46l.995-.96a1.125 1.125 0 0 0 0-1.618l-.995-.96a1.125 1.125 0 0 1-.202-1.46L4 7.958c.275-.476.878-.677 1.312-.437l1.22.49a1.125 1.125 0 0 0 1.484-.866l.213-1.28z"
          />
          <path stroke-linecap="round" stroke-linejoin="round" d="M12 15.75a3.75 3.75 0 1 0 0-7.5 3.75 3.75 0 0 0 0 7.5z" />
        </svg>
        Settings
      </RouterLink>

      <RouterLink
        :to="closeAccountRoute"
        class="mb-1.5 flex items-center gap-3 rounded-lg px-1 py-2 text-base font-normal leading-none text-neutral-900 transition hover:bg-[#e5e8eb]"
      >
        <svg class="h-5 w-5 shrink-0" fill="none" viewBox="0 0 24 24" stroke="currentColor" stroke-width="1.8">
          <path
            stroke-linecap="round"
            stroke-linejoin="round"
            d="m9.75 9.75 4.5 4.5m0-4.5-4.5 4.5M21 12a9 9 0 1 1-18 0 9 9 0 0 1 18 0Z"
          />
        </svg>
        Close Account
      </RouterLink>

      <button
        type="button"
        class="flex w-full cursor-pointer items-center gap-3 rounded-lg px-1 py-2 text-left text-base font-normal leading-none text-neutral-900 transition hover:bg-[#e5e8eb]"
        @click="auth.logout()"
      >
        <svg class="h-5 w-5 shrink-0" fill="none" viewBox="0 0 24 24" stroke="currentColor" stroke-width="1.8">
          <path
            stroke-linecap="round"
            stroke-linejoin="round"
            d="M15.75 9V5.25A2.25 2.25 0 0 0 13.5 3h-6A2.25 2.25 0 0 0 5.25 5.25v13.5A2.25 2.25 0 0 0 7.5 21h6a2.25 2.25 0 0 0 2.25-2.25V15m3 0 3-3m0 0-3-3m3 3H9"
          />
        </svg>
        Log out
      </button>
    </div>
  </AppDropdown>
</template>

<script setup lang="ts">
import { computed } from 'vue'
import { RouterLink, type RouteLocationRaw } from 'vue-router'
import { useAuthStore } from '@/stores/auth.store'
import type { UserRole } from '@/types'
import AppDropdown from '@/components/ui/AppDropdown.vue'

const auth = useAuthStore()

const accountRoleLabel = computed(() => {
  if (auth.role === 'client') return 'basic'
  if (auth.role === 'freelancer') return 'freelancer'
  if (auth.role === 'admin') return 'admin'
  return 'guest'
})

const ROLE_SETTINGS_NAMES: Partial<Record<UserRole, string>> = {
  admin: 'admin-settings',
}

/** Named route for role dashboard settings; empty when not applicable (e.g. guest). */
const roleSettingsName = computed(
  () => ROLE_SETTINGS_NAMES[auth.role] ?? '',
)

const closeAccountRoute = { name: 'close-account' } as const satisfies RouteLocationRaw
</script>
