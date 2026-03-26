<template>
  <div>
    <div class="mb-6">
      <h1 class="text-2xl font-bold text-slate-900">Welcome back</h1>
      <p class="text-slate-500 mt-1 text-sm">Sign in to your Downwork account</p>
    </div>

    <form class="space-y-4" @submit.prevent="handleLogin">
      <AppInput
        v-model="form.email"
        label="Email Address"
        type="email"
        placeholder="you@example.com"
        required
        :error="errors.email"
      />

      <div>
        <AppInput
          v-model="form.password"
          :type="showPassword ? 'text' : 'password'"
          label="Password"
          placeholder="Enter your password"
          required
          :error="errors.password"
        >
          <template #suffix>
            <button
              type="button"
              class="text-slate-400 hover:text-slate-600"
              :aria-label="showPassword ? 'Hide password' : 'Show password'"
              @click="showPassword = !showPassword"
            >
              <svg class="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" aria-hidden="true">
                <path v-if="!showPassword" stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M15 12a3 3 0 11-6 0 3 3 0 016 0z M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z" />
                <path v-else stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M13.875 18.825A10.05 10.05 0 0112 19c-4.478 0-8.268-2.943-9.543-7a9.97 9.97 0 011.563-3.029m5.858.908a3 3 0 114.243 4.243M9.878 9.878l4.242 4.242M9.88 9.88l-3.29-3.29m7.532 7.532l3.29 3.29M3 3l3.59 3.59m0 0A9.953 9.953 0 0112 5c4.478 0 8.268 2.943 9.543 7a10.025 10.025 0 01-4.132 5.411m0 0L21 21" />
              </svg>
            </button>
          </template>
        </AppInput>
        <div class="flex justify-end mt-1.5">
          <RouterLink to="/auth/forgot-password" class="text-xs text-green-600 hover:text-green-700 font-medium">
            Forgot password?
          </RouterLink>
        </div>
      </div>

      <AppButton type="submit" class="w-full" size="lg" :loading="auth.isLoading">
        Sign In
      </AppButton>
    </form>

    <!-- Divider -->
    <div class="relative my-6">
      <div class="absolute inset-0 flex items-center">
        <div class="w-full border-t border-slate-200" />
      </div>
      <div class="relative flex justify-center">
        <span class="bg-white px-3 text-xs text-slate-400 font-medium">OR CONTINUE WITH</span>
      </div>
    </div>

    <!-- Demo quick-login buttons -->
    <div class="grid grid-cols-3 gap-2 mb-6">
      <button
        v-for="demo in demoUsers"
        :key="demo.role"
        type="button"
        class="flex flex-col items-center gap-1 px-2 py-2.5 border border-slate-200 rounded-xl text-xs font-medium text-slate-600 hover:bg-slate-50 hover:border-slate-300 transition-colors"
        :aria-label="`Sign in as demo ${demo.label}`"
        @click="loginAsDemo(demo)"
      >
        <span class="text-lg" aria-hidden="true">{{ demo.emoji }}</span>
        {{ demo.label }}
      </button>
    </div>

    <p class="text-center text-sm text-slate-500">
      Don't have an account?
      <RouterLink to="/auth/register" class="text-green-600 font-medium hover:text-green-700">
        Sign up free
      </RouterLink>
    </p>
  </div>
</template>

<script setup lang="ts">
import { ref, reactive } from 'vue'
import { RouterLink } from 'vue-router'
import { useAuthStore } from '@/stores/auth.store'
import AppInput from '@/components/ui/AppInput.vue'
import AppButton from '@/components/ui/AppButton.vue'

const auth = useAuthStore()
const showPassword = ref(false)

const form = reactive({ email: '', password: '' })
const errors = reactive({ email: '', password: '' })

const EMAIL_REGEX = /^[^\s@]+@[^\s@]+\.[^\s@]+$/

function validate(): boolean {
  let valid = true
  errors.email = ''
  errors.password = ''
  if (!EMAIL_REGEX.test(form.email)) { errors.email = 'Please enter a valid email address.'; valid = false }
  if (form.password.length < 8) { errors.password = 'Password must be at least 8 characters.'; valid = false }
  return valid
}

async function handleLogin(): Promise<void> {
  if (!validate()) return
  await auth.login(form.email, form.password)
}

const demoUsers = [
  { role: 'freelancer', label: 'Freelancer', emoji: '💼', email: 'freelancer@demo.com', password: 'demo1234' },
  { role: 'client', label: 'Client', emoji: '🏢', email: 'client@demo.com', password: 'demo1234' },
  { role: 'admin', label: 'Admin', emoji: '🛡️', email: 'admin@demo.com', password: 'demo1234' },
]

async function loginAsDemo(demo: { email: string; password: string }): Promise<void> {
  form.email = demo.email
  form.password = demo.password
  await auth.login(demo.email, demo.password)
}
</script>
