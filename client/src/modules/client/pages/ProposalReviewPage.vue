<template>
  <div class="space-y-6">
    <div class="flex items-center gap-3">
      <button class="p-2 rounded-xl hover:bg-slate-100 transition-colors" @click="router.back()">
        <svg class="w-5 h-5 text-slate-600" fill="none" viewBox="0 0 24 24" stroke="currentColor">
          <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M15 19l-7-7 7-7" />
        </svg>
      </button>
      <div class="flex-1">
        <h1 class="text-xl font-bold text-slate-900">Review Proposals</h1>
        <p class="text-sm text-slate-500">{{ jobStore.selectedJob?.title ?? 'Loading...' }}</p>
      </div>
      <RouterLink to="/client/jobs/1/invite" class="flex items-center gap-2 px-4 py-2 border border-blue-300 text-blue-600 rounded-xl text-sm font-medium hover:bg-blue-50 transition-colors">
        <svg class="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M3 8l7.89 5.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z"/></svg>
        Invite Freelancers
      </RouterLink>
    </div>

    <!-- Loading State -->
    <div v-if="proposalStore.isLoading" class="space-y-4">
      <div class="grid grid-cols-4 gap-3">
        <div v-for="i in 4" :key="i" class="animate-pulse bg-white rounded-xl border border-slate-200 p-4 h-16"></div>
      </div>
      <div v-for="i in 3" :key="i" class="animate-pulse bg-white rounded-2xl border border-slate-200 p-6 h-48"></div>
    </div>

    <!-- Error State -->
    <div v-else-if="proposalStore.error" class="text-center py-16">
      <div class="text-red-400 mb-4">
        <svg class="w-12 h-12 mx-auto" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-2.5L13.732 4c-.77-.833-1.964-.833-2.732 0L4.082 16.5c-.77.833.192 2.5 1.732 2.5z"/></svg>
      </div>
      <p class="text-gray-600 mb-4">{{ proposalStore.error }}</p>
      <button class="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700" @click="retry">Try Again</button>
    </div>

    <!-- Empty State -->
    <div v-else-if="!proposals.length" class="text-center py-16 bg-white rounded-2xl border border-slate-200">
      <div class="text-slate-300 mb-4">
        <svg class="w-16 h-16 mx-auto" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="1.5" d="M20 13V6a2 2 0 00-2-2H6a2 2 0 00-2 2v7m16 0v5a2 2 0 01-2 2H6a2 2 0 01-2-2v-5m16 0h-2.586a1 1 0 00-.707.293l-2.414 2.414a1 1 0 01-.707.293h-2.172a1 1 0 01-.707-.293l-2.414-2.414A1 1 0 006.586 13H4"/></svg>
      </div>
      <h3 class="text-lg font-medium text-slate-900 mb-1">No proposals received yet</h3>
      <p class="text-slate-500">Proposals from freelancers will appear here. Try inviting freelancers to apply.</p>
    </div>

    <!-- Content -->
    <template v-else>
    <!-- Summary stats -->
    <div class="grid grid-cols-4 gap-3">
      <div v-for="stat in proposalStats" :key="stat.label" :class="['p-4 rounded-xl text-center border', stat.highlight ? 'bg-blue-50 border-blue-200' : 'bg-white border-slate-200']">
        <p class="text-2xl font-bold text-slate-900">{{ stat.value }}</p>
        <p class="text-xs text-slate-500 mt-0.5">{{ stat.label }}</p>
      </div>
    </div>

    <!-- Filter tabs -->
    <AppTabs v-model="activeTab" :tabs="filterTabs" variant="buttons" />

    <!-- Proposals -->
    <div class="space-y-5">
      <div
        v-for="proposal in filteredProposals"
        :key="proposal.id"
        :class="['bg-white rounded-2xl border p-6 transition-shadow hover:shadow-sm', proposal.isShortlisted ? 'border-yellow-300' : 'border-slate-200']"
      >
        <!-- Shortlisted Badge -->
        <div v-if="proposal.isShortlisted" class="flex items-center gap-1.5 text-xs font-semibold text-yellow-700 bg-yellow-50 border border-yellow-200 px-2.5 py-1 rounded-lg w-fit mb-3">
          ⭐ Shortlisted
        </div>

        <!-- Header -->
        <div class="flex items-start gap-4 mb-4">
          <RouterLink :to="`/freelancers/${proposal.freelancerId}`">
            <UserAvatar :name="`${proposal.freelancer?.firstName} ${proposal.freelancer?.lastName}`" size="lg" />
          </RouterLink>
          <div class="flex-1">
            <div class="flex flex-wrap items-start justify-between gap-3">
              <div>
                <div class="flex items-center gap-2 mb-0.5">
                  <RouterLink :to="`/freelancers/${proposal.freelancerId}`" class="font-semibold text-slate-900 hover:text-green-600 transition-colors">
                    {{ proposal.freelancer?.firstName }} {{ proposal.freelancer?.lastName }}
                  </RouterLink>
                  <AppBadge v-if="(proposal.freelancer as any)?.badge === 'top_rated'" variant="yellow">Top Rated</AppBadge>
                  <AppBadge v-else-if="(proposal.freelancer as any)?.badge === 'rising_talent'" variant="purple">Rising Talent</AppBadge>
                </div>
                <p class="text-sm text-slate-500">{{ (proposal.freelancer as any)?.title }}</p>
                <div class="flex items-center gap-2 mt-1">
                  <StarRating :model-value="(proposal.freelancer as any)?.rating ?? 0" size="sm" show-value />
                  <span class="text-xs text-slate-500">({{ (proposal.freelancer as any)?.totalReviews }} reviews)</span>
                  <span class="text-xs text-slate-400">·</span>
                  <span class="text-xs font-semibold text-green-700">{{ (proposal.freelancer as any)?.jobSuccessScore ?? 97 }}% JSS</span>
                </div>
              </div>
              <div class="text-right">
                <p class="text-2xl font-bold text-slate-900">${{ (proposal.bidAmount ?? 0).toLocaleString() }}</p>
                <p class="text-xs text-slate-500">{{ proposal.estimatedDuration }}</p>
                <p class="text-xs text-slate-400 mt-0.5">Submitted {{ timeAgo(proposal.createdAt ?? '') }}</p>
              </div>
            </div>
          </div>
        </div>

        <!-- Cover Letter -->
        <div class="mb-4">
          <p class="text-sm font-medium text-slate-700 mb-2">Cover Letter</p>
          <p class="text-sm text-slate-600 leading-relaxed">
            {{ expandedIds.has(proposal.id!) ? proposal.coverLetter : (proposal.coverLetter ?? '').slice(0, 200) + ((proposal.coverLetter ?? '').length > 200 ? '...' : '') }}
          </p>
          <button v-if="(proposal.coverLetter ?? '').length > 200" class="text-xs text-green-600 font-medium mt-1 hover:text-green-700" @click="toggleExpand(proposal.id!)">
            {{ expandedIds.has(proposal.id!) ? 'Show less' : 'Read more' }}
          </button>
        </div>

        <!-- Milestones Preview -->
        <div v-if="proposal.milestones?.length" class="mb-4 p-3 bg-slate-50 rounded-xl">
          <p class="text-xs font-semibold text-slate-700 mb-2">Proposed Milestones:</p>
          <div class="space-y-1">
            <div v-for="m in proposal.milestones" :key="m.id" class="flex justify-between text-xs text-slate-600">
              <span>{{ m.title }}</span>
              <span class="font-semibold">${{ (m.amount ?? 0).toLocaleString() }}</span>
            </div>
          </div>
        </div>

        <!-- Actions -->
        <div class="flex flex-wrap gap-3 pt-4 border-t border-slate-100">
          <AppButton size="sm" @click="openHireModal(proposal)">
            <svg class="w-4 h-4 mr-1" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z"/></svg>
            Hire Now
          </AppButton>
          <AppButton
            variant="outline"
            size="sm"
            :class="proposal.isShortlisted ? 'border-yellow-300 text-yellow-700' : ''"
            @click="toggleShortlist(proposal.id!)"
          >
            {{ proposal.isShortlisted ? '★ Shortlisted' : '☆ Shortlist' }}
          </AppButton>
          <RouterLink :to="`/freelancers/${proposal.freelancerId}`">
            <AppButton variant="outline" size="sm">View Profile</AppButton>
          </RouterLink>
          <AppButton variant="ghost" size="sm" @click="router.push('/client/messages')">Message</AppButton>
          <AppButton variant="ghost" size="sm" class="ml-auto text-red-500 hover:bg-red-50" @click="rejectProposal(proposal.id!)">
            Decline
          </AppButton>
        </div>
      </div>

      <div v-if="!filteredProposals.length" class="text-center py-12 bg-white rounded-2xl border border-slate-200">
        <p class="text-4xl mb-3">📭</p>
        <p class="text-lg font-semibold text-slate-900 mb-1">No proposals here</p>
        <p class="text-sm text-slate-500">{{ activeTab === 'shortlisted' ? 'Shortlist candidates you like.' : 'Proposals matching this filter will appear here.' }}</p>
      </div>
    </div>
    </template>
  </div>

  <!-- Hire Modal -->
  <AppModal v-model="showHireModal" title="Start Contract" size="md">
    <div v-if="selectedProposal" class="space-y-4">
      <div class="flex items-center gap-3 p-4 bg-green-50 rounded-xl border border-green-200">
        <UserAvatar :name="`${selectedProposal.freelancer?.firstName} ${selectedProposal.freelancer?.lastName}`" size="md" />
        <div>
          <p class="font-semibold text-slate-900">{{ selectedProposal.freelancer?.firstName }} {{ selectedProposal.freelancer?.lastName }}</p>
          <p class="text-sm text-green-700 font-semibold">${{ (selectedProposal.bidAmount ?? 0).toLocaleString() }} {{ selectedProposal.bidType === 'hourly' ? '/hr' : 'fixed' }}</p>
        </div>
      </div>
      <AppInput v-model="contractForm.title" label="Contract Title" required />
      <AppTextarea v-model="contractForm.description" label="Contract Description" :rows="3" />
      <div class="grid grid-cols-2 gap-3">
        <AppDatePicker v-model="contractForm.startDate" label="Start Date" :min="today" />
        <AppDatePicker v-model="contractForm.endDate" label="End Date (optional)" :min="contractForm.startDate" />
      </div>
      <div class="p-4 bg-amber-50 rounded-xl border border-amber-200">
        <p class="text-sm text-amber-800 font-medium mb-1">Escrow Payment</p>
        <p class="text-xs text-amber-700">By hiring, ${{ (selectedProposal.bidAmount ?? 0).toLocaleString() }} will be deposited into escrow to secure this contract. Funds are released when milestones are approved.</p>
      </div>
    </div>
    <template #footer>
      <AppButton variant="outline" @click="showHireModal = false">Cancel</AppButton>
      <AppButton :loading="hiring" @click="confirmHire">Start Contract & Deposit Funds</AppButton>
    </template>
  </AppModal>
</template>

<script setup lang="ts">
import { ref, reactive, computed, onMounted } from 'vue'
import { RouterLink, useRouter, useRoute } from 'vue-router'
import { useProposalStore } from '@/stores/proposal.store'
import { useJobStore } from '@/stores/job.store'
import type { Proposal } from '@/types'
import AppBadge from '@/components/ui/AppBadge.vue'
import AppButton from '@/components/ui/AppButton.vue'
import AppModal from '@/components/ui/AppModal.vue'
import AppInput from '@/components/ui/AppInput.vue'
import AppTextarea from '@/components/ui/AppTextarea.vue'
import AppDatePicker from '@/components/ui/AppDatePicker.vue'
import AppTabs from '@/components/ui/AppTabs.vue'
import StarRating from '@/components/ui/StarRating.vue'
import UserAvatar from '@/components/common/UserAvatar.vue'

const router = useRouter()
const route = useRoute()
const proposalStore = useProposalStore()
const jobStore = useJobStore()

const activeTab = ref('all')
const expandedIds = ref(new Set<string>())
const showHireModal = ref(false)
const hiring = ref(false)
const selectedProposal = ref<Partial<Proposal> | null>(null)
const today = new Date().toISOString().split('T')[0]

const contractForm = reactive({ title: '', description: '', startDate: today, endDate: '' })

async function retry() {
  const jobId = route.params.id as string
  if (jobId) {
    await Promise.all([
      proposalStore.fetchMyProposals(),
      jobStore.fetchJob(jobId),
    ])
  }
}

onMounted(async () => {
  await retry()
})

const proposals = computed(() => proposalStore.proposals)

const filterTabs = computed(() => [
  { label: 'All Proposals', value: 'all', badge: proposals.value.filter((p) => p.status !== 'rejected').length },
  { label: 'Best Match', value: 'best', badge: proposals.value.filter((p) => (p.freelancer as any)?.jobSuccessScore >= 96).length },
  { label: 'Shortlisted', value: 'shortlisted', badge: proposals.value.filter((p) => p.isShortlisted).length },
  { label: 'Declined', value: 'rejected' },
])

const proposalStats = computed(() => {
  const all = proposals.value
  const avgBid = all.length ? Math.round(all.reduce((s, p) => s + (p.bidAmount ?? 0), 0) / all.length) : 0
  return [
    { label: 'Total Proposals', value: all.length, highlight: false },
    { label: 'Viewed', value: all.filter((p) => p.status === 'viewed' || p.isShortlisted).length, highlight: false },
    { label: 'Shortlisted', value: all.filter((p) => p.isShortlisted).length, highlight: false },
    { label: 'Avg Bid', value: `$${avgBid.toLocaleString()}`, highlight: true },
  ]
})

const filteredProposals = computed(() => {
  if (activeTab.value === 'shortlisted') return proposals.value.filter((p) => p.isShortlisted)
  if (activeTab.value === 'rejected') return proposals.value.filter((p) => p.status === 'rejected')
  if (activeTab.value === 'best') return proposals.value.filter((p) => (p.freelancer as any)?.jobSuccessScore >= 96)
  return proposals.value.filter((p) => p.status !== 'rejected')
})

function toggleExpand(id: string) {
  if (expandedIds.value.has(id)) expandedIds.value.delete(id)
  else expandedIds.value.add(id)
}

async function toggleShortlist(id: string) {
  await proposalStore.shortlistProposal(id)
}

function openHireModal(proposal: Partial<Proposal>) {
  selectedProposal.value = proposal
  contractForm.title = `Contract with ${proposal.freelancer?.firstName} ${proposal.freelancer?.lastName}`
  showHireModal.value = true
}

async function confirmHire() {
  if (!selectedProposal.value?.id) return
  hiring.value = true
  const ok = await proposalStore.acceptProposal(selectedProposal.value.id)
  hiring.value = false
  if (ok) {
    showHireModal.value = false
    router.push('/client/contracts')
  }
}

async function rejectProposal(id: string) {
  await proposalStore.rejectProposal(id)
}

function timeAgo(date: string): string {
  const diff = Date.now() - new Date(date).getTime()
  const hours = Math.floor(diff / 3600000)
  if (hours < 1) return 'just now'
  if (hours < 24) return `${hours}h ago`
  return `${Math.floor(hours / 24)}d ago`
}
</script>
