<template>
  <section class="py-20 bg-white" aria-labelledby="featured-jobs-heading">
    <div class="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
      <div class="flex items-end justify-between mb-10">
        <div>
          <h2 id="featured-jobs-heading" class="text-3xl font-bold text-slate-900 mb-2">Featured Jobs</h2>
          <p class="text-slate-500">Hand-picked opportunities from top clients</p>
        </div>
        <RouterLink
          to="/browse-jobs"
          class="text-green-600 font-medium text-sm hover:text-green-700 flex items-center gap-1"
        >
          View all →
        </RouterLink>
      </div>

      <div v-if="isLoading" class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6" aria-busy="true">
        <div v-for="i in 6" :key="i" class="bg-slate-100 rounded-2xl h-64 animate-pulse" aria-hidden="true" />
        <span class="sr-only">Loading featured jobs…</span>
      </div>

      <div v-else-if="jobs.length" class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        <JobCard v-for="job in jobs" :key="job.id" :job="job" />
      </div>

      <div v-else class="text-center py-16 text-slate-400">
        <p>No featured jobs available right now.</p>
      </div>
    </div>
  </section>
</template>

<script setup lang="ts">
import { RouterLink } from 'vue-router'
import JobCard from '@/modules/jobs/components/JobCard.vue'
import type { Job } from '@/types'

defineProps<{ jobs: Job[]; isLoading: boolean }>()
</script>
