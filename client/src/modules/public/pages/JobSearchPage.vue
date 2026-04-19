<template>
  <div class="min-h-screen bg-white">
    <FreelanceJobsCategorySubnav context="hire" current-slug="" use-category-urls />

    <!-- Search strip (matches Talent search layout) -->
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
                    v-model="localFilters.search"
                    type="search"
                    autocomplete="off"
                    placeholder="Search"
                    class="w-full rounded-lg border border-neutral-300 bg-white py-2.5 pl-10 pr-4 text-sm text-neutral-900 placeholder-neutral-400 shadow-sm focus:border-green-600 focus:outline-none focus:ring-1 focus:ring-green-600"
                    @keydown.enter.prevent="applyFilters"
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
                <RouterLink
                  to="/search/talent"
                  class="-mb-px border-b-2 border-transparent pb-2 text-sm font-medium text-neutral-600 hover:text-neutral-900"
                >
                  Talent
                </RouterLink>
                <span
                  class="-mb-px border-b-2 border-green-600 pb-2 text-sm font-semibold text-neutral-900"
                  aria-current="page"
                >
                  Jobs
                </span>
              </div>
            </div>
            <div class="mt-4 border-b border-neutral-200" aria-hidden="true" />
          </div>
        </div>
      </div>
    </div>

    <div class="mx-auto flex max-w-7xl flex-col gap-8 px-4 py-8 sm:px-6 lg:flex-row lg:px-8">
      <aside id="job-search-filters" class="w-full shrink-0 lg:w-64" aria-label="Refine job search">
        <div class="sticky top-24 space-y-1">
          <section class="border-b border-neutral-200 pb-4">
            <h2 class="mb-2 text-sm font-semibold text-neutral-900">Category</h2>
            <AppSelect
              v-model="localFilters.category"
              :options="CATEGORY_OPTIONS"
              placeholder="Select categories"
            />
          </section>

          <section class="border-b border-neutral-200 py-4">
            <h2 class="mb-3 text-sm font-semibold text-neutral-900">Experience level</h2>
            <ul class="space-y-2.5">
              <li v-for="level in EXPERIENCE_LEVELS" :key="level.value" class="flex items-center gap-2">
                <input
                  :id="`exp-${level.value}`"
                  type="checkbox"
                  class="h-4 w-4 rounded border-neutral-300 text-green-600 focus:ring-green-600"
                  :checked="localFilters.experienceLevel === level.value"
                  @change="
                    localFilters.experienceLevel =
                      localFilters.experienceLevel === level.value ? undefined : level.value
                  "
                />
                <label :for="`exp-${level.value}`" class="text-sm text-neutral-700">{{ level.label }}</label>
              </li>
            </ul>
          </section>

          <section class="border-b border-neutral-200 py-4">
            <h2 class="mb-3 text-sm font-semibold text-neutral-900">Job type</h2>
            <ul class="space-y-3">
              <li class="space-y-2">
                <label class="flex cursor-pointer items-center gap-2">
                  <input
                    type="checkbox"
                    class="h-4 w-4 rounded border-neutral-300 text-green-600 focus:ring-green-600"
                    :checked="localFilters.type === 'hourly'"
                    @change="
                      localFilters.type = localFilters.type === 'hourly' ? undefined : 'hourly'
                    "
                  />
                  <span class="text-sm text-neutral-700">Hourly</span>
                </label>
                <div v-if="localFilters.type === 'hourly'" class="ml-6 flex gap-2">
                  <AppInput
                    v-model.number="localFilters.budgetMin"
                    type="number"
                    placeholder="Min $/hr"
                    :min="0"
                  />
                  <AppInput
                    v-model.number="localFilters.budgetMax"
                    type="number"
                    placeholder="Max $/hr"
                    :min="0"
                  />
                </div>
              </li>
              <li class="space-y-2">
                <label class="flex cursor-pointer items-center gap-2">
                  <input
                    type="checkbox"
                    class="h-4 w-4 rounded border-neutral-300 text-green-600 focus:ring-green-600"
                    :checked="localFilters.type === 'fixed'"
                    @change="
                      localFilters.type = localFilters.type === 'fixed' ? undefined : 'fixed'
                    "
                  />
                  <span class="text-sm text-neutral-700">Fixed-Price</span>
                </label>
                <div v-if="localFilters.type === 'fixed'" class="ml-6 flex gap-2">
                  <AppInput
                    v-model.number="localFilters.budgetMin"
                    type="number"
                    placeholder="Min $"
                    :min="0"
                  />
                  <AppInput
                    v-model.number="localFilters.budgetMax"
                    type="number"
                    placeholder="Max $"
                    :min="0"
                  />
                </div>
              </li>
            </ul>
          </section>

          <section class="border-b border-neutral-200 py-4">
            <h2 class="mb-3 text-sm font-semibold text-neutral-900">Client history</h2>
            <p class="mb-2 text-xs text-neutral-500">Demo filter (derived from client id in mock data).</p>
            <ul class="space-y-2.5">
              <li v-for="opt in CLIENT_HISTORY_OPTIONS" :key="opt.key" class="flex items-center gap-2">
                <input
                  :id="`ch-${opt.key}`"
                  v-model="clientHistory[opt.key]"
                  type="checkbox"
                  class="h-4 w-4 rounded border-neutral-300 text-green-600 focus:ring-green-600"
                />
                <label :for="`ch-${opt.key}`" class="text-sm text-neutral-700">{{ opt.label }}</label>
              </li>
            </ul>
          </section>

          <section class="border-b border-neutral-200 py-4">
            <h2 class="mb-2 text-sm font-semibold text-neutral-900">Client location</h2>
            <AppSelect v-model="clientLocation" :options="CLIENT_LOCATION_OPTIONS" placeholder="Select client locations" />
          </section>

          <section class="border-b border-neutral-200 py-4">
            <h2 class="mb-2 text-sm font-semibold text-neutral-900">Client time zones</h2>
            <AppSelect v-model="clientTimezone" :options="TIMEZONE_OPTIONS" placeholder="Select client time zones" />
          </section>

          <TalentSearchFilterAccordion title="Project length">
            <ul class="space-y-2.5">
              <li v-for="opt in PROJECT_LENGTH_OPTIONS" :key="opt.value" class="flex items-center gap-2">
                <input
                  :id="`pl-${opt.value}`"
                  v-model="projectLength[opt.value]"
                  type="checkbox"
                  class="h-4 w-4 rounded border-neutral-300 text-green-600 focus:ring-green-600"
                />
                <label :for="`pl-${opt.value}`" class="text-sm text-neutral-700">{{ opt.label }}</label>
              </li>
            </ul>
          </TalentSearchFilterAccordion>

          <TalentSearchFilterAccordion title="Hours per week">
            <ul class="space-y-2.5">
              <li class="flex items-center gap-2">
                <input
                  id="hpw-low"
                  v-model="hoursPerWeek.less30"
                  type="checkbox"
                  class="h-4 w-4 rounded border-neutral-300 text-green-600 focus:ring-green-600"
                />
                <label for="hpw-low" class="text-sm text-neutral-700">Less than 30 hrs/week</label>
              </li>
              <li class="flex items-center gap-2">
                <input
                  id="hpw-high"
                  v-model="hoursPerWeek.more30"
                  type="checkbox"
                  class="h-4 w-4 rounded border-neutral-300 text-green-600 focus:ring-green-600"
                />
                <label for="hpw-high" class="text-sm text-neutral-700">More than 30 hrs/week</label>
              </li>
            </ul>
          </TalentSearchFilterAccordion>

          <section class="py-4">
            <label class="flex cursor-pointer items-center gap-2">
              <input
                v-model="contractToHireOnly"
                type="checkbox"
                class="h-4 w-4 rounded border-neutral-300 text-green-600 focus:ring-green-600"
              />
              <span class="text-sm text-neutral-700">Contract-to-hire roles</span>
            </label>
          </section>

          <div class="flex gap-2 pb-6">
            <button
              type="button"
              class="flex-1 rounded-lg bg-green-600 px-4 py-2.5 text-sm font-semibold text-white hover:bg-green-700"
              @click="applyFilters"
            >
              Apply filters
            </button>
            <button
              type="button"
              class="rounded-lg border border-neutral-300 px-4 py-2.5 text-sm font-medium text-neutral-700 hover:bg-neutral-50"
              @click="resetAll"
            >
              Clear
            </button>
          </div>
        </div>
      </aside>

      <div class="min-w-0 flex-1">
        <div class="mb-4 flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
          <p class="text-sm text-neutral-600">
            <span class="font-semibold text-neutral-900">{{ refinedJobs.length }}</span>
            jobs found
          </p>
          <div class="flex flex-col gap-2 sm:flex-row sm:items-center">
            <AppSelect v-model="jobsPerPageStr" :options="JOBS_PER_PAGE_OPTIONS" placeholder="Jobs per page" class="w-full sm:w-40" />
            <AppSelect v-model="sortBy" :options="SORT_OPTIONS" placeholder="Sort by" class="w-full sm:w-48" />
          </div>
        </div>

        <div v-if="showJobSkeleton" class="space-y-4" aria-busy="true">
          <div v-for="i in 4" :key="i" class="animate-pulse rounded-lg border border-neutral-200 p-5">
            <div class="h-4 w-2/3 rounded bg-neutral-200" />
            <div class="mt-3 h-3 w-full rounded bg-neutral-200" />
            <div class="mt-2 h-3 w-4/5 rounded bg-neutral-200" />
          </div>
        </div>

        <div v-else-if="jobStore.error && !jobStore.isLoading" class="rounded-xl border border-dashed border-neutral-200 py-16 text-center">
          <p class="text-neutral-600">{{ jobStore.error }}</p>
          <button
            type="button"
            class="mt-4 text-sm font-semibold text-green-700 hover:text-green-800"
            @click="applyFilters"
          >
            Try again
          </button>
        </div>

        <template v-else>
          <div v-if="paginatedJobs.length" class="space-y-4">
            <JobCard v-for="job in paginatedJobs" :key="job.id" :job="job" />
          </div>

          <div
            v-else-if="!jobStore.isLoading && !paginatedJobs.length"
            class="rounded-xl border border-dashed border-neutral-200 py-20 text-center"
          >
            <p class="text-neutral-600">No jobs match these filters.</p>
            <button type="button" class="mt-3 text-sm font-semibold text-green-700 hover:text-green-800" @click="resetAll">
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
              :class="p === currentPage ? 'bg-green-600 text-white' : 'text-neutral-700 hover:bg-neutral-100'"
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
import { ref, reactive, computed, watch, onMounted, onBeforeUnmount } from 'vue'
import { RouterLink, useRoute } from 'vue-router'
import type { Job, JobFilters } from '@/types'
import { CATEGORY_OPTIONS } from '@/constants/categories'
import { useJobStore } from '@/stores/job.store'
import FreelanceJobsCategorySubnav from '@/modules/jobs/components/FreelanceJobsCategorySubnav.vue'
import TalentSearchFilterAccordion from '@/modules/public/components/TalentSearchFilterAccordion.vue'
import JobCard from '@/modules/jobs/components/JobCard.vue'
import AppInput from '@/components/ui/AppInput.vue'
import AppSelect from '@/components/ui/AppSelect.vue'

const route = useRoute()
const jobStore = useJobStore()

const FETCH_LIMIT = 120

const EXPERIENCE_LEVELS = [
  { label: 'Entry Level', value: 'entry' },
  { label: 'Intermediate', value: 'intermediate' },
  { label: 'Expert', value: 'expert' },
]

const CLIENT_HISTORY_OPTIONS = [
  { key: 'noHires' as const, label: 'No hires' },
  { key: 'lowHires' as const, label: '1 to 9 hires' },
  { key: 'highHires' as const, label: '10+ hires' },
]

const CLIENT_LOCATION_OPTIONS = [
  { label: 'United States', value: 'us' },
  { label: 'United Kingdom', value: 'uk' },
  { label: 'Europe', value: 'eu' },
  { label: 'Asia Pacific', value: 'apac' },
]

const TIMEZONE_OPTIONS = [
  { label: 'Americas', value: 'americas' },
  { label: 'Europe', value: 'europe' },
  { label: 'Asia Pacific', value: 'apac' },
]

const PROJECT_LENGTH_OPTIONS = [
  { label: 'Less than one month', value: 'short' as const },
  { label: '1 to 3 months', value: 'medium' as const },
  { label: '3 to 6 months', value: 'long' as const },
]

const SORT_OPTIONS = [
  { label: 'Relevance', value: 'newest' },
  { label: 'Highest budget', value: 'budget_desc' },
  { label: 'Most proposals', value: 'proposals_desc' },
]

const JOBS_PER_PAGE_OPTIONS = [
  { label: '10 jobs per page', value: '10' },
  { label: '20 jobs per page', value: '20' },
  { label: '50 jobs per page', value: '50' },
]

const sortBy = ref('newest')
const currentPage = ref(1)
const jobsPerPageStr = ref('10')
const jobsPerPage = computed(() => Number(jobsPerPageStr.value) || 10)

const localFilters = reactive<JobFilters>({
  search: '',
  category: '',
  type: undefined,
  experienceLevel: undefined,
  budgetMin: undefined,
  budgetMax: undefined,
  page: 1,
  limit: FETCH_LIMIT,
})

const clientHistory = reactive({
  noHires: false,
  lowHires: false,
  highHires: false,
})

const projectLength = reactive({
  short: false,
  medium: false,
  long: false,
})

const hoursPerWeek = reactive({
  less30: false,
  more30: false,
})

const contractToHireOnly = ref(false)
const clientLocation = ref('')
const clientTimezone = ref('')

function clientHireTier(clientId: string): 'noHires' | 'lowHires' | 'highHires' {
  const n =
    clientId.split('').reduce((acc, ch) => acc + ch.charCodeAt(0), 0) % 10
  if (n < 3) return 'noHires'
  if (n < 7) return 'lowHires'
  return 'highHires'
}

function syncFromRouteQuery(): void {
  const q = route.query
  if (typeof q.search === 'string') localFilters.search = q.search
  if (typeof q.q === 'string') localFilters.search = q.q
  if (typeof q.category === 'string') localFilters.category = q.category
}

function scrollToFilters(): void {
  document.getElementById('job-search-filters')?.scrollIntoView({ behavior: 'smooth', block: 'start' })
}

function numFilter(n: unknown): number | undefined {
  if (n === '' || n == null) return undefined
  const x = Number(n)
  return Number.isFinite(x) ? x : undefined
}

function buildApiFilters(): JobFilters {
  const f: JobFilters = {
    search: localFilters.search?.trim() || undefined,
    category: localFilters.category || undefined,
    type: localFilters.type,
    experienceLevel: localFilters.experienceLevel,
    budgetMin: numFilter(localFilters.budgetMin),
    budgetMax: numFilter(localFilters.budgetMax),
    sortBy: sortBy.value,
    page: 1,
    limit: FETCH_LIMIT,
  }
  return f
}

function applyFilters(): void {
  currentPage.value = 1
  void jobStore.fetchJobs(buildApiFilters())
}

function resetAll(): void {
  localFilters.search = ''
  localFilters.category = ''
  localFilters.type = undefined
  localFilters.experienceLevel = undefined
  localFilters.budgetMin = undefined
  localFilters.budgetMax = undefined
  clientHistory.noHires = false
  clientHistory.lowHires = false
  clientHistory.highHires = false
  projectLength.short = false
  projectLength.medium = false
  projectLength.long = false
  hoursPerWeek.less30 = false
  hoursPerWeek.more30 = false
  contractToHireOnly.value = false
  clientLocation.value = ''
  clientTimezone.value = ''
  sortBy.value = 'newest'
  currentPage.value = 1
  jobStore.resetFilters()
  void jobStore.fetchJobs({ page: 1, limit: FETCH_LIMIT, sortBy: sortBy.value })
}

const refinedJobs = computed(() => {
  let list: Job[] = [...jobStore.jobs]

  const anyProject =
    projectLength.short || projectLength.medium || projectLength.long
  if (anyProject) {
    list = list.filter((j) => {
      const pl = j.projectLength
      if (!pl) return true
      if (projectLength.short && pl === 'short') return true
      if (projectLength.medium && pl === 'medium') return true
      if (projectLength.long && pl === 'long') return true
      return false
    })
  }

  const anyHistory = clientHistory.noHires || clientHistory.lowHires || clientHistory.highHires
  if (anyHistory) {
    list = list.filter((j) => {
      const tier = clientHireTier(j.clientId)
      if (clientHistory.noHires && tier === 'noHires') return true
      if (clientHistory.lowHires && tier === 'lowHires') return true
      if (clientHistory.highHires && tier === 'highHires') return true
      return false
    })
  }

  if (contractToHireOnly.value) {
    list = list.filter((j) => /\bcontract\b/i.test(`${j.title} ${j.description}`))
  }

  if (hoursPerWeek.less30 && !hoursPerWeek.more30) {
    list = list.filter((j) => j.type === 'hourly')
  } else if (hoursPerWeek.more30 && !hoursPerWeek.less30) {
    list = list.filter((j) => j.type === 'fixed' || j.type === 'hourly')
  }

  return list
})

const totalPages = computed(() =>
  Math.max(1, Math.ceil(refinedJobs.value.length / jobsPerPage.value)),
)

const paginatedJobs = computed(() => {
  const start = (currentPage.value - 1) * jobsPerPage.value
  return refinedJobs.value.slice(start, start + jobsPerPage.value)
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

watch(refinedJobs, (list) => {
  const tp = Math.max(1, Math.ceil(list.length / jobsPerPage.value))
  if (currentPage.value > tp) currentPage.value = 1
})

watch(jobsPerPageStr, () => {
  currentPage.value = 1
})

watch(sortBy, () => {
  applyFilters()
})

watch(
  () => route.query,
  () => {
    syncFromRouteQuery()
  },
  { deep: true },
)

onMounted(() => {
  syncFromRouteQuery()
  void jobStore.fetchJobs(buildApiFilters())
})

onBeforeUnmount(() => {
  clearJobSkeletonTimer()
})
</script>
