<template>
  <div class="space-y-6">
    <div class="flex items-center justify-between">
      <h1 class="text-2xl font-bold text-slate-900">My Proposals</h1>
      <RouterLink to="/browse-jobs" class="px-4 py-2 bg-green-600 text-white text-sm font-medium rounded-xl hover:bg-green-700 transition-colors">
        + Find Jobs
      </RouterLink>
    </div>

    <!-- Loading State -->
    <div v-if="proposalStore.isLoading" class="space-y-4">
      <div class="grid grid-cols-4 gap-3">
        <div v-for="i in 4" :key="i" class="animate-pulse bg-white rounded-xl border border-slate-200 p-3 h-16"></div>
      </div>
      <div v-for="i in 4" :key="i" class="animate-pulse bg-white rounded-2xl border border-slate-200 p-6 h-36"></div>
    </div>

    <!-- Error State -->
    <div v-else-if="proposalStore.error" class="text-center py-16">
      <div class="text-red-400 mb-4">
        <svg class="w-12 h-12 mx-auto" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-2.5L13.732 4c-.77-.833-1.964-.833-2.732 0L4.082 16.5c-.77.833.192 2.5 1.732 2.5z"/></svg>
      </div>
      <p class="text-gray-600 mb-4">{{ proposalStore.error }}</p>
      <button class="px-4 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700" @click="retry">Try Again</button>
    </div>

    <!-- Content -->
    <template v-else>
    <!-- Stats quick summary -->
    <div class="grid grid-cols-4 gap-3">
      <div v-for="s in proposalStats" :key="s.label" class="bg-white rounded-xl border border-slate-200 p-3 text-center">
        <p class="text-xl font-bold text-slate-900">{{ s.value }}</p>
        <p class="text-xs text-slate-500 mt-0.5">{{ s.label }}</p>
      </div>
    </div>

    <!-- Tab Filter -->
    <div class="flex gap-1 bg-slate-100 p-1 rounded-xl w-fit">
      <button
        v-for="tab in tabs"
        :key="tab.value"
        :class="['px-4 py-2 text-sm font-medium rounded-lg transition-colors', activeTab === tab.value ? 'bg-white text-slate-900 shadow-sm' : 'text-slate-500 hover:text-slate-700']"
        @click="activeTab = tab.value"
      >
        {{ tab.label }}
        <span v-if="tab.count" class="ml-1.5 px-1.5 py-0.5 text-xs bg-green-100 text-green-700 rounded-full">{{ tab.count }}</span>
      </button>
    </div>

    <!-- Proposals List -->
    <div class="space-y-4">
      <div
        v-for="proposal in filteredProposals"
        :key="proposal.id"
        class="bg-white rounded-2xl border border-slate-200 p-6 hover:shadow-sm transition-shadow"
      >
        <div class="flex flex-col sm:flex-row sm:items-start justify-between gap-4">
          <div class="flex-1">
            <div class="flex flex-wrap items-center gap-2 mb-1">
              <RouterLink :to="`/jobs/${proposal.jobId}`" class="font-semibold text-slate-900 hover:text-green-600 transition-colors">
                {{ proposal.job?.title ?? 'Job Title' }}
              </RouterLink>
              <AppBadge :variant="statusVariant(proposal.status ?? 'submitted')" class="capitalize">{{ proposal.status }}</AppBadge>
            </div>
            <p class="text-xs text-slate-500 mb-2">{{ proposal.job?.category }} · Submitted {{ timeAgo(proposal.createdAt ?? '') }}</p>
            <p class="text-sm text-slate-600 line-clamp-2">{{ proposal.coverLetter }}</p>

            <!-- Status messages -->
            <div v-if="proposal.status === 'viewed'" class="mt-2 text-xs text-blue-600 font-medium flex items-center gap-1">
              <svg class="w-3.5 h-3.5" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M15 12a3 3 0 11-6 0 3 3 0 016 0z"/><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z"/></svg>
              Client has viewed your proposal
            </div>
            <div v-if="proposal.status === 'shortlisted'" class="mt-2 text-xs text-yellow-600 font-medium flex items-center gap-1">
              ⭐ You've been shortlisted! The client may reach out soon.
            </div>
            <div v-if="proposal.status === 'accepted'" class="mt-2 text-xs text-green-600 font-medium flex items-center gap-1">
              <svg class="w-3.5 h-3.5" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z"/></svg>
              Proposal accepted! Contract started.
            </div>
          </div>
          <div class="flex flex-col items-end gap-1 shrink-0">
            <p class="text-lg font-bold text-green-700">${{ (proposal.bidAmount ?? 0).toLocaleString() }}{{ proposal.bidType === 'hourly' ? '/hr' : '' }}</p>
            <p class="text-xs text-slate-500">{{ proposal.estimatedDuration }}</p>
            <p v-if="proposal.connectsUsed" class="text-xs text-amber-600 flex items-center gap-1">
              <svg class="w-3 h-3" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M13 10V3L4 14h7v7l9-11h-7z"/></svg>
              {{ proposal.connectsUsed }} connects used
            </p>
          </div>
        </div>

        <div class="flex gap-2 mt-4 pt-4 border-t border-slate-100">
          <RouterLink :to="`/jobs/${proposal.jobId}`">
            <AppButton variant="outline" size="sm">View Job</AppButton>
          </RouterLink>
          <AppButton v-if="proposal.status === 'accepted'" size="sm" @click="router.push('/freelancer/contracts')">View Contract</AppButton>
          <AppButton variant="ghost" size="sm" @click="router.push('/freelancer/messages')">Message Client</AppButton>
          <AppButton
            v-if="proposal.status === 'submitted' || proposal.status === 'viewed'"
            variant="ghost"
            size="sm"
            class="ml-auto text-red-500 hover:bg-red-50"
            @click="withdraw(proposal.id!)"
          >
            Withdraw
          </AppButton>
        </div>
      </div>
      <div v-if="!filteredProposals.length" class="text-center py-16">
        <div class="text-slate-300 mb-4">
          <svg class="w-16 h-16 mx-auto" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="1.5" d="M20 13V6a2 2 0 00-2-2H6a2 2 0 00-2 2v7m16 0v5a2 2 0 01-2 2H6a2 2 0 01-2-2v-5m16 0h-2.586a1 1 0 00-.707.293l-2.414 2.414a1 1 0 01-.707.293h-2.172a1 1 0 01-.707-.293l-2.414-2.414A1 1 0 006.586 13H4"/></svg>
        </div>
        <h3 class="text-lg font-semibold text-slate-900 mb-1">No proposals yet</h3>
        <p class="text-sm text-slate-500">Start applying to jobs to see your proposals here.</p>
      </div>
    </div>
    </template>
  </div>
</template>

<script setup lang="ts">
import { ref, computed, onMounted } from 'vue'
import { RouterLink, useRouter } from 'vue-router'
import { useProposalStore } from '@/stores/proposal.store'
import AppBadge from '@/components/ui/AppBadge.vue'
import AppButton from '@/components/ui/AppButton.vue'

const router = useRouter()
const proposalStore = useProposalStore()
const activeTab = ref('all')

function retry() {
  proposalStore.fetchMyProposals()
}

onMounted(() => {
  retry()
})

const proposals = computed(() => proposalStore.proposals)

const tabs = computed(() => {
  const all = proposals.value
  return [
    { label: 'All', value: 'all', count: all.length },
    { label: 'Submitted', value: 'submitted', count: all.filter(p => p.status === 'submitted').length },
    { label: 'Viewed', value: 'viewed', count: all.filter(p => p.status === 'viewed').length },
    { label: 'Shortlisted', value: 'shortlisted', count: all.filter(p => p.status === 'shortlisted').length },
    { label: 'Accepted', value: 'accepted', count: all.filter(p => p.status === 'accepted').length },
    { label: 'Rejected', value: 'rejected', count: all.filter(p => p.status === 'rejected').length },
  ]
})

const filteredProposals = computed(() =>
  activeTab.value === 'all' ? proposals.value : proposals.value.filter((p) => p.status === activeTab.value),
)

const proposalStats = computed(() => {
  const all = proposals.value
  return [
    { label: 'Total Sent', value: all.length },
    { label: 'Views', value: all.filter(p => p.status === 'viewed').length },
    { label: 'Shortlisted', value: all.filter(p => p.status === 'shortlisted').length },
    { label: 'Accepted', value: all.filter(p => p.status === 'accepted').length },
  ]
})

function statusVariant(status: string): 'green' | 'blue' | 'yellow' | 'red' | 'slate' {
  const map: Record<string, 'green' | 'blue' | 'yellow' | 'red' | 'slate'> = {
    accepted: 'green',
    viewed: 'blue',
    shortlisted: 'yellow',
    submitted: 'slate',
    rejected: 'red',
    withdrawn: 'red',
  }
  return map[status] ?? 'slate'
}

function timeAgo(date: string): string {
  const diff = Date.now() - new Date(date).getTime()
  const days = Math.floor(diff / 86400000)
  if (days < 1) {
    const hours = Math.floor(diff / 3600000)
    return `${hours}h ago`
  }
  return `${days}d ago`
}

async function withdraw(id: string): Promise<void> {
  await proposalStore.withdrawProposal(id)
}
</script>
