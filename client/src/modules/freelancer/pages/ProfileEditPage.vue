<template>
  <div class="space-y-6 max-w-3xl">
    <div class="flex items-center justify-between">
      <h1 class="text-2xl font-bold text-slate-900">Edit Profile</h1>
      <RouterLink to="/freelancers/me" class="text-sm text-green-600 font-medium hover:text-green-700">
        Preview Profile →
      </RouterLink>
    </div>

    <!-- Loading State -->
    <div v-if="userStore.isLoading" class="space-y-6">
      <div class="animate-pulse bg-white rounded-2xl border border-slate-200 p-5 h-24"></div>
      <div class="animate-pulse bg-white rounded-2xl border border-slate-200 p-6 h-32"></div>
      <div class="animate-pulse bg-white rounded-2xl border border-slate-200 p-6 h-64"></div>
    </div>

    <!-- Error State -->
    <div v-else-if="userStore.error" class="text-center py-16">
      <div class="text-red-400 mb-4">
        <svg class="w-12 h-12 mx-auto" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-2.5L13.732 4c-.77-.833-1.964-.833-2.732 0L4.082 16.5c-.77.833.192 2.5 1.732 2.5z"/></svg>
      </div>
      <p class="text-gray-600 mb-4">{{ userStore.error }}</p>
      <button class="px-4 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700" @click="retry">Try Again</button>
    </div>

    <!-- Content -->
    <template v-else>
    <!-- Profile Completeness -->
    <div class="bg-white rounded-2xl border border-slate-200 p-5">
      <div class="flex justify-between items-center mb-2">
        <h2 class="font-semibold text-slate-900">Profile Completeness</h2>
        <span class="text-sm font-bold text-green-600">{{ completeness }}%</span>
      </div>
      <AppProgressBar :value="completeness" color="auto" size="md" />
      <div class="mt-3 grid grid-cols-2 gap-1.5">
        <div v-for="item in completionChecklist" :key="item.label" class="flex items-center gap-1.5 text-xs">
          <svg
            :class="['w-3.5 h-3.5 shrink-0', item.done ? 'text-green-500' : 'text-slate-300']"
            fill="currentColor"
            viewBox="0 0 20 20"
            aria-hidden="true"
          >
            <path fill-rule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clip-rule="evenodd" />
          </svg>
          <span :class="item.done ? 'text-slate-700' : 'text-slate-400'">{{ item.label }}</span>
        </div>
      </div>
    </div>

    <!-- Profile Photo -->
    <div class="bg-white rounded-2xl border border-slate-200 p-6">
      <h2 class="font-semibold text-slate-900 mb-4">Profile Photo</h2>
      <div class="flex items-center gap-5">
        <div class="relative">
          <UserAvatar :name="auth.fullName" :src="auth.user?.avatar" size="xl" />
          <button
            class="absolute bottom-0 right-0 w-7 h-7 bg-white border-2 border-slate-200 rounded-full flex items-center justify-center shadow-sm hover:bg-slate-50"
            aria-label="Change photo"
          >
            <svg class="w-3.5 h-3.5 text-slate-600" fill="none" viewBox="0 0 24 24" stroke="currentColor" aria-hidden="true">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M3 9a2 2 0 012-2h.93a2 2 0 001.664-.89l.812-1.22A2 2 0 0110.07 4h3.86a2 2 0 011.664.89l.812 1.22A2 2 0 0018.07 7H19a2 2 0 012 2v9a2 2 0 01-2 2H5a2 2 0 01-2-2V9z" />
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M15 13a3 3 0 11-6 0 3 3 0 016 0z" />
            </svg>
          </button>
        </div>
        <div>
          <label class="cursor-pointer">
            <AppButton variant="outline" size="sm" as="span">Upload New Photo</AppButton>
            <input type="file" accept="image/*" class="hidden" @change="handlePhotoUpload" />
          </label>
          <p class="text-xs text-slate-400 mt-2">JPG, PNG or GIF. Max 5MB.</p>
          <p class="text-xs text-slate-400">Square photos look best.</p>
        </div>
      </div>
    </div>

    <!-- Basic Info -->
    <div class="bg-white rounded-2xl border border-slate-200 p-6">
      <h2 class="font-semibold text-slate-900 mb-4">Basic Information</h2>
      <div class="space-y-4">
        <div class="grid grid-cols-2 gap-4">
          <AppInput v-model="form.firstName" label="First Name" required />
          <AppInput v-model="form.lastName" label="Last Name" required />
        </div>
        <AppInput v-model="form.title" label="Professional Title" placeholder="e.g. Senior Vue.js Developer" />
        <AppTextarea
          v-model="form.bio"
          label="Professional Overview"
          :rows="6"
          :maxlength="5000"
          placeholder="Describe your expertise, experience, and what makes you unique..."
        />
        <p class="text-xs text-slate-400 text-right -mt-2">{{ form.bio.length }}/5000</p>
        <div class="grid grid-cols-2 gap-4">
          <AppInput v-model="form.location" label="Location" placeholder="City, Country" />
          <div class="relative">
            <label class="text-sm font-medium text-slate-700 block mb-1.5">Hourly Rate (USD)</label>
            <div class="relative">
              <span class="absolute left-3 top-1/2 -translate-y-1/2 text-slate-500 font-medium text-sm" aria-hidden="true">$</span>
              <input
                v-model="form.hourlyRate"
                type="number"
                min="1"
                placeholder="0"
                class="w-full pl-7 pr-4 py-2.5 border border-slate-300 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-green-500"
                aria-label="Hourly rate in USD"
              />
            </div>
          </div>
        </div>

        <!-- Availability -->
        <fieldset>
          <legend class="text-sm font-medium text-slate-700 block mb-2">Availability</legend>
          <div class="grid grid-cols-3 gap-2">
            <button
              v-for="opt in availabilityOptions"
              :key="opt.value"
              :class="['p-3 border-2 rounded-xl text-sm font-medium transition-all', form.availability === opt.value ? opt.activeClass : 'border-slate-200 text-slate-600 hover:border-slate-300']"
              :aria-pressed="form.availability === opt.value"
              @click="form.availability = opt.value as typeof form.availability"
            >
              <span class="block text-lg mb-1" aria-hidden="true">{{ opt.icon }}</span>
              {{ opt.label }}
            </button>
          </div>
        </fieldset>
      </div>
    </div>

    <!-- Section components -->
    <ProfileSkillsSection v-model="form.skills" />
    <ProfileLanguagesSection v-model="form.languages" />
    <ProfilePortfolioSection v-model="form.portfolio" />
    <ProfileEmploymentSection v-model="form.employmentHistory" />
    <ProfileEducationSection v-model="form.educationHistory" />

    <!-- Save Buttons -->
    <div class="flex gap-3">
      <AppButton :loading="saving" class="flex-1" @click="saveProfile">Save Changes</AppButton>
      <AppButton variant="outline" @click="router.back()">Cancel</AppButton>
    </div>
    </template>
  </div>
</template>

<script setup lang="ts">
import { ref, reactive, computed, onMounted } from 'vue'
import { RouterLink, useRouter } from 'vue-router'
import { useAuthStore } from '@/stores/auth.store'
import { useUserStore } from '@/stores/user.store'
import type { Language, PortfolioItem, EmploymentItem, EducationItem } from '@/types'
import AppInput from '@/components/ui/AppInput.vue'
import AppTextarea from '@/components/ui/AppTextarea.vue'
import AppButton from '@/components/ui/AppButton.vue'
import AppProgressBar from '@/components/ui/AppProgressBar.vue'
import UserAvatar from '@/components/common/UserAvatar.vue'
import ProfileSkillsSection from '../components/ProfileSkillsSection.vue'
import ProfileLanguagesSection from '../components/ProfileLanguagesSection.vue'
import ProfilePortfolioSection from '../components/ProfilePortfolioSection.vue'
import ProfileEmploymentSection from '../components/ProfileEmploymentSection.vue'
import ProfileEducationSection from '../components/ProfileEducationSection.vue'

const auth = useAuthStore()
const userStore = useUserStore()
const router = useRouter()
const saving = computed(() => userStore.isUpdating)
const pendingAvatar = ref<File | null>(null)

const form = reactive({
  firstName: auth.user?.firstName ?? '',
  lastName: auth.user?.lastName ?? '',
  title: '',
  bio: '',
  location: '',
  hourlyRate: 0,
  availability: 'available' as 'available' | 'busy' | 'unavailable',
  skills: [] as string[],
  languages: [] as { name: string; proficiency: Language['proficiency'] }[],
  portfolio: [] as Partial<PortfolioItem>[],
  employmentHistory: [] as Partial<EmploymentItem>[],
  educationHistory: [] as Partial<EducationItem>[],
})

async function retry() {
  if (auth.user?.id) {
    await userStore.fetchFreelancerProfile(auth.user.id)
  }
}

onMounted(async () => {
  if (auth.user?.id) {
    await userStore.fetchFreelancerProfile(auth.user.id)
    const p = userStore.freelancerProfile
    if (p) {
      form.firstName = p.firstName ?? ''
      form.lastName = p.lastName ?? ''
      form.title = p.title ?? ''
      form.bio = p.bio ?? ''
      form.location = p.location ?? ''
      form.hourlyRate = p.hourlyRate ?? 0
      form.availability = (p.availability as typeof form.availability) ?? 'available'
      form.skills = p.skills?.map((s: any) => typeof s === 'string' ? s : s.name) ?? []
      form.languages = p.languages ?? []
      form.portfolio = p.portfolio ?? []
      form.employmentHistory = p.employmentHistory ?? []
      form.educationHistory = p.educationHistory ?? []
    }
  }
})

const availabilityOptions = [
  { value: 'available', label: 'Available', icon: '🟢', activeClass: 'border-green-500 bg-green-50 text-green-700' },
  { value: 'busy', label: 'Busy', icon: '🟡', activeClass: 'border-yellow-500 bg-yellow-50 text-yellow-700' },
  { value: 'unavailable', label: 'Unavailable', icon: '🔴', activeClass: 'border-red-500 bg-red-50 text-red-700' },
]

const completeness = computed(() => {
  let score = 0
  if (form.firstName && form.lastName) score += 15
  if (form.title) score += 15
  if (form.bio && form.bio.length > 50) score += 15
  if (form.skills.length >= 3) score += 15
  if (form.portfolio.length > 0) score += 15
  if (form.languages.length > 0) score += 10
  if (form.educationHistory.length > 0) score += 5
  if (form.employmentHistory.length > 0) score += 10
  return Math.min(100, score)
})

const completionChecklist = computed(() => [
  { label: 'Name & basic info', done: !!(form.firstName && form.lastName) },
  { label: 'Professional title', done: !!form.title },
  { label: 'Profile overview', done: form.bio.length > 50 },
  { label: '3+ skills added', done: form.skills.length >= 3 },
  { label: 'Portfolio items', done: form.portfolio.length > 0 },
  { label: 'Languages', done: form.languages.length > 0 },
  { label: 'Employment history', done: form.employmentHistory.length > 0 },
  { label: 'Education', done: form.educationHistory.length > 0 },
])

async function handlePhotoUpload(e: Event): Promise<void> {
  const file = (e.target as HTMLInputElement).files?.[0]
  if (file) {
    pendingAvatar.value = file
    await userStore.updateAvatar(file)
  }
}

async function saveProfile(): Promise<void> {
  await userStore.updateFreelancerProfile({
    title: form.title,
    bio: form.bio,
    location: form.location,
    hourlyRate: form.hourlyRate,
    availability: form.availability,
    skills: form.skills as any,
    languages: form.languages,
    portfolio: form.portfolio as any,
    employmentHistory: form.employmentHistory as any,
    educationHistory: form.educationHistory as any,
  })
}
</script>
