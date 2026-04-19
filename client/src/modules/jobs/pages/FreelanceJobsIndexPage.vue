<template>
  <div class="bg-white">
    <FreelanceJobsCategorySubnav current-slug="" :hover-mega-menu="true" />

    <section class="bg-white">
      <div class="mx-auto max-w-7xl px-4 py-8 sm:px-6 lg:px-8">
        <h1 class="mb-5 text-left text-3xl font-bold tracking-tight text-slate-900 sm:mb-6 sm:text-4xl lg:text-[2.75rem] lg:leading-tight">
          Find the best freelance jobs
        </h1>
        <div class="mb-8 min-w-0 overflow-x-auto sm:mb-10">
          <p class="whitespace-nowrap text-left text-base font-normal leading-relaxed text-slate-900 sm:text-lg">
            Browse jobs posted on Downwork, or jump right in and create a free profile to find the work that you love to do.
          </p>
        </div>

        <RouterLink
          to="/browse-jobs"
          class="inline-flex items-center justify-center rounded-lg bg-[#14a800] px-8 py-3 text-base font-bold text-white transition-colors hover:bg-[#118f00]"
        >
          Find work
        </RouterLink>
      </div>
    </section>

    <div class="mx-auto max-w-7xl px-4 py-10 sm:px-6 lg:px-8">
      <div class="flex flex-col gap-10 lg:flex-row lg:gap-14">
        <aside class="shrink-0 lg:w-64" aria-label="Job type filters">
          <p class="text-sm font-normal text-slate-600">Find freelance jobs /</p>
          <h2 id="freelance-jobs-type-heading" class="mt-6 text-base font-bold text-slate-900">
            Type of work
          </h2>
          <fieldset class="mt-4 border-0 p-0">
            <legend class="sr-only">Type of work</legend>
            <ul class="list-none space-y-0 p-0" role="presentation">
              <li v-for="opt in FREELANCE_JOBS_TYPE_OF_WORK" :key="opt.id">
                <label
                  class="group flex cursor-pointer items-center gap-3 py-2.5 text-sm font-normal text-slate-900 select-none"
                >
                  <input
                    type="radio"
                    name="freelance-jobs-type-of-work"
                    class="sr-only"
                    :value="opt.id"
                    :checked="opt.id === 'any'"
                    @change="onTypeOfWorkChange(opt)"
                  />
                  <span
                    class="flex h-[18px] w-[18px] shrink-0 items-center justify-center rounded-full border-2 border-slate-300 bg-white transition-colors group-has-[:checked]:border-[#14a800]"
                    aria-hidden="true"
                  >
                    <span
                      class="h-2.5 w-2.5 rounded-full bg-[#14a800] opacity-0 transition-opacity group-has-[:checked]:opacity-100"
                    />
                  </span>
                  <span>{{ opt.label }}</span>
                </label>
              </li>
            </ul>
          </fieldset>
        </aside>

        <div class="min-w-0 flex-1">
          <h2 class="mb-5 text-2xl font-bold tracking-tight text-slate-900 sm:text-3xl">
            Explore remote jobs
          </h2>

          <div class="relative mb-10">
            <label class="sr-only" for="freelance-jobs-explore-search">Search skills</label>
            <input
              id="freelance-jobs-explore-search"
              v-model="exploreQuery"
              type="search"
              autocomplete="off"
              placeholder='Try skills like "PHP" or "JavaScript"'
              class="w-full rounded-xl border border-slate-200 bg-white py-3.5 pl-4 pr-12 text-base text-slate-900 shadow-sm outline-none placeholder:text-slate-400 focus:border-slate-300 focus:ring-2 focus:ring-slate-200/80"
            />
            <span
              class="pointer-events-none absolute right-4 top-1/2 -translate-y-1/2 text-slate-400"
              aria-hidden="true"
            >
              <svg class="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor" stroke-width="2">
                <path
                  stroke-linecap="round"
                  stroke-linejoin="round"
                  d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z"
                />
              </svg>
            </span>
          </div>

          <template v-for="group in filteredDirectory" :key="group.letter">
            <section
              v-if="group.items.length"
              :id="`letter-${group.letter === '0-9' ? '0-9' : group.letter}`"
              class="mb-12 scroll-mt-28 last:mb-0"
            >
              <h3 class="mb-4 text-lg font-bold text-slate-900 sm:text-xl">{{ group.letter }}</h3>
              <ul class="grid grid-cols-1 gap-x-10 gap-y-2.5 sm:grid-cols-2 lg:grid-cols-3">
                <li v-for="item in group.items" :key="item.slug + item.label">
                  <RouterLink
                    :to="item.to ?? `/freelance-jobs/${item.slug}`"
                    class="text-sm text-slate-500 transition-colors hover:text-slate-800"
                  >
                    {{ item.label }}
                  </RouterLink>
                </li>
              </ul>
            </section>
          </template>

          <p
            v-if="exploreQuery.trim() && !filteredDirectory.some((g) => g.items.length)"
            class="text-sm text-slate-500"
          >
            No skills match “{{ exploreQuery.trim() }}”. Try another search or
            <RouterLink to="/browse-jobs" class="font-medium text-green-600 hover:text-green-700">
              browse all jobs
            </RouterLink>
            .
          </p>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { computed, ref } from 'vue'
import { RouterLink, useRouter } from 'vue-router'
import {
  FREELANCE_JOBS_TYPE_OF_WORK,
  type FreelanceJobsTypeOfWorkOption,
  type FreelanceJobsDirectoryLetterGroup,
  getFreelanceJobsDirectoryByLetter,
} from '@/constants/freelance-jobs.landing'
import FreelanceJobsCategorySubnav from '@/modules/jobs/components/FreelanceJobsCategorySubnav.vue'

const router = useRouter()
const exploreQuery = ref('')

const directory = computed(() => getFreelanceJobsDirectoryByLetter())

const filteredDirectory = computed((): FreelanceJobsDirectoryLetterGroup[] => {
  const q = exploreQuery.value.trim().toLowerCase()
  if (!q) return directory.value
  return directory.value.map((group) => ({
    letter: group.letter,
    items: group.items.filter(
      (item) =>
        item.label.toLowerCase().includes(q) || item.slug.toLowerCase().includes(q),
    ),
  }))
})

function onTypeOfWorkChange(opt: FreelanceJobsTypeOfWorkOption): void {
  if (opt.id === 'any') return
  void router.push(opt.to)
}
</script>
