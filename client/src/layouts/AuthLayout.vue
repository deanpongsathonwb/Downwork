<template>
  <!-- Login: header + floating dark footer (reference-style) -->
  <div v-if="isLoginRoute" class="min-h-screen flex flex-col bg-white">
    <header class="sticky top-0 z-50 shrink-0 bg-white">
      <div class="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <div class="flex h-16 items-stretch">
          <div class="flex shrink-0 items-center">
            <AppLogo size="md" />
          </div>
        </div>
      </div>
    </header>

    <div class="flex flex-1 flex-col items-center justify-center px-4 py-8 sm:py-12">
      <div class="w-full max-w-[420px]">
        <div class="rounded-lg border border-[#d5d5d5] bg-white px-8 py-9 shadow-sm">
          <RouterView />
        </div>
      </div>
    </div>

    <footer class="shrink-0 pb-6 pt-2">
      <div class="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <nav
          class="flex w-full flex-wrap content-center items-center justify-center gap-x-2 gap-y-2 rounded-2xl bg-[#121212] px-4 py-11 text-center sm:gap-x-3 sm:gap-y-2.5 sm:px-8 sm:py-14"
          aria-label="Legal"
        >
          <span class="text-[13px] text-white sm:text-sm">
            © {{ copyrightStart }} – {{ year }} {{ appName }}<span class="align-super text-[0.65em]">®</span> Inc.
          </span>
          <span class="hidden text-white/60 sm:inline" aria-hidden="true">·</span>
          <RouterLink
            class="text-[13px] text-white underline-offset-2 hover:underline sm:text-sm"
            :to="{ name: 'privacy-policy' }"
          >
            Privacy Policy
          </RouterLink>
          <span class="hidden text-white/60 sm:inline" aria-hidden="true">·</span>
          <RouterLink
            class="inline-flex items-center gap-2 text-[13px] text-white underline-offset-2 hover:underline sm:text-sm"
            :to="{ name: 'cookie-policy' }"
          >
            <span class="inline-flex shrink-0" aria-hidden="true">
              <svg xmlns="http://www.w3.org/2000/svg" width="26" height="14" viewBox="0 0 26 14" class="overflow-visible">
                <rect width="26" height="14" rx="2" fill="#fff" />
                <rect x="2" y="2" width="10" height="10" rx="1.5" fill="#1a73e8" />
                <path fill="#fff" d="M6.2 8.15 8.1 6.2l.7.72-1.62 1.55L5.5 7.05l.72-.7.98 1.05z" />
                <rect x="14" y="3" width="10" height="8" rx="1" fill="#dadce0" />
                <circle cx="20" cy="7" r="2.25" fill="#1a73e8" />
              </svg>
            </span>
            Your Privacy Choices
          </RouterLink>
        </nav>
      </div>
    </footer>
  </div>

  <!-- Register: same logo header as login -->
  <div v-else-if="isRegisterRoute" class="flex min-h-screen flex-col bg-white">
    <header class="sticky top-0 z-50 shrink-0 bg-white">
      <div class="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <div class="flex min-h-16 flex-wrap items-center gap-x-4 gap-y-2 py-2 sm:flex-nowrap sm:py-0">
          <div class="flex shrink-0 items-center">
            <AppLogo size="md" />
          </div>
          <nav
            v-if="signupHeaderRole"
            class="ml-auto text-right text-[13px] text-neutral-900 sm:text-sm"
            aria-label="Switch sign up type"
          >
            <p v-if="signupHeaderRole === 'client'" class="flex flex-wrap items-baseline justify-end gap-x-4 gap-y-1 sm:gap-x-5">
              <span>Looking for work?</span>
              <RouterLink
                :to="{ name: 'signup' }"
                class="font-semibold text-[#108a00] hover:text-[#0e7a00] underline-offset-2 hover:underline"
                @click="onSwitchToFreelancerSignup"
              >
                Apply As Talent
              </RouterLink>
            </p>
            <p v-else class="flex flex-wrap items-baseline justify-end gap-x-4 gap-y-1 sm:gap-x-5">
              <span>Here to hire talent?</span>
              <RouterLink
                :to="{ name: 'signup' }"
                class="font-semibold text-[#108a00] hover:text-[#0e7a00] underline-offset-2 hover:underline"
                @click="onSwitchToClientSignup"
              >
                Join as a Client
              </RouterLink>
            </p>
          </nav>
        </div>
      </div>
    </header>

    <div class="flex flex-1 flex-col items-center justify-start p-4 pt-5 pb-10 sm:pt-7">
      <div class="w-full max-w-3xl px-2 sm:px-0">
        <RouterView />
      </div>
      <p class="mt-8 text-center text-sm text-[#656565]">
        &copy; {{ year }} Downwork. All rights reserved.
      </p>
    </div>
  </div>

  <!-- Other auth routes (forgot / reset password, etc.) -->
  <div v-else class="flex min-h-screen flex-col items-center justify-center bg-[#f2f2f2] p-4 py-10">
    <div class="w-full max-w-[420px]">
      <div class="rounded-lg border border-[#d5d5d5] bg-white px-8 py-9 shadow-sm">
        <RouterView />
      </div>
      <p class="mt-8 text-center text-sm text-[#656565]">
        &copy; {{ year }} Downwork. All rights reserved.
      </p>
    </div>
  </div>
</template>

<script setup lang="ts">
import { computed } from 'vue'
import { RouterLink, RouterView, useRoute } from 'vue-router'
import { APP_CONFIG } from '@/config/app.config'
import AppLogo from '@/components/common/AppLogo.vue'
import { useSignupFlowStore } from '@/stores/signup-flow.store'

const route = useRoute()
const signupFlow = useSignupFlowStore()

/** Header crossover only on registration form step (step 2), not on the card picker. */
const signupHeaderRole = computed<'client' | 'freelancer' | null>(() => {
  if (route.name !== 'signup') return null
  if (signupFlow.step !== 2) return null
  return signupFlow.role
})

function onSwitchToFreelancerSignup(e: MouseEvent): void {
  signupFlow.switchSignupRole('freelancer')
  if (route.name === 'signup') e.preventDefault()
}

function onSwitchToClientSignup(e: MouseEvent): void {
  signupFlow.switchSignupRole('client')
  if (route.name === 'signup') e.preventDefault()
}

const isRegisterRoute = computed(() => route.name === 'signup')
const isLoginRoute = computed(() => route.name === 'login')
const year = computed(() => new Date().getFullYear())
const appName = APP_CONFIG.name
/** Platform “since” year for footer range (adjust if needed). */
const copyrightStart = 2024
</script>
