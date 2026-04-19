<template>
  <article
    class="rounded-lg border border-neutral-200 bg-white p-4 shadow-sm transition-shadow hover:shadow-md sm:p-5"
    :aria-label="`Freelancer ${freelancer.firstName} ${freelancer.lastName}`"
  >
    <div class="flex gap-4">
      <RouterLink
        :to="profilePath"
        class="relative shrink-0"
        :aria-label="`View profile of ${freelancer.firstName} ${freelancer.lastName}`"
      >
        <UserAvatar
          :name="`${freelancer.firstName} ${freelancer.lastName}`"
          :src="freelancer.avatar"
          size="lg"
        />
        <span
          v-if="freelancer.availability === 'available'"
          class="absolute bottom-0 right-0 h-3 w-3 rounded-full border-2 border-white bg-emerald-500"
          aria-hidden="true"
          title="Available now"
        />
      </RouterLink>

      <div class="min-w-0 flex-1">
        <div class="flex flex-col gap-3 sm:flex-row sm:items-start sm:justify-between">
          <div class="min-w-0">
            <RouterLink
              :to="profilePath"
              class="text-base font-semibold text-neutral-900 hover:text-green-700 sm:text-lg"
            >
              {{ freelancer.firstName }} {{ freelancer.lastName }}
            </RouterLink>
            <p class="mt-0.5 text-sm leading-snug text-neutral-700 line-clamp-2">
              {{ freelancer.title }}
            </p>
            <p class="mt-1 text-xs text-neutral-500">{{ freelancer.location }}</p>
          </div>
          <RouterLink
            :to="profilePath"
            class="inline-flex shrink-0 items-center justify-center rounded-lg border-2 border-green-600 px-4 py-2 text-sm font-semibold text-green-700 transition-colors hover:bg-green-50"
          >
            View profile
          </RouterLink>
        </div>

        <div class="mt-3 flex flex-wrap items-center gap-x-3 gap-y-1.5 text-sm">
          <span class="font-medium text-neutral-800">{{ jssPercent }}% Job Success</span>
          <span class="text-neutral-400" aria-hidden="true">·</span>
          <span class="text-neutral-600">${{ earningsDisplay }}+ earned</span>
          <span class="text-neutral-400" aria-hidden="true">·</span>
          <span class="text-neutral-600">${{ freelancer.hourlyRate }}/hr</span>
          <template v-if="freelancer.availability === 'available'">
            <span class="text-neutral-400" aria-hidden="true">·</span>
            <span
              class="rounded-full bg-violet-100 px-2.5 py-0.5 text-xs font-semibold text-violet-800"
            >
              Available now
            </span>
          </template>
          <span v-if="badgeShort" class="rounded-full bg-amber-100 px-2.5 py-0.5 text-xs font-semibold text-amber-900">
            {{ badgeShort }}
          </span>
        </div>

        <div v-if="skillChips.length" class="mt-3 flex flex-wrap gap-1.5">
          <span
            v-for="skill in skillChips"
            :key="skill.id"
            class="rounded-md bg-neutral-100 px-2 py-0.5 text-xs font-medium text-neutral-700"
          >
            {{ skill.name }}
          </span>
        </div>

        <p class="mt-3 line-clamp-3 text-sm leading-relaxed text-neutral-600">
          {{ freelancer.bio }}
        </p>
      </div>
    </div>
  </article>
</template>

<script setup lang="ts">
import { computed } from 'vue'
import { RouterLink } from 'vue-router'
import type { User, FreelancerProfile } from '@/types'
import UserAvatar from '@/components/common/UserAvatar.vue'

type FreelancerWithUser = User & FreelancerProfile

const props = defineProps<{ freelancer: FreelancerWithUser }>()

const profilePath = computed(() => `/freelancers/${props.freelancer.userId ?? props.freelancer.id}`)

const jssPercent = computed(() => {
  const f = props.freelancer as Record<string, unknown>
  const n = Number(f.jobSuccessScore ?? f.successRate)
  return Number.isFinite(n) ? Math.round(n) : 0
})

const earningsDisplay = computed(() => {
  const n = Number(props.freelancer.totalEarnings)
  if (!Number.isFinite(n) || n < 1000) return '1'
  return `${Math.round(n / 1000)}k`
})

const skillChips = computed(() => {
  const s = props.freelancer.skills
  if (!Array.isArray(s)) return []
  return s.slice(0, 8).map((item, i) => {
    if (typeof item === 'string') return { id: `skill-${i}`, name: item }
    const o = item as { id?: string; name?: string }
    return { id: o.id ?? `skill-${i}`, name: o.name ?? '' }
  })
})

const badgeShort = computed(() => {
  const map: Record<string, string> = {
    top_rated_plus: 'Top Rated Plus',
    top_rated: 'Top Rated',
    rising_talent: 'Rising Talent',
  }
  return props.freelancer.badge ? map[props.freelancer.badge] ?? '' : ''
})
</script>
