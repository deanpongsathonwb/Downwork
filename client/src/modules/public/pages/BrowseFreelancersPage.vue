<template>
  <div class="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10">
    <div class="mb-8">
      <h1 class="text-3xl font-bold text-slate-900">Browse Freelancers</h1>
      <p class="text-slate-500 mt-1">Find the right professional for your project</p>
    </div>

    <div class="flex flex-col lg:flex-row gap-8">
      <!-- Filters -->
      <aside class="lg:w-72 shrink-0" aria-label="Freelancer filters">
        <div class="bg-white rounded-2xl border border-slate-200 p-5 sticky top-24">
          <h2 class="font-semibold text-slate-900 mb-5">Filters</h2>
          <div class="space-y-4">
            <AppInput v-model="filters.search" placeholder="Search freelancers..." @keydown.enter="applyFilters">
              <template #prefix>
                <svg class="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" aria-hidden="true">
                  <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
                </svg>
              </template>
            </AppInput>
            <AppSelect v-model="filters.category" label="Category" :options="CATEGORY_OPTIONS" placeholder="All Categories" />
            <div>
              <p class="text-sm font-medium text-slate-700 mb-2">Hourly Rate (USD)</p>
              <div class="flex gap-2">
                <AppInput v-model.number="filters.minRate" type="number" placeholder="Min" :min="0" />
                <AppInput v-model.number="filters.maxRate" type="number" placeholder="Max" :min="0" />
              </div>
            </div>
            <div>
              <p class="text-sm font-medium text-slate-700 mb-2">Minimum Rating</p>
              <StarRating v-model="filters.minRating" interactive />
            </div>
            <AppButton class="w-full" @click="applyFilters">Apply</AppButton>
          </div>
        </div>
      </aside>

      <!-- Freelancer Grid -->
      <div class="flex-1 min-w-0">
        <!-- Loading State -->
        <div v-if="userStore.isLoading" class="space-y-5">
          <div class="flex items-center justify-between mb-5">
            <div class="animate-pulse bg-slate-200 rounded h-4 w-40"></div>
            <div class="animate-pulse bg-slate-200 rounded h-10 w-44"></div>
          </div>
          <div v-for="i in 4" :key="i" class="animate-pulse bg-white rounded-2xl border border-slate-200 p-6">
            <div class="flex items-start gap-4">
              <div class="w-16 h-16 bg-slate-200 rounded-full shrink-0"></div>
              <div class="flex-1 space-y-2">
                <div class="bg-slate-200 rounded h-5 w-40"></div>
                <div class="bg-slate-200 rounded h-4 w-60"></div>
                <div class="bg-slate-200 rounded h-3 w-48"></div>
                <div class="flex gap-2 mt-2">
                  <div v-for="j in 4" :key="j" class="bg-slate-200 rounded-lg h-6 w-16"></div>
                </div>
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
          <button class="px-4 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700" @click="retry">Try Again</button>
        </div>

        <!-- Content -->
        <template v-else>
        <!-- Sort Bar -->
        <div class="flex items-center justify-between mb-5">
          <p class="text-sm text-slate-500"><strong>{{ displayedFreelancers.length }}</strong> freelancers found</p>
          <AppSelect v-model="sortBy" :options="SORT_OPTIONS" placeholder="Sort by" class="w-44" aria-label="Sort freelancers" />
        </div>

        <div v-if="displayedFreelancers.length" class="grid grid-cols-1 gap-5">
          <FreelancerCard
            v-for="freelancer in displayedFreelancers"
            :key="freelancer.id"
            :freelancer="freelancer"
            @message="handleMessage"
            @invite="handleInvite"
          />
        </div>

        <div v-else class="text-center py-20">
          <div class="text-slate-300 mb-4">
            <svg class="w-16 h-16 mx-auto" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="1.5" d="M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857M7 20H2v-2a3 3 0 015.356-1.857M7 20v-2c0-.656.126-1.283.356-1.857m0 0a5.002 5.002 0 019.288 0M15 7a3 3 0 11-6 0 3 3 0 016 0z"/></svg>
          </div>
          <h3 class="text-lg font-semibold text-slate-900 mb-2">No freelancers found</h3>
          <p class="text-slate-500 text-sm">Try adjusting your filters.</p>
        </div>
        </template>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, reactive, computed, onMounted } from 'vue'
import { useRouter } from 'vue-router'
import type { User, FreelancerProfile } from '@/types'
import { CATEGORY_OPTIONS } from '@/constants/categories'
import { useUserStore } from '@/stores/user.store'
import FreelancerCard from '../components/FreelancerCard.vue'
import AppInput from '@/components/ui/AppInput.vue'
import AppSelect from '@/components/ui/AppSelect.vue'
import AppButton from '@/components/ui/AppButton.vue'
import StarRating from '@/components/ui/StarRating.vue'

type FreelancerWithUser = User & FreelancerProfile

const router = useRouter()
const userStore = useUserStore()

const sortBy = ref('best_match')

const filters = reactive({
  search: '',
  category: '',
  minRate: undefined as number | undefined,
  maxRate: undefined as number | undefined,
  minRating: 0,
})

const SORT_OPTIONS = [
  { label: 'Best Match',                value: 'best_match'  },
  { label: 'Highest Rated',             value: 'rating_desc' },
  { label: 'Most Jobs Done',            value: 'jobs_desc'   },
  { label: 'Hourly Rate: Low to High',  value: 'rate_asc'    },
  { label: 'Hourly Rate: High to Low',  value: 'rate_desc'   },
]

const displayedFreelancers = computed<FreelancerWithUser[]>(() => {
  let list = [...userStore.freelancersList]

  if (filters.search.trim()) {
    const q = filters.search.toLowerCase()
    list = list.filter(
      (f) =>
        `${f.firstName} ${f.lastName}`.toLowerCase().includes(q) ||
        f.title.toLowerCase().includes(q) ||
        f.skills.some((s) => s.name.toLowerCase().includes(q)),
    )
  }
  if (filters.minRating > 0) {
    list = list.filter((f) => f.rating >= filters.minRating)
  }
  if (filters.minRate != null) {
    list = list.filter((f) => f.hourlyRate >= filters.minRate!)
  }
  if (filters.maxRate != null) {
    list = list.filter((f) => f.hourlyRate <= filters.maxRate!)
  }

  switch (sortBy.value) {
    case 'rating_desc': return [...list].sort((a, b) => b.rating - a.rating)
    case 'jobs_desc':   return [...list].sort((a, b) => b.totalJobsDone - a.totalJobsDone)
    case 'rate_asc':    return [...list].sort((a, b) => a.hourlyRate - b.hourlyRate)
    case 'rate_desc':   return [...list].sort((a, b) => b.hourlyRate - a.hourlyRate)
    default:            return list
  }
})

function retry() {
  userStore.fetchFreelancers()
}

onMounted(() => {
  retry()
})

function applyFilters(): void {
  // Filtering is reactive via displayedFreelancers computed
}

function handleMessage(_userId: string): void {
  router.push('/client/messages')
}

function handleInvite(_userId: string): void {
  router.push('/client/jobs/j1/invite')
}
</script>
