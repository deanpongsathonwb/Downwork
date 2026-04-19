<template>
  <div class="min-h-screen bg-white">
    <FreelanceJobsCategorySubnav context="hire" current-slug="" use-category-urls />

    <!-- Search strip (Upwork-style) -->
    <div class="bg-white">
      <div class="mx-auto max-w-7xl px-4 py-4 sm:px-6 lg:px-8">
        <div class="flex flex-col gap-4 lg:flex-row lg:items-end lg:justify-between">
          <div class="min-w-0 flex-1">
            <div class="space-y-3">
              <div class="flex flex-col gap-3 sm:flex-row sm:items-center">
                <div class="relative min-w-0 w-full max-w-xs sm:max-w-sm">
                  <span class="pointer-events-none absolute inset-y-0 left-0 flex items-center pl-3 text-neutral-400">
                    <svg class="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor" aria-hidden="true">
                      <path
                        stroke-linecap="round"
                        stroke-linejoin="round"
                        stroke-width="2"
                        d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z"
                      />
                    </svg>
                  </span>
                  <input
                    v-model="filters.search"
                    type="search"
                    autocomplete="off"
                    placeholder="Search for talent"
                    class="w-full rounded-lg border border-neutral-300 bg-white py-2.5 pl-10 pr-4 text-sm text-neutral-900 placeholder-neutral-400 shadow-sm focus:border-green-600 focus:outline-none focus:ring-1 focus:ring-green-600"
                    @keydown.enter.prevent
                  />
                </div>
                <button
                  type="button"
                  class="shrink-0 text-sm font-semibold text-green-700 hover:text-green-800"
                  @click="scrollToFilters"
                >
                  Advanced search
                </button>
              </div>
              <div class="flex gap-8 border-b border-transparent">
                <span
                  class="-mb-px border-b-2 border-green-600 pb-2 text-sm font-semibold text-neutral-900"
                  aria-current="page"
                >
                  Talent
                </span>
                <RouterLink
                  to="/search/jobs"
                  class="-mb-px border-b-2 border-transparent pb-2 text-sm font-medium text-neutral-600 hover:text-neutral-900"
                >
                  Jobs
                </RouterLink>
              </div>
            </div>
            <div class="mt-4 border-b border-neutral-200" aria-hidden="true" />
          </div>
        </div>
      </div>
    </div>

    <div class="mx-auto flex max-w-7xl flex-col gap-8 px-4 py-8 sm:px-6 lg:flex-row lg:px-8">
      <!-- Sidebar filters -->
      <aside id="talent-search-filters" class="w-full shrink-0 lg:w-64" aria-label="Refine talent search">
        <div class="sticky top-24 space-y-1">
          <section class="border-b border-neutral-200 pb-4">
            <h2 class="mb-3 text-sm font-semibold text-neutral-900">Talent badge</h2>
            <ul class="space-y-2.5">
              <li v-for="opt in badgeFilterOptions" :key="opt.key" class="flex items-center gap-2">
                <input
                  :id="`badge-${opt.key}`"
                  v-model="filters.badges[opt.key]"
                  type="checkbox"
                  class="h-4 w-4 rounded border-neutral-300 text-green-600 focus:ring-green-600"
                />
                <label :for="`badge-${opt.key}`" class="text-sm text-neutral-700">{{ opt.label }}</label>
              </li>
            </ul>
          </section>

          <section class="border-b border-neutral-200 py-4">
            <h2 class="mb-2 text-sm font-semibold text-neutral-900">Location</h2>
            <AppInput v-model="filters.location" placeholder="Enter location" />
          </section>

          <section class="border-b border-neutral-200 py-4">
            <h2 class="mb-2 text-sm font-semibold text-neutral-900">Talent time zones</h2>
            <AppSelect v-model="filters.timezone" :options="TIMEZONE_OPTIONS" placeholder="Any time zone" />
          </section>

          <section class="border-b border-neutral-200 py-4">
            <h2 class="mb-3 text-sm font-semibold text-neutral-900">Talent type</h2>
            <fieldset class="space-y-2.5">
              <label class="flex cursor-pointer items-center gap-2">
                <input v-model="filters.talentType" type="radio" value="all" class="text-green-600 focus:ring-green-600" />
                <span class="text-sm text-neutral-700">Freelancers &amp; Agencies</span>
              </label>
              <label class="flex cursor-pointer items-center gap-2">
                <input v-model="filters.talentType" type="radio" value="freelancer" class="text-green-600 focus:ring-green-600" />
                <span class="text-sm text-neutral-700">Freelancers</span>
              </label>
              <label class="flex cursor-pointer items-center gap-2">
                <input v-model="filters.talentType" type="radio" value="agency" class="text-green-600 focus:ring-green-600" />
                <span class="text-sm text-neutral-700">Agencies</span>
              </label>
            </fieldset>
          </section>

          <section class="border-b border-neutral-200 py-4">
            <ul class="space-y-2.5">
              <li class="flex items-center gap-2">
                <input
                  id="filter-contract"
                  v-model="filters.openToContract"
                  type="checkbox"
                  class="h-4 w-4 rounded border-neutral-300 text-green-600 focus:ring-green-600"
                />
                <label for="filter-contract" class="text-sm text-neutral-700">Open to contract-to-hire</label>
              </li>
              <li class="flex items-center gap-2">
                <input
                  id="filter-consult"
                  v-model="filters.offersConsultations"
                  type="checkbox"
                  class="h-4 w-4 rounded border-neutral-300 text-green-600 focus:ring-green-600"
                />
                <label for="filter-consult" class="text-sm text-neutral-700">Offers consultations</label>
              </li>
            </ul>
          </section>

          <TalentSearchFilterAccordion title="Job success">
            <AppSelect
              v-model="filters.minJobSuccess"
              :options="JOB_SUCCESS_OPTIONS"
              placeholder="Any job success"
            />
          </TalentSearchFilterAccordion>

          <TalentSearchFilterAccordion title="Earned amount">
            <div class="flex gap-2">
              <AppInput v-model.number="filters.minEarned" type="number" placeholder="Min $" :min="0" />
            </div>
          </TalentSearchFilterAccordion>

          <TalentSearchFilterAccordion title="Hours billed">
            <AppSelect v-model="filters.minHours" :options="HOURS_OPTIONS" placeholder="Any hours billed" />
          </TalentSearchFilterAccordion>

          <TalentSearchFilterAccordion title="English level">
            <AppSelect
              v-model="filters.englishLevel"
              :options="ENGLISH_OPTIONS"
              placeholder="Any English level"
            />
          </TalentSearchFilterAccordion>

          <TalentSearchFilterAccordion title="Other languages">
            <AppInput v-model="filters.otherLanguage" placeholder="Language" />
          </TalentSearchFilterAccordion>

          <section class="pt-4">
            <h2 class="mb-2 text-sm font-semibold text-neutral-900">Category</h2>
            <AppSelect
              v-model="filters.category"
              :options="CATEGORY_OPTIONS"
              placeholder="All categories"
            />
          </section>

          <section class="pt-4">
            <p class="mb-2 text-sm font-medium text-neutral-800">Hourly rate (USD)</p>
            <div class="flex gap-2">
              <AppInput v-model.number="filters.minRate" type="number" placeholder="Min" :min="0" />
              <AppInput v-model.number="filters.maxRate" type="number" placeholder="Max" :min="0" />
            </div>
          </section>

          <section class="pt-4">
            <p class="mb-2 text-sm font-medium text-neutral-800">Client rating</p>
            <StarRating v-model="filters.minRating" interactive />
          </section>
        </div>
      </aside>

      <!-- Results -->
      <div class="min-w-0 flex-1">
        <div class="mb-4 flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
          <p class="text-sm text-neutral-600">
            <span class="font-semibold text-neutral-900">{{ filteredFreelancers.length }}</span>
            talent found
          </p>
          <AppSelect v-model="sortBy" :options="SORT_OPTIONS" placeholder="Sort by" class="w-full sm:w-48" />
        </div>

        <div v-if="showTalentSkeleton" class="space-y-4" aria-busy="true">
          <div v-for="i in 4" :key="i" class="animate-pulse rounded-lg border border-neutral-200 p-5">
            <div class="flex gap-4">
              <div class="h-14 w-14 shrink-0 rounded-full bg-neutral-200" />
              <div class="flex-1 space-y-2">
                <div class="h-4 w-40 rounded bg-neutral-200" />
                <div class="h-3 w-full max-w-md rounded bg-neutral-200" />
                <div class="h-3 w-52 rounded bg-neutral-200" />
              </div>
            </div>
          </div>
        </div>

        <div v-else-if="userStore.error && !userStore.isLoading" class="rounded-xl border border-dashed border-neutral-200 py-16 text-center">
          <p class="text-neutral-600">{{ userStore.error }}</p>
          <button
            type="button"
            class="mt-4 text-sm font-semibold text-green-700 hover:text-green-800"
            @click="retry"
          >
            Try again
          </button>
        </div>

        <template v-else>
          <div v-if="paginatedFreelancers.length" class="space-y-4">
            <TalentSearchResultCard v-for="f in paginatedFreelancers" :key="f.id" :freelancer="f" />
          </div>

          <div
            v-else-if="!userStore.isLoading && !paginatedFreelancers.length"
            class="rounded-xl border border-dashed border-neutral-200 py-20 text-center"
          >
            <p class="text-neutral-600">No talent matches these filters.</p>
            <button type="button" class="mt-3 text-sm font-semibold text-green-700 hover:text-green-800" @click="resetFilters">
              Clear filters
            </button>
          </div>

          <nav
            v-if="totalPages > 1"
            class="mt-10 flex flex-wrap items-center justify-center gap-2 border-t border-neutral-200 pt-8"
            aria-label="Pagination"
          >
            <button
              type="button"
              class="rounded-lg border border-neutral-300 px-3 py-1.5 text-sm font-medium text-neutral-700 hover:bg-neutral-50 disabled:opacity-40"
              :disabled="currentPage <= 1"
              @click="currentPage--"
            >
              Previous
            </button>
            <button
              v-for="p in pageNumbers"
              :key="p"
              type="button"
              class="min-w-[2.25rem] rounded-lg px-2 py-1.5 text-sm font-medium"
              :class="
                p === currentPage
                  ? 'bg-green-600 text-white'
                  : 'text-neutral-700 hover:bg-neutral-100'
              "
              @click="currentPage = p"
            >
              {{ p }}
            </button>
            <button
              type="button"
              class="rounded-lg border border-neutral-300 px-3 py-1.5 text-sm font-medium text-neutral-700 hover:bg-neutral-50 disabled:opacity-40"
              :disabled="currentPage >= totalPages"
              @click="currentPage++"
            >
              Next
            </button>
          </nav>
        </template>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, reactive, computed, onMounted, onBeforeUnmount, watch } from 'vue'
import { RouterLink, useRoute } from 'vue-router'
import type { User, FreelancerProfile } from '@/types'
import { CATEGORY_OPTIONS } from '@/constants/categories'
import { useUserStore } from '@/stores/user.store'
import FreelanceJobsCategorySubnav from '@/modules/jobs/components/FreelanceJobsCategorySubnav.vue'
import TalentSearchResultCard from '@/modules/public/components/TalentSearchResultCard.vue'
import TalentSearchFilterAccordion from '@/modules/public/components/TalentSearchFilterAccordion.vue'
import AppInput from '@/components/ui/AppInput.vue'
import AppSelect from '@/components/ui/AppSelect.vue'
import StarRating from '@/components/ui/StarRating.vue'

type FreelancerWithUser = User & FreelancerProfile

const route = useRoute()
const userStore = useUserStore()

/** Avoid skeleton flash on fast loads / tab switches when cache is warm. */
const SKELETON_DELAY_MS = 220
const showTalentSkeleton = ref(false)
let talentSkeletonTimer: ReturnType<typeof setTimeout> | undefined

function clearTalentSkeletonTimer(): void {
  if (talentSkeletonTimer !== undefined) {
    clearTimeout(talentSkeletonTimer)
    talentSkeletonTimer = undefined
  }
}

watch(
  () => userStore.isLoading && userStore.freelancersList.length === 0,
  (showPending) => {
    clearTalentSkeletonTimer()
    if (showPending) {
      talentSkeletonTimer = window.setTimeout(() => {
        showTalentSkeleton.value = true
        talentSkeletonTimer = undefined
      }, SKELETON_DELAY_MS)
    } else {
      showTalentSkeleton.value = false
    }
  },
  { immediate: true },
)

const PAGE_SIZE = 10
const currentPage = ref(1)
const sortBy = ref('best_match')

const badgeFilterOptions = [
  { key: 'top_rated_plus' as const, label: 'Top Rated Plus' },
  { key: 'top_rated' as const, label: 'Top Rated' },
  { key: 'rising_talent' as const, label: 'Rising Talent' },
]

const TIMEZONE_OPTIONS = [
  { label: 'Americas', value: 'americas' },
  { label: 'Europe', value: 'europe' },
  { label: 'Asia Pacific', value: 'apac' },
]

const JOB_SUCCESS_OPTIONS = [
  { label: '90% and up', value: '90' },
  { label: '80% and up', value: '80' },
  { label: '70% and up', value: '70' },
]

const HOURS_OPTIONS = [
  { label: '100+ hrs', value: '100' },
  { label: '500+ hrs', value: '500' },
  { label: '1,000+ hrs', value: '1000' },
]

const ENGLISH_OPTIONS = [
  { label: 'Fluent', value: 'fluent' },
  { label: 'Conversational', value: 'conversational' },
]

/** Coarse match from job category slug → freelancer profile (mock-friendly). */
function matchesJobCategory(f: FreelancerWithUser, jobCat: string): boolean {
  const t = `${f.title} ${f.bio}`.toLowerCase()
  const skillCats = new Set(f.skills.map((s) => s.category))
  switch (jobCat) {
    case 'web-development':
      return (
        skillCats.has('frontend') ||
        skillCats.has('backend') ||
        skillCats.has('database') ||
        /\b(web|full[\s-]?stack|react|vue|node|developer|engineer)\b/i.test(t)
      )
    case 'mobile-apps':
      return skillCats.has('mobile') || /\b(mobile|ios|android|flutter|react native)\b/i.test(t)
    case 'design':
      return skillCats.has('design') || /\b(design|ui|ux|figma|brand|graphic)\b/i.test(t)
    case 'data-science':
      return skillCats.has('ml') || /\b(data|machine learning|ml|nlp|analyst|scientist)\b/i.test(t)
    case 'writing':
      return /\b(writer|writing|content|copy|editor|translator)\b/i.test(t)
    case 'marketing':
      return /\b(market|seo|ads|social|growth|brand)\b/i.test(t)
    case 'game-development':
      return /\b(game|unity|unreal)\b/i.test(t)
    case 'video':
      return /\b(video|motion|animation|premiere|after effects)\b/i.test(t)
    case 'finance':
      return /\b(finance|account|book|tax|cpa|fpa)\b/i.test(t)
    default:
      return true
  }
}

const SORT_OPTIONS = [
  { label: 'Best match', value: 'best_match' },
  { label: 'Highest rated', value: 'rating_desc' },
  { label: 'Most jobs done', value: 'jobs_desc' },
  { label: 'Rate: Low to high', value: 'rate_asc' },
  { label: 'Rate: High to low', value: 'rate_desc' },
]

const filters = reactive({
  search: '',
  location: '',
  timezone: '',
  talentType: 'all' as 'all' | 'freelancer' | 'agency',
  openToContract: false,
  offersConsultations: false,
  minJobSuccess: '',
  minEarned: undefined as number | undefined,
  minHours: '',
  englishLevel: '',
  otherLanguage: '',
  category: '',
  minRate: undefined as number | undefined,
  maxRate: undefined as number | undefined,
  minRating: 0,
  badges: {
    top_rated_plus: false,
    top_rated: false,
    rising_talent: false,
  },
})

function syncFromRouteQuery(): void {
  const q = route.query
  if (typeof q.q === 'string' && q.q) filters.search = q.q
  if (typeof q.search === 'string' && q.search) filters.search = q.search
  if (typeof q.category === 'string') filters.category = q.category
  if (typeof q.location === 'string') filters.location = q.location
  if (q.talentType === 'agency' || q.talentType === 'freelancer' || q.talentType === 'all') {
    filters.talentType = q.talentType
  }
}

function jssOf(f: FreelancerWithUser): number {
  const raw = f as Record<string, unknown>
  const n = Number(raw.jobSuccessScore ?? raw.successRate)
  return Number.isFinite(n) ? n : 0
}

function hoursOf(f: FreelancerWithUser): number {
  const raw = f as Record<string, unknown>
  const billed = Number(raw.hoursBilled)
  if (Number.isFinite(billed)) return billed
  return (f.totalJobsDone ?? 0) * 40
}

const filteredFreelancers = computed<FreelancerWithUser[]>(() => {
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

  if (filters.location.trim()) {
    const loc = filters.location.toLowerCase()
    list = list.filter((f) => f.location.toLowerCase().includes(loc))
  }

  const badgeKeys = badgeFilterOptions.map((o) => o.key).filter((k) => filters.badges[k])
  if (badgeKeys.length) {
    list = list.filter((f) => f.badge && badgeKeys.includes(f.badge as typeof badgeKeys[number]))
  }

  if (filters.minJobSuccess) {
    const min = Number(filters.minJobSuccess)
    list = list.filter((f) => jssOf(f) >= min)
  }

  if (filters.minEarned != null && filters.minEarned > 0) {
    list = list.filter((f) => f.totalEarnings >= filters.minEarned!)
  }

  if (filters.minHours) {
    const min = Number(filters.minHours)
    list = list.filter((f) => hoursOf(f) >= min)
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

  if (filters.talentType === 'agency') {
    list = []
  }

  if (filters.category) {
    list = list.filter((f) => matchesJobCategory(f, filters.category))
  }

  if (filters.openToContract || filters.offersConsultations || filters.timezone || filters.englishLevel || filters.otherLanguage) {
    /* Reserved for future profile fields */
  }

  switch (sortBy.value) {
    case 'rating_desc':
      list = [...list].sort((a, b) => b.rating - a.rating)
      break
    case 'jobs_desc':
      list = [...list].sort((a, b) => b.totalJobsDone - a.totalJobsDone)
      break
    case 'rate_asc':
      list = [...list].sort((a, b) => a.hourlyRate - b.hourlyRate)
      break
    case 'rate_desc':
      list = [...list].sort((a, b) => b.hourlyRate - a.hourlyRate)
      break
    default:
      break
  }

  return list
})

const totalPages = computed(() =>
  Math.max(1, Math.ceil(filteredFreelancers.value.length / PAGE_SIZE)),
)

const paginatedFreelancers = computed(() => {
  const start = (currentPage.value - 1) * PAGE_SIZE
  return filteredFreelancers.value.slice(start, start + PAGE_SIZE)
})

const pageNumbers = computed(() => {
  const total = totalPages.value
  const cur = currentPage.value
  const windowSize = 5
  let start = Math.max(1, cur - 2)
  let end = Math.min(total, start + windowSize - 1)
  start = Math.max(1, end - windowSize + 1)
  const nums: number[] = []
  for (let i = start; i <= end; i++) nums.push(i)
  return nums
})

watch(filteredFreelancers, (list) => {
  const tp = Math.max(1, Math.ceil(list.length / PAGE_SIZE))
  if (currentPage.value > tp) currentPage.value = 1
})

watch(
  () => route.query,
  () => {
    syncFromRouteQuery()
  },
  { deep: true },
)

function scrollToFilters(): void {
  document.getElementById('talent-search-filters')?.scrollIntoView({ behavior: 'smooth', block: 'start' })
}

function resetFilters(): void {
  filters.search = ''
  filters.location = ''
  filters.timezone = ''
  filters.talentType = 'all'
  filters.openToContract = false
  filters.offersConsultations = false
  filters.minJobSuccess = ''
  filters.minEarned = undefined
  filters.minHours = ''
  filters.englishLevel = ''
  filters.otherLanguage = ''
  filters.category = ''
  filters.minRate = undefined
  filters.maxRate = undefined
  filters.minRating = 0
  badgeFilterOptions.forEach((o) => {
    filters.badges[o.key] = false
  })
  currentPage.value = 1
}

function retry(): void {
  void userStore.fetchFreelancers()
}

onMounted(() => {
  syncFromRouteQuery()
  void userStore.fetchFreelancers()
})

onBeforeUnmount(() => {
  clearTalentSkeletonTimer()
})
</script>
