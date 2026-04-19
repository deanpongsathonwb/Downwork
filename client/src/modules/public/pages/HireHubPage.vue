<template>
  <div class="bg-white text-slate-900">
    <FreelanceJobsCategorySubnav context="hire" current-slug="" use-category-urls hover-mega-menu />

    <!-- Hero -->
    <section class="relative">
      <div class="mx-auto max-w-7xl px-4 pb-12 pt-2 sm:px-6 sm:pb-16 lg:px-8 lg:pb-20">
        <div class="relative mx-auto max-w-7xl lg:min-h-[28rem]">
          <div
            class="lg:grid lg:grid-cols-[1fr_minmax(0,36rem)_1fr] lg:items-center lg:gap-x-3 xl:gap-x-6 2xl:gap-x-10"
          >
            <!-- Left: card 1 top-right; cards 2 & 3 staggered (upper-left → lower-right) -->
            <div
              class="pointer-events-none relative hidden h-[28rem] w-full max-w-[22rem] justify-self-end lg:block"
              aria-hidden="true"
            >
              <article
                class="absolute right-0 top-0 flex aspect-square w-[9.75rem] flex-col items-center justify-center gap-2 rounded-3xl border border-slate-100 bg-white px-3 py-4 text-center shadow-[0_12px_40px_-12px_rgba(15,23,42,0.18)] sm:w-[10.25rem]"
                style="transform: rotate(2deg)"
              >
                <img
                  :src="heroCardsLeft[0]!.photo"
                  alt=""
                  width="52"
                  height="52"
                  class="h-[3.25rem] w-[3.25rem] shrink-0 rounded-full object-cover ring-1 ring-slate-100"
                  loading="lazy"
                />
                <div class="min-w-0 px-0.5">
                  <p class="text-sm font-semibold leading-tight text-slate-900">{{ heroCardsLeft[0]!.name }}</p>
                  <p class="mt-1 line-clamp-2 text-xs leading-snug text-slate-600">{{ heroCardsLeft[0]!.title }}</p>
                </div>
              </article>
              <div
                class="absolute right-0 top-[11.75rem] h-[14.5rem] w-[20.5rem] max-w-[calc(100%+0.5rem)]"
              >
                <article
                  class="absolute left-0 top-0 flex aspect-square w-[9.75rem] flex-col items-center justify-center gap-2 rounded-3xl border border-slate-100 bg-white px-3 py-4 text-center shadow-[0_12px_40px_-12px_rgba(15,23,42,0.18)] sm:w-[10.25rem]"
                  style="transform: rotate(-2deg)"
                >
                  <img
                    :src="heroCardsLeft[1]!.photo"
                    alt=""
                    width="52"
                    height="52"
                    class="h-[3.25rem] w-[3.25rem] shrink-0 rounded-full object-cover ring-1 ring-slate-100"
                    loading="lazy"
                  />
                  <div class="min-w-0 px-0.5">
                    <p class="text-sm font-semibold leading-tight text-slate-900">{{ heroCardsLeft[1]!.name }}</p>
                    <p class="mt-1 line-clamp-2 text-xs leading-snug text-slate-600">{{ heroCardsLeft[1]!.title }}</p>
                  </div>
                </article>
                <article
                  class="absolute left-[11.5rem] top-[3.5rem] flex aspect-square w-[9.75rem] flex-col items-center justify-center gap-2 rounded-3xl border border-slate-100 bg-white px-3 py-4 text-center shadow-[0_12px_40px_-12px_rgba(15,23,42,0.18)] sm:left-[11.75rem] sm:w-[10.25rem]"
                  style="transform: rotate(2deg)"
                >
                  <img
                    :src="heroCardsLeft[2]!.photo"
                    alt=""
                    width="52"
                    height="52"
                    class="h-[3.25rem] w-[3.25rem] shrink-0 rounded-full object-cover ring-1 ring-slate-100"
                    loading="lazy"
                  />
                  <div class="min-w-0 px-0.5">
                    <p class="text-sm font-semibold leading-tight text-slate-900">{{ heroCardsLeft[2]!.name }}</p>
                    <p class="mt-1 line-clamp-2 text-xs leading-snug text-slate-600">{{ heroCardsLeft[2]!.title }}</p>
                  </div>
                </article>
              </div>
            </div>

            <div
              class="relative z-10 mx-auto flex max-w-3xl flex-col items-center px-2 text-center lg:mx-0 lg:max-w-none lg:px-4 lg:pt-6"
            >
              <h1
                class="text-[1.65rem] font-bold leading-tight tracking-tight text-slate-900 sm:text-4xl lg:text-[2.65rem] lg:leading-[1.12]"
              >
                Hire proven freelancers who deliver results
              </h1>
              <p class="mt-4 max-w-2xl text-sm leading-relaxed text-slate-600 sm:text-base">
                Post a job, get bids immediately. See verified work history, reviews, certifications. Hire in a few
                clicks. 1M+ jobs &amp; reviews completed.
              </p>
              <div class="mt-8">
                <RouterLink
                  :to="{ name: 'talent-search' }"
                  class="inline-flex min-h-11 items-center justify-center rounded-full bg-[#14a800] px-8 text-sm font-semibold text-white shadow-sm transition-colors hover:bg-[#118f00]"
                >
                  Browse freelancers
                </RouterLink>
              </div>
            </div>

            <!-- Right: card 1 top-left; cards 2 & 3 staggered (upper-left → lower-right) -->
            <div
              class="pointer-events-none relative hidden h-[28rem] w-full max-w-[22rem] justify-self-start lg:block"
              aria-hidden="true"
            >
              <article
                class="absolute left-0 top-0 flex aspect-square w-[9.75rem] flex-col items-center justify-center gap-2 rounded-3xl border border-slate-100 bg-white px-3 py-4 text-center shadow-[0_12px_40px_-12px_rgba(15,23,42,0.18)] sm:w-[10.25rem]"
                style="transform: rotate(-2deg)"
              >
                <img
                  :src="heroCardsRight[0]!.photo"
                  alt=""
                  width="52"
                  height="52"
                  class="h-[3.25rem] w-[3.25rem] shrink-0 rounded-full object-cover ring-1 ring-slate-100"
                  loading="lazy"
                />
                <div class="min-w-0 px-0.5">
                  <p class="text-sm font-semibold leading-tight text-slate-900">{{ heroCardsRight[0]!.name }}</p>
                  <p class="mt-1 line-clamp-2 text-xs leading-snug text-slate-600">{{ heroCardsRight[0]!.title }}</p>
                </div>
              </article>
              <!-- Same vertical offset as left (top card → pair gap); pair anchored to headline side -->
              <div class="absolute left-0 top-[9.75rem] h-[14.5rem] w-[20.5rem] max-w-full">
                <article
                  class="absolute left-[11.5rem] top-0 flex aspect-square w-[9.75rem] flex-col items-center justify-center gap-2 rounded-3xl border border-slate-100 bg-white px-3 py-4 text-center shadow-[0_12px_40px_-12px_rgba(15,23,42,0.18)] sm:left-[11.75rem] sm:w-[10.25rem]"
                  style="transform: rotate(2deg)"
                >
                  <img
                    :src="heroCardsRight[1]!.photo"
                    alt=""
                    width="52"
                    height="52"
                    class="h-[3.25rem] w-[3.25rem] shrink-0 rounded-full object-cover ring-1 ring-slate-100"
                    loading="lazy"
                  />
                  <div class="min-w-0 px-0.5">
                    <p class="text-sm font-semibold leading-tight text-slate-900">{{ heroCardsRight[1]!.name }}</p>
                    <p class="mt-1 line-clamp-2 text-xs leading-snug text-slate-600">{{ heroCardsRight[1]!.title }}</p>
                  </div>
                </article>
                <article
                  class="absolute left-0 top-[3.5rem] flex aspect-square w-[9.75rem] flex-col items-center justify-center gap-2 rounded-3xl border border-slate-100 bg-white px-3 py-4 text-center shadow-[0_12px_40px_-12px_rgba(15,23,42,0.18)] sm:w-[10.25rem]"
                  style="transform: rotate(-2deg)"
                >
                  <img
                    :src="heroCardsRight[2]!.photo"
                    alt=""
                    width="52"
                    height="52"
                    class="h-[3.25rem] w-[3.25rem] shrink-0 rounded-full object-cover ring-1 ring-slate-100"
                    loading="lazy"
                  />
                  <div class="min-w-0 px-0.5">
                    <p class="text-sm font-semibold leading-tight text-slate-900">{{ heroCardsRight[2]!.name }}</p>
                    <p class="mt-1 line-clamp-2 text-xs leading-snug text-slate-600">{{ heroCardsRight[2]!.title }}</p>
                  </div>
                </article>
              </div>
            </div>
          </div>

          <!-- Mobile / tablet cards -->
          <div
            class="mx-auto mt-10 grid max-w-lg grid-cols-2 gap-3 sm:grid-cols-3 lg:hidden"
            aria-hidden="true"
          >
            <article
              v-for="card in heroCards"
              :key="`m-${card.name}`"
              class="mx-auto flex aspect-square w-full max-w-[9.5rem] flex-col items-center justify-center gap-1.5 rounded-3xl border border-slate-100 bg-white px-2 py-3 text-center shadow-md"
            >
              <img
                :src="card.photo"
                alt=""
                width="44"
                height="44"
                class="h-11 w-11 shrink-0 rounded-full object-cover ring-1 ring-slate-100"
                loading="lazy"
              />
              <div class="min-w-0 px-0.5">
                <p class="text-xs font-semibold leading-tight text-slate-900">{{ card.name }}</p>
                <p class="mt-0.5 line-clamp-2 text-[11px] leading-snug text-slate-600">{{ card.title }}</p>
              </div>
            </article>
          </div>
        </div>
      </div>
    </section>

    <!-- Value props -->
    <section class="bg-white py-14 sm:py-16" aria-labelledby="safe-hire-heading">
      <div class="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <h2 id="safe-hire-heading" class="max-w-xl text-2xl font-bold tracking-tight text-slate-900 sm:text-3xl">
          Safe and secure hiring, for any size of work
        </h2>
        <ul class="mt-10 grid list-none grid-cols-1 gap-10 p-0 sm:grid-cols-3 sm:gap-8 lg:gap-12">
          <li v-for="item in valueProps" :key="item.title">
            <div class="flex h-11 w-11 items-center justify-center rounded-full bg-[#14a800]/10 text-[#14a800]">
              <component :is="item.icon" />
            </div>
            <h3 class="mt-4 text-base font-bold text-slate-900 sm:text-lg">{{ item.title }}</h3>
            <p class="mt-2 text-sm leading-relaxed text-slate-600 sm:text-[15px]">
              {{ item.body }}
            </p>
          </li>
        </ul>
      </div>
    </section>

    <!-- Category accordion -->
    <section class="bg-slate-50/80 py-14 sm:py-16" aria-labelledby="categories-heading">
      <div class="mx-auto max-w-3xl px-4 sm:px-6 lg:px-8">
        <h2 id="categories-heading" class="text-center text-2xl font-bold text-slate-900 sm:text-3xl">
          Choose a category to see popular skills for hire
        </h2>

        <div class="mt-8 flex justify-center gap-3">
          <button
            type="button"
            class="rounded-full px-5 py-2 text-sm font-semibold transition-colors"
            :class="
              hireMode === 'solo'
                ? 'bg-[#14a800] text-white shadow-sm'
                : 'border-2 border-[#14a800] bg-white text-[#14a800] hover:bg-green-50'
            "
            @click="hireMode = 'solo'"
          >
            Solo professionals
          </button>
          <button
            type="button"
            class="rounded-full px-5 py-2 text-sm font-semibold transition-colors"
            :class="
              hireMode === 'teams'
                ? 'bg-[#14a800] text-white shadow-sm'
                : 'border-2 border-[#14a800] bg-white text-[#14a800] hover:bg-green-50'
            "
            @click="hireMode = 'teams'"
          >
            Teams
          </button>
        </div>

        <p class="mx-auto mt-5 max-w-lg text-center text-sm text-slate-600">
          {{
            hireMode === 'solo'
              ? 'Hiring a professional is great for growing your team or working on a project.'
              : 'Agencies and studios can scale delivery with a coordinated team and shared workflows.'
          }}
        </p>

        <ul class="mt-10 space-y-0 divide-y divide-slate-200 rounded-2xl border border-slate-200 bg-white px-1 shadow-sm">
          <li v-for="cat in accordionCategories" :key="cat.id">
            <button
              type="button"
              class="flex w-full items-center gap-3 px-4 py-4 text-left transition-colors hover:bg-slate-50 sm:px-5"
              :aria-expanded="openAccordion === cat.id"
              @click="toggleAccordion(cat.id)"
            >
              <svg
                class="h-5 w-5 shrink-0 text-slate-500 transition-transform duration-200"
                :class="openAccordion === cat.id ? 'rotate-180' : ''"
                viewBox="0 0 20 20"
                fill="currentColor"
                aria-hidden="true"
              >
                <path
                  fill-rule="evenodd"
                  d="M5.293 7.293a1 1 0 011.414 0L10 10.586l3.293-3.293a1 1 0 111.414 1.414l-4 4a1 1 0 01-1.414 0l-4-4a1 1 0 010-1.414z"
                  clip-rule="evenodd"
                />
              </svg>
              <span class="text-sm font-semibold text-slate-900 sm:text-base">{{ cat.label }}</span>
            </button>
            <div
              v-show="openAccordion === cat.id"
              class="border-t border-slate-100 px-4 pb-5 pt-1 sm:px-5 sm:pl-14"
            >
              <ul class="flex flex-col gap-2 sm:grid sm:grid-cols-2">
                <li v-for="link in cat.links" :key="link.label">
                  <RouterLink
                    :to="link.to"
                    class="text-sm font-medium text-[#14a800] hover:text-[#118f00] hover:underline"
                  >
                    {{ link.label }}
                  </RouterLink>
                </li>
              </ul>
            </div>
          </li>
        </ul>
      </div>
    </section>
  </div>
</template>

<script setup lang="ts">
import { h, ref } from 'vue'
import { RouterLink } from 'vue-router'
import FreelanceJobsCategorySubnav from '@/modules/jobs/components/FreelanceJobsCategorySubnav.vue'

const hireMode = ref<'solo' | 'teams'>('solo')
const openAccordion = ref<string | null>('dev')

const heroCards = [
  {
    name: 'Martin G.',
    title: 'Data Scientist',
    photo: 'https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?w=96&h=96&fit=crop',
  },
  {
    name: 'Andrea R.',
    title: 'Lead Software Engineer',
    photo: 'https://images.unsplash.com/photo-1494790108377-be9c29b29330?w=96&h=96&fit=crop',
  },
  {
    name: 'James T.',
    title: 'Product Designer',
    photo: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=96&h=96&fit=crop',
  },
  {
    name: 'Priya K.',
    title: 'Marketing Strategist',
    photo: 'https://images.unsplash.com/photo-1573496359142-b8d87734a5a2?w=96&h=96&fit=crop',
  },
  {
    name: 'Elena V.',
    title: 'Full-Stack Developer',
    photo: 'https://images.unsplash.com/photo-1580489944761-15a19d654956?w=96&h=96&fit=crop',
  },
  {
    name: 'David L.',
    title: 'DevOps Engineer',
    photo: 'https://images.unsplash.com/photo-1500648767791-00dcc994a43e?w=96&h=96&fit=crop',
  },
]

const heroCardsLeft = heroCards.slice(0, 3)
const heroCardsRight = heroCards.slice(3, 6)

const IconStar = () =>
  h(
    'svg',
    { class: 'h-6 w-6', viewBox: '0 0 24 24', fill: 'currentColor', 'aria-hidden': 'true' },
    [
      h('path', {
        d: 'M12 2l3.09 6.26L22 9.27l-5 4.87 1.18 6.88L12 17.77l-6.18 3.25L7 14.14 2 9.27l6.91-1.01L12 2z',
      }),
    ],
  )

const IconShield = () =>
  h('svg', { class: 'h-6 w-6', viewBox: '0 0 24 24', fill: 'currentColor', 'aria-hidden': 'true' }, [
    h('path', {
      d: 'M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10z',
    }),
  ])

/** Dollar-in-circle mark (compact glyph, matches reference layout). */
const IconMoney = () =>
  h(
    'span',
    { class: 'flex h-6 w-6 items-center justify-center text-[15px] font-bold leading-none', 'aria-hidden': 'true' },
    '$',
  )

const valueProps = [
  {
    title: 'Over 1M reviews',
    body: 'Develop relationships with highly rated professionals.',
    icon: IconStar,
  },
  {
    title: 'Protected payments',
    body: 'Hassle-free billing so you can focus on work that matters.',
    icon: IconShield,
  },
  {
    title: 'Hire who you need',
    body: 'Find pros who can start right away and handle any job.',
    icon: IconMoney,
  },
]

type AccLink = { label: string; to: string }

const accordionCategories: { id: string; label: string; links: AccLink[] }[] = [
  {
    id: 'dev',
    label: 'Development & IT',
    links: [
      { label: 'Web Developers', to: '/hire/web-developers' },
      { label: 'Software Developers', to: '/hire/software-developers' },
      { label: 'Python Developers', to: '/hire/python-developers' },
      { label: 'Mobile App Developers', to: '/hire/mobile-app-developers' },
      { label: 'WordPress Developers', to: '/hire/wordpress-developers' },
      { label: 'Ethical Hackers', to: '/hire/ethical-hackers' },
    ],
  },
  {
    id: 'ai',
    label: 'AI Services',
    links: [
      { label: 'Machine Learning Engineers', to: '/hire/machine-learning-engineers' },
      { label: 'Chatbot Developers', to: '/hire/chatbot-developers' },
      { label: 'Computer Vision Engineers', to: '/hire/computer-vision-engineers' },
      { label: 'Automation Engineers', to: '/hire/automation-engineers' },
    ],
  },
  {
    id: 'design',
    label: 'Design & Creative',
    links: [
      { label: 'Graphic Designers', to: '/hire/graphic-designers' },
      { label: 'UX Designers', to: '/hire/ux-designers' },
      { label: 'Web Designers', to: '/hire/web-designers' },
      { label: 'Illustrators', to: '/hire/illustrators' },
      { label: 'Logo Designers', to: '/hire/logo-designers' },
      { label: 'Animators', to: '/hire/animators' },
    ],
  },
  {
    id: 'mkt',
    label: 'Sales & Marketing',
    links: [
      { label: 'Digital Marketers', to: '/hire/digital-marketers' },
      { label: 'SEO Experts', to: '/hire/seo-experts' },
      { label: 'Google Ads Experts', to: '/hire/google-ads-experts' },
      { label: 'Social Media Managers', to: '/hire/social-media-managers' },
      { label: 'Lead Generation Specialists', to: '/hire/lead-generation-specialists' },
      { label: 'Cold Callers', to: '/hire/cold-callers' },
    ],
  },
  {
    id: 'writing',
    label: 'Writing & Translation',
    links: [
      { label: 'Content Writers', to: '/hire/content-writers' },
      { label: 'Copywriters', to: '/hire/copywriters' },
      { label: 'Ghostwriters', to: '/hire/ghostwriters' },
      { label: 'Book Editors', to: '/hire/book-editors' },
      { label: 'Email Copywriters', to: '/hire/email-copywriters' },
    ],
  },
  {
    id: 'admin',
    label: 'Admin & Customer Support',
    links: [
      { label: 'Virtual Assistants', to: '/hire/virtual-assistants' },
      { label: 'Personal Assistants', to: '/hire/personal-assistants' },
      { label: 'Content Moderators', to: '/hire/content-moderators' },
    ],
  },
  {
    id: 'finance',
    label: 'Finance & Accounting',
    links: [{ label: 'Finance & Accounting Professionals', to: '/hire/finance-professionals' }],
  },
  {
    id: 'legal',
    label: 'Legal',
    links: [{ label: 'Legal Professionals', to: '/hire/legal-professionals' }],
  },
  {
    id: 'hr',
    label: 'HR & Training',
    links: [{ label: 'HR & Training Specialists', to: '/hire/hr-specialists' }],
  },
  {
    id: 'eng',
    label: 'Engineering & Architecture',
    links: [
      { label: 'Software Developers', to: '/hire/software-developers' },
      { label: 'Automation Engineers', to: '/hire/automation-engineers' },
      { label: 'Mobile App Developers', to: '/hire/mobile-app-developers' },
    ],
  },
]

function toggleAccordion(id: string): void {
  openAccordion.value = openAccordion.value === id ? null : id
}
</script>
