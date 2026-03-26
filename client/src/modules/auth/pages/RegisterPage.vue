<template>
  <div>
    <!-- Role Selection -->
    <div v-if="step === 1">
      <div class="mb-6">
        <h1 class="text-2xl font-bold text-slate-900">Join Downwork</h1>
        <p class="text-slate-500 mt-1 text-sm">Choose how you want to use Downwork</p>
      </div>

      <div class="space-y-3 mb-6">
        <button
          v-for="roleOpt in roleOptions"
          :key="roleOpt.value"
          type="button"
          :class="[
            'w-full flex items-center gap-4 p-4 border-2 rounded-2xl text-left transition-all',
            form.role === roleOpt.value
              ? 'border-green-500 bg-green-50'
              : 'border-slate-200 hover:border-slate-300 bg-white',
          ]"
          @click="form.role = roleOpt.value as 'freelancer' | 'client'"
        >
          <div :class="['w-12 h-12 rounded-xl flex items-center justify-center text-2xl', roleOpt.value === form.role ? 'bg-green-100' : 'bg-slate-100']">
            {{ roleOpt.emoji }}
          </div>
          <div class="flex-1">
            <p class="font-semibold text-slate-900">{{ roleOpt.label }}</p>
            <p class="text-sm text-slate-500">{{ roleOpt.description }}</p>
          </div>
          <div :class="['w-5 h-5 rounded-full border-2 flex items-center justify-center', form.role === roleOpt.value ? 'border-green-500 bg-green-500' : 'border-slate-300']">
            <svg v-if="form.role === roleOpt.value" class="w-3 h-3 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="3" d="M5 13l4 4L19 7" />
            </svg>
          </div>
        </button>
      </div>

      <AppButton class="w-full" size="lg" :disabled="!form.role" @click="step = 2">
        Continue
      </AppButton>

      <p class="text-center text-sm text-slate-500 mt-4">
        Already have an account?
        <RouterLink to="/auth/login" class="text-green-600 font-medium hover:text-green-700">Sign in</RouterLink>
      </p>
    </div>

    <!-- Registration Form -->
    <div v-else>
      <button class="flex items-center gap-1 text-sm text-slate-500 hover:text-slate-700 mb-5" @click="step = 1">
        <svg class="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
          <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M15 19l-7-7 7-7" />
        </svg>
        Back
      </button>

      <div class="mb-6">
        <h1 class="text-2xl font-bold text-slate-900">Create your account</h1>
        <p class="text-slate-500 mt-1 text-sm">
          Joining as a
          <span class="font-medium text-green-600 capitalize">{{ form.role }}</span>
        </p>
      </div>

      <form class="space-y-4" @submit.prevent="handleRegister">
        <div class="grid grid-cols-2 gap-3">
          <AppInput v-model="form.firstName" label="First Name" placeholder="John" required :error="errors.firstName" />
          <AppInput v-model="form.lastName" label="Last Name" placeholder="Doe" required :error="errors.lastName" />
        </div>
        <AppInput v-model="form.email" label="Email" type="email" placeholder="you@example.com" required :error="errors.email" />
        <AppInput v-model="form.password" label="Password" type="password" placeholder="Min. 8 characters" required :error="errors.password" />
        <AppInput v-model="form.confirmPassword" label="Confirm Password" type="password" placeholder="Repeat your password" required :error="errors.confirmPassword" />

        <div class="flex items-start gap-2 pt-1">
          <input id="terms" v-model="form.acceptTerms" type="checkbox" class="mt-0.5 accent-green-600" />
          <label for="terms" class="text-xs text-slate-500 leading-relaxed">
            I agree to the
            <RouterLink to="/terms-of-service" class="text-green-600 font-medium hover:text-green-700">Terms of Service</RouterLink>
            and
            <RouterLink to="/privacy-policy" class="text-green-600 font-medium hover:text-green-700">Privacy Policy</RouterLink>
          </label>
        </div>

        <AppButton type="submit" class="w-full" size="lg" :loading="auth.isLoading" :disabled="!form.acceptTerms">
          Create Account
        </AppButton>
      </form>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, reactive } from 'vue'
import { RouterLink } from 'vue-router'
import { useAuthStore } from '@/stores/auth.store'
import AppInput from '@/components/ui/AppInput.vue'
import AppButton from '@/components/ui/AppButton.vue'

const auth = useAuthStore()
const step = ref(1)

const form = reactive({
  role: '' as 'freelancer' | 'client' | '',
  firstName: '',
  lastName: '',
  email: '',
  password: '',
  confirmPassword: '',
  acceptTerms: false,
})

const errors = reactive({ firstName: '', lastName: '', email: '', password: '', confirmPassword: '' })

const roleOptions = [
  { value: 'freelancer', label: 'I want to work', description: 'Find clients and grow your freelance business', emoji: '💼' },
  { value: 'client', label: 'I want to hire', description: 'Post jobs and hire top freelancers', emoji: '🏢' },
]

const EMAIL_REGEX = /^[^\s@]+@[^\s@]+\.[^\s@]+$/

function validate(): boolean {
  let valid = true
  Object.keys(errors).forEach((k) => { (errors as Record<string, string>)[k] = '' })
  if (!form.firstName.trim()) { errors.firstName = 'First name is required.'; valid = false }
  if (!form.lastName.trim()) { errors.lastName = 'Last name is required.'; valid = false }
  if (!EMAIL_REGEX.test(form.email)) { errors.email = 'Please enter a valid email address.'; valid = false }
  if (form.password.length < 8) { errors.password = 'Password must be at least 8 characters.'; valid = false }
  if (form.password !== form.confirmPassword) { errors.confirmPassword = 'Passwords do not match.'; valid = false }
  return valid
}

async function handleRegister(): Promise<void> {
  if (!validate() || !form.role) return
  await auth.register({
    email: form.email,
    password: form.password,
    firstName: form.firstName,
    lastName: form.lastName,
    role: form.role,
  })
}
</script>
