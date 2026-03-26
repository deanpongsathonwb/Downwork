<template>
  <div class="max-w-3xl space-y-6">
    <div class="flex items-center gap-3">
      <div class="w-10 h-10 bg-blue-100 rounded-xl flex items-center justify-center">
        <svg class="w-5 h-5 text-blue-600" fill="none" viewBox="0 0 24 24" stroke="currentColor">
          <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 4v16m8-8H4" />
        </svg>
      </div>
      <div>
        <h1 class="text-2xl font-bold text-slate-900">Post a New Job</h1>
        <p class="text-sm text-slate-500">Find the perfect freelancer for your project</p>
      </div>
    </div>

    <!-- Step Indicator -->
    <div class="flex items-center gap-2">
      <div v-for="(s, i) in steps" :key="s" class="flex items-center gap-2">
        <div :class="['w-8 h-8 rounded-full flex items-center justify-center text-sm font-bold transition-all', step > i ? 'bg-green-600 text-white' : step === i ? 'bg-blue-600 text-white' : 'bg-slate-200 text-slate-500']">
          <svg v-if="step > i" class="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="3" d="M5 13l4 4L19 7" /></svg>
          <span v-else>{{ i + 1 }}</span>
        </div>
        <span class="text-sm text-slate-600 hidden sm:block">{{ s }}</span>
        <div v-if="i < steps.length - 1" class="w-8 h-px bg-slate-200" />
      </div>
    </div>

    <!-- STEP 1: Job Basics -->
    <div v-if="step === 0" class="bg-white rounded-2xl border border-slate-200 p-6 space-y-4">
      <h2 class="font-semibold text-slate-900 mb-2">Job Details</h2>
      <div>
        <AppInput v-model="form.title" label="Job Title" placeholder="e.g. Senior Vue.js Developer Needed" required />
        <p v-if="errors.title" class="text-red-500 text-xs mt-1">{{ errors.title }}</p>
      </div>
      <div>
        <AppTextarea v-model="form.description" label="Job Description" placeholder="Describe the project, requirements, and deliverables in detail..." :rows="6" :maxlength="10000" required />
        <p v-if="errors.description" class="text-red-500 text-xs mt-1">{{ errors.description }}</p>
      </div>
      <div>
        <AppSelect v-model="form.category" label="Category" :options="categoryOptions" placeholder="Select a category" required />
        <p v-if="errors.category" class="text-red-500 text-xs mt-1">{{ errors.category }}</p>
      </div>
      <AppSelect v-model="form.experienceLevel" label="Experience Level" :options="expOptions" placeholder="Select level" required />
      <AppSelect v-model="form.projectLength" label="Project Duration" :options="durationOptions" placeholder="How long?" required />
      <div class="flex items-center gap-2">
        <input id="remote" v-model="form.isRemote" type="checkbox" class="accent-blue-600" />
        <label for="remote" class="text-sm text-slate-700">This is a remote job</label>
      </div>
    </div>

    <!-- STEP 2: Budget -->
    <div v-if="step === 1" class="bg-white rounded-2xl border border-slate-200 p-6 space-y-4">
      <h2 class="font-semibold text-slate-900 mb-2">Budget & Compensation</h2>
      <div class="grid grid-cols-2 gap-3">
        <button
          v-for="type in ['fixed', 'hourly']"
          :key="type"
          :class="['p-4 border-2 rounded-xl text-left transition-all', form.budgetType === type ? 'border-blue-500 bg-blue-50' : 'border-slate-200 hover:border-slate-300']"
          @click="form.budgetType = type as 'fixed' | 'hourly'"
        >
          <p class="font-semibold text-slate-900 capitalize">{{ type }} Price</p>
          <p class="text-xs text-slate-500 mt-1">{{ type === 'fixed' ? 'One-time project payment' : 'Pay per hour worked' }}</p>
        </button>
      </div>

      <p v-if="errors.budgetType" class="text-red-500 text-xs mt-1">{{ errors.budgetType }}</p>

      <div v-if="form.budgetType === 'fixed'" class="grid grid-cols-2 gap-4">
        <div>
          <AppInput v-model="form.budgetMin" type="number" label="Minimum Budget (USD)" placeholder="500" />
          <p v-if="errors.budgetMin" class="text-red-500 text-xs mt-1">{{ errors.budgetMin }}</p>
        </div>
        <div>
          <AppInput v-model="form.budgetMax" type="number" label="Maximum Budget (USD)" placeholder="2000" />
          <p v-if="errors.budgetMax" class="text-red-500 text-xs mt-1">{{ errors.budgetMax }}</p>
        </div>
      </div>
      <div v-else class="grid grid-cols-2 gap-4">
        <div>
          <AppInput v-model="form.budgetMin" type="number" label="Min Hourly Rate (USD)" placeholder="25" />
          <p v-if="errors.budgetMin" class="text-red-500 text-xs mt-1">{{ errors.budgetMin }}</p>
        </div>
        <div>
          <AppInput v-model="form.budgetMax" type="number" label="Max Hourly Rate (USD)" placeholder="100" />
          <p v-if="errors.budgetMax" class="text-red-500 text-xs mt-1">{{ errors.budgetMax }}</p>
        </div>
      </div>
    </div>

    <!-- STEP 3: Skills & Attachments -->
    <div v-if="step === 2" class="bg-white rounded-2xl border border-slate-200 p-6 space-y-5">
      <h2 class="font-semibold text-slate-900 mb-2">Skills & Requirements</h2>

      <!-- Skills -->
      <div>
        <label class="text-sm font-medium text-slate-700 block mb-2">Required Skills</label>
        <div class="flex gap-2 mb-3">
          <input
            v-model="newSkill"
            type="text"
            placeholder="Type a skill and press Enter..."
            class="flex-1 border border-slate-300 rounded-xl px-4 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
            @keydown.enter.prevent="addSkill"
          />
          <AppButton variant="outline" size="sm" @click="addSkill">Add</AppButton>
        </div>
        <div class="flex flex-wrap gap-2">
          <div v-for="(skill, i) in form.skills" :key="i" class="flex items-center gap-1.5 px-3 py-1.5 bg-blue-50 border border-blue-200 rounded-lg text-sm text-blue-800">
            {{ skill }}
            <button @click="form.skills.splice(i, 1)">
              <svg class="w-3.5 h-3.5" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M6 18L18 6M6 6l12 12" /></svg>
            </button>
          </div>
        </div>
        <p v-if="errors.skills" class="text-red-500 text-xs mt-1">{{ errors.skills }}</p>
      </div>

      <!-- Screening Questions -->
      <div>
        <div class="flex justify-between items-center mb-2">
          <label class="text-sm font-medium text-slate-700">Screening Questions (optional)</label>
          <AppButton variant="outline" size="sm" @click="addQuestion">+ Add Question</AppButton>
        </div>
        <div class="space-y-2">
          <div v-for="(q, i) in form.questions" :key="i" class="flex gap-2">
            <input v-model="q.question" type="text" :placeholder="`Question ${i + 1}...`" class="flex-1 border border-slate-300 rounded-xl px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500" />
            <label class="flex items-center gap-1 text-xs text-slate-500 shrink-0">
              <input v-model="q.required" type="checkbox" class="accent-blue-600" /> Required
            </label>
            <button class="text-slate-400 hover:text-red-500" @click="form.questions.splice(i, 1)">
              <svg class="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M6 18L18 6M6 6l12 12" /></svg>
            </button>
          </div>
          <p v-if="!form.questions.length" class="text-xs text-slate-400">Screening questions help you find the best candidates faster.</p>
        </div>
      </div>

      <!-- Visibility -->
      <div>
        <label class="text-sm font-medium text-slate-700 block mb-2">Job Visibility</label>
        <div class="space-y-2">
          <label v-for="opt in visibilityOptions" :key="opt.value" :class="['flex items-start gap-3 p-4 border-2 rounded-xl cursor-pointer transition-all', form.visibility === opt.value ? 'border-blue-500 bg-blue-50' : 'border-slate-200 hover:border-slate-300']">
            <input v-model="form.visibility" type="radio" :value="opt.value" class="mt-0.5 accent-blue-600" />
            <div>
              <p class="font-medium text-sm text-slate-900">{{ opt.label }}</p>
              <p class="text-xs text-slate-500">{{ opt.description }}</p>
            </div>
          </label>
        </div>
      </div>

      <!-- File upload -->
      <AppFileUpload
        label="Attachments (Optional)"
        hint="Project brief, wireframes, or reference files · Max 5 files, 50MB each"
        accept=".pdf,.doc,.docx,.jpg,.png,.zip"
        :multiple="true"
        @change="form.attachments = $event"
      />
    </div>

    <!-- STEP 4: Review & Publish -->
    <div v-if="step === 3" class="bg-white rounded-2xl border border-slate-200 p-6 space-y-4">
      <h2 class="font-semibold text-slate-900 mb-2">Review & Publish</h2>
      <dl class="space-y-3">
        <div class="flex justify-between py-2 border-b border-slate-100">
          <dt class="text-sm text-slate-500">Job Title</dt>
          <dd class="text-sm font-semibold text-slate-900 text-right max-w-xs">{{ form.title || '—' }}</dd>
        </div>
        <div class="flex justify-between py-2 border-b border-slate-100">
          <dt class="text-sm text-slate-500">Category</dt>
          <dd class="text-sm font-semibold text-slate-900 capitalize">{{ form.category || '—' }}</dd>
        </div>
        <div class="flex justify-between py-2 border-b border-slate-100">
          <dt class="text-sm text-slate-500">Budget Type</dt>
          <dd class="text-sm font-semibold text-slate-900 capitalize">{{ form.budgetType }}</dd>
        </div>
        <div class="flex justify-between py-2 border-b border-slate-100">
          <dt class="text-sm text-slate-500">Budget Range</dt>
          <dd class="text-sm font-semibold text-slate-900">${{ form.budgetMin }} – ${{ form.budgetMax }}</dd>
        </div>
        <div class="flex justify-between py-2">
          <dt class="text-sm text-slate-500">Skills</dt>
          <dd class="text-sm font-semibold text-slate-900">{{ form.skills.join(', ') || '—' }}</dd>
        </div>
      </dl>
    </div>

    <!-- Navigation Buttons -->
    <div class="flex justify-between">
      <AppButton v-if="step > 0" variant="outline" @click="step--">← Previous</AppButton>
      <div v-else />
      <AppButton v-if="step < 3" @click="nextStep">Next →</AppButton>
      <AppButton v-else :loading="publishing" @click="publishJob">🚀 Publish Job</AppButton>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, reactive } from 'vue'
import { useRouter } from 'vue-router'
import { useJobStore } from '@/stores/job.store'
import AppInput from '@/components/ui/AppInput.vue'
import AppTextarea from '@/components/ui/AppTextarea.vue'
import AppSelect from '@/components/ui/AppSelect.vue'
import AppButton from '@/components/ui/AppButton.vue'
import AppFileUpload from '@/components/ui/AppFileUpload.vue'

const router = useRouter()
const jobStore = useJobStore()
const step = ref(0)
const publishing = ref(false)
const newSkill = ref('')

const steps = ['Job Details', 'Budget', 'Skills', 'Review']

const errors = reactive<Record<string, string>>({})

function validateStep(s: number): boolean {
  // Clear previous errors
  Object.keys(errors).forEach(k => delete errors[k])

  if (s === 0) {
    if (!form.title || form.title.length < 10) errors.title = 'Title is required and must be at least 10 characters.'
    if (!form.description || form.description.length < 50) errors.description = 'Description is required and must be at least 50 characters.'
    if (!form.category) errors.category = 'Please select a category.'
  } else if (s === 1) {
    if (!form.budgetType) errors.budgetType = 'Please select a budget type.'
    const min = Number(form.budgetMin || 0)
    const max = Number(form.budgetMax || 0)
    if (form.budgetType === 'hourly') {
      if (min <= 0) errors.budgetMin = 'Minimum rate must be greater than 0.'
      if (max <= min) errors.budgetMax = 'Maximum rate must be greater than minimum.'
    } else {
      if (min <= 0 && max <= 0) errors.budgetMin = 'Please provide a budget amount greater than 0.'
      if (max > 0 && max < min) errors.budgetMax = 'Maximum budget must be greater than or equal to minimum.'
    }
  } else if (s === 2) {
    if (form.skills.length < 1) errors.skills = 'Please add at least 1 skill.'
  }

  return Object.keys(errors).length === 0
}

function nextStep() {
  if (validateStep(step.value)) {
    step.value++
  }
}

const form = reactive({
  title: '',
  description: '',
  category: '',
  experienceLevel: '',
  projectLength: '',
  isRemote: true,
  budgetType: 'fixed' as 'fixed' | 'hourly',
  budgetMin: undefined as number | undefined,
  budgetMax: undefined as number | undefined,
  skills: [] as string[],
  questions: [] as { question: string; required: boolean }[],
  visibility: 'public' as 'public' | 'invite_only' | 'private',
  attachments: [] as File[],
})

const visibilityOptions = [
  { value: 'public', label: 'Public', description: 'Any freelancer can see and apply to your job' },
  { value: 'invite_only', label: 'Invite Only', description: 'Only freelancers you invite can apply' },
  { value: 'private', label: 'Private', description: 'Only you can see this job (save as draft)' },
]

function addQuestion() {
  form.questions.push({ question: '', required: false })
}

const categoryOptions = [
  { label: 'Web Development', value: 'web-development' },
  { label: 'Mobile Apps', value: 'mobile-apps' },
  { label: 'Design & Creative', value: 'design' },
  { label: 'Writing & Content', value: 'writing' },
  { label: 'Data Science', value: 'data-science' },
]

const expOptions = [
  { label: 'Entry Level', value: 'entry' },
  { label: 'Intermediate', value: 'intermediate' },
  { label: 'Expert', value: 'expert' },
]

const durationOptions = [
  { label: 'Short-term (< 1 month)', value: 'short' },
  { label: 'Medium-term (1–3 months)', value: 'medium' },
  { label: 'Long-term (3+ months)', value: 'long' },
]

function addSkill(): void {
  if (newSkill.value.trim() && !form.skills.includes(newSkill.value.trim())) {
    form.skills.push(newSkill.value.trim())
    newSkill.value = ''
  }
}

async function publishJob(): Promise<void> {
  publishing.value = true
  const job = await jobStore.createJob({
    title: form.title,
    description: form.description,
    category: form.category,
    type: form.budgetType,
    experienceLevel: form.experienceLevel as 'entry' | 'intermediate' | 'expert',
    projectLength: form.projectLength as 'short' | 'medium' | 'long',
    budget: {
      type: form.budgetType,
      min: form.budgetMin,
      max: form.budgetMax,
      currency: 'USD',
    },
    skills: form.skills,
  })
  publishing.value = false
  if (job) router.push('/client/jobs')
}
</script>
