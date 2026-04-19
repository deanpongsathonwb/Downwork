<template>
  <div class="text-slate-900">
    <!-- Hero -->
    <section class="relative overflow-hidden bg-[#f2f2f2] pb-16 pt-14 sm:pt-20">
      <div class="pointer-events-none absolute inset-0 opacity-[0.35]" aria-hidden="true">
        <svg
          class="absolute -top-24 left-1/2 h-[420px] w-[140%] max-w-none -translate-x-1/2 text-white/80"
          viewBox="0 0 1440 320"
          fill="none"
          xmlns="http://www.w3.org/2000/svg"
        >
          <path
            d="M0 160C240 60 480 220 720 140C960 60 1200 200 1440 100V320H0V160Z"
            fill="currentColor"
          />
          <path
            d="M0 200C200 120 400 260 600 180C800 100 1000 240 1200 160C1280 130 1360 90 1440 70V320H0V200Z"
            fill="white"
            fill-opacity="0.4"
          />
        </svg>
      </div>

      <div class="relative mx-auto max-w-6xl px-4 sm:px-6 lg:px-8">
        <h1
          class="text-center text-3xl font-bold tracking-tight text-slate-900 sm:text-4xl lg:text-[2.75rem] lg:leading-tight"
        >
          Pricing plans for every business
        </h1>
        <p class="mt-4 text-center text-base text-slate-600">
          Just looking?
          <RouterLink
            to="/auth/signup"
            class="font-medium text-[#14a800] underline decoration-[#14a800]/30 underline-offset-2 hover:decoration-[#14a800]"
          >
            Join as a freelancer
          </RouterLink>
        </p>

        <div class="mx-auto mt-12 grid max-w-4xl gap-6 md:grid-cols-2 md:gap-8">
          <article
            class="flex flex-col rounded-2xl border border-slate-200/80 bg-white p-8 shadow-sm"
          >
            <h2 class="text-xl font-bold text-slate-900">Basic</h2>
            <p class="mt-1 text-sm text-slate-600">For starting out</p>
            <p class="mt-4 text-lg font-semibold text-slate-900">5% Service fee</p>
            <RouterLink
              to="/auth/signup"
              class="mt-6 inline-flex h-11 items-center justify-center rounded-full border-2 border-[#14a800] px-6 text-sm font-semibold text-[#14a800] transition-colors hover:bg-[#14a800]/5"
            >
              Start with this plan
            </RouterLink>
            <p class="mt-8 text-sm font-semibold text-slate-900">Basic plan includes:</p>
            <ul class="mt-3 space-y-2.5 text-sm text-slate-600">
              <li v-for="item in basicPlanFeatures" :key="item" class="flex gap-2">
                <span
                  class="mt-1.5 h-1 w-1 shrink-0 rounded-full bg-slate-400"
                  aria-hidden="true"
                />
                <span>{{ item }}</span>
              </li>
            </ul>
          </article>

          <article
            class="flex flex-col rounded-2xl border border-slate-200/80 bg-white p-8 shadow-md ring-1 ring-slate-900/5"
          >
            <h2 class="text-xl font-bold text-slate-900">Business Plus</h2>
            <p class="mt-1 text-sm text-slate-600">For growing</p>
            <p class="mt-4 text-lg font-semibold text-slate-900">10% Service fee</p>
            <RouterLink
              to="/auth/signup"
              class="mt-6 inline-flex h-11 items-center justify-center rounded-full bg-[#14a800] px-6 text-sm font-semibold text-white transition-colors hover:bg-[#118f00]"
            >
              Sign up for free
            </RouterLink>
            <p class="mt-8 text-sm font-semibold text-slate-900">Everything in Basic, plus</p>
            <ul class="mt-3 space-y-2.5 text-sm text-slate-600">
              <li v-for="item in businessPlusFeatures" :key="item" class="flex gap-2">
                <span
                  class="mt-1.5 h-1 w-1 shrink-0 rounded-full bg-slate-400"
                  aria-hidden="true"
                />
                <span>{{ item }}</span>
              </li>
            </ul>
          </article>
        </div>
      </div>
    </section>

    <!-- Key features comparison: one unified card per plan column (subgrid alignment) -->
    <section class="bg-white py-14 sm:py-16 lg:py-20">
      <div class="mx-auto max-w-6xl px-4 sm:px-6 lg:px-8">
        <div
          class="-mx-4 overflow-x-auto px-4 sm:mx-0 sm:overflow-visible sm:px-0"
        >
          <div
            class="compare-root grid min-w-[680px] gap-x-3 text-left sm:gap-x-4"
            :style="{
              gridTemplateColumns: 'minmax(0,38%) minmax(0,31%) minmax(0,31%)',
              gridTemplateRows: `repeat(${compareRowCount}, auto)`,
            }"
          >
            <!-- Labels column -->
            <div
              class="compare-col-labels grid [grid-column:1] [grid-row:1/-1] [grid-template-rows:subgrid]"
            >
              <div
                class="border-b border-slate-200 pb-6 pr-6 text-2xl font-bold tracking-tight text-slate-900 sm:text-3xl"
              >
                Key features
              </div>
              <template v-for="(block, blockIndex) in keyFeatureBlocks" :key="block.title">
                <div
                  :class="[
                    'pr-6 align-top text-base font-bold leading-snug text-slate-900 sm:text-[1.0625rem]',
                    blockIndex === 0
                      ? 'pb-2 pt-6 sm:pt-8'
                      : 'border-t border-slate-200 pb-2 pt-8 sm:pt-10',
                  ]"
                >
                  {{ block.title }}
                </div>
                <div
                  v-for="row in block.rows"
                  :key="row.label"
                  class="py-3 pr-6 text-sm leading-snug text-slate-800 sm:py-3.5 sm:text-[0.9375rem]"
                >
                  <span class="inline-flex items-start gap-1.5">
                    <span>{{ row.label }}</span>
                    <span
                      v-if="row.info"
                      class="relative top-px inline-flex shrink-0 cursor-help text-slate-400"
                      :title="row.info"
                      role="img"
                      :aria-label="row.info"
                    >
                      <svg
                        class="h-4 w-4"
                        viewBox="0 0 24 24"
                        fill="none"
                        stroke="currentColor"
                        stroke-width="2"
                        stroke-linecap="round"
                        stroke-linejoin="round"
                        aria-hidden="true"
                      >
                        <circle cx="12" cy="12" r="10" />
                        <path d="M12 16v-4M12 8h.01" />
                      </svg>
                    </span>
                  </span>
                </div>
              </template>
            </div>

            <!-- Basic: single card wrapping header + all rows -->
            <article
              class="compare-plan-card compare-plan-card--basic grid overflow-hidden rounded-2xl border border-[#d9d9d9] bg-white shadow-sm [grid-column:2] [grid-row:1/-1] [grid-template-rows:subgrid]"
            >
              <div class="border-b border-slate-200 px-4 pb-6 pt-1 sm:px-5">
                <div class="mx-auto w-full max-w-[220px] space-y-1 text-center">
                  <div class="text-xl font-bold text-slate-900">Basic</div>
                  <p class="text-sm text-slate-500">5% Service fee</p>
                  <RouterLink
                    to="/auth/signup"
                    class="mt-4 inline-flex h-10 w-full items-center justify-center rounded-full bg-[#14a800] px-5 text-sm font-semibold text-white transition-colors hover:bg-[#118f00] sm:h-11"
                  >
                    Sign up
                  </RouterLink>
                </div>
              </div>
              <template v-for="(block, blockIndex) in keyFeatureBlocks" :key="'b-' + block.title">
                <div
                  :class="[
                    'px-4 py-3 sm:px-5',
                    blockIndex > 0 ? 'border-t border-slate-200' : '',
                  ]"
                  aria-hidden="true"
                />
                <div
                  v-for="(row, rowIndex) in block.rows"
                  :key="'bb-' + row.label"
                  :class="[
                    'flex items-center justify-center px-4 py-3 text-center text-sm text-slate-800 sm:px-5 sm:py-3.5 sm:text-[0.9375rem]',
                    isLastCompareRow(blockIndex, rowIndex) ? 'pb-5' : '',
                  ]"
                >
                  <template v-if="row.basic === 'check'">
                    <span
                      class="inline-flex w-full justify-center text-[#2563eb]"
                      aria-label="Included"
                    >
                      <svg
                        class="h-5 w-5 shrink-0"
                        viewBox="0 0 20 20"
                        fill="none"
                        stroke="currentColor"
                        stroke-width="2"
                        stroke-linecap="round"
                        stroke-linejoin="round"
                        aria-hidden="true"
                      >
                        <path d="M16.667 5 7.5 14.167 3.333 10" />
                      </svg>
                    </span>
                  </template>
                  <span
                    v-else-if="row.basic !== 'empty'"
                    class="font-medium tabular-nums text-slate-800"
                  >
                    {{ row.basic }}
                  </span>
                  <span v-else class="mx-auto block min-h-[1.25rem] w-0" aria-hidden="true" />
                </div>
              </template>
            </article>

            <!-- Business Plus: single card -->
            <article
              class="compare-plan-card compare-plan-card--plus grid overflow-hidden rounded-2xl border border-[#9dce96] bg-[#f6fbf4] shadow-sm [grid-column:3] [grid-row:1/-1] [grid-template-rows:subgrid]"
            >
              <div class="border-b border-slate-200 px-4 pb-6 pt-1 sm:px-5">
                <div class="mx-auto w-full max-w-[220px] space-y-1 text-center">
                  <div class="text-xl font-bold text-slate-900">Business Plus</div>
                  <p class="text-sm text-slate-500">10% Service fee</p>
                  <RouterLink
                    to="/auth/signup"
                    class="mt-4 inline-flex h-10 w-full items-center justify-center rounded-full bg-[#14a800] px-5 text-sm font-semibold text-white transition-colors hover:bg-[#118f00] sm:h-11"
                  >
                    Sign up
                  </RouterLink>
                </div>
              </div>
              <template v-for="(block, blockIndex) in keyFeatureBlocks" :key="'p-' + block.title">
                <div
                  :class="[
                    'px-4 py-3 sm:px-5',
                    blockIndex > 0 ? 'border-t border-slate-200' : '',
                  ]"
                  aria-hidden="true"
                />
                <div
                  v-for="(row, rowIndex) in block.rows"
                  :key="'bp-' + row.label"
                  :class="[
                    'flex items-center justify-center px-4 py-3 text-center text-sm text-slate-800 sm:px-5 sm:py-3.5 sm:text-[0.9375rem]',
                    isLastCompareRow(blockIndex, rowIndex) ? 'pb-5' : '',
                  ]"
                >
                  <template v-if="row.plus === 'check'">
                    <span
                      class="inline-flex w-full justify-center text-[#2563eb]"
                      aria-label="Included"
                    >
                      <svg
                        class="h-5 w-5 shrink-0"
                        viewBox="0 0 20 20"
                        fill="none"
                        stroke="currentColor"
                        stroke-width="2"
                        stroke-linecap="round"
                        stroke-linejoin="round"
                        aria-hidden="true"
                      >
                        <path d="M16.667 5 7.5 14.167 3.333 10" />
                      </svg>
                    </span>
                  </template>
                  <span
                    v-else-if="row.plus !== 'empty'"
                    class="font-medium tabular-nums text-slate-800"
                  >
                    {{ row.plus }}
                  </span>
                  <span v-else class="mx-auto block min-h-[1.25rem] w-0" aria-hidden="true" />
                </div>
              </template>
            </article>
          </div>
        </div>
      </div>
    </section>

    <!-- FAQ -->
    <section class="mx-auto max-w-6xl px-4 pb-20 sm:px-6 lg:px-8">
      <div class="rounded-2xl bg-[#f2f2f2] p-8 sm:p-10 lg:p-12">
        <div class="grid gap-10 lg:grid-cols-12 lg:gap-12">
          <div class="lg:col-span-4">
            <h2 class="text-3xl font-bold text-slate-900 sm:text-[2rem] sm:leading-snug">
              Frequently asked questions
            </h2>
          </div>
          <div class="divide-y divide-[#e0e0e0] lg:col-span-8">
            <div v-for="item in faqItems" :key="item.q" class="py-8 first:pt-0">
              <h3
                class="text-xl font-semibold leading-snug text-[#222] sm:text-2xl sm:leading-snug"
              >
                {{ item.q }}
              </h3>
              <p class="mt-3 text-[0.9375rem] leading-relaxed text-slate-600 sm:text-base">
                {{ item.a }}
              </p>
              <RouterLink
                v-if="item.more"
                :to="item.more"
                class="mt-4 inline-block text-sm font-medium text-[#14a800] no-underline hover:underline"
              >
                Read more
              </RouterLink>
            </div>
          </div>
        </div>
      </div>
    </section>
  </div>
</template>

<script setup lang="ts">
import { computed } from 'vue'
import { RouterLink } from 'vue-router'
import { APP_CONFIG } from '@/config/app.config'

const brand = APP_CONFIG.name

type CompareCellValue = 'check' | 'empty' | string

interface KeyFeatureRow {
  label: string
  info?: string
  basic: CompareCellValue
  plus: CompareCellValue
}

interface KeyFeatureBlock {
  title: string
  rows: KeyFeatureRow[]
}

const keyFeatureBlocks: KeyFeatureBlock[] = [
  {
    title: 'Discover quality talent',
    rows: [
      {
        label: `Access to ${brand}'s global talent marketplace`,
        basic: 'check',
        plus: 'check',
      },
      { label: 'Talent ID verified', basic: 'check', plus: 'check' },
      {
        label: `Verified freelancer work history and reviews`,
        basic: 'check',
        plus: 'check',
      },
      {
        label: 'Top Rated and Rising Talent search filter',
        basic: 'check',
        plus: 'check',
      },
      {
        label: 'Expert-Vetted talent',
        info: 'Curated experts vetted by our team. Included with Business Plus.',
        basic: 'empty',
        plus: 'check',
      },
    ],
  },
  {
    title: 'Engage the right candidates',
    rows: [
      { label: 'Job post generator', basic: 'check', plus: 'check' },
      {
        label: 'Invites per job post',
        basic: '30 invites',
        plus: '80 invites',
      },
      {
        label: 'Direct messages',
        basic: '5/day',
        plus: '15/day',
      },
      {
        label: 'Direct contracts',
        info: 'Contract and pay freelancers directly where supported for your account.',
        basic: 'check',
        plus: 'check',
      },
      {
        label: `${brand} Recruiter`,
        info: 'Dedicated recruiting support to help you hire faster on Business Plus.',
        basic: 'empty',
        plus: 'check',
      },
    ],
  },
  {
    title: 'Collaborate and hire',
    rows: [
      {
        label: 'Chat, share files, and voice & video calls',
        basic: 'check',
        plus: 'check',
      },
      {
        label: 'Timesheets and work diary',
        basic: 'check',
        plus: 'check',
      },
      {
        label: 'Milestones, contracts, and scope in one workspace',
        basic: 'check',
        plus: 'check',
      },
    ],
  },
  {
    title: 'Manage and pay',
    rows: [
      {
        label: 'Contract initiation',
        info: 'Fees may apply when starting certain contract types. See billing for details.',
        basic: 'check',
        plus: 'check',
      },
      { label: 'Standard reporting', basic: 'check', plus: 'check' },
      { label: 'Advanced reporting', basic: 'empty', plus: 'check' },
      {
        label: 'Team billing and purchase controls',
        basic: 'empty',
        plus: 'check',
      },
    ],
  },
  {
    title: 'Receive support',
    rows: [
      {
        label: 'Customer support',
        basic: 'Standard',
        plus: 'Premium 24/7',
      },
      { label: 'API access', basic: 'empty', plus: 'check' },
    ],
  },
]

/** Rows for the comparison grid: 1 header row + per block (title row + feature rows). */
const compareRowCount = computed(() => {
  let n = 1
  for (const b of keyFeatureBlocks) {
    n += 1 + b.rows.length
  }
  return n
})

function isLastCompareRow(blockIndex: number, rowIndex: number): boolean {
  const bi = keyFeatureBlocks.length - 1
  if (blockIndex !== bi) return false
  return rowIndex === keyFeatureBlocks[bi].rows.length - 1
}

const basicPlanFeatures = [
  `${brand}'s global freelance marketplace`,
  'Access to all payment features',
  'Collaboration and project tracking tools',
  'Standard reporting',
  'Pay as work is completed',
  '30 invites per job post',
]

const businessPlusFeatures = [
  'Instant access to pre-vetted top 1% of talent',
  `${brand} Recruiter`,
  'Team controls',
  'Advanced reporting',
  'Priority 24/7 support',
  'Pay by bill',
  '60 invites per job post',
  '15 direct messages per day',
]

const faqItems = [
  {
    q: `What is ${brand}'s client service fee and how is it calculated?`,
    a: `The client service fee is a percentage of what you pay freelancers through ${brand}. It covers marketplace operations, payments, and support. Your plan (Basic or Business Plus) determines the rate shown above.`,
    more: '/privacy-policy' as const,
  },
  {
    q: 'When do I pay a client service fee?',
    a: 'Fees apply when you pay for completed work or approved milestones. You only pay when money moves to your freelancer.',
    more: '/privacy-policy' as const,
  },
  {
    q: 'Can I change my plan later on?',
    a: 'Yes. You can move between plans as your hiring needs change. Any rate change typically applies to new contracts going forward.',
    more: '/privacy-policy' as const,
  },
  {
    q: 'What payment methods do you accept?',
    a: 'We support major credit and debit cards and other methods shown at checkout, depending on your region.',
    more: '/privacy-policy' as const,
  },
  {
    q: 'Are there any other fees?',
    a: 'Optional add-ons, currency conversion, or third-party services may incur separate charges. See checkout and your invoice for details.',
    more: '/privacy-policy' as const,
  },
  {
    q: 'How do I get 30-day payment terms?',
    a: '30-day terms may be available on Business Plus for eligible businesses after verification. Contact support to apply.',
    more: '/privacy-policy' as const,
  },
]
</script>
