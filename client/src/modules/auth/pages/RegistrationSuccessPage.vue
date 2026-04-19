<template>
  <div class="min-h-screen flex flex-col bg-white text-neutral-900">
    <header class="shrink-0 bg-white">
      <div class="mx-auto flex h-16 max-w-7xl items-center justify-between px-4 sm:px-6 lg:px-8">
        <AppLogo size="md" />
        <AuthAccountDropdown />
      </div>
    </header>

    <main class="flex flex-1 flex-col items-center justify-center px-6 pb-16 pt-12 sm:pt-16">
      <div class="relative mb-10 sm:mb-12" aria-hidden="true">
        <!-- Confetti -->
        <svg class="w-[220px] h-[200px] sm:w-[260px] sm:h-[240px]" viewBox="0 0 260 240" fill="none" xmlns="http://www.w3.org/2000/svg">
          <path d="M40 48l8 14-14 6-6-14 12-6z" fill="#7dd87a" opacity="0.9" />
          <path d="M210 36l10 8-4 12-12-4 6-16z" fill="#5cb85c" opacity="0.85" />
          <circle cx="224" cy="120" r="5" fill="#9fdf9a" />
          <rect x="28" y="140" width="10" height="10" rx="2" transform="rotate(-20 28 140)" fill="#6bbd69" />
          <path d="M180 200l6-16 14 4-8 14-12-2z" fill="#8fd98f" />
          <circle cx="52" cy="96" r="4" fill="#5cb85c" />
          <rect x="200" y="72" width="8" height="14" rx="1" transform="rotate(15 200 72)" fill="#7dd87a" />
        </svg>
        <!-- Profile card -->
        <div
          class="absolute left-1/2 top-1/2 w-[120px] sm:w-[140px] -translate-x-1/2 -translate-y-1/2 rounded-lg border-2 border-[#6bbd69] bg-[#e8f8e8] shadow-sm px-4 py-5 flex flex-col items-center"
        >
          <div class="flex h-14 w-14 items-center justify-center rounded-full bg-[#c8efc8] text-[#2d6a2d]">
            <svg class="h-8 w-8" fill="currentColor" viewBox="0 0 24 24" aria-hidden="true">
              <path d="M12 12c2.21 0 4-1.79 4-4s-1.79-4-4-4-4 1.79-4 4 1.79 4 4 4zm0 2c-2.67 0-8 1.34-8 4v2h16v-2c0-2.66-5.33-4-8-4z" />
            </svg>
          </div>
          <div class="mt-3 w-full space-y-1.5">
            <div class="h-1.5 rounded-full bg-[#7dd87a]/80 w-full" />
            <div class="h-1.5 rounded-full bg-[#7dd87a]/50 w-4/5 mx-auto" />
          </div>
        </div>
      </div>

      <h1 class="max-w-lg text-center text-xl sm:text-2xl font-bold text-black leading-snug px-2">
        Congratulations, your account has been created. Let's get you started!
      </h1>
    </main>
  </div>
</template>

<script setup lang="ts">
import { onMounted, onUnmounted } from 'vue'
import { useRouter } from 'vue-router'
import AppLogo from '@/components/common/AppLogo.vue'
import { useAuthStore } from '@/stores/auth.store'
import AuthAccountDropdown from '@/modules/auth/components/AuthAccountDropdown.vue'

const router = useRouter()
const auth = useAuthStore()

let timer: ReturnType<typeof setTimeout> | undefined

function stopAutoRedirect(): void {
  if (timer !== undefined) {
    clearTimeout(timer)
    timer = undefined
  }
}

function onKeydown(event: KeyboardEvent): void {
  if (event.key === 'Escape') stopAutoRedirect()
}

onMounted(() => {
  timer = setTimeout(() => {
    if (auth.isClient) {
      void router.replace({ name: 'client-business-onboarding' })
    } else {
      void auth.redirectAfterAuth()
    }
  }, 5000)

  window.addEventListener('keydown', onKeydown)
})

onUnmounted(() => {
  stopAutoRedirect()
  window.removeEventListener('keydown', onKeydown)
})
</script>
