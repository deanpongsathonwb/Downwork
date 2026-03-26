<template>
  <div class="space-y-6 max-w-4xl">
    <AppBreadcrumb :items="[{ label: 'My Jobs', route: '/client/jobs' }, { label: jobTitle }, { label: 'Invite Freelancers' }]" />

    <div class="flex items-center justify-between">
      <div>
        <h1 class="text-2xl font-bold text-slate-900">Invite Freelancers</h1>
        <p class="text-sm text-slate-500 mt-0.5">Find and invite talented freelancers to apply to your job</p>
      </div>
      <div class="text-right">
        <p class="text-sm text-slate-500">Job:</p>
        <p class="text-sm font-semibold text-slate-900">{{ jobTitle }}</p>
      </div>
    </div>

    <!-- Search & Filter -->
    <div class="bg-white rounded-2xl border border-slate-200 p-5">
      <div class="grid grid-cols-1 sm:grid-cols-3 gap-3">
        <div class="relative">
          <svg class="w-4 h-4 text-slate-400 absolute left-3 top-1/2 -translate-y-1/2" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
          </svg>
          <input v-model="search" type="text" placeholder="Search by name or skill..." class="w-full pl-9 pr-3 py-2.5 border border-slate-300 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-blue-500" />
        </div>
        <AppSelect v-model="filterSkill" :options="skillOptions" placeholder="Filter by skill" />
        <AppSelect v-model="filterBudget" :options="budgetOptions" placeholder="Hourly rate range" />
      </div>
    </div>

    <!-- Invited Already -->
    <div v-if="invitedIds.size > 0" class="bg-blue-50 border border-blue-200 rounded-xl p-4 flex items-center justify-between">
      <p class="text-sm text-blue-700 font-medium">{{ invitedIds.size }} freelancer{{ invitedIds.size !== 1 ? 's' : '' }} invited</p>
      <RouterLink to="/client/jobs" class="text-sm font-semibold text-blue-700 hover:text-blue-800">Done →</RouterLink>
    </div>

    <!-- Loading State -->
    <div v-if="userStore.isLoading" class="space-y-4">
      <div v-for="i in 4" :key="i" class="animate-pulse bg-white rounded-2xl border border-slate-200 p-6">
        <div class="flex items-start gap-4">
          <div class="w-14 h-14 bg-slate-200 rounded-full shrink-0"></div>
          <div class="flex-1 space-y-2">
            <div class="bg-slate-200 rounded h-5 w-40"></div>
            <div class="bg-slate-200 rounded h-4 w-60"></div>
            <div class="bg-slate-200 rounded h-3 w-32"></div>
          </div>
        </div>
      </div>
    </div>

    <!-- Error State -->
    <div v-else-if="userStore.error" class="text-center py-16">
      <div class="text-red-400 mb-4">
        <svg class="w-12 h-12 mx-auto" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-2.5L13.732 4c-.77-.833-1.964-.833-2.732 0L4.082 16.5c-.77.833.192 2.5 1.732 2.5z"/></svg>
      </div>
      <p class="text-gray-600 mb-4">{{ userStore.error }}</p>
      <button class="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700" @click="retry">Try Again</button>
    </div>

    <!-- Empty State -->
    <div v-else-if="!filteredFreelancers.length" class="text-center py-16 bg-white rounded-2xl border border-slate-200">
      <div class="text-slate-300 mb-4">
        <svg class="w-16 h-16 mx-auto" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="1.5" d="M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857M7 20H2v-2a3 3 0 015.356-1.857M7 20v-2c0-.656.126-1.283.356-1.857m0 0a5.002 5.002 0 019.288 0M15 7a3 3 0 11-6 0 3 3 0 016 0z"/></svg>
      </div>
      <h3 class="text-lg font-medium text-slate-900 mb-1">No freelancers found</h3>
      <p class="text-slate-500">Try adjusting your search or filters.</p>
    </div>

    <!-- Freelancer List -->
    <div v-else class="space-y-4">
      <div
        v-for="freelancer in filteredFreelancers"
        :key="freelancer.id"
        class="bg-white rounded-2xl border border-slate-200 p-6 hover:shadow-sm transition-shadow"
      >
        <div class="flex items-start gap-4">
          <UserAvatar :name="freelancer.name" size="lg" />
          <div class="flex-1 min-w-0">
            <div class="flex flex-wrap items-start justify-between gap-3">
              <div>
                <div class="flex items-center gap-2 mb-1">
                  <RouterLink :to="`/freelancers/${freelancer.id}`" class="font-semibold text-slate-900 hover:text-green-600 transition-colors">
                    {{ freelancer.name }}
                  </RouterLink>
                  <AppBadge v-if="freelancer.badge === 'top_rated'" variant="yellow">Top Rated</AppBadge>
                  <AppBadge v-else-if="freelancer.badge === 'rising_talent'" variant="purple">Rising Talent</AppBadge>
                  <span v-if="freelancer.isVerified" class="flex items-center gap-1 text-xs text-blue-600 font-medium">
                    <svg class="w-3.5 h-3.5" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 12l2 2 4-4m5.618-4.016A11.955 11.955 0 0112 2.944a11.955 11.955 0 01-8.618 3.04A12.02 12.02 0 003 9c0 5.591 3.824 10.29 9 11.622 5.176-1.332 9-6.03 9-11.622 0-1.042-.133-2.052-.382-3.016z"/></svg>
                    Verified
                  </span>
                </div>
                <p class="text-sm text-slate-600">{{ freelancer.title }}</p>
                <div class="flex items-center gap-3 mt-1.5 text-xs text-slate-500">
                  <span class="flex items-center gap-1">
                    <svg class="w-3.5 h-3.5 text-yellow-400" fill="currentColor" viewBox="0 0 20 20"><path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z"/></svg>
                    {{ freelancer.rating }} ({{ freelancer.reviews }})
                  </span>
                  <span>{{ freelancer.jobsDone }} jobs</span>
                  <span>{{ freelancer.successRate }}% JSS</span>
                  <span>{{ freelancer.location }}</span>
                </div>
              </div>
              <div class="text-right">
                <p class="text-lg font-bold text-green-700">${{ freelancer.hourlyRate }}/hr</p>
                <p class="text-xs text-slate-500">${{ (freelancer.totalEarned / 1000).toFixed(0) }}k+ earned</p>
              </div>
            </div>

            <p class="text-sm text-slate-600 mt-2 line-clamp-2">{{ freelancer.bio }}</p>

            <div class="flex flex-wrap gap-1.5 mt-3">
              <span v-for="skill in freelancer.skills" :key="skill" class="px-2.5 py-1 bg-slate-100 text-slate-600 text-xs rounded-lg font-medium">{{ skill }}</span>
            </div>
          </div>
        </div>

        <div class="flex gap-3 mt-4 pt-4 border-t border-slate-100">
          <AppButton
            v-if="!invitedIds.has(freelancer.id)"
            size="sm"
            @click="inviteFreelancer(freelancer.id)"
          >
            <svg class="w-4 h-4 mr-1" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M3 8l7.89 5.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z"/></svg>
            Send Invite
          </AppButton>
          <AppButton v-else variant="outline" size="sm" disabled>
            <svg class="w-4 h-4 mr-1 text-green-600" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M5 13l4 4L19 7"/></svg>
            Invited
          </AppButton>
          <RouterLink :to="`/freelancers/${freelancer.id}`">
            <AppButton variant="outline" size="sm">View Profile</AppButton>
          </RouterLink>
          <AppButton variant="ghost" size="sm" @click="startMessage(freelancer.id)">Message</AppButton>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, computed, onMounted } from 'vue'
import { RouterLink, useRouter, useRoute } from 'vue-router'
import { useToastStore } from '@/stores/toast.store'
import { useUserStore } from '@/stores/user.store'
import { useJobStore } from '@/stores/job.store'
import { invitationService } from '@/services/api/invitation.service'
import AppBreadcrumb from '@/components/ui/AppBreadcrumb.vue'
import AppBadge from '@/components/ui/AppBadge.vue'
import AppButton from '@/components/ui/AppButton.vue'
import AppSelect from '@/components/ui/AppSelect.vue'
import UserAvatar from '@/components/common/UserAvatar.vue'

const router = useRouter()
const route = useRoute()
const toast = useToastStore()
const userStore = useUserStore()
const jobStore = useJobStore()

const search = ref('')
const filterSkill = ref('')
const filterBudget = ref('')
const invitedIds = ref(new Set<string>())

const jobId = computed(() => route.params.id as string)
const jobTitle = computed(() => jobStore.selectedJob?.title ?? '')

async function retry() {
  await Promise.all([
    userStore.fetchFreelancers(),
    jobId.value ? jobStore.fetchJob(jobId.value) : Promise.resolve(),
  ])
}

onMounted(async () => {
  await retry()
})

const skillOptions = [
  { label: 'Vue.js', value: 'vue' },
  { label: 'React', value: 'react' },
  { label: 'TypeScript', value: 'typescript' },
  { label: 'Node.js', value: 'nodejs' },
]

const budgetOptions = [
  { label: 'Under $25/hr', value: 'under25' },
  { label: '$25–$50/hr', value: '25-50' },
  { label: '$50–$100/hr', value: '50-100' },
  { label: '$100+/hr', value: 'over100' },
]

const freelancers = computed(() =>
  userStore.freelancersList.map((f) => ({
    id: f.id,
    name: `${f.firstName} ${f.lastName}`,
    title: f.title ?? '',
    badge: f.badge,
    isVerified: f.isEmailVerified,
    rating: f.rating ?? 0,
    reviews: f.totalReviews ?? 0,
    jobsDone: f.totalJobsDone ?? 0,
    successRate: f.jobSuccessScore ?? 0,
    location: f.location ?? 'Remote',
    hourlyRate: f.hourlyRate ?? 0,
    totalEarned: f.totalEarnings ?? 0,
    bio: f.bio ?? '',
    skills: (f.skills ?? []).map((s: any) => typeof s === 'string' ? s : s.name ?? ''),
  })),
)

const filteredFreelancers = computed(() => {
  return freelancers.value.filter((f) => {
    if (search.value && !f.name.toLowerCase().includes(search.value.toLowerCase()) && !f.skills.some((s: string) => s.toLowerCase().includes(search.value.toLowerCase()))) return false
    return true
  })
})

async function inviteFreelancer(id: string) {
  try {
    await invitationService.send(jobId.value, id)
    invitedIds.value = new Set([...invitedIds.value, id])
    toast.success('Invitation Sent!', 'The freelancer has been notified about your job.')
  } catch {
    toast.error('Failed', 'Could not send invitation.')
  }
}

function startMessage(_id: string) {
  router.push('/client/messages')
}
</script>
