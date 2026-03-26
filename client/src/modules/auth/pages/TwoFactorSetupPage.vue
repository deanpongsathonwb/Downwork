<template>
  <div class="min-h-screen bg-slate-50 flex items-center justify-center p-4">
    <div class="bg-white rounded-2xl shadow-lg p-8 max-w-md w-full">
      <div class="text-center mb-6">
        <div class="w-16 h-16 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-4">
          <svg class="w-8 h-8 text-green-600" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z" />
          </svg>
        </div>
        <h1 class="text-2xl font-bold text-slate-900">Two-Factor Authentication</h1>
        <p class="text-slate-500 text-sm mt-1">Add an extra layer of security to your account</p>
      </div>

      <!-- Steps -->
      <div class="space-y-4">
        <div class="p-4 bg-slate-50 rounded-xl">
          <p class="text-sm font-semibold text-slate-700 mb-2">Step 1: Install Authenticator App</p>
          <p class="text-xs text-slate-500">Download Google Authenticator, Authy, or any TOTP-compatible app on your phone.</p>
        </div>

        <div class="p-4 bg-slate-50 rounded-xl">
          <p class="text-sm font-semibold text-slate-700 mb-3">Step 2: Scan QR Code</p>
          <!-- QR Code placeholder -->
          <div class="w-40 h-40 mx-auto bg-slate-200 rounded-lg flex items-center justify-center">
            <p class="text-xs text-slate-400 text-center">QR Code<br />appears here</p>
          </div>
          <div v-if="secret" class="mt-3 p-2.5 bg-slate-100 rounded-lg text-center">
            <p class="text-xs text-slate-500 mb-1">Manual entry key:</p>
            <code class="text-xs font-mono font-bold text-slate-800 tracking-widest">{{ secret }}</code>
          </div>
        </div>

        <div class="p-4 bg-slate-50 rounded-xl">
          <p class="text-sm font-semibold text-slate-700 mb-3">Step 3: Enter Verification Code</p>
          <div class="flex gap-2 justify-center">
            <input
              v-for="(_, i) in 6"
              :key="i"
              v-model="codeDigits[i]"
              maxlength="1"
              type="text"
              inputmode="numeric"
              class="w-10 h-12 text-center border border-slate-300 rounded-lg text-lg font-bold focus:outline-none focus:ring-2 focus:ring-green-500"
              @input="onDigitInput(i, $event)"
              @keydown.backspace="onBackspace(i)"
            />
          </div>
        </div>
      </div>

      <div class="flex gap-3 mt-6">
        <AppButton variant="outline" class="flex-1" @click="$router.back()">Cancel</AppButton>
        <AppButton class="flex-1" :disabled="code.length !== 6" @click="handleVerify">
          Enable 2FA
        </AppButton>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, computed, onMounted } from 'vue'
import { authService } from '@/services/api/auth.service'
import { useToastStore } from '@/stores/toast.store'
import { logger } from '@/utils/logger'
import AppButton from '@/components/ui/AppButton.vue'

const toast = useToastStore()
const secret = ref('')
const codeDigits = ref<string[]>(Array(6).fill(''))
const code = computed(() => codeDigits.value.join(''))

onMounted(async () => {
  try {
    const res = await authService.setup2FA()
    secret.value = res.data.secret
  } catch (err) {
    logger.catch(err, 'TwoFactorSetupPage')
    toast.error('2FA Setup Failed', 'Could not load the setup. Please try again.')
  }
})

function onDigitInput(index: number, event: Event): void {
  const target = event.target as HTMLInputElement
  const val = target.value.replace(/\D/g, '').slice(-1)
  codeDigits.value[index] = val
  if (val && index < 5) {
    const nextEl = document.querySelectorAll('input[type="text"]')[index + 1] as HTMLInputElement
    nextEl?.focus()
  }
}

function onBackspace(index: number): void {
  if (!codeDigits.value[index] && index > 0) {
    const prevEl = document.querySelectorAll('input[type="text"]')[index - 1] as HTMLInputElement
    prevEl?.focus()
  }
}

async function handleVerify(): Promise<void> {
  await authService.verify2FA(code.value)
}
</script>
