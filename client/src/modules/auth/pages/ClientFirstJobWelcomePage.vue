<template>
  <div class="relative flex min-h-dvh flex-col overflow-x-hidden bg-white text-black">
    <PublicNavbar />
    <!-- Subtle background curves -->
    <div
      class="pointer-events-none absolute inset-0 text-slate-200/90"
      aria-hidden="true"
    >
      <svg
        class="absolute left-1/2 top-1/2 h-[min(100vw,720px)] w-[min(100vw,720px)] -translate-x-1/2 -translate-y-1/2"
        viewBox="0 0 400 400"
        fill="none"
      >
        <path
          d="M200 40c88 0 160 72 160 160s-72 160-160 160S40 288 40 200 112 40 200 40z"
          stroke="currentColor"
          stroke-width="0.9"
          opacity="0.35"
        />
        <path
          d="M200 80c66 0 120 54 120 120s-54 120-120 120S80 266 80 200s54-120 120-120z"
          stroke="currentColor"
          stroke-width="0.75"
          opacity="0.45"
        />
        <path
          d="M200 120c44 0 80 36 80 80s-36 80-80 80-80-36-80-80 36-80 80-80z"
          stroke="currentColor"
          stroke-width="0.65"
          opacity="0.55"
        />
      </svg>
      <svg class="absolute -left-24 top-0 h-[420px] w-[420px]" viewBox="0 0 400 400" fill="none">
        <path
          d="M40 120c80-100 220-80 280 20s20 220-80 280"
          stroke="currentColor"
          stroke-width="1.25"
        />
        <path
          d="M120 360c120-40 200-200 160-320"
          stroke="currentColor"
          stroke-width="1"
          opacity="0.7"
        />
      </svg>
      <svg
        class="absolute -right-16 bottom-0 h-[380px] w-[380px]"
        viewBox="0 0 400 400"
        fill="none"
      >
        <path
          d="M360 280c-60 100-200 120-280 40S20 80 120 40"
          stroke="currentColor"
          stroke-width="1.25"
        />
      </svg>
    </div>

    <div class="relative z-10 flex min-h-0 flex-1 flex-col px-6 pb-8 pt-3 sm:pt-5">
      <!-- Email verification reminder (wider strip so the message stays on one line) -->
      <div
        v-if="showVerifyBanner"
        class="mx-auto mb-8 flex w-full max-w-3xl shrink-0 items-center gap-3 overflow-x-auto rounded-lg border border-amber-200 bg-amber-50 px-4 py-3 text-sm text-amber-950"
        role="status"
      >
        <svg class="h-5 w-5 shrink-0 text-amber-700" fill="currentColor" viewBox="0 0 20 20">
          <path
            fill-rule="evenodd"
            d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7 4a1 1 0 11-2 0 1 1 0 012 0zm-1-9a1 1 0 00-1 1v4a1 1 0 102 0V6a1 1 0 00-1-1z"
            clip-rule="evenodd"
          />
        </svg>
        <p class="min-w-0 flex-1 whitespace-nowrap leading-snug">
          Just a reminder that to access all the features of Downwork, you’ll need to
          <RouterLink
            :to="{ name: 'verify-email' }"
            class="cursor-pointer font-medium text-[#14A800] underline decoration-[#14A800]/35 underline-offset-2 hover:text-[#118800]"
          >
            verify your email address
          </RouterLink>.
        </p>
        <button
          type="button"
          class="shrink-0 cursor-pointer rounded p-1 text-amber-800/70 hover:bg-amber-100 hover:text-amber-950"
          aria-label="Dismiss reminder"
          @click="verifyBannerDismissed = true"
        >
          <svg class="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor" stroke-width="2">
            <path stroke-linecap="round" stroke-linejoin="round" d="M6 18L18 6M6 6l12 12" />
          </svg>
        </button>
      </div>

      <div class="mx-auto flex w-full max-w-lg flex-1 flex-col justify-center py-6 sm:py-10">
        <main class="flex w-full flex-col items-start text-left">
          <!-- Mark (knot-style loops, matches favicon feel) -->
          <div
            class="mb-8 flex h-14 w-14 items-center justify-center rounded-full border-2 border-black bg-white shadow-sm sm:mb-10"
            aria-hidden="true"
          >
            <svg class="h-8 w-8 text-black" viewBox="0 0 32 32" fill="none">
              <path
                d="M16 6c-3.5 0-6.5 2.2-7.6 5.3-.5 1.4-.7 2.9-.5 4.4.3 2.6 1.8 5 4 6.5M16 6c3.5 0 6.5 2.2 7.6 5.3.5 1.4.7 2.9.5 4.4-.3 2.6-1.8 5-4 6.5M16 26c-3.2 0-6-2-7.2-4.8"
                stroke="currentColor"
                stroke-width="2"
                stroke-linecap="round"
              />
              <path
                d="M16 26c3.2 0 6-2 7.2-4.8"
                stroke="currentColor"
                stroke-width="2"
                stroke-linecap="round"
              />
              <circle cx="11" cy="14" r="3.25" stroke="currentColor" stroke-width="1.75" />
              <circle cx="21" cy="14" r="3.25" stroke="currentColor" stroke-width="1.75" />
              <circle cx="16" cy="22" r="3.25" stroke="currentColor" stroke-width="1.75" />
            </svg>
          </div>

          <h1 class="text-2xl font-semibold leading-snug tracking-tight sm:text-[1.75rem]">
            Welcome, {{ firstName }}!<br />
            Let’s start with your first job post.
          </h1>
          <p class="mt-4 max-w-md text-sm leading-relaxed text-neutral-700 sm:text-base">
            It’s the fastest way to meet top talent.<br />
            Get help from AI and be done in no time.
          </p>

          <div class="mt-10 w-full max-w-sm space-y-4">
            <AppButton
              class="w-full !rounded-lg border-0 !bg-[#14A800] !text-white shadow-sm hover:!bg-[#118800] focus:!ring-[#14A800]"
              size="lg"
              variant="primary"
              @click="goPostJob(true)"
            >
              Get started using AI
            </AppButton>
            <button
              type="button"
              class="w-full cursor-pointer text-left text-sm font-medium text-[#14A800] hover:text-[#118800]"
              @click="goPostJob(false)"
            >
              I’ll do it without AI
            </button>
          </div>

          <p class="mt-6 max-w-md text-left text-xs leading-relaxed text-[#5E6D55] sm:mt-7">
            Beta feature powered by Uma, Downwork’s Mindful AI.
            <button
              type="button"
              class="cursor-pointer font-medium text-[#14A800] hover:text-[#118800]"
              @click="howItWorksOpen = !howItWorksOpen"
            >
              How it works
            </button>
          </p>
          <div
            v-if="howItWorksOpen"
            class="mt-2 w-full max-w-md rounded-lg border border-slate-200 bg-slate-50 px-4 py-3 text-left text-xs text-slate-600"
          >
            We’ll open the job post form. With AI enabled, you’ll see guidance to describe your role
            faster; you can always edit everything before publishing.
          </div>
        </main>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { computed, ref } from 'vue'
import { useRouter } from 'vue-router'
import { useAuthStore } from '@/stores/auth.store'
import AppButton from '@/components/ui/AppButton.vue'
import PublicNavbar from '@/components/layout/PublicNavbar.vue'

const router = useRouter()
const auth = useAuthStore()

const verifyBannerDismissed = ref(false)
const howItWorksOpen = ref(false)

const firstName = computed(() => auth.user?.firstName?.trim() || 'there')

const showVerifyBanner = computed(
  () => !verifyBannerDismissed.value && auth.user && !auth.user.isEmailVerified,
)

function goPostJob(withAi: boolean) {
  if (withAi) {
    void router.push({ name: 'client-new-job', query: { assist: 'ai' } })
  } else {
    void router.push({ name: 'client-new-job-guided' })
  }
}
</script>
