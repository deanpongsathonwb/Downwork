<template>
  <article
    class="rounded-2xl border border-slate-200 bg-white p-5 shadow-sm transition-shadow hover:shadow-md"
  >
    <div class="flex flex-wrap items-center gap-2 mb-2">
      <RouterLink
        :to="`/jobs/${job.id}`"
        class="text-lg font-semibold text-slate-900 hover:text-green-700 transition-colors"
      >
        {{ job.title }}
      </RouterLink>
      <AppBadge v-if="isNew" variant="blue">New</AppBadge>
    </div>

    <p class="text-sm text-slate-500 mb-3">
      <span class="capitalize">{{ job.type === 'hourly' ? 'Hourly' : 'Fixed price' }}</span>
      <span class="mx-1.5 text-slate-300" aria-hidden="true">·</span>
      <span>Posted {{ timeAgo(job.createdAt) }}</span>
    </p>

    <div class="flex flex-wrap gap-3 text-xs text-slate-600 mb-3">
      <span class="inline-flex items-center gap-1.5">
        <svg class="h-4 w-4 text-slate-400 shrink-0" fill="none" viewBox="0 0 24 24" stroke="currentColor" aria-hidden="true">
          <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
        </svg>
        {{ hoursLabel }}
      </span>
      <span class="inline-flex items-center gap-1.5 capitalize">
        <svg class="h-4 w-4 text-slate-400 shrink-0" fill="none" viewBox="0 0 24 24" stroke="currentColor" aria-hidden="true">
          <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M13 10V3L4 14h7v7l9-11h-7z" />
        </svg>
        {{ job.experienceLevel }} level
      </span>
    </div>

    <p class="text-sm text-slate-600 leading-relaxed line-clamp-3 mb-4">
      {{ job.description }}
    </p>

    <div class="flex flex-wrap gap-1.5 mb-4">
      <span
        v-for="skill in job.skills.slice(0, 6)"
        :key="skill.id"
        class="text-xs text-slate-600 bg-slate-100 px-2.5 py-1 rounded-full"
      >
        {{ skill.name }}
      </span>
    </div>

    <RouterLink
      :to="`/jobs/${job.id}`"
      class="inline-flex items-center justify-center rounded-xl bg-green-600 px-4 py-2 text-sm font-semibold text-white hover:bg-green-700 transition-colors"
    >
      See more
    </RouterLink>
  </article>
</template>

<script setup lang="ts">
import { computed } from 'vue'
import { RouterLink } from 'vue-router'
import type { Job } from '@/types'
import { useFormatters } from '@/composables/useFormatters'
import AppBadge from '@/components/ui/AppBadge.vue'

const props = defineProps<{ job: Job }>()

const { timeAgo } = useFormatters()

const MS_48H = 48 * 60 * 60 * 1000

const isNew = computed(() => {
  const t = new Date(props.job.createdAt).getTime()
  return Date.now() - t < MS_48H
})

const hoursLabel = computed(() => {
  if (props.job.type === 'fixed') return 'Project-based'
  const len = props.job.projectLength
  if (len === 'small') return 'Less than 10 hrs/week'
  if (len === 'medium') return '10–30 hrs/week'
  if (len === 'large') return 'More than 30 hrs/week'
  return 'Hours to be discussed'
})
</script>
