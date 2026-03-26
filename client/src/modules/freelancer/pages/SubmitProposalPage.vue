<template>
  <div class="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10">
    <!-- Breadcrumb -->
    <AppBreadcrumb :items="[{ label: 'Browse Jobs', route: '/browse-jobs' }, { label: jobTitle }, { label: 'Submit Proposal' }]" class="mb-6" />

    <!-- Loading State -->
    <div v-if="jobStore.isLoadingDetail" class="grid grid-cols-1 lg:grid-cols-3 gap-8">
      <div class="lg:col-span-2 space-y-6">
        <div class="animate-pulse bg-white rounded-2xl border border-slate-200 p-6 h-20"></div>
        <div class="animate-pulse bg-white rounded-2xl border border-slate-200 p-6 h-64"></div>
        <div class="animate-pulse bg-white rounded-2xl border border-slate-200 p-6 h-48"></div>
      </div>
      <div class="animate-pulse bg-white rounded-2xl border border-slate-200 p-5 h-64"></div>
    </div>

    <!-- Error State -->
    <div v-else-if="jobStore.error" class="text-center py-16">
      <div class="text-red-400 mb-4">
        <svg class="w-12 h-12 mx-auto" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-2.5L13.732 4c-.77-.833-1.964-.833-2.732 0L4.082 16.5c-.77.833.192 2.5 1.732 2.5z"/></svg>
      </div>
      <p class="text-gray-600 mb-4">{{ jobStore.error }}</p>
      <button class="px-4 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700" @click="retry">Try Again</button>
    </div>

    <div v-else class="grid grid-cols-1 lg:grid-cols-3 gap-8">
      <!-- Proposal Form -->
      <div class="lg:col-span-2 space-y-6">
        <div class="bg-white rounded-2xl border border-slate-200 p-6">
          <h1 class="text-xl font-bold text-slate-900 mb-1">Submit a Proposal</h1>
          <p class="text-sm text-slate-500">for <span class="font-medium text-slate-700">{{ jobTitle }}</span></p>
        </div>

        <!-- Connects Cost -->
        <div class="bg-amber-50 border border-amber-200 rounded-2xl p-4 flex items-start gap-3">
          <svg class="w-5 h-5 text-amber-600 shrink-0 mt-0.5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M13 10V3L4 14h7v7l9-11h-7z" />
          </svg>
          <div>
            <p class="text-sm font-semibold text-amber-800">Submitting requires <strong>{{ connectsCost }} Connects</strong></p>
            <p class="text-xs text-amber-700 mt-0.5">You have <strong>{{ connectsBalance }} Connects</strong> available. After submitting, you'll have {{ connectsBalance - connectsCost }} left.</p>
          </div>
        </div>

        <!-- Bid Amount -->
        <div class="bg-white rounded-2xl border border-slate-200 p-6 space-y-4">
          <h2 class="font-semibold text-slate-900">Terms</h2>

          <div class="grid grid-cols-2 gap-4">
            <div>
              <label class="text-sm font-medium text-slate-700 block mb-1.5">
                {{ jobType === 'hourly' ? 'Your Hourly Rate (USD)' : 'Your Bid (USD)' }}
                <span class="text-red-500">*</span>
              </label>
              <div class="relative">
                <span class="absolute left-3 top-1/2 -translate-y-1/2 text-slate-500 font-medium text-sm">$</span>
                <input
                  v-model="form.bidAmount"
                  type="number"
                  min="1"
                  class="w-full pl-7 pr-4 py-2.5 border border-slate-300 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-green-500"
                  placeholder="0.00"
                />
              </div>
            </div>
            <AppInput v-model="form.estimatedDuration" label="Estimated Duration *" placeholder="e.g. 2 weeks, 1 month" />
          </div>

          <!-- Service fee breakdown -->
          <div class="bg-slate-50 rounded-xl p-4 text-sm space-y-2">
            <div class="flex justify-between text-slate-600">
              <span>Your bid amount</span>
              <span>${{ Number(form.bidAmount || 0).toFixed(2) }}</span>
            </div>
            <div class="flex justify-between text-slate-500">
              <span>Downwork service fee (20%)</span>
              <span>-${{ serviceFee.toFixed(2) }}</span>
            </div>
            <div class="flex justify-between font-semibold text-slate-900 border-t border-slate-200 pt-2 mt-2">
              <span>You'll receive</span>
              <span class="text-green-700">${{ netAmount.toFixed(2) }}</span>
            </div>
          </div>
        </div>

        <!-- Milestones (for Fixed Price) -->
        <div v-if="jobType === 'fixed'" class="bg-white rounded-2xl border border-slate-200 p-6">
          <div class="flex justify-between items-center mb-4">
            <h2 class="font-semibold text-slate-900">Milestones (optional)</h2>
            <AppButton variant="outline" size="sm" @click="addMilestone">+ Add Milestone</AppButton>
          </div>
          <div class="space-y-3">
            <div v-for="(m, i) in form.milestones" :key="i" class="flex gap-3 items-start p-4 bg-slate-50 rounded-xl">
              <div class="flex-1 grid grid-cols-3 gap-3">
                <div class="col-span-2">
                  <AppInput v-model="m.title" placeholder="Milestone title" size="sm" />
                </div>
                <div class="relative">
                  <span class="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400 text-sm">$</span>
                  <input v-model="m.amount" type="number" placeholder="Amount" class="w-full pl-7 pr-3 py-2 border border-slate-300 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-green-500" />
                </div>
                <div class="col-span-3">
                  <input v-model="m.description" type="text" placeholder="What will be delivered?" class="w-full px-3 py-2 border border-slate-300 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-green-500" />
                </div>
              </div>
              <button class="text-slate-400 hover:text-red-500 mt-1 shrink-0" @click="form.milestones.splice(i, 1)">
                <svg class="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M6 18L18 6M6 6l12 12" /></svg>
              </button>
            </div>
            <p v-if="!form.milestones.length" class="text-sm text-slate-400 text-center py-2">No milestones added. Breaking into milestones builds trust with clients.</p>
          </div>
        </div>

        <!-- Cover Letter -->
        <div class="bg-white rounded-2xl border border-slate-200 p-6">
          <h2 class="font-semibold text-slate-900 mb-4">Cover Letter <span class="text-red-500">*</span></h2>
          <AppTextarea
            v-model="form.coverLetter"
            placeholder="Introduce yourself, explain why you're the best fit, and describe your approach to this project..."
            :rows="8"
            :maxlength="5000"
          />
          <p class="text-xs text-slate-400 mt-2 text-right">{{ form.coverLetter.length }}/5000</p>
        </div>

        <!-- Screening Questions -->
        <div v-if="screeningQuestions.length" class="bg-white rounded-2xl border border-slate-200 p-6 space-y-4">
          <h2 class="font-semibold text-slate-900">Client Questions</h2>
          <div v-for="(q, i) in screeningQuestions" :key="i" class="space-y-2">
            <label class="text-sm font-medium text-slate-700">
              {{ i + 1 }}. {{ q.question }}
              <span v-if="q.required" class="text-red-500 ml-0.5">*</span>
            </label>
            <AppTextarea v-model="answers[i]" :placeholder="`Answer question ${i + 1}...`" :rows="3" />
          </div>
        </div>

        <!-- Attachments -->
        <div class="bg-white rounded-2xl border border-slate-200 p-6">
          <h2 class="font-semibold text-slate-900 mb-4">Attachments (optional)</h2>
          <AppFileUpload
            label=""
            hint="Portfolio samples, work examples, or relevant files · Max 5 files, 50MB each"
            accept=".pdf,.doc,.docx,.jpg,.jpeg,.png,.zip"
            :multiple="true"
            :max-size-m-b="50"
            @change="form.attachments = $event"
          />
        </div>

        <!-- Submit -->
        <div class="flex gap-3">
          <AppButton :loading="submitting" :disabled="connectsBalance < connectsCost" class="flex-1" @click="submitProposal">
            Submit Proposal ({{ connectsCost }} Connects)
          </AppButton>
          <AppButton variant="outline" @click="router.back()">Cancel</AppButton>
        </div>

        <p v-if="connectsBalance < connectsCost" class="text-sm text-red-600 text-center">
          You don't have enough Connects.
          <RouterLink to="/freelancer/earnings" class="font-medium underline">Buy more Connects</RouterLink>
        </p>
      </div>

      <!-- Sidebar: Job Overview -->
      <div class="space-y-5">
        <div class="bg-white rounded-2xl border border-slate-200 p-5 sticky top-24">
          <h3 class="font-semibold text-slate-900 mb-4">Job Overview</h3>
          <dl class="space-y-3 text-sm">
            <div>
              <dt class="text-slate-500 mb-0.5">Payment Type</dt>
              <dd class="font-semibold capitalize">{{ jobType }} Price</dd>
            </div>
            <div>
              <dt class="text-slate-500 mb-0.5">Budget</dt>
              <dd class="font-semibold text-green-700">{{ budgetDisplay }}</dd>
            </div>
            <div>
              <dt class="text-slate-500 mb-0.5">Experience Level</dt>
              <dd class="font-semibold capitalize">{{ experienceLevel }}</dd>
            </div>
            <div>
              <dt class="text-slate-500 mb-0.5">Project Length</dt>
              <dd class="font-semibold capitalize">{{ projectLength }}</dd>
            </div>
            <div>
              <dt class="text-slate-500 mb-0.5">Proposals Received</dt>
              <dd class="font-semibold">{{ proposalCount }} proposals</dd>
            </div>
          </dl>
        </div>

        <!-- Tips -->
        <div class="bg-blue-50 border border-blue-100 rounded-2xl p-5">
          <h3 class="font-semibold text-blue-900 mb-3 flex items-center gap-2">
            <svg class="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9.663 17h4.673M12 3v1m6.364 1.636l-.707.707M21 12h-1M4 12H3m3.343-5.657l-.707-.707m2.828 9.9a5 5 0 117.072 0l-.548.547A3.374 3.374 0 0014 18.469V19a2 2 0 11-4 0v-.531c0-.895-.356-1.754-.988-2.386l-.548-.547z"/></svg>
            Tips for a strong proposal
          </h3>
          <ul class="text-xs text-blue-700 space-y-1.5 list-disc list-inside">
            <li>Address the client's specific needs</li>
            <li>Highlight relevant past experience</li>
            <li>Set realistic timelines and pricing</li>
            <li>Break into milestones for larger projects</li>
            <li>Attach work samples if relevant</li>
          </ul>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, reactive, computed, onMounted } from 'vue'
import { useRouter, useRoute, RouterLink } from 'vue-router'
import { useJobStore } from '@/stores/job.store'
import { useProposalStore } from '@/stores/proposal.store'
import { usePaymentStore } from '@/stores/payment.store'
import { useToastStore } from '@/stores/toast.store'
import AppBreadcrumb from '@/components/ui/AppBreadcrumb.vue'
import AppInput from '@/components/ui/AppInput.vue'
import AppTextarea from '@/components/ui/AppTextarea.vue'
import AppButton from '@/components/ui/AppButton.vue'
import AppFileUpload from '@/components/ui/AppFileUpload.vue'
import type { ScreeningQuestion } from '@/types'

const router = useRouter()
const route = useRoute()
const jobStore = useJobStore()
const proposalStore = useProposalStore()
const paymentStore = usePaymentStore()
const toast = useToastStore()

const submitting = computed(() => proposalStore.isSubmitting)
const connectsBalance = computed(() => paymentStore.connectsBalance)
const connectsCost = ref(6)

const job = computed(() => jobStore.selectedJob)
const jobTitle = computed(() => job.value?.title ?? '')
const jobType = computed<'fixed' | 'hourly'>(() => (job.value?.type as 'fixed' | 'hourly') ?? 'fixed')
const budgetDisplay = computed(() => {
  const b = job.value?.budget
  if (!b) return 'Negotiable'
  if (b.type === 'hourly') return `$${b.min}–$${b.max}/hr`
  if (b.min && b.max) return `$${b.min.toLocaleString()}–$${b.max.toLocaleString()}`
  return b.amount ? `$${b.amount.toLocaleString()}` : 'Negotiable'
})
const experienceLevel = computed(() => job.value?.experienceLevel ?? 'intermediate')
const projectLength = computed(() => job.value?.projectLength ?? 'medium')
const proposalCount = computed(() => job.value?.proposalCount ?? 0)

const screeningQuestions = computed<ScreeningQuestion[]>(() => job.value?.screeningQuestions ?? [])
const answers = ref<string[]>([])

async function retry() {
  const jobId = route.params.jobId as string
  if (jobId) await jobStore.fetchJob(jobId)
  await paymentStore.fetchConnectsBalance()
  answers.value = screeningQuestions.value.map(() => '')
  if (job.value?.connectsRequired) connectsCost.value = job.value.connectsRequired
}

onMounted(async () => {
  await retry()
})

const form = reactive({
  bidAmount: 0,
  estimatedDuration: '',
  coverLetter: '',
  milestones: [] as { title: string; description: string; amount: number }[],
  attachments: [] as File[],
})

const serviceFee = computed(() => Number(form.bidAmount || 0) * 0.2)
const netAmount = computed(() => Number(form.bidAmount || 0) - serviceFee.value)

function addMilestone() {
  form.milestones.push({ title: '', description: '', amount: 0 })
}

async function submitProposal() {
  if (!form.coverLetter.trim()) {
    toast.error('Cover letter required', 'Please write a cover letter before submitting.')
    return
  }
  if (!form.bidAmount) {
    toast.error('Bid amount required', 'Please enter your bid amount.')
    return
  }
  const jobId = route.params.jobId as string
  const result = await proposalStore.submitProposal({
    jobId,
    coverLetter: form.coverLetter,
    bidAmount: Number(form.bidAmount),
    bidType: jobType.value,
    estimatedDuration: form.estimatedDuration,
    milestones: form.milestones.length ? form.milestones.map(m => ({ title: m.title, amount: m.amount })) : undefined,
    answers: screeningQuestions.value.length
      ? screeningQuestions.value.map((q, i) => ({ questionId: q.id, answer: answers.value[i] ?? '' }))
      : undefined,
    attachments: form.attachments.length ? form.attachments : undefined,
  })
  if (result) {
    await paymentStore.fetchConnectsBalance()
    router.push('/freelancer/proposals')
  }
}
</script>
