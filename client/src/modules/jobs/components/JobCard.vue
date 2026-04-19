<template>
  <RouterLink
    :to="`/jobs/${job.id}`"
    class="block bg-white rounded-2xl border border-slate-200 p-5 hover:shadow-lg hover:border-green-200 transition-all duration-200 group"
    :aria-label="`View job: ${job.title}`"
  >
    <!-- Header: Client info + timestamp -->
    <div class="flex items-start justify-between gap-3 mb-3">
      <div class="flex items-center gap-2 min-w-0">
        <UserAvatar :name="job.client?.firstName ?? 'Client'" size="sm" />
        <div class="min-w-0">
          <p class="text-xs text-slate-500 truncate">
            {{ job.client?.firstName }} {{ job.client?.lastName }}
          </p>
          <p class="text-xs text-slate-400">{{ timeAgo(job.createdAt) }}</p>
        </div>
      </div>
      <AppBadge :variant="statusVariant(job.status)">{{ job.status }}</AppBadge>
    </div>

    <!-- Title -->
    <h2 class="font-semibold text-slate-900 text-base leading-snug mb-2 group-hover:text-green-700 transition-colors line-clamp-2">
      {{ job.title }}
    </h2>

    <!-- Description -->
    <p class="text-sm text-slate-500 leading-relaxed mb-4 line-clamp-3">
      {{ job.description }}
    </p>

    <!-- Meta -->
    <div class="flex flex-wrap gap-2 mb-4">
      <span class="inline-flex items-center gap-1 text-xs font-medium text-slate-700 bg-slate-100 px-2.5 py-1 rounded-lg">
        <svg class="w-3.5 h-3.5 text-green-600" fill="none" viewBox="0 0 24 24" stroke="currentColor" aria-hidden="true">
          <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 8c-1.657 0-3 .895-3 2s1.343 2 3 2 3 .895 3 2-1.343 2-3 2m0-8c1.11 0 2.08.402 2.599 1M12 8V7m0 1v8m0 0v1m0-1c-1.11 0-2.08-.402-2.599-1M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
        </svg>
        {{ formatBudget(job.budget) }}
      </span>

      <span class="inline-flex items-center gap-1 text-xs font-medium text-blue-700 bg-blue-50 px-2.5 py-1 rounded-lg capitalize">
        {{ job.type }}
      </span>

      <span class="inline-flex items-center gap-1 text-xs font-medium text-slate-600 bg-slate-100 px-2.5 py-1 rounded-lg capitalize">
        {{ job.experienceLevel }}
      </span>

      <span v-if="job.isRemote" class="inline-flex items-center gap-1 text-xs font-medium text-teal-700 bg-teal-50 px-2.5 py-1 rounded-lg">
        Remote
      </span>
    </div>

    <!-- Skills -->
    <div class="flex flex-wrap gap-1.5 mb-4">
      <span
        v-for="skill in job.skills.slice(0, 5)"
        :key="skill.id"
        class="text-xs text-slate-600 bg-slate-100 px-2 py-0.5 rounded-md"
      >
        {{ skill.name }}
      </span>
      <span v-if="job.skills.length > 5" class="text-xs text-slate-400 px-2 py-0.5">
        +{{ job.skills.length - 5 }} more
      </span>
    </div>

    <!-- Footer -->
    <div class="flex items-center justify-between pt-3 border-t border-slate-100">
      <div class="flex items-center gap-1 text-xs text-slate-500">
        <svg class="w-3.5 h-3.5" fill="none" viewBox="0 0 24 24" stroke="currentColor" aria-hidden="true">
          <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
        </svg>
        {{ job.proposalCount }} proposal{{ job.proposalCount !== 1 ? 's' : '' }}
      </div>

      <span v-if="showApply && auth.isFreelancer" class="text-xs font-medium text-green-600 group-hover:text-green-700 group-hover:underline transition-colors">
        Apply Now →
      </span>
    </div>
  </RouterLink>
</template>

<script setup lang="ts">
import { RouterLink } from 'vue-router'
import { useAuthStore } from '@/stores/auth.store'
import { useFormatters } from '@/composables/useFormatters'
import type { Job } from '@/types'
import AppBadge from '@/components/ui/AppBadge.vue'
import UserAvatar from '@/components/common/UserAvatar.vue'

interface Props {
  job: Job
  showApply?: boolean
}

withDefaults(defineProps<Props>(), { showApply: true })

const auth = useAuthStore()
const { formatBudget, timeAgo } = useFormatters()

function statusVariant(status: string): 'green' | 'slate' | 'blue' | 'yellow' | 'red' {
  const map: Record<string, 'green' | 'slate' | 'blue' | 'yellow' | 'red'> = {
    open: 'green',
    closed: 'slate',
    draft: 'yellow',
    pending_verification: 'yellow',
    in_progress: 'blue',
  }
  return map[status] ?? 'slate'
}
</script>
