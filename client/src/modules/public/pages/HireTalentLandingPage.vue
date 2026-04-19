<template>
  <div v-if="entry" class="bg-white">
    <FreelanceJobsCategorySubnav
      context="hire"
      :current-slug="entry.slug"
      :use-category-urls="useCategoryHubUrls"
      hover-mega-menu
    />

    <!-- Hero -->
    <section class="bg-white">
      <div class="mx-auto max-w-7xl px-4 py-14 sm:px-6 sm:py-20 lg:px-8">
        <div class="mx-auto flex max-w-3xl flex-col items-center text-center">
          <h1 class="text-3xl font-bold tracking-tight text-slate-900 sm:text-4xl lg:text-[2.75rem] lg:leading-tight">
            Hire the best {{ entry.headlineRole }}
          </h1>
          <p class="mt-5 text-sm font-medium text-slate-900 sm:text-base">
            Clients rate our {{ entry.headlineRole }}
          </p>
          <div
            class="mt-2 flex flex-wrap items-center justify-center gap-1.5 sm:gap-2"
            role="img"
            aria-label="Client rating 4.8 out of 5 stars, based on 75,309 client reviews"
          >
            <svg
              v-for="i in 5"
              :key="i"
              class="h-5 w-5 shrink-0 fill-amber-400 text-amber-400"
              viewBox="0 0 24 24"
              aria-hidden="true"
            >
              <polygon points="12 2 15.09 8.26 22 9.27 17 14.14 18.18 21.02 12 17.77 5.82 21.02 7 14.14 2 9.27 8.91 8.26 12 2" />
            </svg>
            <span class="ml-0.5 text-sm font-semibold tabular-nums text-slate-900 sm:text-base">4.8/5</span>
          </div>
          <p class="mt-1 text-xs text-slate-500 sm:text-sm">Based on 75,309 client reviews</p>
          <div class="mt-8">
            <RouterLink
              :to="{ name: 'client-new-job-guided' }"
              class="inline-flex items-center justify-center rounded-xl bg-green-600 px-6 py-3 text-sm font-semibold text-white transition-colors hover:bg-green-700"
            >
              Hire Freelancers
            </RouterLink>
          </div>
        </div>
      </div>
    </section>

    <!-- Talent grid -->
    <section class="mx-auto max-w-7xl px-4 py-12 sm:px-6 lg:px-8" aria-labelledby="talent-heading">
      <div class="mb-8 flex flex-col gap-2 sm:flex-row sm:items-end sm:justify-between">
        <div>
          <h2 id="talent-heading" class="text-xl font-semibold text-slate-900 sm:text-2xl">
            Meet {{ entry.headlineRole.toLowerCase() }} on Downwork
          </h2>
          <p class="mt-1 text-sm text-slate-600">
            Sample profiles below—filters match this category to help you shortlist faster.
          </p>
        </div>
        <RouterLink :to="browseTalentQuery" class="text-sm font-semibold text-green-600 hover:text-green-700">
          See all in talent search →
        </RouterLink>
      </div>

      <div v-if="userStore.isLoading && !userStore.freelancersList.length" class="grid gap-5 sm:grid-cols-2" aria-busy="true">
        <div v-for="i in 6" :key="i" class="h-56 animate-pulse rounded-2xl bg-slate-100" />
      </div>
      <div v-else-if="userStore.error" class="rounded-2xl border border-dashed border-slate-200 py-16 text-center">
        <p class="text-slate-600">{{ userStore.error }}</p>
        <button
          type="button"
          class="mt-4 text-sm font-semibold text-green-600 hover:text-green-700"
          @click="loadTalent"
        >
          Try again
        </button>
      </div>
      <div v-else-if="!displayedFreelancers.length" class="rounded-2xl border border-dashed border-slate-200 py-16 text-center">
        <p class="text-slate-600">No profiles match this filter right now.</p>
        <RouterLink
          :to="{ name: 'talent-search' }"
          class="mt-4 inline-block text-sm font-semibold text-green-600 hover:text-green-700"
        >
          Browse all freelancers →
        </RouterLink>
      </div>
      <div v-else class="grid gap-5 sm:grid-cols-2">
        <FreelancerCard
          v-for="freelancer in displayedFreelancers"
          :key="freelancer.id"
          :freelancer="freelancer"
          @message="goMessages"
          @invite="goPostJob"
        />
      </div>
    </section>

    <!-- How it works -->
    <section class="bg-white py-16 sm:py-20" aria-labelledby="how-heading">
      <div class="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <h2 id="how-heading" class="text-2xl font-bold text-slate-900 sm:text-3xl">How it works</h2>
        <ol class="mt-12 grid list-none grid-cols-1 gap-12 p-0 sm:mt-14 sm:grid-cols-2 sm:gap-x-10 sm:gap-y-14 lg:grid-cols-4 lg:gap-x-8 lg:gap-y-0 xl:gap-x-12">
          <li class="text-left">
            <div class="mb-5 flex h-[7.5rem] items-end justify-start" aria-hidden="true">
              <svg class="h-[6.5rem] w-[5.5rem] shrink-0 drop-shadow-sm" viewBox="0 0 88 104" fill="none" xmlns="http://www.w3.org/2000/svg">
                <rect x="6" y="8" width="76" height="92" rx="10" fill="#f8fafc" stroke="#e2e8f0" stroke-width="2" />
                <rect x="14" y="16" width="60" height="14" rx="3" fill="#22c55e" />
                <rect x="14" y="38" width="52" height="5" rx="2" fill="#cbd5e1" />
                <rect x="14" y="48" width="60" height="5" rx="2" fill="#cbd5e1" />
                <rect x="14" y="58" width="44" height="5" rx="2" fill="#cbd5e1" />
                <rect x="14" y="72" width="60" height="5" rx="2" fill="#e2e8f0" />
                <rect x="14" y="82" width="36" height="5" rx="2" fill="#e2e8f0" />
                <rect x="28" y="20" width="32" height="6" rx="1.5" fill="white" opacity="0.35" />
                <rect x="28" y="28" width="20" height="4" rx="1" fill="white" opacity="0.25" />
              </svg>
            </div>
            <h3 class="text-base font-bold text-slate-900 sm:text-lg">Post a job for free</h3>
            <p class="mt-3 text-sm leading-relaxed text-slate-600 sm:text-[15px]">
              Tell us what you need. Write a clear job post with goals, timeline, and budget—then review proposals from matched freelancers.
            </p>
          </li>
          <li class="text-left">
            <div class="mb-5 flex h-[7.5rem] items-end justify-start" aria-hidden="true">
              <svg class="h-[6.5rem] w-[6rem] shrink-0 drop-shadow-sm" viewBox="0 0 96 104" fill="none" xmlns="http://www.w3.org/2000/svg">
                <rect x="8" y="12" width="80" height="84" rx="12" fill="#fef3c7" stroke="#fcd34d" stroke-width="2" />
                <circle cx="48" cy="42" r="14" fill="#fde68a" stroke="#f59e0b" stroke-width="1.5" />
                <circle cx="44" cy="40" r="1.5" fill="#b45309" />
                <circle cx="52" cy="40" r="1.5" fill="#b45309" />
                <path d="M42 48c2 3 10 3 12 0" stroke="#b45309" stroke-width="1.5" fill="none" stroke-linecap="round" />
                <rect x="28" y="58" width="40" height="6" rx="2" fill="#fcd34d" />
                <path
                  d="M62 78c6-4 12-2 14 4l-8 10c-4-6-10-10-18-10s-14 4-18 10l-8-10c2-6 8-8 14-4"
                  fill="#f472b6"
                  stroke="#db2777"
                  stroke-width="1"
                  stroke-linejoin="round"
                />
                <ellipse cx="52" cy="80" rx="10" ry="8" fill="#fbcfe8" />
              </svg>
            </div>
            <h3 class="text-base font-bold text-slate-900 sm:text-lg">Hire top talent fast</h3>
            <p class="mt-3 text-sm leading-relaxed text-slate-600 sm:text-[15px]">
              Consult, interview, and hire quickly so you can move forward with freelancers who fit your stack and timeline.
            </p>
          </li>
          <li class="text-left">
            <div class="mb-5 flex h-[7.5rem] items-end justify-start" aria-hidden="true">
              <svg class="h-[6.5rem] w-[6.5rem] shrink-0 drop-shadow-sm" viewBox="0 0 104 104" fill="none" xmlns="http://www.w3.org/2000/svg">
                <rect x="10" y="18" width="84" height="56" rx="8" fill="#e0f2fe" stroke="#38bdf8" stroke-width="2" />
                <rect x="42" y="78" width="20" height="6" rx="2" fill="#94a3b8" />
                <rect x="32" y="84" width="40" height="4" rx="2" fill="#cbd5e1" />
                <path d="M24 36h36M24 46h48M24 56h32" stroke="#bae6fd" stroke-width="3" stroke-linecap="round" />
                <rect x="52" y="28" width="36" height="26" rx="6" fill="#22c55e" />
                <path d="M62 40h16M62 46h12" stroke="white" stroke-width="2" stroke-linecap="round" opacity="0.95" />
              </svg>
            </div>
            <h3 class="text-base font-bold text-slate-900 sm:text-lg">Collaborate easily</h3>
            <p class="mt-3 text-sm leading-relaxed text-slate-600 sm:text-[15px]">
              Message, share files, and track milestones in Downwork so everyone stays aligned without juggling extra tools.
            </p>
          </li>
          <li class="text-left">
            <div class="mb-5 flex h-[7.5rem] items-end justify-start" aria-hidden="true">
              <svg class="h-[6.5rem] w-[6rem] shrink-0 drop-shadow-sm" viewBox="0 0 96 104" fill="none" xmlns="http://www.w3.org/2000/svg">
                <rect x="14" y="16" width="68" height="88" rx="14" fill="#f1f5f9" stroke="#cbd5e1" stroke-width="2" />
                <rect x="24" y="28" width="48" height="32" rx="6" fill="white" stroke="#e2e8f0" stroke-width="1.5" />
                <rect x="30" y="36" width="20" height="14" rx="2" fill="#22c55e" opacity="0.85" />
                <rect x="54" y="36" width="12" height="4" rx="1" fill="#cbd5e1" />
                <rect x="54" y="44" width="12" height="4" rx="1" fill="#cbd5e1" />
                <circle cx="48" cy="78" r="16" fill="#fcd34d" stroke="#f59e0b" stroke-width="2" />
                <circle cx="48" cy="78" r="6" fill="#fbbf24" stroke="#d97706" stroke-width="1" />
              </svg>
            </div>
            <h3 class="text-base font-bold text-slate-900 sm:text-lg">Payment simplified</h3>
            <p class="mt-3 text-sm leading-relaxed text-slate-600 sm:text-[15px]">
              Manage payments in one place with hourly or milestone billing—only pay for work you approve.
            </p>
          </li>
        </ol>
      </div>
    </section>
  </div>
</template>

<script setup lang="ts">
import { computed, watch } from 'vue'
import { RouterLink, useRoute, useRouter } from 'vue-router'
import {
  getHireTalentLanding,
  resolveHireCategorySlug,
  type HireTalentLandingEntry,
} from '@/constants/hire-talent.landing'
import { useUserStore } from '@/stores/user.store'
import { useAuthStore } from '@/stores/auth.store'
import FreelancerCard from '@/modules/public/components/FreelancerCard.vue'
import FreelanceJobsCategorySubnav from '@/modules/jobs/components/FreelanceJobsCategorySubnav.vue'

const route = useRoute()
const router = useRouter()
const userStore = useUserStore()
const auth = useAuthStore()

/** Hub landings use `/category/:slug`; keep tab targets on that path (not `/hire/...`). */
const useCategoryHubUrls = computed(() => route.name === 'hire-talent-category')

const entry = computed((): HireTalentLandingEntry | undefined => {
  const raw = typeof route.params.slug === 'string' ? route.params.slug : ''
  const slug = resolveHireCategorySlug(raw)
  return getHireTalentLanding(slug)
})

const browseTalentQuery = computed(() => {
  const e = entry.value
  if (!e) return { name: 'talent-search' as const }
  const query: Record<string, string> = {}
  if (e.talentFilters.category) query.category = e.talentFilters.category
  if (e.talentFilters.search) query.q = e.talentFilters.search
  return { name: 'talent-search' as const, query }
})

const displayedFreelancers = computed(() => userStore.freelancersList.slice(0, 6))

function loadTalent(): void {
  const e = entry.value
  if (!e) return
  void userStore.fetchFreelancers({
    category: e.talentFilters.category,
    search: e.talentFilters.search,
    limit: 12,
    page: 1,
  })
}

watch(
  () => route.params.slug,
  () => {
    loadTalent()
  },
  { immediate: true },
)

function goMessages(): void {
  if (auth.isAuthenticated) {
    const map: Record<string, string> = {
      freelancer: '/freelancer/messages',
      client: '/client/messages',
      admin: '/admin/messages',
    }
    void router.push(map[auth.role] ?? '/auth/login')
    return
  }
  void router.push({ path: '/auth/login', query: { redirect: route.fullPath } })
}

function goPostJob(): void {
  if (auth.isAuthenticated && auth.role === 'client') {
    void router.push({ name: 'client-new-job-guided' })
    return
  }
  void router.push('/auth/login')
}
</script>
