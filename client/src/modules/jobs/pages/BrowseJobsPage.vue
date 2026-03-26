<template>
  <div class="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10">
    <div class="mb-8">
      <h1 class="text-3xl font-bold text-slate-900">Browse Jobs</h1>
      <p class="text-slate-500 mt-1">{{ jobStore.totalJobs.toLocaleString() }} jobs available</p>
    </div>

    <div class="flex flex-col lg:flex-row gap-8">
      <!-- FILTERS SIDEBAR -->
      <JobFiltersPanel
        :filters="localFilters"
        @update:filters="localFilters = $event as JobFilters"
        @apply="applyFilters"
        @reset="resetFilters"
      />

      <!-- JOB LIST -->
      <div class="flex-1 min-w-0">
        <!-- Sort bar -->
        <div class="flex items-center justify-between mb-5">
          <p class="text-sm text-slate-500">
            Showing <strong>{{ jobStore.jobs.length }}</strong> jobs
          </p>
          <AppSelect
            v-model="sortBy"
            :options="SORT_OPTIONS"
            placeholder="Sort by"
            class="w-48"
            aria-label="Sort jobs by"
          />
        </div>

        <!-- Loading skeletons -->
        <div v-if="jobStore.isLoading && !jobStore.jobs.length" class="grid grid-cols-1 gap-4" aria-busy="true">
          <div v-for="i in 8" :key="i" class="bg-slate-100 rounded-2xl h-52 animate-pulse" aria-hidden="true" />
          <span class="sr-only">Loading jobs…</span>
        </div>

        <!-- Empty state -->
        <div v-else-if="!jobStore.jobs.length && !jobStore.isLoading" class="text-center py-20">
          <p class="text-5xl mb-4" aria-hidden="true">🔍</p>
          <h3 class="text-lg font-semibold text-slate-900 mb-2">No jobs found</h3>
          <p class="text-slate-500 text-sm">Try adjusting your filters or search query.</p>
        </div>

        <!-- Jobs grid -->
        <div v-else class="grid grid-cols-1 gap-4">
          <JobCard v-for="job in jobStore.jobs" :key="job.id" :job="job" />
        </div>

        <!-- Load More -->
        <div v-if="jobStore.hasMore" class="text-center mt-8">
          <AppButton variant="outline" :loading="jobStore.isLoading" @click="jobStore.nextPage()">
            Load More Jobs
          </AppButton>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, onMounted, watch } from 'vue'
import { useRoute } from 'vue-router'
import { useJobStore } from '@/stores/job.store'
import type { JobFilters } from '@/types'
import JobCard from '@/modules/jobs/components/JobCard.vue'
import JobFiltersPanel from '@/modules/jobs/components/JobFiltersPanel.vue'
import AppSelect from '@/components/ui/AppSelect.vue'
import AppButton from '@/components/ui/AppButton.vue'

const jobStore = useJobStore()
const route = useRoute()
const sortBy = ref('newest')

const localFilters = ref<JobFilters>({
  search: (route.query.search as string) || undefined,
  category: (route.query.category as string) || undefined,
  page: 1,
  limit: 12,
})

const SORT_OPTIONS = [
  { label: 'Newest First',    value: 'newest'        },
  { label: 'Highest Budget',  value: 'budget_desc'   },
  { label: 'Most Proposals',  value: 'proposals_desc' },
]

onMounted(() => {
  jobStore.fetchJobs(localFilters.value)
})

watch(sortBy, () => applyFilters())

function applyFilters(): void {
  jobStore.fetchJobs({ ...localFilters.value, sortBy: sortBy.value, page: 1 })
}

function resetFilters(): void {
  localFilters.value = { page: 1, limit: 12 }
  jobStore.resetFilters()
  jobStore.fetchJobs()
}
</script>
