<template>
  <div class="flex min-h-screen flex-col bg-[#f2f2f2] text-neutral-900">
    <header class="mx-auto flex w-full max-w-6xl items-center justify-between px-6 pt-6">
      <AppLogo size="md" />
      <AuthAccountDropdown />
    </header>
    <main class="mx-auto flex w-full max-w-3xl flex-1 flex-col items-center justify-center px-6 py-12 text-center">
      <div class="mb-8" aria-hidden="true">
        <div class="relative">
          <svg class="h-24 w-24 sm:h-28 sm:w-28" viewBox="0 0 120 100" fill="none" xmlns="http://www.w3.org/2000/svg">
            <path d="M10 20h100v60a8 8 0 0 1-8 8H18a8 8 0 0 1-8-8V20z" fill="#dbe5dd" />
            <path d="M10 20l50 34 50-34v-2a8 8 0 0 0-8-8H18a8 8 0 0 0-8 8v2z" fill="#e6eeea" />
            <path d="M10 80l36-28m64 28L74 52" stroke="#c9d7ce" stroke-width="2" />
          </svg>
          <span class="absolute -right-1 -top-2 inline-flex h-9 w-9 items-center justify-center rounded-full bg-pink-400 shadow-sm">
            <span class="h-2.5 w-2.5 rounded-full bg-pink-200" />
          </span>
        </div>
      </div>

      <h1 class="mb-4 text-3xl font-semibold tracking-tight text-black sm:text-4xl">Verify your email to continue</h1>

      <p class="max-w-xl text-lg text-neutral-600">
        We just sent an email to the address: {{ emailForDisplay }}
      </p>
      <p class="mb-10 max-w-xl text-lg text-neutral-600">
        Please check your email and select the link provided to verify your address.
      </p>

      <div class="mb-8 flex flex-wrap items-center justify-center gap-2.5 sm:gap-3">
        <button
          type="button"
          class="cursor-pointer rounded-lg border-2 border-[#108a00] px-5 py-2 text-sm font-medium text-[#108a00] transition hover:bg-[#edf8ed] disabled:cursor-not-allowed disabled:opacity-60 sm:px-6 sm:text-base"
          :disabled="resending"
          @click="handleResend"
        >
          {{ resending ? 'Sending...' : 'Send again' }}
        </button>
        <button
          type="button"
          class="cursor-pointer rounded-lg bg-[#108a00] px-5 py-2 text-sm font-medium text-white transition hover:bg-[#0e7a00] sm:px-6 sm:text-base"
          @click="openGmailInbox"
        >
          Go to Gmail Inbox
        </button>
      </div>

      <a href="#" class="text-xl text-[#108a00] underline underline-offset-4 hover:text-[#0e7a00]" @click.prevent="handleResend">
        Didn't receive email?
      </a>
    </main>

    <div class="shrink-0 pb-4 pt-2 sm:pb-6 lg:pb-8">
      <PublicFooter />
    </div>
  </div>
</template>

<script setup lang="ts">
import { computed, ref } from 'vue'
import { useAuthStore } from '@/stores/auth.store'
import { authService } from '@/services/api/auth.service'
import { useToastStore } from '@/stores/toast.store'
import { logger } from '@/utils/logger'
import AppLogo from '@/components/common/AppLogo.vue'
import PublicFooter from '@/components/layout/PublicFooter.vue'
import AuthAccountDropdown from '@/modules/auth/components/AuthAccountDropdown.vue'

const auth = useAuthStore()
const toast = useToastStore()
const resending = ref(false)

const emailForDisplay = computed(() => auth.user?.email || 'your email address')

async function handleResend(): Promise<void> {
  if (resending.value) return
  resending.value = true
  try {
    await authService.resendVerificationEmail()
    toast.success('Email sent', 'We sent another verification email to your inbox.')
  } catch (err) {
    logger.catch(err, 'PleaseVerifyPage.handleResend')
    toast.error('Unable to resend', 'Please try again in a moment.')
  } finally {
    resending.value = false
  }
}

function openGmailInbox(): void {
  window.open('https://mail.google.com', '_blank', 'noopener,noreferrer')
}
</script>
