<template>
  <div class="space-y-6">
    <div class="flex items-center justify-between">
      <div>
        <h1 class="text-2xl font-bold text-slate-900">Saved Jobs</h1>
        <p class="text-sm text-slate-500 mt-0.5">{{ savedJobs.length }} saved job{{ savedJobs.length !== 1 ? 's' : '' }}</p>
      </div>
      <RouterLink to="/hire" class="text-sm text-green-600 font-medium hover:text-green-700">Browse more jobs →</RouterLink>
    </div>

    <!-- Loading State -->
    <div v-if="jobStore.isLoading" class="space-y-4">
      <div v-for="i in 4" :key="i" class="animate-pulse">
        <div class="bg-white rounded-2xl border border-slate-200 p-6 h-36"></div>
      </div>
    </div>

    <!-- Error State -->
    <div v-else-if="jobStore.error" class="text-center py-16">
      <div class="text-red-400 mb-4">
        <svg class="w-12 h-12 mx-auto" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-2.5L13.732 4c-.77-.833-1.964-.833-2.732 0L4.082 16.5c-.77.833.192 2.5 1.732 2.5z"/></svg>
      </div>
      <p class="text-gray-600 mb-4">{{ jobStore.error }}</p>
      <button class="px-4 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700" @click="retry">Try Again</button>
    </div>

    <!-- Empty state -->
    <div v-else-if="!savedJobs.length" class="text-center py-20 bg-white rounded-2xl border border-slate-200">
      <div class="w-16 h-16 bg-slate-100 rounded-full flex items-center justify-center mx-auto mb-4">
        <svg class="w-8 h-8 text-slate-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
          <path stroke-linecap="round" stroke-linejoin="round" stroke-width="1.5" d="M5 5a2 2 0 012-2h10a2 2 0 012 2v16l-7-3.5L5 21V5z" />
        </svg>
      </div>
      <h3 class="text-lg font-semibold text-slate-900 mb-2">No saved jobs yet</h3>
      <p class="text-sm text-slate-500 mb-5">Save jobs you're interested in to review them later.</p>
      <RouterLink to="/hire" class="px-5 py-2.5 bg-green-600 text-white rounded-xl font-medium text-sm hover:bg-green-700 transition-colors">Browse Jobs</RouterLink>
    </div>

    <!-- Saved Jobs List (content) -->
    <div v-else class="space-y-4">
      <div v-for="saved in savedJobs" :key="saved.id" class="bg-white rounded-2xl border border-slate-200 p-6 hover:shadow-sm transition-shadow">
        <div class="flex items-start justify-between gap-4">
          <div class="flex-1 min-w-0">
            <div class="flex flex-wrap items-center gap-2 mb-2">
              <AppBadge variant="green" dot>{{ saved.job.status }}</AppBadge>
              <AppBadge variant="blue">{{ saved.job.type }}</AppBadge>
              <AppBadge v-if="saved.job.isRemote" variant="purple">Remote</AppBadge>
            </div>
            <RouterLink :to="`/jobs/${saved.job.id}`" class="text-lg font-semibold text-slate-900 hover:text-green-600 transition-colors">
              {{ saved.job.title }}
            </RouterLink>
            <p class="text-sm text-slate-500 mt-1">{{ saved.job.category }} · Posted {{ timeAgo(saved.job.createdAt ?? '') }}</p>
            <p class="text-sm text-slate-600 mt-2 line-clamp-2">{{ saved.job.description }}</p>

            <div class="flex flex-wrap gap-1.5 mt-3">
              <span v-for="skill in (saved.job.skills ?? []).slice(0, 5)" :key="skill.id" class="px-2.5 py-1 bg-slate-100 text-slate-600 text-xs rounded-lg font-medium">
                {{ skill.name }}
              </span>
            </div>
          </div>

          <div class="text-right shrink-0">
            <p class="font-bold text-slate-900">{{ formatBudget(saved.job.budget) }}</p>
            <p class="text-xs text-slate-500 mt-0.5">{{ saved.job.proposalCount }} proposals</p>
            <p class="text-xs text-slate-400 mt-1">Saved {{ timeAgo(saved.savedAt) }}</p>
          </div>
        </div>

        <div class="flex gap-3 mt-4 pt-4 border-t border-slate-100">
          <RouterLink :to="`/jobs/${saved.job.id}/apply`" class="flex-1">
            <AppButton class="w-full" size="sm">Apply Now</AppButton>
          </RouterLink>
          <RouterLink :to="`/jobs/${saved.job.id}`">
            <AppButton variant="outline" size="sm">View Details</AppButton>
          </RouterLink>
          <AppButton variant="ghost" size="sm" class="text-red-500 hover:bg-red-50" @click="unsaveJob(saved.id)">
            <svg class="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M6 18L18 6M6 6l12 12" />
            </svg>
            Remove
          </AppButton>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { onMounted } from 'vue'
import { RouterLink } from 'vue-router'
import { useJobStore } from '@/stores/job.store'
import type { SavedJob } from '@/types'
import AppBadge from '@/components/ui/AppBadge.vue'
import AppButton from '@/components/ui/AppButton.vue'

const jobStore = useJobStore()
const savedJobs = jobStore.savedJobs

function retry() {
  jobStore.fetchSavedJobs()
}

onMounted(() => {
  retry()
})

function unsaveJob(id: string) {
  const saved = savedJobs.find((s) => s.id === id)
  if (saved) jobStore.unsaveJob(saved.jobId)
}

function formatBudget(budget?: SavedJob['job']['budget']): string {
  if (!budget) return 'Negotiable'
  if (budget.type === 'hourly') return `$${budget.min}–$${budget.max}/hr`
  if (budget.min && budget.max) return `$${budget.min.toLocaleString()}–$${budget.max.toLocaleString()}`
  return budget.amount ? `$${budget.amount.toLocaleString()}` : 'Negotiable'
}

function timeAgo(date: string): string {
  const diff = Date.now() - new Date(date).getTime()
  const hours = Math.floor(diff / 3600000)
  const days = Math.floor(diff / 86400000)
  if (hours < 1) return 'just now'
  if (hours < 24) return `${hours}h ago`
  return `${days}d ago`
}
</script>
