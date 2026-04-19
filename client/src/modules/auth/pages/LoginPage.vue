<template>
  <div>
    <form class="space-y-4" @submit.prevent="handleFormSubmit">
      <template v-if="step === 1">
        <h1 class="text-center text-2xl font-bold text-neutral-900 mb-8">Log in to Downwork</h1>
        <AppInput
          id="login-email"
          v-model="form.email"
          type="text"
          placeholder="Username or Email"
          autocomplete="username"
          inputmode="email"
          :error="errors.email"
        >
          <template #prefix>
            <svg class="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor" stroke-width="1.5" aria-hidden="true">
              <path stroke-linecap="round" stroke-linejoin="round" d="M15.75 6a3.75 3.75 0 11-7.5 0 3.75 3.75 0 017.5 0zM4.501 20.118a7.5 7.5 0 0114.998 0A17.933 17.933 0 0112 21.75c-2.676 0-5.216-.584-7.499-1.632z" />
            </svg>
          </template>
        </AppInput>

        <button
          type="button"
          class="w-full rounded-lg bg-[#14a800] py-3 text-center text-base font-semibold text-white shadow-sm transition hover:bg-[#118f00] focus:outline-none focus:ring-2 focus:ring-[#14a800] focus:ring-offset-2"
          @click="goToPasswordStep"
        >
          Continue
        </button>

        <div class="relative py-2">
          <div class="absolute inset-0 flex items-center" aria-hidden="true">
            <div class="w-full border-t border-[#d5d5d5]" />
          </div>
          <div class="relative flex justify-center text-sm">
            <span class="bg-white px-3 text-[#656565]">or</span>
          </div>
        </div>

        <button
          type="button"
          class="flex w-full items-center justify-center gap-3 rounded-lg bg-[#4285f4] py-3 text-sm font-semibold text-white shadow-sm transition hover:bg-[#3367d6] focus:outline-none focus:ring-2 focus:ring-[#4285f4] focus:ring-offset-2"
        >
          <span class="flex h-9 w-9 shrink-0 items-center justify-center rounded bg-white">
            <svg class="h-[22px] w-[22px]" viewBox="0 0 24 24" aria-hidden="true">
              <path fill="#4285F4" d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z" />
              <path fill="#34A853" d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z" />
              <path fill="#FBBC05" d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z" />
              <path fill="#EA4335" d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z" />
            </svg>
          </span>
          Continue with Google
        </button>
      </template>

      <template v-else>
        <h1 class="text-center text-2xl font-bold text-neutral-900">Welcome</h1>
        <p class="text-center text-base font-normal text-slate-700 mt-3 mb-2">
          {{ form.email }}
        </p>

        <div class="pt-2">
          <AppInput
            id="login-password"
            v-model="form.password"
            type="password"
            placeholder="Password"
            autocomplete="current-password"
            :error="errors.password"
          >
            <template #prefix>
              <svg class="w-5 h-5 text-neutral-900" fill="none" viewBox="0 0 24 24" stroke="currentColor" stroke-width="1.5" aria-hidden="true">
                <path stroke-linecap="round" stroke-linejoin="round" d="M16.5 10.5V6.75a4.5 4.5 0 10-9 0v3.75m-.75 11.25h10.5a2.25 2.25 0 002.25-2.25v-6.75a2.25 2.25 0 00-2.25-2.25H6.75a2.25 2.25 0 00-2.25 2.25v6.75a2.25 2.25 0 002.25 2.25z" />
              </svg>
            </template>
          </AppInput>
        </div>

        <div class="flex items-center justify-between gap-4 pt-1">
          <label class="flex cursor-pointer items-center gap-2 text-sm text-[#656565] select-none">
            <input
              v-model="keepLoggedIn"
              type="checkbox"
              class="h-4 w-4 rounded border-[#d5d5d5] text-[#14a800] focus:ring-[#14a800] focus:ring-offset-0"
            />
            Keep me logged in
          </label>
          <RouterLink
            to="/auth/forgot-password"
            class="shrink-0 text-sm font-medium text-[#14a800] hover:underline"
          >
            Forgot password?
          </RouterLink>
        </div>

        <button
          type="submit"
          class="w-full rounded-lg bg-[#14a800] py-3 text-center text-base font-semibold text-white shadow-sm transition hover:bg-[#118f00] focus:outline-none focus:ring-2 focus:ring-[#14a800] focus:ring-offset-2 disabled:opacity-50"
          :disabled="auth.isLoading"
        >
          <span v-if="auth.isLoading" class="inline-flex items-center gap-2">
            <svg class="h-5 w-5 animate-spin" fill="none" viewBox="0 0 24 24" aria-hidden="true">
              <circle class="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" stroke-width="4" />
              <path class="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4z" />
            </svg>
            Signing in
          </span>
          <span v-else>Log in</span>
        </button>

        <p class="text-center pt-2">
          <button
            type="button"
            class="text-sm font-medium text-[#14a800] hover:underline"
            @click="notYou"
          >
            Not you?
          </button>
        </p>
      </template>
    </form>

    <div v-if="step === 1" class="mt-10 space-y-4 text-center">
      <p class="text-sm text-[#656565]">Don't have a Downwork account?</p>
      <RouterLink
        to="/auth/signup"
        class="flex w-full items-center justify-center rounded-lg border-2 border-[#14a800] bg-white py-3 text-sm font-semibold text-[#14a800] transition hover:bg-[#14a800]/5 focus:outline-none focus:ring-2 focus:ring-[#14a800] focus:ring-offset-2"
      >
        Sign Up
      </RouterLink>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, reactive, nextTick, watch, onMounted } from 'vue'
import { RouterLink } from 'vue-router'
import { useAuthStore } from '@/stores/auth.store'
import AppInput from '@/components/ui/AppInput.vue'

const auth = useAuthStore()
const step = ref<1 | 2>(1)
const keepLoggedIn = ref(false)

const form = reactive({ email: '', password: '' })
const errors = reactive({ email: '', password: '' })

const EMAIL_REGEX = /^[^\s@]+@[^\s@]+\.[^\s@]+$/
/** 3–32 chars: letters, numbers, . _ - (matches server login identifier when not an email). */
const USERNAME_REGEX = /^[a-zA-Z0-9._-]{3,32}$/

watch(
  () => form.password,
  () => {
    if (errors.password) errors.password = ''
  },
)

function focusEmailField(): void {
  void nextTick(() => {
    document.getElementById('login-email')?.focus()
  })
}

onMounted(() => {
  if (step.value === 1) {
    focusEmailField()
  }
})

function goToPasswordStep(): void {
  errors.email = ''
  errors.password = ''
  const id = form.email.trim()
  if (!id) {
    errors.email = 'Please enter your username or email.'
    return
  }
  const isEmail = EMAIL_REGEX.test(id)
  const isUsername = USERNAME_REGEX.test(id)
  if (!isEmail && !isUsername) {
    errors.email = 'Please enter a valid email address or username.'
    return
  }
  step.value = 2
  void nextTick(() => {
    document.getElementById('login-password')?.focus()
  })
}

function notYou(): void {
  form.password = ''
  errors.password = ''
  step.value = 1
  focusEmailField()
}

function handleFormSubmit(): void {
  if (step.value === 1) {
    goToPasswordStep()
    return
  }
  void handleLogin()
}

async function handleLogin(): Promise<void> {
  errors.password = ''
  const ok = await auth.login(form.email, form.password)
  if (!ok) {
    errors.password = auth.error ?? 'Username or password is incorrect.'
  }
}
</script>
