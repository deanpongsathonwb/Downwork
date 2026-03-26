<template>
  <div class="min-h-screen bg-slate-50 flex items-center justify-center p-4">
    <div class="bg-white rounded-2xl shadow-lg p-8 max-w-md w-full text-center">
      <div class="w-16 h-16 bg-blue-100 rounded-full flex items-center justify-center mx-auto mb-4">
        <svg class="w-8 h-8 text-blue-600" fill="none" viewBox="0 0 24 24" stroke="currentColor">
          <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M3 8l7.89 5.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" />
        </svg>
      </div>

      <h1 class="text-2xl font-bold text-slate-900 mb-2">Verify your email</h1>

      <div v-if="verifying" class="text-slate-500 text-sm">Verifying your email...</div>
      <div v-else-if="verified">
        <p class="text-slate-500 text-sm mb-6">Your email has been verified successfully!</p>
        <RouterLink to="/auth/login" class="px-6 py-2.5 bg-green-600 text-white rounded-xl font-medium text-sm hover:bg-green-700 transition-colors">
          Continue to Sign In
        </RouterLink>
      </div>
      <div v-else>
        <p class="text-slate-500 text-sm mb-2">We sent a verification email to your inbox.</p>
        <p class="text-slate-400 text-xs mb-6">Check your spam folder if you don't see it.</p>
        <button class="text-green-600 font-medium text-sm hover:text-green-700" @click="resend">
          Resend verification email
        </button>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, onMounted } from 'vue'
import { useRoute, RouterLink } from 'vue-router'
import { useAuthStore } from '@/stores/auth.store'

const auth = useAuthStore()
const route = useRoute()
const verifying = ref(false)
const verified = ref(false)
const token = route.query.token as string | undefined

onMounted(async () => {
  if (token) {
    verifying.value = true
    verified.value = await auth.verifyEmail(token)
    verifying.value = false
  }
})

async function resend(): Promise<void> {
  if (auth.user?.email) {
    await auth.forgotPassword(auth.user.email)
  }
}
</script>
