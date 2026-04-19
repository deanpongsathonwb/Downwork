<template>
  <div>
    <!-- Role Selection -->
    <div v-if="step === 1" class="mx-auto max-w-[640px]">
      <h1 class="text-2xl sm:text-3xl font-semibold text-center text-black mb-8 sm:mb-10">
        Join as a client or freelancer
      </h1>

      <div class="grid grid-cols-1 sm:grid-cols-2 gap-4 mb-8 items-stretch">
        <button
          v-for="roleOpt in roleOptions"
          :key="roleOpt.value"
          type="button"
          :class="[
            'relative rounded-xl p-5 sm:p-6 text-left bg-white outline-none focus-visible:ring-2 focus-visible:ring-black focus-visible:ring-offset-2',
            'border-2 transition-[border-color,box-shadow,transform] duration-200 ease-out motion-reduce:transition-none motion-reduce:scale-100',
            form.role === roleOpt.value
              ? 'border-black shadow-sm scale-[1.02] z-[1]'
              : 'border-neutral-300 shadow-none scale-100 hover:border-neutral-400',
          ]"
          @click="form.role = roleOpt.value as 'freelancer' | 'client'"
        >
          <div class="flex justify-between items-start gap-3 mb-10 sm:mb-12">
            <div
              class="flex items-center gap-2 text-black [&_svg]:w-7 [&_svg]:h-7 [&_svg]:stroke-[1.75] stroke-current fill-none"
              aria-hidden="true"
            >
              <template v-if="roleOpt.value === 'client'">
                <svg viewBox="0 0 24 24">
                  <path
                    stroke-linecap="round"
                    stroke-linejoin="round"
                    d="M20.25 14.15v4.25c0 1.094-.787 2.036-1.872 2.18-2.087.277-4.216.42-6.378.42s-4.291-.143-6.378-.42c-1.085-.144-1.872-1.086-1.872-2.18v-4.25m16.5 0a2.18 2.18 0 00.75-1.661V8.706c0-1.081-.768-2.015-1.837-2.175a48.114 48.114 0 00-3.413-.387m4.5 8.006c-.194.165-.42.295-.673.38A23.978 23.978 0 0112 15.75c-2.648 0-5.195-.429-7.577-1.22a2.016 2.016 0 01-.673-.38m0 0A2.18 2.18 0 013 12.489V8.706c0-1.081.768-2.015 1.837-2.175a48.111 48.111 0 013.413-.387m7.5 0V5.25A2.25 2.25 0 0013.5 3h-3a2.25 2.25 0 00-2.25 2.25v.894m7.5 0a48.667 48.667 0 00-7.5 0M12 12.75h.008v.008H12v-.008z"
                  />
                </svg>
              </template>
              <template v-else>
                <svg viewBox="0 0 24 24">
                  <path
                    stroke-linecap="round"
                    stroke-linejoin="round"
                    d="M9 17.25v1.007a3 3 0 01-.879 2.122L7.5 21h9l-.621-.621A3 3 0 0115 18.257V17.25m6-12V15a2.25 2.25 0 01-2.25 2.25H5.25A2.25 2.25 0 013 15V5.25m18 0A2.25 2.25 0 0018.75 3H5.25A2.25 2.25 0 003 5.25m18 0V12a2.25 2.25 0 01-2.25 2.25H5.25A2.25 2.25 0 013 12V5.25"
                  />
                </svg>
              </template>
            </div>
            <span
              :class="[
                'w-5 h-5 rounded-full border-2 shrink-0 flex items-center justify-center mt-0.5 transition-[border-color] duration-200',
                form.role === roleOpt.value ? 'border-[#108a00]' : 'border-neutral-400',
              ]"
              aria-hidden="true"
            >
              <span
                class="w-2.5 h-2.5 rounded-full bg-[#108a00] transition-[opacity,transform] duration-200 ease-out motion-reduce:transition-none"
                :class="
                  form.role === roleOpt.value
                    ? 'opacity-100 scale-100'
                    : 'opacity-0 scale-50 pointer-events-none'
                "
              />
            </span>
          </div>
          <p class="font-bold text-black text-[15px] sm:text-base leading-snug pr-2">
            {{ roleOpt.label }}
          </p>
        </button>
      </div>

      <button
        type="button"
        :class="[
          'mx-auto block w-fit max-w-full px-8 sm:px-10 py-3.5 rounded-xl text-[15px] font-semibold transition-colors',
          !form.role
            ? 'bg-neutral-200 text-neutral-500 cursor-not-allowed'
            : 'bg-[#108a00] text-white shadow-sm hover:bg-[#0e7a00] focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[#108a00]',
        ]"
        :disabled="!form.role"
        @click="step = 2"
      >
        {{ primaryCtaLabel }}
      </button>

      <p class="text-center text-sm text-neutral-800 mt-5">
        Already have an account?
        <RouterLink
          to="/auth/login"
          class="text-[#108a00] font-semibold underline underline-offset-2 hover:text-[#0e7a00]"
        >
          Log In
        </RouterLink>
      </p>
    </div>

    <!-- Registration Form (Upwork-style) -->
    <div v-else class="mx-auto w-full max-w-[480px]">
      <button
        type="button"
        class="flex items-center gap-1 text-sm text-neutral-600 hover:text-neutral-900 mb-6"
        @click="goToRoleStep"
      >
        <svg class="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" stroke-width="2">
          <path stroke-linecap="round" stroke-linejoin="round" d="M15 19l-7-7 7-7" />
        </svg>
        Back
      </button>

      <h1 class="text-center text-2xl font-bold text-black mb-6">
        {{ signupHeadline }}
      </h1>

      <div class="mb-4">
        <button
          type="button"
          class="flex w-full items-center justify-center gap-3 rounded-lg bg-[#4285f4] py-3 px-3 text-sm font-semibold text-white shadow-sm transition hover:bg-[#3367d6] focus:outline-none focus:ring-2 focus:ring-[#4285f4] focus:ring-offset-2"
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
      </div>

      <div class="relative py-3" aria-hidden="true">
        <div class="absolute inset-0 flex items-center">
          <div class="w-full border-t border-neutral-300" />
        </div>
        <div class="relative flex justify-center text-sm">
          <span class="bg-white px-3 text-neutral-500">or</span>
        </div>
      </div>

      <form class="space-y-4 pt-1" @submit.prevent="handleRegister">
        <div class="grid grid-cols-2 gap-3">
          <AppInput v-model="form.firstName" label="First name" :error="errors.firstName" />
          <AppInput v-model="form.lastName" label="Last name" :error="errors.lastName" />
        </div>
        <AppInput
          v-model="form.email"
          :label="emailFieldLabel"
          type="email"
          autocomplete="email"
          :error="errors.email"
        >
          <template #error-after>
            <RouterLink
              v-if="emailAlreadyRegistered"
              to="/auth/login"
              class="text-[#108a00] font-semibold underline underline-offset-2 hover:text-[#0e7a00] whitespace-nowrap"
            >
              Want to log in?
            </RouterLink>
          </template>
        </AppInput>
        <AppInput
          v-model="form.password"
          label="Password"
          type="password"
          autocomplete="new-password"
          placeholder="Password (8 or more characters)"
          :error="errors.password"
          :warning="passwordFieldWarning"
          @focus="passwordFieldFocused = true"
          @blur="passwordFieldFocused = false"
        />

        <div class="flex flex-col gap-1.5">
          <label for="register-country" class="text-sm font-medium text-slate-700">Country</label>
          <select
            id="register-country"
            v-model="form.country"
            class="w-full cursor-pointer appearance-none rounded-xl border border-slate-300 bg-white bg-[length:1.25rem_1.25rem] bg-[position:right_1rem_center] bg-no-repeat py-2.5 pl-4 pr-11 text-sm text-slate-900 transition-colors focus:border-transparent focus:outline-none focus:ring-2 focus:ring-[#108a00] bg-[url('data:image/svg+xml,%3Csvg%20xmlns%3D%22http%3A%2F%2Fwww.w3.org%2F2000%2Fsvg%22%20width%3D%2220%22%20height%3D%2220%22%20fill%3D%22none%22%20viewBox%3D%220%200%2024%2024%22%20stroke%3D%22%23334155%22%20stroke-width%3D%222%22%20stroke-linecap%3D%22round%22%20stroke-linejoin%3D%22round%22%3E%3Cpath%20d%3D%22M6%209l6%206%206-6%22%2F%3E%3C%2Fsvg%3E')]"
          >
            <option v-for="c in countryOptions" :key="c.code" :value="c.code">
              {{ c.name }}
            </option>
          </select>
        </div>

        <div class="flex items-start gap-3 pt-2">
          <input
            id="register-marketing"
            v-model="form.marketingOptIn"
            type="checkbox"
            class="mt-1 h-4 w-4 shrink-0 rounded border-neutral-300 text-[#108a00] focus:ring-[#108a00]"
          />
          <label for="register-marketing" class="text-sm text-neutral-700 leading-snug cursor-pointer">
            {{ marketingEmailLabel }}
          </label>
        </div>

        <div class="flex items-start gap-3">
          <input
            id="register-terms"
            v-model="form.acceptTerms"
            type="checkbox"
            class="mt-1 h-4 w-4 shrink-0 rounded border-neutral-300 text-[#108a00] focus:ring-[#108a00]"
          />
          <label for="register-terms" class="text-sm text-neutral-700 leading-snug cursor-pointer">
            Yes, I understand and agree to the Downwork
            <RouterLink to="/terms-of-service" class="text-[#108a00] font-medium hover:text-[#0e7a00]">
              Terms of Service
            </RouterLink>
            , including the
            <RouterLink to="/terms-of-service" class="text-[#108a00] font-medium hover:text-[#0e7a00]">
              User Agreement
            </RouterLink>
            and
            <RouterLink to="/privacy-policy" class="text-[#108a00] font-medium hover:text-[#0e7a00]">
              Privacy Policy
            </RouterLink>
            .
          </label>
        </div>

        <button
          type="submit"
          class="w-full rounded-xl bg-[#108a00] py-3.5 text-center text-base font-semibold text-white shadow-sm transition hover:bg-[#0e7a00] focus:outline-none focus:ring-2 focus:ring-[#108a00] focus:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-60"
          :disabled="!form.acceptTerms || auth.isLoading"
        >
          <span v-if="auth.isLoading" class="inline-flex items-center gap-2">
            <svg class="h-5 w-5 animate-spin" fill="none" viewBox="0 0 24 24" aria-hidden="true">
              <circle class="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" stroke-width="4" />
              <path class="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4z" />
            </svg>
            Creating…
          </span>
          <span v-else>Create my account</span>
        </button>
      </form>

      <p class="text-center text-sm text-neutral-800 mt-6">
        Already have an account?
        <RouterLink
          to="/auth/login"
          class="text-[#108a00] font-semibold underline underline-offset-2 hover:text-[#0e7a00]"
        >
          Log In
        </RouterLink>
      </p>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, reactive, computed, watch, onMounted } from 'vue'
import { watchDebounced } from '@vueuse/core'
import { RouterLink, useRoute, useRouter, onBeforeRouteUpdate } from 'vue-router'
import { useAuthStore } from '@/stores/auth.store'
import { useSignupFlowStore } from '@/stores/signup-flow.store'
import { authService } from '@/services/api/auth.service'
import AppInput from '@/components/ui/AppInput.vue'

const auth = useAuthStore()
const route = useRoute()
const router = useRouter()
const signupFlow = useSignupFlowStore()
const step = ref(1)

const form = reactive({
  role: '' as 'freelancer' | 'client' | '',
  firstName: '',
  lastName: '',
  email: '',
  password: '',
  country: 'TH',
  marketingOptIn: true,
  acceptTerms: false,
})

function normalizeQueryRole(raw: unknown): 'client' | 'freelancer' | null {
  const r = Array.isArray(raw) ? raw[0] : raw
  return r === 'client' || r === 'freelancer' ? r : null
}

function isSignupDeepLinkQuery(q: typeof route.query): boolean {
  const reg = q.register
  const registerOk = reg === '1' || reg === 'true'
  return registerOk && !!normalizeQueryRole(q.role)
}

function applySignupDeepLinkFromQuery(q: typeof route.query): boolean {
  const role = normalizeQueryRole(q.role)
  if (!isSignupDeepLinkQuery(q) || !role) return false
  form.role = role
  step.value = 2
  syncSignupFlowStore()
  void router.replace({ name: 'signup', query: {} })
  return true
}

function syncSignupFlowStore(): void {
  const r =
    step.value === 2 && (form.role === 'client' || form.role === 'freelancer') ? form.role : null
  signupFlow.setFormStep(step.value === 2 ? 2 : 1, r)
}

watch(() => [step.value, form.role] as const, syncSignupFlowStore, { immediate: true })

/** Header “switch role” updates the store; mirror into local form state. */
watch(
  () => [signupFlow.step, signupFlow.role] as const,
  ([s, r]) => {
    if (route.name !== 'signup') return
    if (s === 2 && r && (step.value !== 2 || form.role !== r)) {
      step.value = 2
      form.role = r
    }
  },
)

onMounted(() => {
  if (route.name !== 'signup') return
  if (applySignupDeepLinkFromQuery(route.query)) return
  step.value = 1
  form.role = ''
  signupFlow.reset()
  syncSignupFlowStore()
})

onBeforeRouteUpdate((to) => {
  if (to.name !== 'signup') return
  if (applySignupDeepLinkFromQuery(to.query)) return
})

function goToRoleStep(): void {
  step.value = 1
  form.role = ''
}

const errors = reactive({ firstName: '', lastName: '', email: '', password: '' })
const emailAlreadyRegistered = ref(false)
const passwordFieldFocused = ref(false)

const EMAIL_IN_USE_MSG = 'This email is already in use.'

/** Clear submit-time red errors while the user edits (same idea as password + olive hints). */
watch(
  () => form.firstName,
  (v) => {
    if (v.trim()) errors.firstName = ''
  },
)
watch(
  () => form.lastName,
  (v) => {
    if (v.trim()) errors.lastName = ''
  },
)
watch(() => form.email, () => {
  errors.email = ''
  emailAlreadyRegistered.value = false
})
watch(
  () => form.password,
  (p) => {
    if (p.length > 0) errors.password = ''
  },
)

const countryOptions = [
  { code: 'TH', name: 'Thailand' },
  { code: 'US', name: 'United States' },
  { code: 'GB', name: 'United Kingdom' },
  { code: 'SG', name: 'Singapore' },
  { code: 'AU', name: 'Australia' },
  { code: 'DE', name: 'Germany' },
  { code: 'JP', name: 'Japan' },
  { code: 'IN', name: 'India' },
  { code: 'CA', name: 'Canada' },
  { code: 'OTHER', name: 'Other' },
]

const roleOptions = [
  { value: 'client', label: "I'm a client, hiring for a project" },
  { value: 'freelancer', label: "I'm a freelancer, looking for work" },
]

const primaryCtaLabel = computed(() => {
  if (!form.role) return 'Create Account'
  if (form.role === 'client') return 'Join as a Client'
  return 'Apply as a Freelancer'
})

const signupHeadline = computed(() =>
  form.role === 'client' ? 'Sign up to hire talent' : 'Sign up to find work you love',
)

const emailFieldLabel = computed(() =>
  form.role === 'client' ? 'Work email address' : 'Email',
)

const marketingEmailLabel = computed(() =>
  form.role === 'client'
    ? 'Send me emails with tips on how to find talent that fits my needs.'
    : 'Send me helpful emails to find rewarding work and job leads.',
)

const PASSWORD_POLICY_HINT =
  'Password should be at least 8 characters, with a symbol or letter'

/** ≥8 chars and (Latin letter OR a “symbol” — not digit-only, not digits+asterisks only). */
function passwordMeetsPolicy(p: string): boolean {
  if (p.length < 8) return false
  if (/[a-zA-Z]/.test(p)) return true
  return /[^0-9*]/.test(p)
}

/** Upwork-style olive hints: empty+focus → required; 1–7 chars → too short; 8+ invalid → policy. */
const passwordFieldWarning = computed(() => {
  const p = form.password
  if (passwordMeetsPolicy(p)) return ''
  if (p.length === 0) {
    return passwordFieldFocused.value ? 'Password is required' : ''
  }
  if (p.length < 8) {
    return 'Too short. Use at least 8 characters'
  }
  return PASSWORD_POLICY_HINT
})

const EMAIL_REGEX = /^[^\s@]+@[^\s@]+\.[^\s@]+$/

let emailAvailabilitySeq = 0
watchDebounced(
  () => form.email,
  async (email) => {
    const trimmed = email.trim()
    if (!EMAIL_REGEX.test(trimmed)) return
    const seq = ++emailAvailabilitySeq
    try {
      const { data } = await authService.registerEmailAvailable(trimmed)
      if (seq !== emailAvailabilitySeq) return
      if (!data.available) {
        emailAlreadyRegistered.value = true
        errors.email = EMAIL_IN_USE_MSG
      }
    } catch {
      /* ignore: offline / throttle; submit still validates */
    }
  },
  { debounce: 450 },
)

function validate(): boolean {
  let valid = true
  errors.firstName = ''
  errors.lastName = ''
  errors.password = ''
  if (!form.firstName.trim()) { errors.firstName = 'First name is required.'; valid = false }
  if (!form.lastName.trim()) { errors.lastName = 'Last name is required.'; valid = false }
  const emailOk = EMAIL_REGEX.test(form.email)
  if (!emailOk) {
    errors.email = 'Please enter a valid email address.'
    emailAlreadyRegistered.value = false
    valid = false
  } else if (emailAlreadyRegistered.value) {
    errors.email = EMAIL_IN_USE_MSG
    valid = false
  }
  if (!form.password) { errors.password = 'Password is required.'; valid = false }
  else if (!passwordMeetsPolicy(form.password)) { valid = false }
  return valid
}

async function handleRegister(): Promise<void> {
  if (!validate() || !form.role) return
  const outcome = await auth.register({
    email: form.email,
    password: form.password,
    firstName: form.firstName,
    lastName: form.lastName,
    role: form.role,
  })
  if (outcome === 'email_in_use') {
    emailAlreadyRegistered.value = true
    errors.email = EMAIL_IN_USE_MSG
  }
}
</script>
