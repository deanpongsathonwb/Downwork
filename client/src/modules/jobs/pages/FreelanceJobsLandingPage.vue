<template>
  <div v-if="entry" class="bg-white">
    <FreelanceJobsCategorySubnav :current-slug="entry.slug" :hover-mega-menu="true" />

    <!-- Hero -->
    <section class="bg-white">
      <div class="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-14 sm:py-20 text-center">
        <h1 class="text-3xl sm:text-4xl lg:text-[2.75rem] font-bold text-slate-900 tracking-tight leading-[1.15] mb-0">
          Find the Best {{ entry.heroSkill }} Jobs
        </h1>

        <div class="mt-3 sm:mt-4 flex flex-col items-center gap-0 max-w-2xl mx-auto">
          <div
            class="flex flex-wrap items-center justify-center gap-x-2 gap-y-0.5 text-[0.9375rem] sm:text-base text-slate-900 leading-snug"
          >
            <span>Professionals on Downwork rate clients</span>
            <span class="inline-flex items-center gap-1 shrink-0" role="img" aria-label="Rating 4.9 out of 5">
              <svg
                v-for="n in 4"
                :key="n"
                class="w-[1.125rem] h-[1.125rem] sm:w-5 sm:h-5 text-amber-400 fill-amber-400"
                viewBox="0 0 24 24"
              >
                <polygon
                  points="12 2 15.09 8.26 22 9.27 17 14.14 18.18 21.02 12 17.77 5.82 21.02 7 14.14 2 9.27 8.91 8.26 12 2"
                />
              </svg>
              <svg class="w-[1.125rem] h-[1.125rem] sm:w-5 sm:h-5" viewBox="0 0 24 24" aria-hidden="true">
                <defs>
                  <linearGradient :id="`hero-star-partial-${entry.slug}`" x1="0" x2="1" y1="0" y2="0">
                    <stop offset="90%" stop-color="rgb(251 191 36)" />
                    <stop offset="90%" stop-color="rgb(203 213 225)" />
                  </linearGradient>
                </defs>
                <polygon
                  :fill="`url(#hero-star-partial-${entry.slug})`"
                  stroke="none"
                  points="12 2 15.09 8.26 22 9.27 17 14.14 18.18 21.02 12 17.77 5.82 21.02 7 14.14 2 9.27 8.91 8.26 12 2"
                />
              </svg>
            </span>
            <span class="font-bold text-slate-900 tabular-nums">4.9/5</span>
          </div>
          <p class="text-sm text-slate-500 leading-tight mt-0.5">On average from 2M+ reviews</p>
        </div>

        <RouterLink
          to="/"
          class="mt-5 sm:mt-6 inline-flex items-center justify-center rounded-[10px] bg-[#14a800] px-10 py-3 text-base font-medium text-white hover:bg-[#118f00] transition-colors shadow-sm"
        >
          Find work
        </RouterLink>
      </div>
    </section>

    <!-- Sample jobs -->
    <section class="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12 sm:py-16">
      <header class="mb-10 text-left max-w-4xl">
        <h2 class="text-lg sm:text-xl font-semibold text-slate-900 leading-snug tracking-tight">
          Check out a sample of the {{ jobStore.totalJobs.toLocaleString() }}
          {{ entry.heroSkill }} {{ sampleJobsJobNoun }} posted on Downwork
        </h2>
        <nav class="mt-3" aria-label="Breadcrumb">
          <ol class="flex flex-wrap items-center gap-x-2 gap-y-1 text-sm">
            <li>
              <RouterLink
                to="/hire"
                class="font-medium text-green-600 hover:text-green-700 transition-colors"
              >
                Find freelance jobs
              </RouterLink>
            </li>
            <li class="text-slate-400 select-none" aria-hidden="true">&gt;</li>
            <li class="text-slate-500" aria-current="page">
              {{ entry.heroSkill }} Jobs
            </li>
          </ol>
        </nav>
      </header>

      <div v-if="jobStore.isLoading && !jobStore.jobs.length" class="grid sm:grid-cols-2 gap-5" aria-busy="true">
        <div v-for="i in 6" :key="i" class="h-64 rounded-2xl bg-slate-100 animate-pulse" />
      </div>

      <div v-else-if="!jobStore.jobs.length" class="text-center py-16 rounded-2xl border border-dashed border-slate-200">
        <p class="text-slate-600 mb-4">No sample listings match this filter right now.</p>
        <RouterLink
          to="/hire"
          class="text-green-600 font-semibold hover:text-green-700"
        >
          Browse all jobs →
        </RouterLink>
      </div>

      <div v-else class="grid sm:grid-cols-2 gap-5">
        <FreelanceJobsLandingJobCard v-for="job in jobStore.jobs" :key="job.id" :job="job" />
      </div>

      <div v-if="jobStore.hasMore" class="text-center mt-10">
        <AppButton
          variant="outline"
          class="!rounded-xl !border-2 !border-green-600 !px-6 !py-2.5 !text-sm !font-semibold !text-green-700 hover:!bg-green-50 !shadow-none focus:!ring-green-600/30"
          :loading="jobStore.isLoading"
          @click="jobStore.nextPage()"
        >
          Load more jobs
        </AppButton>
      </div>
    </section>
  </div>
</template>

<script setup lang="ts">
import { computed, onBeforeUnmount, watch } from 'vue'
import { RouterLink, useRoute } from 'vue-router'
import { getFreelanceJobLanding, type FreelanceJobLandingEntry } from '@/constants/freelance-jobs.landing'
import { useJobStore } from '@/stores/job.store'
import FreelanceJobsLandingJobCard from '@/modules/jobs/components/FreelanceJobsLandingJobCard.vue'
import FreelanceJobsCategorySubnav from '@/modules/jobs/components/FreelanceJobsCategorySubnav.vue'
import AppButton from '@/components/ui/AppButton.vue'

/** Matches `client/index.html` default when leaving this page. */
const DEFAULT_DOCUMENT_TITLE = 'Hire Top Freelance Talent with Confidence - Downwork'

function freelanceLandingTitle(e: FreelanceJobLandingEntry): string {
  return `${e.heroSkill} Freelance Jobs: Work Remote & Earn Online`
}

const route = useRoute()
const jobStore = useJobStore()

const entry = computed((): FreelanceJobLandingEntry | undefined => {
  const slug = route.params.slug as string
  return getFreelanceJobLanding(slug)
})

const sampleJobsJobNoun = computed(() => (jobStore.totalJobs === 1 ? 'job' : 'jobs'))

watch(
  entry,
  (e) => {
    document.title = e ? freelanceLandingTitle(e) : DEFAULT_DOCUMENT_TITLE
  },
  { immediate: true },
)

onBeforeUnmount(() => {
  document.title = DEFAULT_DOCUMENT_TITLE
})

function loadJobs(): void {
  const e = entry.value
  if (!e) return
  // Always set category + search explicitly so a prior landing’s `search` (e.g. WordPress)
  // does not stick when switching to a slug that only sets `category`.
  jobStore.fetchJobs({
    category: e.jobFilters.category,
    search: e.jobFilters.search,
    page: 1,
    limit: 10,
    sortBy: 'newest',
  })
}

watch(
  () => route.params.slug,
  () => {
    loadJobs()
  },
  { immediate: true },
)
</script>
