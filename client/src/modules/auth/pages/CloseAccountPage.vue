<template>
  <section class="mx-auto w-full max-w-[1240px] px-4 py-8 sm:px-6 lg:px-8">
    <div
      v-if="showReminder"
      class="mb-6 flex items-start justify-between gap-3 rounded-md border border-[#e4d8a3] bg-[#fcf8dc] px-4 py-3 text-sm text-[#75641d]"
    >
      <div class="flex items-start gap-2">
        <svg class="mt-0.5 h-4 w-4 shrink-0" fill="none" viewBox="0 0 24 24" stroke="currentColor" stroke-width="2" aria-hidden="true">
          <path stroke-linecap="round" stroke-linejoin="round" d="M12 9v3.75m0 3h.008M21 12a9 9 0 1 1-18 0 9 9 0 0 1 18 0z" />
        </svg>
        <p>
          Just a reminder that to access all the features of Downwork, you'll need to
          <a href="#" class="cursor-pointer underline hover:no-underline" @click.prevent>verify your email address</a>.
        </p>
      </div>
      <button
        type="button"
        class="shrink-0 cursor-pointer text-[#9e8e48] transition hover:text-[#7f7239]"
        aria-label="Close reminder"
        @click="showReminder = false"
      >
        <svg class="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor" stroke-width="2">
          <path stroke-linecap="round" stroke-linejoin="round" d="M6 6l12 12M18 6L6 18" />
        </svg>
      </button>
    </div>

    <div class="grid gap-6 md:grid-cols-[200px_minmax(0,1fr)]">
      <aside>
        <h1 class="mb-4 text-[40px] font-medium leading-none text-slate-900">Settings</h1>
        <nav class="space-y-1 border-l border-slate-300 pl-3 text-[15px] leading-6 text-slate-600">
          <a
            v-for="item in sidebarItems"
            :key="item.label"
            href="#"
            class="flex items-center gap-3 rounded-md py-2 pr-2 hover:bg-slate-50 hover:text-slate-800"
            @click.prevent
          >
            <span class="inline-flex h-5 w-5 shrink-0 items-center justify-center text-slate-500" aria-hidden="true">
              <svg
                v-if="item.icon === 'user'"
                class="h-5 w-5"
                fill="none"
                viewBox="0 0 24 24"
                stroke="currentColor"
                stroke-width="1.8"
              >
                <path
                  stroke-linecap="round"
                  stroke-linejoin="round"
                  d="M15.75 7.5a3.75 3.75 0 1 1-7.5 0 3.75 3.75 0 0 1 7.5 0zM4.5 20.25a7.5 7.5 0 0 1 15 0"
                />
              </svg>
              <svg
                v-else-if="item.icon === 'card'"
                class="h-5 w-5"
                fill="none"
                viewBox="0 0 24 24"
                stroke="currentColor"
                stroke-width="1.8"
              >
                <rect x="2.25" y="5.25" width="19.5" height="13.5" rx="2" />
                <path stroke-linecap="round" d="M2.25 9.75h19.5" />
              </svg>
              <svg
                v-else-if="item.icon === 'lock'"
                class="h-5 w-5"
                fill="none"
                viewBox="0 0 24 24"
                stroke="currentColor"
                stroke-width="1.8"
              >
                <path
                  stroke-linecap="round"
                  stroke-linejoin="round"
                  d="M16.5 10.5V7.5a4.5 4.5 0 1 0-9 0v3M6 10.5h12a1.5 1.5 0 0 1 1.5 1.5v7.5a1.5 1.5 0 0 1-1.5 1.5H6a1.5 1.5 0 0 1-1.5-1.5v-7.5a1.5 1.5 0 0 1 1.5-1.5z"
                />
              </svg>
              <svg
                v-else-if="item.icon === 'users'"
                class="h-5 w-5"
                fill="none"
                viewBox="0 0 24 24"
                stroke="currentColor"
                stroke-width="1.8"
              >
                <path
                  stroke-linecap="round"
                  stroke-linejoin="round"
                  d="M15 19a6 6 0 0 0-12 0M18 8.25a3 3 0 1 1-6 0 3 3 0 0 1 6 0zM19.5 19a4.5 4.5 0 0 0-3.75-4.428"
                />
              </svg>
              <svg
                v-else-if="item.icon === 'badge'"
                class="h-5 w-5"
                fill="none"
                viewBox="0 0 24 24"
                stroke="currentColor"
                stroke-width="1.8"
              >
                <rect x="4" y="6" width="16" height="12" rx="2" />
                <circle cx="9" cy="10.5" r="1.35" />
                <path stroke-linecap="round" d="M7.1 14.25h3.8" />
                <path stroke-linecap="round" d="M13.5 9h5M13.5 12h5M13.5 15h3.75" />
              </svg>
              <svg
                v-else-if="item.icon === 'bell'"
                class="h-5 w-5"
                fill="none"
                viewBox="0 0 24 24"
                stroke="currentColor"
                stroke-width="1.8"
              >
                <path
                  stroke-linecap="round"
                  stroke-linejoin="round"
                  d="M14.25 18.75a2.25 2.25 0 0 1-4.5 0M18 14.25V11a6 6 0 1 0-12 0v3.25L4.5 18.75h15L18 14.25z"
                />
              </svg>
              <svg
                v-else-if="item.icon === 'document'"
                class="h-5 w-5"
                fill="none"
                viewBox="0 0 24 24"
                stroke="currentColor"
                stroke-width="1.8"
              >
                <path
                  stroke-linecap="round"
                  stroke-linejoin="round"
                  d="M19.5 14.25v-2.625a3.375 3.375 0 0 0-3.375-3.375h-1.5a1.125 1.125 0 0 1-1.125-1.125v-1.5a3.375 3.375 0 0 0-3.375-3.375H9.75a3.375 3.375 0 0 0-3.375 3.375V19.5a3.375 3.375 0 0 0 3.375 3.375h7.5A3.375 3.375 0 0 0 19.5 19.5v-5.25"
                />
              </svg>
              <svg
                v-else-if="item.icon === 'plug'"
                class="h-5 w-5"
                fill="none"
                viewBox="0 0 24 24"
                stroke="currentColor"
                stroke-width="1.8"
              >
                <path
                  stroke-linecap="round"
                  stroke-linejoin="round"
                  d="M13.19 8.688a4.5 4.5 0 0 1 1.242 7.244l-4.5 4.5a4.5 4.5 0 0 1-6.364-6.364l1.757-1.757m13.35-.709.479-.479a4.5 4.5 0 0 0-6.364-6.364l-.478.479m-2.94 2.94a4.5 4.5 0 0 0-1.586 6.364l.478.479a4.5 4.5 0 0 0 6.364-6.364l-.479-.479"
                />
              </svg>
            </span>
            <span>{{ item.label }}</span>
          </a>
        </nav>
      </aside>

      <div class="rounded-lg border border-slate-200 bg-white p-6 sm:p-8">
        <h2 class="text-3xl font-medium text-slate-900">Close account</h2>
        <p class="mt-4 text-base text-slate-700">Thank you for using Downwork.</p>

        <p class="mt-8 text-sm font-medium text-slate-800">Why are you closing your account?</p>
        <div class="mt-4 space-y-3">
          <label
            v-for="reason in reasons"
            :key="reason"
            class="flex cursor-pointer items-start gap-3 text-sm text-slate-800"
          >
            <input
              v-model="selectedReason"
              type="radio"
              name="close-account-reason"
              :value="reason"
              class="mt-[2px] h-4 w-4 border-slate-300 text-green-600 focus:ring-green-600"
            />
            <span>{{ reason }}</span>
          </label>
        </div>

        <div class="mt-8 flex items-center gap-5">
          <button
            type="button"
            class="rounded-md bg-[#108a00] px-5 py-2 text-sm font-medium text-white transition hover:bg-[#0e7a00]"
          >
            Close account
          </button>
          <RouterLink :to="cancelRoute" class="text-sm font-medium text-green-700 hover:text-green-800">
            Cancel
          </RouterLink>
        </div>
      </div>
    </div>
  </section>
</template>

<script setup lang="ts">
import { computed, ref } from 'vue'
import { RouterLink } from 'vue-router'
import { useAuthStore } from '@/stores/auth.store'

const auth = useAuthStore()
const showReminder = ref(true)

const sidebarItems = [
  { label: 'My info', icon: 'user' as const },
  { label: 'Billing & Payments', icon: 'card' as const },
  { label: 'Password & Security', icon: 'lock' as const },
  { label: 'Teams & Members', icon: 'users' as const },
  { label: 'Membership', icon: 'badge' as const },
  { label: 'Notification Settings', icon: 'bell' as const },
  { label: 'Tax Information', icon: 'document' as const },
  { label: 'Connected Services', icon: 'plug' as const },
] as const

const reasons = [
  "I finished my work and don't need Downwork anymore",
  "I couldn't find the jobs I wanted",
  "I found a good client on Downwork, but we're working directly together",
  'I want to change my username',
  'Downwork is not easy to use',
  'I signed up for the wrong type of account',
  'Closing duplicate account',
] as const

const selectedReason = ref<string | null>(null)

const cancelRoute = computed(() => {
  if (auth.role === 'client' || auth.role === 'freelancer' || auth.role === 'admin') {
    return `/${auth.role}/settings`
  }
  return '/'
})
</script>
