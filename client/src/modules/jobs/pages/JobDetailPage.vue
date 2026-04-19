<template>
  <div class="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 py-10">
    <!-- Loading Skeleton -->
    <div v-if="jobStore.isLoadingDetail" class="space-y-4">
      <AppSkeleton height="2rem" width="75%" rounded="xl" />
      <AppSkeleton height="1rem" width="50%" rounded="lg" />
      <AppSkeleton height="16rem" rounded="2xl" />
    </div>

    <div v-else-if="job" class="grid grid-cols-1 lg:grid-cols-3 gap-8">
      <!-- MAIN CONTENT -->
      <div class="lg:col-span-2 space-y-6">
        <!-- Header -->
        <div>
          <div class="flex flex-wrap gap-2 mb-3">
            <AppBadge :variant="job.status === 'open' ? 'green' : 'slate'" dot>{{ job.status }}</AppBadge>
            <AppBadge variant="blue">{{ job.type === 'fixed' ? 'Fixed Price' : 'Hourly Rate' }}</AppBadge>
            <AppBadge v-if="job.isRemote" variant="purple">Remote</AppBadge>
            <AppBadge v-if="job.connectsRequired" variant="yellow">
              {{ job.connectsRequired }} Connects to Apply
            </AppBadge>
          </div>
          <h1 class="text-2xl font-bold text-slate-900 mb-2">{{ job.title }}</h1>
          <div class="flex flex-wrap items-center gap-4 text-sm text-slate-500">
            <span>Posted {{ timeAgo(job.createdAt) }}</span>
            <span aria-hidden="true">·</span>
            <span>{{ job.category }}</span>
            <span aria-hidden="true">·</span>
            <span>{{ job.proposalCount }} proposals</span>
          </div>
        </div>

        <!-- Description -->
        <div class="bg-white rounded-2xl border border-slate-200 p-6">
          <h2 class="font-semibold text-slate-900 mb-4">Job Description</h2>
          <div class="text-slate-600 leading-relaxed whitespace-pre-line text-sm">{{ job.description }}</div>
        </div>

        <!-- Skills Required -->
        <div class="bg-white rounded-2xl border border-slate-200 p-6">
          <h2 class="font-semibold text-slate-900 mb-4">Skills & Expertise</h2>
          <div class="flex flex-wrap gap-2">
            <span
              v-for="skill in job.skills"
              :key="skill.id"
              class="px-3 py-1.5 bg-green-50 text-green-800 text-sm rounded-lg font-medium border border-green-100"
            >
              {{ skill.name }}
            </span>
          </div>
        </div>

        <!-- Attachments -->
        <div v-if="job.attachments?.length" class="bg-white rounded-2xl border border-slate-200 p-6">
          <h2 class="font-semibold text-slate-900 mb-4">Attachments</h2>
          <div class="space-y-2">
            <a
              v-for="att in job.attachments"
              :key="att.id"
              :href="att.url"
              target="_blank"
              rel="noopener noreferrer"
              class="flex items-center gap-3 p-3 bg-slate-50 rounded-xl border border-slate-200 hover:bg-slate-100 transition-colors text-sm"
            >
              <svg class="w-5 h-5 text-blue-500 shrink-0" fill="none" viewBox="0 0 24 24" stroke="currentColor" aria-hidden="true">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
              </svg>
              <span class="font-medium text-slate-700">{{ att.name }}</span>
              <span class="text-xs text-slate-400 ml-auto">{{ att.size ? (att.size / 1024).toFixed(0) + ' KB' : '' }}</span>
            </a>
          </div>
        </div>

        <!-- Screening Questions -->
        <div v-if="job.screeningQuestions?.length" class="bg-white rounded-2xl border border-slate-200 p-6">
          <h2 class="font-semibold text-slate-900 mb-4">Client Questions</h2>
          <ol class="space-y-3" aria-label="Screening questions">
            <li v-for="q in job.screeningQuestions" :key="q.id" class="flex gap-3 text-sm">
              <span class="w-5 h-5 bg-blue-100 text-blue-700 rounded-full flex items-center justify-center font-bold text-xs shrink-0 mt-0.5" aria-hidden="true" />
              <span class="text-slate-700">{{ q.question }} <span v-if="q.required" class="text-red-500" aria-label="required">*</span></span>
            </li>
          </ol>
          <p class="text-xs text-slate-400 mt-3">You will answer these questions when you submit your proposal.</p>
        </div>

        <!-- Already Applied Banner -->
        <div v-if="hasApplied" class="bg-blue-50 border border-blue-200 rounded-2xl p-5 flex items-start gap-3" role="status">
          <svg class="w-5 h-5 text-blue-600 shrink-0 mt-0.5" fill="none" viewBox="0 0 24 24" stroke="currentColor" aria-hidden="true">
            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
          </svg>
          <div>
            <p class="font-semibold text-blue-800">You've already submitted a proposal</p>
            <p class="text-sm text-blue-700 mt-0.5">
              Your proposal is under review. Check the status in
              <RouterLink to="/freelancer/proposals" class="underline font-medium">My Proposals</RouterLink>.
            </p>
          </div>
        </div>

        <!-- Quick Proposal Form (Freelancers only, job open, not applied) -->
        <div v-else-if="auth.isFreelancer && job.status === 'open'" ref="proposalSection" class="bg-white rounded-2xl border border-green-200 p-6 shadow-sm">
          <div class="flex justify-between items-start mb-4">
            <h2 class="font-semibold text-slate-900">Submit a Proposal</h2>
            <div class="flex items-center gap-1.5 text-xs text-amber-600 font-medium bg-amber-50 px-2.5 py-1 rounded-lg border border-amber-200">
              <svg class="w-3.5 h-3.5" fill="none" viewBox="0 0 24 24" stroke="currentColor" aria-hidden="true">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M13 10V3L4 14h7v7l9-11h-7z" />
              </svg>
              {{ job.connectsRequired ?? 6 }} Connects required
            </div>
          </div>

          <div class="space-y-4">
            <div class="grid grid-cols-2 gap-4">
              <div>
                <label for="bid-amount" class="text-sm font-medium text-slate-700 block mb-1.5">
                  {{ job.type === 'hourly' ? 'Your Hourly Rate (USD)' : 'Your Bid (USD)' }} *
                </label>
                <div class="relative">
                  <span class="absolute left-3 top-1/2 -translate-y-1/2 text-slate-500 text-sm" aria-hidden="true">$</span>
                  <input
                    id="bid-amount"
                    v-model.number="proposal.bidAmount"
                    type="number"
                    min="1"
                    class="w-full pl-7 pr-3 py-2.5 border border-slate-300 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-green-500"
                    placeholder="0.00"
                    aria-label="Bid amount in USD"
                  />
                </div>
              </div>
              <AppInput v-model="proposal.estimatedDuration" label="Estimated Duration *" placeholder="e.g. 2 weeks" />
            </div>

            <!-- Fee breakdown -->
            <div v-if="proposal.bidAmount > 0" class="flex items-center gap-4 p-3 bg-slate-50 rounded-xl text-xs text-slate-600" aria-live="polite">
              <span>Bid: <strong>${{ proposal.bidAmount.toFixed(2) }}</strong></span>
              <span aria-hidden="true">·</span>
              <span>Fee (20%): <strong>-${{ (proposal.bidAmount * 0.2).toFixed(2) }}</strong></span>
              <span aria-hidden="true">·</span>
              <span class="font-semibold text-green-700">You receive: ${{ (proposal.bidAmount * 0.8).toFixed(2) }}</span>
            </div>

            <AppTextarea
              v-model="proposal.coverLetter"
              label="Cover Letter *"
              placeholder="Introduce yourself and explain why you're the best candidate..."
              :rows="5"
              :maxlength="5000"
            />

            <RouterLink :to="`/jobs/${job.id}/apply`" class="block">
              <AppButton class="w-full">Submit Proposal →</AppButton>
            </RouterLink>
            <p class="text-xs text-slate-400 text-center">
              For full proposal with milestones & attachments, use the
              <RouterLink :to="`/jobs/${job.id}/apply`" class="text-green-600 font-medium">full application form</RouterLink>
            </p>
          </div>
        </div>

        <!-- Login prompt for guests -->
        <div v-else-if="!auth.isAuthenticated" class="bg-gradient-to-r from-green-50 to-emerald-50 border border-green-200 rounded-2xl p-8 text-center">
          <p class="text-lg font-semibold text-slate-900 mb-2">Ready to apply for this job?</p>
          <p class="text-sm text-slate-600 mb-5">Create a free account or sign in to submit your proposal.</p>
          <div class="flex gap-3 justify-center">
            <RouterLink to="/auth/signup" class="px-5 py-2.5 bg-green-600 text-white rounded-xl font-medium text-sm hover:bg-green-700 transition-colors">
              Create Account
            </RouterLink>
            <RouterLink to="/auth/login" class="px-5 py-2.5 border border-slate-300 text-slate-700 rounded-xl font-medium text-sm hover:bg-white transition-colors">
              Sign In
            </RouterLink>
          </div>
        </div>

        <!-- Similar Jobs -->
        <div class="bg-white rounded-2xl border border-slate-200 p-6">
          <h2 class="font-semibold text-slate-900 mb-4">Similar Jobs</h2>
          <div class="space-y-3">
            <RouterLink
              v-for="sj in similarJobs"
              :key="sj.id"
              :to="`/jobs/${sj.id}`"
              class="flex justify-between items-start p-3 rounded-xl hover:bg-slate-50 transition-colors group"
            >
              <div>
                <p class="text-sm font-medium text-slate-900 group-hover:text-green-600 transition-colors">{{ sj.title }}</p>
                <p class="text-xs text-slate-500 mt-0.5">{{ sj.category }} · {{ sj.proposalCount }} proposals</p>
              </div>
              <span class="text-sm font-semibold text-green-700 shrink-0 ml-3">{{ sj.budgetDisplay }}</span>
            </RouterLink>
          </div>
        </div>
      </div>

      <!-- SIDEBAR -->
      <div class="space-y-5">
        <!-- Actions -->
        <div class="bg-white rounded-2xl border border-slate-200 p-5">
          <div class="flex gap-2 mb-4">
            <AppButton
              v-if="auth.isFreelancer && job.status === 'open' && !hasApplied"
              class="flex-1"
              @click="scrollToApply"
            >
              Apply Now
            </AppButton>
            <button
              :class="[
                'p-2.5 border rounded-xl transition-colors',
                isSaved
                  ? 'border-red-300 bg-red-50 text-red-500'
                  : 'border-slate-200 text-slate-500 hover:border-slate-300 hover:bg-slate-50',
              ]"
              :aria-label="isSaved ? 'Remove from saved jobs' : 'Save this job'"
              :aria-pressed="isSaved"
              @click="toggleSave"
            >
              <svg :class="['w-5 h-5', isSaved ? 'fill-red-500 text-red-500' : '']" fill="none" viewBox="0 0 24 24" stroke="currentColor" aria-hidden="true">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M5 5a2 2 0 012-2h10a2 2 0 012 2v16l-7-3.5L5 21V5z" />
              </svg>
            </button>
          </div>
          <p v-if="isSaved" class="text-xs text-slate-500 text-center">
            Job saved! View in <RouterLink to="/freelancer/saved-jobs" class="text-green-600 font-medium">Saved Jobs</RouterLink>
          </p>
        </div>

        <!-- Job Details -->
        <div class="bg-white rounded-2xl border border-slate-200 p-5">
          <h3 class="font-semibold text-slate-900 mb-4">Job Details</h3>
          <dl class="space-y-3">
            <div class="flex justify-between">
              <dt class="text-sm text-slate-500">Budget</dt>
              <dd class="text-sm font-bold text-green-700">{{ formatBudget(job.budget) }}</dd>
            </div>
            <div class="flex justify-between">
              <dt class="text-sm text-slate-500">Type</dt>
              <dd class="text-sm font-semibold text-slate-900 capitalize">{{ job.type }} Price</dd>
            </div>
            <div class="flex justify-between">
              <dt class="text-sm text-slate-500">Experience Level</dt>
              <dd class="text-sm font-semibold text-slate-900 capitalize">{{ job.experienceLevel }}</dd>
            </div>
            <div class="flex justify-between">
              <dt class="text-sm text-slate-500">Project Length</dt>
              <dd class="text-sm font-semibold text-slate-900 capitalize">{{ job.projectLength }}</dd>
            </div>
            <div class="flex justify-between">
              <dt class="text-sm text-slate-500">Proposals</dt>
              <dd class="text-sm font-semibold text-slate-900">{{ job.proposalCount }}</dd>
            </div>
            <div v-if="job.isRemote" class="flex justify-between">
              <dt class="text-sm text-slate-500">Location</dt>
              <dd class="text-sm font-semibold text-slate-900">Worldwide</dd>
            </div>
          </dl>
        </div>

        <!-- Client Card -->
        <div v-if="job.client" class="bg-white rounded-2xl border border-slate-200 p-5">
          <h3 class="font-semibold text-slate-900 mb-4">About the Client</h3>
          <div class="flex items-center gap-3 mb-4">
            <UserAvatar :name="`${job.client.firstName} ${job.client.lastName}`" size="md" />
            <div>
              <p class="font-medium text-slate-900 text-sm">{{ job.client.firstName }} {{ job.client.lastName }}</p>
              <p v-if="job.client.companyName" class="text-xs text-slate-500">{{ job.client.companyName }}</p>
            </div>
          </div>
          <div class="space-y-2 text-xs text-slate-500">
            <div v-if="job.client.paymentVerified" class="flex items-center gap-2 text-green-700 font-medium">
              <svg class="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" aria-hidden="true">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 12l2 2 4-4m5.618-4.016A11.955 11.955 0 0112 2.944a11.955 11.955 0 01-8.618 3.04A12.02 12.02 0 003 9c0 5.591 3.824 10.29 9 11.622 5.176-1.332 9-6.03 9-11.622 0-1.042-.133-2.052-.382-3.016z" />
              </svg>
              Payment Verified
            </div>
            <div class="flex items-center gap-2">
              <svg class="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" aria-hidden="true">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" />
              </svg>
              Member since {{ job.client.memberSince ?? '2022' }}
            </div>
            <div class="flex items-center gap-2">
              <svg class="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" aria-hidden="true">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M21 13.255A23.931 23.931 0 0112 15c-3.183 0-6.22-.62-9-1.745M16 6V4a2 2 0 00-2-2h-4a2 2 0 00-2 2v2m4 6h.01M5 20h14a2 2 0 002-2V8a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" />
              </svg>
              {{ job.client.totalHires ?? 12 }} hires
            </div>
            <div class="flex items-center gap-2">
              <svg class="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" aria-hidden="true">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M17 9V7a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2m2 4h10a2 2 0 002-2v-6a2 2 0 00-2-2H9a2 2 0 00-2 2v6a2 2 0 002 2zm7-5a2 2 0 11-4 0 2 2 0 014 0z" />
              </svg>
              ${{ ((job.client.totalSpent ?? 45000) / 1000).toFixed(0) }}K total spent
            </div>
            <div v-if="job.client.rating" class="flex items-center gap-2">
              <StarRating :model-value="job.client.rating" size="sm" show-value />
              <span>({{ job.client.totalReviews ?? 8 }} reviews)</span>
            </div>
          </div>
        </div>

        <!-- Share -->
        <div class="bg-white rounded-2xl border border-slate-200 p-5">
          <p class="text-sm font-medium text-slate-700 mb-3">Share this job</p>
          <div class="flex gap-2">
            <button
              class="flex-1 py-2 border border-slate-200 rounded-xl text-xs font-medium text-slate-600 hover:bg-slate-50 transition-colors"
              @click="copyLink"
            >
              📋 Copy Link
            </button>
            <a
              :href="`https://twitter.com/intent/tweet?text=${encodeURIComponent(job.title)}&url=${encodeURIComponent(pageUrl)}`"
              target="_blank"
              rel="noopener noreferrer"
              class="flex-1 py-2 border border-slate-200 rounded-xl text-xs font-medium text-slate-600 hover:bg-slate-50 transition-colors text-center"
            >
              🐦 Twitter
            </a>
          </div>
        </div>
      </div>
    </div>

    <!-- 404 -->
    <div v-else class="text-center py-20">
      <p class="text-5xl mb-4" aria-hidden="true">😕</p>
      <h2 class="text-xl font-bold text-slate-900 mb-2">Job not found</h2>
      <RouterLink to="/hire" class="text-green-600 font-medium hover:text-green-700">
        Browse all jobs →
      </RouterLink>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, reactive, computed, onMounted } from 'vue'
import { RouterLink, useRoute } from 'vue-router'
import { useJobStore } from '@/stores/job.store'
import { useAuthStore } from '@/stores/auth.store'
import { useToastStore } from '@/stores/toast.store'
import { useFormatters } from '@/composables/useFormatters'
import AppBadge from '@/components/ui/AppBadge.vue'
import AppSkeleton from '@/components/ui/AppSkeleton.vue'
import AppInput from '@/components/ui/AppInput.vue'
import AppTextarea from '@/components/ui/AppTextarea.vue'
import AppButton from '@/components/ui/AppButton.vue'
import StarRating from '@/components/ui/StarRating.vue'
import UserAvatar from '@/components/common/UserAvatar.vue'

const route = useRoute()
const jobStore = useJobStore()
const auth = useAuthStore()
const toast = useToastStore()
const { formatBudget, timeAgo } = useFormatters()

const job = computed(() => jobStore.selectedJob)
const isSaved = ref(false)
const hasApplied = ref(false)
const proposalSection = ref<HTMLElement | null>(null)

const pageUrl = computed(() => window.location.href)

const proposal = reactive({ bidAmount: 0, estimatedDuration: '', coverLetter: '' })

const similarJobs = [
  { id: 's1', title: 'Senior React Developer for SaaS Platform', category: 'Web Development', proposalCount: 18, budgetDisplay: '$4,000–$7,000' },
  { id: 's2', title: 'Frontend Developer — Vue.js & Nuxt', category: 'Web Development', proposalCount: 9, budgetDisplay: '$60–$90/hr' },
  { id: 's3', title: 'Full-Stack Developer (Node.js + React)', category: 'Web Development', proposalCount: 25, budgetDisplay: '$3,500–$6,000' },
]

onMounted(() => {
  jobStore.fetchJob(route.params.id as string)
})

function toggleSave(): void {
  isSaved.value = !isSaved.value
  toast.info(
    isSaved.value ? 'Job Saved' : 'Job Removed',
    isSaved.value ? 'Added to your saved jobs.' : 'Removed from saved jobs.',
  )
}

function scrollToApply(): void {
  proposalSection.value?.scrollIntoView({ behavior: 'smooth', block: 'center' })
}

function copyLink(): void {
  navigator.clipboard.writeText(window.location.href).then(
    () => toast.success('Link Copied!', 'Job URL copied to clipboard.'),
    () => toast.error('Copy Failed', 'Could not copy link. Please copy manually.'),
  )
}
</script>
