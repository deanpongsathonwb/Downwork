<template>
  <div>
    <div class="mb-6">
      <h1 class="text-2xl font-bold text-slate-900">Reset your password</h1>
      <p class="text-slate-500 mt-1 text-sm">Enter your email and we'll send you a reset link.</p>
    </div>

    <div v-if="sent" class="text-center py-4">
      <div class="w-16 h-16 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-4">
        <svg class="w-8 h-8 text-green-600" fill="none" viewBox="0 0 24 24" stroke="currentColor">
          <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M3 8l7.89 5.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" />
        </svg>
      </div>
      <h2 class="text-lg font-semibold text-slate-900 mb-2">Check your inbox</h2>
      <p class="text-sm text-slate-500 mb-6">We sent a password reset link to <strong>{{ email }}</strong></p>
      <RouterLink to="/auth/login" class="text-green-600 font-medium text-sm hover:text-green-700">
        Back to Sign In
      </RouterLink>
    </div>

    <form v-else class="space-y-4" @submit.prevent="handleSubmit">
      <AppInput v-model="email" label="Email Address" type="email" placeholder="you@example.com" required />
      <AppButton type="submit" class="w-full" size="lg" :loading="auth.isLoading">
        Send Reset Link
      </AppButton>
      <div class="text-center">
        <RouterLink to="/auth/login" class="text-sm text-slate-500 hover:text-slate-700">
          ← Back to Sign In
        </RouterLink>
      </div>
    </form>
  </div>
</template>

<script setup lang="ts">
import { ref } from 'vue'
import { RouterLink } from 'vue-router'
import { useAuthStore } from '@/stores/auth.store'
import AppInput from '@/components/ui/AppInput.vue'
import AppButton from '@/components/ui/AppButton.vue'

const auth = useAuthStore()
const email = ref('')
const sent = ref(false)

async function handleSubmit(): Promise<void> {
  const ok = await auth.forgotPassword(email.value)
  if (ok) sent.value = true
}
</script>
