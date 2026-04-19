<template>
  <footer class="text-neutral-400">
    <div class="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
      <div
        class="overflow-hidden rounded-3xl bg-[#141414] shadow-sm max-[714px]:bg-[#1d1d1d]"
      >
        <div class="px-6 py-16 md:py-20 min-[715px]:px-[clamp(1.25rem,2.8vw+0.35rem,3rem)]">
      <!-- Desktop: 4 equal columns from 715px (flex so all columns resize together, not content-sized) -->
      <div
        class="hidden min-[715px]:flex min-[715px]:w-full min-[715px]:flex-row min-[715px]:items-start min-[715px]:gap-x-[clamp(0.75rem,1.2vw,2rem)]"
      >
        <div
          v-for="(section, sectionIdx) in footerLinks"
          :key="section.title || `footer-col-${sectionIdx}`"
          class="min-w-0 flex-1 basis-0"
        >
          <h3
            v-if="section.title"
            class="mb-3 text-xs font-semibold leading-snug text-white min-[900px]:mb-3.5 min-[900px]:text-sm lg:mb-4 lg:text-sm"
          >
            {{ section.title }}
          </h3>
          <ul class="min-w-0 space-y-2 min-[900px]:space-y-2.5">
            <li v-for="link in section.links" :key="link" class="min-w-0">
              <a
                href="#"
                class="inline-flex max-w-full items-center gap-1.5 break-words text-[0.8125rem] leading-snug text-neutral-400 transition-colors hover:text-white min-[900px]:text-sm"
                @click.prevent
              >
                {{ link }}
                <PrivacyChoicesGlyph
                  v-if="showPrivacyChoicesGlyph && link === 'Your Privacy Choices'"
                  aria-hidden="true"
                />
              </a>
            </li>
          </ul>
        </div>
      </div>

      <!-- Mobile accordion (≤714px), Upwork-style -->
      <div class="min-[715px]:hidden" role="navigation" aria-label="Footer sections">
        <template v-for="(section, sectionIdx) in footerLinks" :key="section.title || `footer-m-${sectionIdx}`">
          <div v-if="section.title" class="border-b border-[#2a2a2a]">
            <button
              type="button"
              class="flex w-full items-center justify-between gap-3 py-4 pl-0 pr-0 text-left text-base font-semibold text-white outline-none focus-visible:ring-2 focus-visible:ring-white/30 focus-visible:ring-offset-2 focus-visible:ring-offset-[#1d1d1d]"
              :aria-expanded="isAccordionOpen(sectionIdx)"
              :aria-controls="`footer-panel-${sectionIdx}`"
              :id="`footer-heading-${sectionIdx}`"
              @click="toggleAccordion(sectionIdx)"
            >
              <span>{{ section.title }}</span>
              <svg
                class="h-5 w-5 shrink-0 text-white transition-transform duration-200"
                :class="isAccordionOpen(sectionIdx) ? 'rotate-180' : ''"
                fill="none"
                viewBox="0 0 24 24"
                stroke="currentColor"
                aria-hidden="true"
              >
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M19 9l-7 7-7-7" />
              </svg>
            </button>
            <div
              :id="`footer-panel-${sectionIdx}`"
              role="region"
              :aria-labelledby="`footer-heading-${sectionIdx}`"
              class="grid transition-[grid-template-rows] duration-200 ease-out"
              :class="isAccordionOpen(sectionIdx) ? 'grid-rows-[1fr]' : 'grid-rows-[0fr]'"
            >
              <div class="min-h-0 overflow-hidden">
                <ul class="space-y-3 pb-5 pl-4 pt-0">
                  <li v-for="link in section.links" :key="link">
                    <a
                      href="#"
                      class="inline-flex items-center gap-1.5 text-sm text-white/90 transition-colors hover:text-white"
                      @click.prevent
                    >
                      {{ link }}
                      <PrivacyChoicesGlyph
                        v-if="showPrivacyChoicesGlyph && link === 'Your Privacy Choices'"
                        aria-hidden="true"
                      />
                    </a>
                  </li>
                </ul>
              </div>
            </div>
          </div>

          <div v-else class="border-b border-[#2a2a2a] py-4">
            <ul class="space-y-3 pl-4">
              <li v-for="link in section.links" :key="link">
                <a
                  href="#"
                  class="inline-flex items-center gap-1.5 text-sm text-white/90 transition-colors hover:text-white"
                  @click.prevent
                >
                  {{ link }}
                  <PrivacyChoicesGlyph
                    v-if="showPrivacyChoicesGlyph && link === 'Your Privacy Choices'"
                    aria-hidden="true"
                  />
                </a>
              </li>
            </ul>
          </div>
        </template>
      </div>

      <div
        class="mt-12 flex flex-col gap-6 border-t border-white/10 pt-8 lg:flex-row lg:items-center lg:justify-between max-[714px]:mt-0 max-[714px]:gap-5 max-[714px]:border-[#2a2a2a]"
      >
        <p class="text-xs text-neutral-500 max-[714px]:text-[13px] max-[714px]:leading-relaxed">
          © {{ year }} Downwork®
        </p>
        <nav
          class="flex flex-wrap items-center gap-x-4 gap-y-2 text-xs text-neutral-500 max-[714px]:flex-col max-[714px]:items-start max-[714px]:gap-3 max-[714px]:text-sm max-[714px]:text-white"
          aria-label="Legal links"
        >
          <a
            href="#"
            class="transition-colors hover:text-white max-[714px]:py-0.5 max-[714px]:text-white max-[714px]:hover:text-white/80"
            @click.prevent
          >
            Terms of Service
          </a>
          <a
            href="#"
            class="transition-colors hover:text-white max-[714px]:py-0.5 max-[714px]:text-white max-[714px]:hover:text-white/80"
            @click.prevent
          >
            Privacy Policy
          </a>
          <a
            href="#"
            class="transition-colors hover:text-white max-[714px]:py-0.5 max-[714px]:text-white max-[714px]:hover:text-white/80"
            @click.prevent
          >
            CA Notice at Collection
          </a>
          <a
            href="#"
            class="inline-flex items-center gap-1.5 transition-colors hover:text-white max-[714px]:py-0.5 max-[714px]:text-white max-[714px]:hover:text-white/80"
            @click.prevent
          >
            Your Privacy Choices
            <PrivacyChoicesGlyph aria-hidden="true" />
          </a>
          <a
            href="#"
            class="transition-colors hover:text-white max-[714px]:py-0.5 max-[714px]:text-white max-[714px]:hover:text-white/80"
            @click.prevent
          >
            Accessibility
          </a>
          <a
            href="#"
            class="transition-colors hover:text-white max-[714px]:py-0.5 max-[714px]:text-white max-[714px]:hover:text-white/80"
            @click.prevent
          >
            Sitemap
          </a>
        </nav>
      </div>
        </div>
      </div>
    </div>
  </footer>
</template>

<script setup lang="ts">
import { computed, h, ref, watch } from 'vue'
import { useRoute } from 'vue-router'

const route = useRoute()
const year = computed(() => new Date().getFullYear())

/** Accordion open state for mobile footer (≤714px); keys = section index */
const mobileAccordionOpen = ref<Record<number, boolean>>({})

function toggleAccordion(sectionIdx: number): void {
  mobileAccordionOpen.value = {
    ...mobileAccordionOpen.value,
    [sectionIdx]: !mobileAccordionOpen.value[sectionIdx],
  }
}

function isAccordionOpen(sectionIdx: number): boolean {
  return !!mobileAccordionOpen.value[sectionIdx]
}

watch(
  () => route.fullPath,
  () => {
    mobileAccordionOpen.value = {}
  },
)
const isCloseAccountPage = computed(() => route.name === 'close-account')
const isPleaseVerifyPage = computed(() => route.name === 'please-verify')
const showPrivacyChoicesGlyph = computed(
  () => isCloseAccountPage.value || isPleaseVerifyPage.value,
)

const DEFAULT_FOOTER_LINKS = [
  {
    title: 'For Clients',
    links: [
      'How to hire',
      'Talent Marketplace',
      'Project Catalog',
      'Hire an agency',
      'Enterprise',
      'Business Plus',
      'Any Hire',
      'Contract-to-hire',
      'Direct Contracts',
      'Hire worldwide',
      'Hire in the USA',
    ],
  },
  {
    title: 'For Talent',
    links: [
      'How to find work',
      'Direct Contracts',
      'Find freelance jobs worldwide',
      'Find freelance jobs in the USA',
      'Win work with ads',
      'Exclusive resources with Freelancer Plus',
    ],
  },
  {
    title: 'Resources',
    links: [
      'Help & support',
      'Success stories',
      'Downwork reviews',
      'Resources',
      'Blog',
      'Affiliate programme',
      'Free Business Tools',
      'Release notes',
    ],
  },
  {
    title: 'Company',
    links: [
      'About us',
      'Leadership',
      'Investor relations',
      'Careers',
      'Our impact',
      'Press',
      'Contact us',
      'Partners',
      'Trust, safety & security',
      'Modern slavery statement',
    ],
  },
] as const

const CLOSE_ACCOUNT_FOOTER_LINKS = [
  {
    title: 'About Us',
    links: ['Feedback', 'Referral Program'],
  },
  {
    title: 'Trust, Safety & Security',
    links: ['Help & Support', 'Downwork Foundation', 'Terms of Service'],
  },
  {
    title: 'Privacy Policy',
    links: ['CA Notice at Collection', 'Your Privacy Choices', 'Accessibility'],
  },
  {
    title: 'Desktop App',
    links: ['Cookie Policy', 'Enterprise Solutions', 'Release notes'],
  },
] as const

/** Same shell as default footer; link grid matches compact legal-style columns (e.g. verify-email hold page). */
const PLEASE_VERIFY_FOOTER_LINKS = [
  {
    title: '',
    links: ['About Us', 'Feedback', 'Trust, Safety & Security'],
  },
  {
    title: '',
    links: ['Help & Support', 'Upwork Foundation', 'Terms of Service'],
  },
  {
    title: '',
    links: ['Privacy Policy', 'CA Notice at Collection', 'Your Privacy Choices', 'Accessibility'],
  },
  {
    title: '',
    links: ['Desktop App', 'Cookie Policy', 'Enterprise Solutions', 'Release notes'],
  },
] as const

const footerLinks = computed(() => {
  if (isPleaseVerifyPage.value) return PLEASE_VERIFY_FOOTER_LINKS
  if (isCloseAccountPage.value) return CLOSE_ACCOUNT_FOOTER_LINKS
  return DEFAULT_FOOTER_LINKS
})

const PrivacyChoicesGlyph = () =>
  h('svg', { viewBox: '0 0 24 16', class: 'h-4 w-6 shrink-0', 'aria-hidden': 'true' }, [
    h('rect', { x: '1', y: '1', width: '22', height: '14', rx: '7', fill: '#e5e7eb' }),
    h('circle', { cx: '8', cy: '8', r: '5', fill: '#3b82f6' }),
    h('circle', { cx: '16', cy: '8', r: '5', fill: '#fff', stroke: '#d1d5db', 'stroke-width': '1' }),
  ])
</script>
