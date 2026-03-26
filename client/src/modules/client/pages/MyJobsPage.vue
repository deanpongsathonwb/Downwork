<template>
  <div class="space-y-6">
    <div class="flex justify-between items-center">
      <h1 class="text-2xl font-bold text-slate-900">My Jobs</h1>
      <RouterLink to="/client/jobs/new" class="px-4 py-2 bg-blue-600 text-white text-sm font-medium rounded-xl hover:bg-blue-700 transition-colors">
        + Post New Job
      </RouterLink>
    </div>

    <!-- Loading State -->
    <div v-if="jobStore.isLoading" class="space-y-4">
      <div v-for="i in 4" :key="i" class="animate-pulse">
        <div class="bg-white rounded-2xl border border-slate-200 p-6">
          <div class="bg-slate-200 rounded h-5 w-64 mb-3"></div>
          <div class="flex gap-2 mb-3">
            <div class="bg-slate-200 rounded-full h-5 w-16"></div>
            <div class="bg-slate-200 rounded-full h-5 w-20"></div>
          </div>
          <div class="bg-slate-200 rounded h-4 w-full"></div>
        </div>
      </div>
    </div>

    <!-- Error State -->
    <div v-else-if="jobStore.error" class="text-center py-16">
      <div class="text-red-400 mb-4">
        <svg class="w-12 h-12 mx-auto" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-2.5L13.732 4c-.77-.833-1.964-.833-2.732 0L4.082 16.5c-.77.833.192 2.5 1.732 2.5z"/></svg>
      </div>
      <p class="text-gray-600 mb-4">{{ jobStore.error }}</p>
      <button class="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700" @click="retry">Try Again</button>
    </div>

    <!-- Content -->
    <template v-else>
    <div class="flex gap-1 bg-slate-100 p-1 rounded-xl w-fit flex-wrap">
      <button v-for="tab in ['All', 'Open', 'In Progress', 'Draft', 'Closed']" :key="tab" :class="['px-4 py-2 text-sm font-medium rounded-lg transition-colors', activeTab === tab ? 'bg-white text-slate-900 shadow-sm' : 'text-slate-500 hover:text-slate-700']" @click="activeTab = tab">
        {{ tab }}
      </button>
    </div>

    <div class="space-y-4">
      <div
        v-for="job in myJobs"
        :key="job.id"
        class="bg-white rounded-2xl border border-slate-200 p-6 hover:shadow-sm transition-shadow"
      >
        <div class="flex flex-col sm:flex-row sm:items-start justify-between gap-4">
          <div class="flex-1">
            <h3 class="font-semibold text-slate-900 mb-1">{{ job.title }}</h3>
            <div class="flex flex-wrap gap-2 mb-3">
              <AppBadge :variant="job.status === 'open' ? 'green' : job.status === 'in_progress' ? 'blue' : job.status === 'draft' ? 'yellow' : 'slate'" dot class="capitalize">{{ job.status?.replace('_', ' ') }}</AppBadge>
              <AppBadge variant="slate">{{ job.type }} rate</AppBadge>
              <AppBadge v-if="job.category" variant="slate">{{ job.category }}</AppBadge>
            </div>
            <p class="text-sm text-slate-600 line-clamp-2">{{ job.description }}</p>
          </div>
          <div class="flex flex-col items-end gap-2 shrink-0">
            <p class="text-sm font-semibold text-slate-700">{{ job.proposalCount }} proposals</p>
            <div class="flex gap-2 flex-wrap justify-end">
              <RouterLink
                v-if="job.status !== 'draft' && job.status !== 'closed'"
                :to="`/client/jobs/${job.id}/proposals`"
                class="px-3 py-1.5 text-xs font-medium text-blue-600 border border-blue-200 rounded-lg hover:bg-blue-50 transition-colors"
              >
                Review Proposals
              </RouterLink>
              <RouterLink
                v-if="job.status !== 'draft' && job.status !== 'closed'"
                :to="`/client/jobs/${job.id}/invite`"
                class="px-3 py-1.5 text-xs font-medium text-green-600 border border-green-200 rounded-lg hover:bg-green-50 transition-colors"
              >
                Invite Freelancers
              </RouterLink>
              <RouterLink
                to="/client/jobs/new"
                class="px-3 py-1.5 text-xs font-medium text-slate-600 border border-slate-200 rounded-lg hover:bg-slate-50 transition-colors"
              >
                {{ job.status === 'draft' ? 'Continue Editing' : 'Edit' }}
              </RouterLink>
            </div>
          </div>
        </div>
      </div>

      <div v-if="!myJobs.length" class="text-center py-16">
        <div class="text-slate-300 mb-4">
          <svg class="w-16 h-16 mx-auto" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="1.5" d="M20 13V6a2 2 0 00-2-2H6a2 2 0 00-2 2v7m16 0v5a2 2 0 01-2 2H6a2 2 0 01-2-2v-5m16 0h-2.586a1 1 0 00-.707.293l-2.414 2.414a1 1 0 01-.707.293h-2.172a1 1 0 01-.707-.293l-2.414-2.414A1 1 0 006.586 13H4"/></svg>
        </div>
        <h3 class="text-lg font-semibold text-slate-900 mb-1">You haven't posted any jobs yet</h3>
        <p class="text-sm text-slate-500 mb-4">Post your first job to start finding talented freelancers.</p>
        <RouterLink to="/client/jobs/new" class="inline-flex items-center gap-2 px-4 py-2 bg-blue-600 text-white text-sm font-medium rounded-xl hover:bg-blue-700 transition-colors">
          + Post a Job
        </RouterLink>
      </div>
    </div>
    </template>
  </div>
</template>

<script setup lang="ts">
import { ref, computed, onMounted } from 'vue'
import { RouterLink } from 'vue-router'
import { useJobStore } from '@/stores/job.store'
import AppBadge from '@/components/ui/AppBadge.vue'

const jobStore = useJobStore()
const activeTab = ref('All')

function retry() {
  jobStore.fetchMyJobs()
}

onMounted(() => retry())

const tabStatusMap: Record<string, string | undefined> = {
  All: undefined,
  Open: 'open',
  'In Progress': 'in_progress',
  Draft: 'draft',
  Closed: 'closed',
}

const myJobs = computed(() => {
  const status = tabStatusMap[activeTab.value]
  return status ? jobStore.jobs.filter((j) => j.status === status) : jobStore.jobs
})
</script>
