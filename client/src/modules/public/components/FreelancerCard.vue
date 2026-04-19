<template>
  <article class="bg-white rounded-2xl border border-slate-200 p-5 hover:shadow-md transition-all">
    <div class="flex items-start gap-4">
      <RouterLink :to="`/freelancers/${profileId}`" :aria-label="`View profile of ${freelancer.firstName} ${freelancer.lastName}`">
        <UserAvatar
          :name="`${freelancer.firstName} ${freelancer.lastName}`"
          :src="freelancer.avatar"
          size="xl"
        />
      </RouterLink>

      <div class="flex-1 min-w-0">
        <div class="flex flex-wrap items-start justify-between gap-2">
          <!-- Info -->
          <div>
            <div class="flex items-center gap-2 mb-0.5 flex-wrap">
              <RouterLink
                :to="`/freelancers/${profileId}`"
                class="font-bold text-slate-900 hover:text-green-600 transition-colors text-lg"
              >
                {{ freelancer.firstName }} {{ freelancer.lastName }}
              </RouterLink>

              <span v-if="freelancer.verificationStatus === 'verified'" class="flex items-center gap-0.5 text-xs text-blue-600 font-medium" aria-label="Verified freelancer">
                <svg class="w-3.5 h-3.5" fill="none" viewBox="0 0 24 24" stroke="currentColor" aria-hidden="true">
                  <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 12l2 2 4-4m5.618-4.016A11.955 11.955 0 0112 2.944a11.955 11.955 0 01-8.618 3.04A12.02 12.02 0 003 9c0 5.591 3.824 10.29 9 11.622 5.176-1.332 9-6.03 9-11.622 0-1.042-.133-2.052-.382-3.016z" />
                </svg>
                Verified
              </span>

              <span v-if="badgeLabel" :class="badgeClass">{{ badgeLabel }}</span>
            </div>

            <p class="text-sm text-slate-600">{{ freelancer.title }}</p>

            <div class="flex items-center gap-3 mt-1.5 text-xs text-slate-500 flex-wrap">
              <div class="flex items-center gap-1">
                <StarRating :model-value="freelancer.rating" size="sm" show-value />
                <span>({{ reviewCount }} reviews)</span>
              </div>
              <span class="font-semibold text-green-700">{{ jssPercent }}% JSS</span>
              <span>{{ jobsDone }} jobs</span>
              <span>{{ freelancer.location }}</span>
            </div>
          </div>

          <!-- Rate & Availability -->
          <div class="text-right shrink-0">
            <p class="text-xl font-bold text-green-700">${{ freelancer.hourlyRate }}/hr</p>
            <p class="text-xs text-slate-500 mt-0.5">${{ (freelancer.totalEarnings / 1000).toFixed(0) }}K+ earned</p>
            <AppBadge
              :variant="freelancer.availability === 'available' ? 'green' : 'slate'"
              dot
              class="mt-1"
            >
              {{ freelancer.availability === 'available' ? 'Available' : 'Not Available' }}
            </AppBadge>
          </div>
        </div>

        <p class="text-sm text-slate-600 mt-2 line-clamp-2">{{ freelancer.bio }}</p>

        <div class="flex flex-wrap gap-1.5 mt-3">
          <span
            v-for="skill in skillChips"
            :key="skill.id"
            class="text-xs bg-slate-100 text-slate-700 px-2.5 py-1 rounded-lg font-medium"
          >
            {{ skill.name }}
          </span>
        </div>

        <div class="flex gap-2 mt-4 pt-3 border-t border-slate-100">
          <RouterLink :to="`/freelancers/${profileId}`">
            <AppButton variant="outline" size="sm">View Profile</AppButton>
          </RouterLink>
          <AppButton size="sm" @click="emit('message', profileId)">Message</AppButton>
          <AppButton variant="outline" size="sm" @click="emit('invite', profileId)">Invite to Job</AppButton>
        </div>
      </div>
    </div>
  </article>
</template>

<script setup lang="ts">
import { computed } from 'vue'
import { RouterLink } from 'vue-router'
import type { User, FreelancerProfile } from '@/types'
import AppBadge from '@/components/ui/AppBadge.vue'
import AppButton from '@/components/ui/AppButton.vue'
import StarRating from '@/components/ui/StarRating.vue'
import UserAvatar from '@/components/common/UserAvatar.vue'

type FreelancerWithUser = User & FreelancerProfile

const props = defineProps<{ freelancer: FreelancerWithUser }>()
const emit = defineEmits<{
  message: [userId: string]
  invite: [userId: string]
}>()

/** List API merges profile onto User — has `id`; nested profile uses `userId` */
const profileId = computed(() => props.freelancer.userId ?? props.freelancer.id)

const reviewCount = computed(() => {
  const f = props.freelancer as Record<string, unknown>
  const n = Number(f.totalReviews ?? f.reviewCount)
  return Number.isFinite(n) ? n : 0
})

const jobsDone = computed(() => {
  const f = props.freelancer as Record<string, unknown>
  const n = Number(f.totalJobsDone ?? f.completedJobs)
  return Number.isFinite(n) ? n : 0
})

const jssPercent = computed(() => {
  const f = props.freelancer as Record<string, unknown>
  const n = Number(f.jobSuccessScore ?? f.successRate)
  return Number.isFinite(n) ? Math.round(n) : 0
})

const earningsK = computed(() => {
  const n = Number(props.freelancer.totalEarnings)
  return Number.isFinite(n) ? Math.round(n / 1000) : 0
})

const skillChips = computed(() => {
  const s = props.freelancer.skills
  if (!Array.isArray(s)) return []
  return s.slice(0, 5).map((item, i) => {
    if (typeof item === 'string') return { id: `skill-${i}`, name: item }
    const o = item as { id?: string; name?: string }
    return { id: o.id ?? `skill-${i}`, name: o.name ?? '' }
  })
})

const badgeLabel = computed(() => {
  const map: Record<string, string> = {
    top_rated:      '⭐ Top Rated',
    top_rated_plus: '🏅 Top Rated Plus',
    rising_talent:  '🚀 Rising Talent',
  }
  return props.freelancer.badge ? map[props.freelancer.badge] : ''
})

const badgeClass = computed(() => {
  const map: Record<string, string> = {
    top_rated:      'text-xs font-bold text-yellow-700 bg-yellow-100 px-2 py-0.5 rounded-md',
    top_rated_plus: 'text-xs font-bold text-orange-700 bg-orange-100 px-2 py-0.5 rounded-md',
    rising_talent:  'text-xs font-bold text-purple-700 bg-purple-100 px-2 py-0.5 rounded-md',
  }
  return props.freelancer.badge ? map[props.freelancer.badge] : ''
})
</script>
