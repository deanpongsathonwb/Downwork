<template>
  <div class="min-h-screen bg-gradient-to-br from-slate-50 to-green-50 flex items-center justify-center px-4 py-12">
    <div class="w-full max-w-2xl">
      <!-- Logo -->
      <div class="text-center mb-8">
        <h1 class="text-3xl font-black text-green-600">Downwork</h1>
        <p class="text-slate-500 mt-1">Let's set up your account</p>
      </div>

      <!-- Progress -->
      <div class="flex items-center justify-between mb-8">
        <div v-for="(_s, i) in steps" :key="i" class="flex items-center flex-1">
          <div :class="['w-9 h-9 rounded-full flex items-center justify-center text-sm font-bold transition-all border-2', step > i ? 'bg-green-600 border-green-600 text-white' : step === i ? 'border-green-600 text-green-600 bg-white' : 'border-slate-200 text-slate-400 bg-white']">
            <svg v-if="step > i" class="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="3" d="M5 13l4 4L19 7" /></svg>
            <span v-else>{{ i + 1 }}</span>
          </div>
          <div v-if="i < steps.length - 1" :class="['flex-1 h-0.5 mx-2', step > i ? 'bg-green-600' : 'bg-slate-200']" />
        </div>
      </div>

      <div class="bg-white rounded-3xl shadow-xl border border-slate-100 overflow-hidden">
        <!-- Step 1: Role Selection -->
        <div v-if="step === 0" class="p-8">
          <h2 class="text-2xl font-bold text-slate-900 mb-2">I want to...</h2>
          <p class="text-slate-500 mb-6">Choose how you'll use Downwork. You can always add more later.</p>
          <div class="grid grid-cols-2 gap-4">
            <button
              v-for="role in roleOptions"
              :key="role.value"
              :class="['p-6 border-2 rounded-2xl text-left transition-all', selectedRole === role.value ? 'border-green-500 bg-green-50' : 'border-slate-200 hover:border-slate-300 hover:bg-slate-50']"
              @click="selectedRole = role.value"
            >
              <div :class="['w-12 h-12 rounded-2xl flex items-center justify-center mb-4', role.value === 'freelancer' ? 'bg-green-100' : 'bg-blue-100']">
                <span class="text-2xl">{{ role.icon }}</span>
              </div>
              <p class="font-bold text-slate-900 mb-1">{{ role.label }}</p>
              <p class="text-sm text-slate-500">{{ role.description }}</p>
            </button>
          </div>
        </div>

        <!-- Step 2: Basic Info -->
        <div v-else-if="step === 1" class="p-8 space-y-4">
          <h2 class="text-2xl font-bold text-slate-900 mb-2">Tell us about yourself</h2>
          <p class="text-slate-500 mb-6">This helps clients and freelancers know who they're working with.</p>

          <div class="flex justify-center mb-4">
            <div class="relative">
              <div class="w-24 h-24 bg-gradient-to-br from-green-400 to-emerald-600 rounded-full flex items-center justify-center text-white text-3xl font-bold">
                {{ (form.firstName[0] || '') + (form.lastName[0] || '') || '?' }}
              </div>
              <button class="absolute bottom-0 right-0 w-8 h-8 bg-white border-2 border-slate-200 rounded-full flex items-center justify-center shadow-sm hover:bg-slate-50">
                <svg class="w-4 h-4 text-slate-600" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M3 9a2 2 0 012-2h.93a2 2 0 001.664-.89l.812-1.22A2 2 0 0110.07 4h3.86a2 2 0 011.664.89l.812 1.22A2 2 0 0018.07 7H19a2 2 0 012 2v9a2 2 0 01-2 2H5a2 2 0 01-2-2V9z"/><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M15 13a3 3 0 11-6 0 3 3 0 016 0z"/></svg>
              </button>
            </div>
          </div>

          <div class="grid grid-cols-2 gap-4">
            <AppInput v-model="form.firstName" label="First Name" required />
            <AppInput v-model="form.lastName" label="Last Name" required />
          </div>
          <AppInput v-model="form.location" label="Country / Region" placeholder="e.g. United States" />
          <AppInput v-model="form.phone" label="Phone Number" type="tel" placeholder="+1 (555) 000-0000" />
        </div>

        <!-- Step 3: Professional Info (Freelancer) or Company Info (Client) -->
        <div v-else-if="step === 2" class="p-8 space-y-4">
          <template v-if="selectedRole === 'freelancer'">
            <h2 class="text-2xl font-bold text-slate-900 mb-2">Your professional profile</h2>
            <p class="text-slate-500 mb-6">Stand out and attract the right clients.</p>
            <AppInput v-model="form.title" label="Professional Title" placeholder="e.g. Senior Vue.js Developer" required />
            <AppTextarea v-model="form.bio" label="Professional Overview" placeholder="Describe your expertise, skills, and what makes you unique..." :rows="5" />
            <div class="grid grid-cols-2 gap-4">
              <AppInput v-model="form.hourlyRate" type="number" label="Hourly Rate (USD)" placeholder="50" />
              <AppSelect v-model="form.experienceLevel" label="Experience Level" :options="expOptions" />
            </div>
            <div>
              <label class="text-sm font-medium text-slate-700 block mb-2">Top Skills (add up to 10)</label>
              <div class="flex gap-2 mb-2">
                <input v-model="newSkill" type="text" placeholder="Add a skill..." class="flex-1 border border-slate-300 rounded-xl px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-green-500" @keydown.enter.prevent="addSkill" />
                <AppButton variant="outline" size="sm" @click="addSkill">Add</AppButton>
              </div>
              <div class="flex flex-wrap gap-2">
                <div v-for="(s, i) in form.skills" :key="i" class="flex items-center gap-1 px-3 py-1.5 bg-green-50 border border-green-200 rounded-lg text-sm text-green-800">
                  {{ s }}
                  <button class="ml-1 text-green-500 hover:text-green-700" @click="form.skills.splice(i, 1)">×</button>
                </div>
              </div>
            </div>
          </template>

          <template v-else>
            <h2 class="text-2xl font-bold text-slate-900 mb-2">About your company</h2>
            <p class="text-slate-500 mb-6">Help freelancers understand your business better.</p>
            <AppInput v-model="form.companyName" label="Company Name (optional)" placeholder="Your company or project name" />
            <AppSelect v-model="form.industry" label="Industry" :options="industryOptions" />
            <AppSelect v-model="form.companySize" label="Company Size" :options="companySizeOptions" />
            <AppTextarea v-model="form.bio" label="About Your Business (optional)" placeholder="Describe what your company does..." :rows="4" />
          </template>
        </div>

        <!-- Step 4: Done -->
        <div v-else-if="step === 3" class="p-8 text-center">
          <div class="w-20 h-20 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-6">
            <svg class="w-10 h-10 text-green-600" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
            </svg>
          </div>
          <h2 class="text-2xl font-bold text-slate-900 mb-3">You're all set! 🎉</h2>
          <p class="text-slate-600 mb-2">
            <template v-if="selectedRole === 'freelancer'">
              Your freelancer profile is ready. Start browsing jobs and submitting proposals.
            </template>
            <template v-else>
              Your client account is ready. Start posting jobs and find the perfect freelancer.
            </template>
          </p>
          <p class="text-sm text-slate-400">Profile completeness: <strong class="text-green-600">{{ completeness }}%</strong></p>
          <AppProgressBar :value="completeness" color="green" size="sm" class="mt-3 mb-6" />
          <div class="grid grid-cols-1 gap-3 text-left bg-slate-50 rounded-2xl p-4 mb-6">
            <p class="text-sm font-semibold text-slate-700 mb-1">Complete your profile to unlock all features:</p>
            <div v-for="item in completionItems" :key="item.label" class="flex items-center gap-2 text-sm">
              <svg :class="['w-4 h-4 shrink-0', item.done ? 'text-green-500' : 'text-slate-300']" fill="currentColor" viewBox="0 0 20 20"><path fill-rule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clip-rule="evenodd"/></svg>
              <span :class="item.done ? 'text-slate-700' : 'text-slate-400'">{{ item.label }}</span>
            </div>
          </div>
        </div>
      </div>

      <!-- Navigation -->
      <div class="flex justify-between mt-6">
        <AppButton v-if="step > 0 && step < 3" variant="outline" @click="step--">← Back</AppButton>
        <div v-else />
        <AppButton v-if="step < 2" :disabled="step === 0 && !selectedRole" @click="step++">
          Continue →
        </AppButton>
        <AppButton v-else-if="step === 2" :loading="saving" @click="saveAndContinue">
          Save & Continue →
        </AppButton>
        <AppButton v-else @click="goToDashboard">Go to Dashboard →</AppButton>
      </div>

      <p v-if="step < 3" class="text-center text-xs text-slate-400 mt-4">
        You can skip this and complete later in your profile settings.
        <button class="text-green-600 hover:text-green-700 font-medium" @click="goToDashboard">Skip for now</button>
      </p>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, reactive, computed } from 'vue'
import { useRouter } from 'vue-router'
import { useAuthStore } from '@/stores/auth.store'
import AppInput from '@/components/ui/AppInput.vue'
import AppTextarea from '@/components/ui/AppTextarea.vue'
import AppSelect from '@/components/ui/AppSelect.vue'
import AppButton from '@/components/ui/AppButton.vue'
import AppProgressBar from '@/components/ui/AppProgressBar.vue'

const router = useRouter()
const auth = useAuthStore()

const step = ref(0)
const saving = ref(false)
const selectedRole = ref<'freelancer' | 'client' | ''>('')
const newSkill = ref('')

const steps = ['Choose Role', 'Basic Info', 'Professional', 'Done']

const form = reactive({
  firstName: auth.user?.firstName ?? '',
  lastName: auth.user?.lastName ?? '',
  location: '',
  phone: '',
  title: '',
  bio: '',
  hourlyRate: 0,
  experienceLevel: '',
  skills: [] as string[],
  companyName: '',
  industry: '',
  companySize: '',
})

const roleOptions: { value: 'freelancer' | 'client'; label: string; description: string; icon: string }[] = [
  { value: 'freelancer', label: 'Work as a Freelancer', description: 'Find jobs and get paid for your skills', icon: '💼' },
  { value: 'client', label: 'Hire a Freelancer', description: 'Post jobs and find expert talent', icon: '🏢' },
]

const expOptions = [
  { label: 'Entry Level (0–2 years)', value: 'entry' },
  { label: 'Intermediate (2–5 years)', value: 'intermediate' },
  { label: 'Expert (5+ years)', value: 'expert' },
]

const industryOptions = [
  { label: 'Technology', value: 'tech' },
  { label: 'Marketing & Advertising', value: 'marketing' },
  { label: 'E-Commerce', value: 'ecommerce' },
  { label: 'Finance', value: 'finance' },
  { label: 'Healthcare', value: 'healthcare' },
  { label: 'Education', value: 'education' },
  { label: 'Other', value: 'other' },
]

const companySizeOptions = [
  { label: 'Just me', value: '1' },
  { label: '2–9 employees', value: '2-9' },
  { label: '10–99 employees', value: '10-99' },
  { label: '100–999 employees', value: '100-999' },
  { label: '1000+ employees', value: '1000+' },
]

const completeness = computed(() => {
  let score = 40
  if (form.firstName && form.lastName) score += 15
  if (form.location) score += 10
  if (selectedRole.value === 'freelancer') {
    if (form.title) score += 15
    if (form.bio) score += 10
    if (form.skills.length >= 3) score += 10
  } else {
    if (form.companyName) score += 15
    if (form.bio) score += 20
  }
  return Math.min(100, score)
})

const completionItems = computed(() => [
  { label: 'Account created', done: true },
  { label: 'Basic info filled', done: !!(form.firstName && form.lastName) },
  { label: 'Professional title added', done: !!(form.title || form.companyName) },
  { label: 'Overview / bio added', done: !!form.bio },
  { label: selectedRole.value === 'freelancer' ? '3+ skills added' : 'Industry selected', done: selectedRole.value === 'freelancer' ? form.skills.length >= 3 : !!form.industry },
  { label: 'Photo uploaded', done: false },
])

function addSkill() {
  if (newSkill.value.trim() && form.skills.length < 10 && !form.skills.includes(newSkill.value.trim())) {
    form.skills.push(newSkill.value.trim())
    newSkill.value = ''
  }
}

async function saveAndContinue() {
  saving.value = true
  await new Promise((r) => setTimeout(r, 800))
  saving.value = false
  step.value++
}

function goToDashboard() {
  const role = selectedRole.value || auth.role
  router.push(role === 'client' ? '/client/dashboard' : '/freelancer/dashboard')
}
</script>
