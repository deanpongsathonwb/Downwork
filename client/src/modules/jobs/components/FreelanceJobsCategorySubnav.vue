<template>
  <nav class="relative z-40 bg-white" aria-label="Browse jobs by category">
    <div class="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
      <!-- ≤991px: compact “Browse categories” control (Upwork-style) -->
      <div ref="mobileCatRootRef" class="relative w-full hidden max-[991px]:block pt-4 pb-3">
        <button
          ref="mobileBrowseTriggerRef"
          type="button"
          class="inline-flex w-full min-[710px]:max-w-xs cursor-pointer items-center justify-between gap-2 rounded-lg border border-neutral-800/35 bg-white px-3.5 py-2.5 text-left text-sm font-medium text-slate-500 shadow-sm transition-colors hover:border-neutral-800/50 hover:bg-slate-50 hover:text-slate-600"
          :aria-expanded="mobileCatOpen ? 'true' : 'false'"
          aria-haspopup="menu"
          :aria-controls="narrowMobileBrowseSheet ? 'browse-categories-sheet' : 'browse-categories-menu'"
          @click.stop="mobileCatOpen = !mobileCatOpen"
        >
          <span>Browse Categories</span>
          <svg
            class="h-4 w-4 shrink-0 transition-transform duration-200"
            :class="{ 'rotate-180': mobileCatOpen }"
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
        </button>
        <div
          v-show="mobileCatOpen && !narrowMobileBrowseSheet"
          id="browse-categories-menu"
          class="absolute left-0 z-50 mt-1 flex max-w-[calc(100vw-1.5rem)] items-start gap-1.5 overflow-x-auto pb-1 pt-0.5"
          role="presentation"
          @mouseenter="cancelMobileCascadeClose"
          @mouseleave="scheduleMobileCascadeClose"
        >
          <!-- Level 1 -->
          <div
            class="flex max-h-[min(85vh,32rem)] min-w-[12.5rem] max-w-[16rem] shrink-0 flex-col overflow-y-auto rounded-xl border border-slate-200 bg-white py-2 shadow-[0_8px_30px_-8px_rgba(15,23,42,0.18)]"
            role="menu"
            aria-label="Categories"
          >
            <div
              v-for="item in navItems"
              :key="item.label"
              class="flex cursor-pointer items-center gap-2 px-4 py-3.5 text-sm font-medium transition-colors duration-150"
              :class="mobileHoverKey === item.megaMenuKey ? 'bg-slate-100' : 'hover:bg-slate-100'"
              @mouseenter="onMobileCascadeL1Enter(item)"
            >
              <RouterLink
                :to="item.to"
                role="menuitem"
                class="min-w-0 flex-1 cursor-pointer truncate text-slate-900"
                @click="closeMobileBrowseMenu"
              >
                {{ item.label }}
              </RouterLink>
              <svg
                v-if="mobileCascadeHasL2(item.megaMenuKey)"
                class="h-4 w-4 shrink-0 text-slate-400"
                fill="none"
                viewBox="0 0 24 24"
                stroke="currentColor"
                stroke-width="2"
                aria-hidden="true"
              >
                <path stroke-linecap="round" stroke-linejoin="round" d="M9 5l7 7-7 7" />
              </svg>
            </div>
          </div>

          <!-- Level 2 -->
          <div
            v-if="mobileHoverKey && mobileL2Rows.length"
            class="flex max-h-[min(85vh,32rem)] min-w-[12.5rem] max-w-[16rem] shrink-0 flex-col overflow-y-auto rounded-xl border border-slate-200 bg-white py-2 shadow-[0_8px_30px_-8px_rgba(15,23,42,0.18)]"
            role="menu"
            :aria-label="mobileL2AriaLabel"
          >
            <template v-for="(row, ri) in mobileL2Rows" :key="mobileL2RowKey(row, ri)">
              <RouterLink
                v-if="row.kind === 'link'"
                :to="row.href"
                role="menuitem"
                class="flex items-center px-4 py-3.5 text-sm font-medium text-slate-900 transition-colors duration-150 hover:bg-slate-100"
                @mouseenter="onMobileCascadeL2LinkHover"
                @click="closeMobileBrowseMenu"
              >
                <span class="min-w-0 flex-1 truncate">{{ row.label }}</span>
              </RouterLink>
              <div
                v-else
                role="menuitem"
                class="flex cursor-pointer items-center justify-between gap-3 px-4 py-3.5 text-sm font-medium transition-colors duration-150"
                :class="mobileL3RowActive(row.section) ? 'bg-slate-100' : 'hover:bg-slate-100'"
                @mouseenter="onMobileCascadeL2SectionEnter(row.section)"
              >
                <span class="min-w-0 flex-1 truncate">{{ row.section.heading }}</span>
                <svg
                  class="h-4 w-4 shrink-0 text-slate-400"
                  fill="none"
                  viewBox="0 0 24 24"
                  stroke="currentColor"
                  stroke-width="2"
                  aria-hidden="true"
                >
                  <path stroke-linecap="round" stroke-linejoin="round" d="M9 5l7 7-7 7" />
                </svg>
              </div>
            </template>
          </div>

          <!-- Level 3 -->
          <div
            v-if="mobileL3Section && mobileL3Section.links.length"
            class="flex min-w-[12.5rem] max-w-[19rem] shrink-0 flex-col rounded-xl border border-slate-200 bg-white py-2 shadow-[0_8px_30px_-8px_rgba(15,23,42,0.18)]"
            role="menu"
            aria-label="Subcategories"
          >
            <RouterLink
              v-for="link in mobileL3Section.links"
              :key="`${link.href}::${link.label}`"
              :to="link.href"
              role="menuitem"
              class="flex cursor-pointer items-center px-4 py-3.5 text-sm font-medium text-slate-900 transition-colors duration-150 hover:bg-slate-100"
              @click="closeMobileBrowseMenu"
            >
              <span class="min-w-0 flex-1 truncate">{{ link.label }}</span>
            </RouterLink>
          </div>
        </div>
      </div>

      <!-- ≥992px: horizontal rail + hover mega -->
      <div class="relative hidden min-[992px]:block">
        <ul
          ref="subnavRailRef"
          class="subnav-rail flex list-none flex-nowrap items-center gap-2 md:gap-3 pt-6 pb-4 text-sm font-medium overscroll-x-contain"
        >
          <li
            v-for="item in navItems"
            :key="item.label"
            class="shrink-0 rounded-md px-2 py-2 md:px-3 md:py-2.5"
            @mouseenter="onNavItemEnter(item)"
            @mouseleave="scheduleCloseMega"
          >
            <div
              v-if="props.context === 'hire' && !effectiveHoverMegaMenu && item.megaMenuKey === 'more'"
              ref="simpleMoreWrapperRef"
              class="relative"
              @mouseenter="onSimpleMoreWrapperEnter"
              @mouseleave="scheduleCloseMega"
            >
              <RouterLink
                :to="item.to"
                class="inline-flex items-center gap-0.5 border-b-2 border-transparent pb-0.5 text-slate-700 transition-colors hover:text-slate-900 whitespace-nowrap"
                :class="isActive(item) ? 'text-green-700 border-green-600' : ''"
                :aria-expanded="simpleMoreOpen ? 'true' : 'false'"
                aria-haspopup="true"
                @mouseenter="onSimpleMoreWrapperEnter"
              >
                {{ item.label }}
                <svg
                  class="h-4 w-4 shrink-0 text-slate-600"
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
              </RouterLink>
            </div>
            <span
              v-else-if="tabLabelIsNonLink"
              class="inline-block cursor-pointer select-none border-b-2 border-transparent pb-0.5 text-slate-700 whitespace-nowrap"
              :class="isActive(item) ? 'text-green-700 border-green-600' : ''"
              aria-haspopup="true"
              :aria-expanded="openKey === item.megaMenuKey ? 'true' : 'false'"
            >
              {{ item.label }}
            </span>
            <RouterLink
              v-else
              :to="item.to"
              class="inline-block border-b-2 border-transparent pb-0.5 text-slate-700 transition-colors hover:text-slate-900 whitespace-nowrap"
              :class="isActive(item) ? 'text-green-700 border-green-600' : ''"
              :aria-expanded="
                mdMegaEnabled && effectiveHoverMegaMenu && openKey === item.megaMenuKey ? 'true' : undefined
              "
              :aria-haspopup="mdMegaEnabled && effectiveHoverMegaMenu ? 'true' : undefined"
            >
              {{ item.label }}
            </RouterLink>
          </li>
        </ul>
      </div>
    </div>

    <!-- Fixed + teleported: stays in document order as “More” in the rail, but escapes `.subnav-rail` overflow clipping. -->
    <Teleport to="body">
      <div
        v-if="hireSimpleMoreFlyout"
        v-show="simpleMoreOpen"
        class="simple-more-flyout pointer-events-auto fixed z-[100] w-max min-w-[17.5rem] pt-2"
        :style="simpleMoreMenuStyle"
        role="menu"
        aria-label="More categories"
        @mouseenter="cancelCloseMega"
        @mouseleave="scheduleCloseMega"
      >
        <div class="relative rounded-lg border border-slate-200 bg-white py-2">
          <RouterLink
            v-for="row in hireSimpleMoreLinks"
            :key="row.to + row.label"
            :to="row.to"
            role="menuitem"
            class="block px-4 py-2.5 text-sm font-medium text-slate-900 transition-colors hover:bg-slate-50 hover:text-green-700"
            :class="row.dividerBefore ? 'mt-1 pt-3' : ''"
            @click="onSimpleMoreMenuItemClick"
          >
            {{ row.label }}
          </RouterLink>
        </div>
      </div>
    </Teleport>

    <!-- ≤709px: dimmed backdrop + bottom sheet (replaces flyout dropdown) -->
    <Teleport to="body">
      <Transition name="browse-cat-sheet">
        <div
          v-if="mobileCatOpen && narrowMobileBrowseSheet"
          ref="mobileCatSheetOverlayRef"
          class="browse-cat-sheet-root fixed inset-0 z-[200] flex flex-col justify-end"
          role="presentation"
        >
          <div
            class="browse-cat-sheet-backdrop absolute inset-0 bg-slate-900/50 opacity-100"
            aria-hidden="true"
            @pointerdown="closeMobileBrowseMenu"
          />
          <div
            id="browse-categories-sheet"
            class="browse-cat-sheet-panel relative z-10 w-full max-w-none flex min-h-0 flex-col overflow-hidden rounded-t-2xl bg-white shadow-[0_-8px_40px_-12px_rgba(15,23,42,0.25)] [padding-bottom:env(safe-area-inset-bottom,0px)]"
            :style="mobileBrowseSheetPanelStyle"
          role="dialog"
          aria-modal="true"
          aria-labelledby="browse-categories-sheet-title"
          @pointerdown.stop
        >
          <div
            class="flex items-center gap-2 border-b border-slate-200 px-3 py-2 sm:px-4"
          >
            <button
              v-if="mobileSheetShowBack"
              type="button"
              class="flex h-10 w-10 shrink-0 cursor-pointer items-center justify-center rounded-lg text-slate-700 transition-colors hover:bg-slate-100"
              aria-label="Back"
              @click="mobileSheetGoBack"
            >
              <svg class="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor" stroke-width="2" aria-hidden="true">
                <path stroke-linecap="round" stroke-linejoin="round" d="M15 19l-7-7 7-7" />
              </svg>
            </button>
            <h2
              id="browse-categories-sheet-title"
              class="min-w-0 flex-1 truncate text-base font-semibold text-slate-900"
              :class="mobileSheetShowBack ? 'text-center' : 'text-left'"
            >
              {{ mobileSheetHeaderTitle }}
            </h2>
            <button
              type="button"
              class="flex h-11 w-11 shrink-0 cursor-pointer items-center justify-center rounded-lg text-slate-600 transition-colors hover:bg-slate-100"
              aria-label="Close"
              @click="closeMobileBrowseMenu"
            >
              <svg class="h-7 w-7" fill="none" viewBox="0 0 24 24" stroke="currentColor" stroke-width="2" aria-hidden="true">
                <path stroke-linecap="round" stroke-linejoin="round" d="M6 18L18 6M6 6l12 12" />
              </svg>
            </button>
          </div>

          <div class="min-h-0 flex-1 overflow-y-auto overscroll-y-contain py-1 [scrollbar-width:thin]">
            <!-- Level 1 -->
            <template v-if="!mobileHoverKey">
              <div role="menu" aria-label="Categories">
                <div
                  v-for="item in navItems"
                  :key="item.label"
                  class="flex cursor-pointer items-center gap-2 px-4 py-3.5 text-sm font-medium text-slate-900 transition-colors duration-150 hover:bg-slate-100"
                >
                  <RouterLink
                    v-if="!mobileCascadeHasL2(item.megaMenuKey)"
                    :to="item.to"
                    role="menuitem"
                    class="min-w-0 flex-1 cursor-pointer truncate"
                    @click="closeMobileBrowseMenu"
                  >
                    {{ item.label }}
                  </RouterLink>
                  <button
                    v-else
                    type="button"
                    role="menuitem"
                    class="flex min-w-0 flex-1 cursor-pointer items-center justify-between gap-2 text-left"
                    @click="onNarrowSheetPickL1(item)"
                  >
                    <span class="min-w-0 truncate">{{ item.label }}</span>
                    <svg
                      class="h-4 w-4 shrink-0 text-slate-400"
                      fill="none"
                      viewBox="0 0 24 24"
                      stroke="currentColor"
                      stroke-width="2"
                      aria-hidden="true"
                    >
                      <path stroke-linecap="round" stroke-linejoin="round" d="M9 5l7 7-7 7" />
                    </svg>
                  </button>
                </div>
              </div>
            </template>

            <!-- Level 2 -->
            <template v-else-if="mobileHoverKey && !mobileL3Section">
              <div role="menu" :aria-label="mobileL2AriaLabel">
                <template v-for="(row, ri) in mobileL2Rows" :key="mobileL2RowKey(row, ri)">
                  <RouterLink
                    v-if="row.kind === 'link'"
                    :to="row.href"
                    role="menuitem"
                    class="flex cursor-pointer items-center px-4 py-3.5 text-sm font-medium text-slate-900 transition-colors duration-150 hover:bg-slate-100"
                    @click="closeMobileBrowseMenu"
                  >
                    <span class="min-w-0 flex-1 truncate">{{ row.label }}</span>
                  </RouterLink>
                  <button
                    v-else
                    type="button"
                    role="menuitem"
                    class="flex w-full cursor-pointer items-center justify-between gap-3 px-4 py-3.5 text-left text-sm font-medium text-slate-900 transition-colors duration-150 hover:bg-slate-100"
                    @click="onNarrowSheetPickL2Section(row.section)"
                  >
                    <span class="min-w-0 flex-1 truncate">{{ row.section.heading }}</span>
                    <svg
                      class="h-4 w-4 shrink-0 text-slate-400"
                      fill="none"
                      viewBox="0 0 24 24"
                      stroke="currentColor"
                      stroke-width="2"
                      aria-hidden="true"
                    >
                      <path stroke-linecap="round" stroke-linejoin="round" d="M9 5l7 7-7 7" />
                    </svg>
                  </button>
                </template>
              </div>
            </template>

            <!-- Level 3 -->
            <template v-else>
              <div role="menu" aria-label="Subcategories">
                <RouterLink
                  v-for="link in mobileL3Section.links"
                  :key="`${link.href}::${link.label}`"
                  :to="link.href"
                  role="menuitem"
                  class="flex cursor-pointer items-center px-4 py-3.5 text-sm font-medium text-slate-900 transition-colors duration-150 hover:bg-slate-100"
                  @click="closeMobileBrowseMenu"
                >
                  <span class="min-w-0 flex-1 truncate">{{ link.label }}</span>
                </RouterLink>
              </div>
            </template>
          </div>
        </div>
        </div>
      </Transition>
    </Teleport>

    <!-- Anchored to <nav> full width — avoids 100vw overflow that shifts the page & rail -->
    <div
      v-show="effectiveHoverMegaMenu && openKey && showMegaPanel && mdMegaEnabled"
      class="absolute left-0 right-0 top-full z-50 hidden w-full overflow-x-hidden border-b border-t border-slate-200 bg-white px-5 sm:px-8 md:px-12 lg:px-16 xl:px-20 min-[992px]:block"
      @mouseenter="cancelCloseMega"
      @mouseleave="scheduleCloseMega"
    >
      <div
        class="mx-auto min-w-0 max-w-[min(100%,88rem)] py-8"
        :class="megaInnerScrollClass"
      >
        <div class="w-full">
          <div
            v-if="megaColumns"
            class="mega-menu-columns grid grid-cols-1 gap-8"
            :class="[moreMegaGridSmClass, megaGridLgColsClass]"
          >
            <div
              v-for="(column, ci) in megaColumns"
              :key="ci"
              :class="[
                'min-w-0 space-y-8',
                isMoreSidebarColumn(ci) ? 'shrink-0 lg:border-r lg:border-slate-200 lg:pr-8 lg:mr-1' : '',
              ]"
              :role="isMoreSidebarColumn(ci) ? 'navigation' : undefined"
              :aria-label="isMoreSidebarColumn(ci) ? moreSidebarNavAriaLabel : undefined"
            >
              <div
                v-for="(section, si) in column"
                :key="`${ci}-${si}-${section.heading || section.links[0]?.label || si}`"
                :class="isMoreSidebarColumn(ci) ? 'min-w-0' : 'min-w-min'"
              >
                <p
                  v-if="section.heading"
                  class="mb-2 text-sm font-bold tracking-tight text-slate-900 whitespace-nowrap"
                >
                  {{ section.heading }}
                </p>
                <ul
                  :class="[
                    section.linksGridColumns === 2 ? 'mega-links-two-col' : 'space-y-1',
                    isMoreSidebarColumn(ci) ? 'space-y-0.5' : '',
                  ]"
                  :style="
                    section.linksGridColumns === 2
                      ? { '--mega-rows': String(Math.ceil(section.links.length / 2)) }
                      : undefined
                  "
                >
                  <li v-for="link in section.links" :key="`${link.href}::${link.label}`">
                    <RouterLink
                      :to="link.href"
                      class="block min-w-0 rounded py-0.5 text-sm leading-snug transition-colors hover:text-green-700"
                      :class="
                        isMegaSidebarPrimaryLink(ci, section)
                          ? isMoreSidebarColumn(ci)
                            ? 'font-semibold text-slate-900 whitespace-normal'
                            : 'font-semibold text-slate-900 break-words'
                          : 'break-words text-slate-600'
                      "
                      @click="openKey = null"
                    >
                      {{ link.label }}
                    </RouterLink>
                  </li>
                </ul>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  </nav>
</template>

<script setup lang="ts">
import { computed, nextTick, onBeforeUnmount, onMounted, ref, watch } from 'vue'
import { RouterLink, useRoute } from 'vue-router'
import {
  FREELANCE_JOBS_SUBNAV_ITEMS,
  type FreelanceJobsSubnavItem,
} from '@/constants/freelance-jobs.landing'
import {
  FREELANCE_JOBS_MEGA_MENU,
  type FreelanceJobsMegaMenuColumns,
  type FreelanceJobsMegaMenuKey,
  type FreelanceJobsMegaMenuSection,
} from '@/constants/freelance-jobs.mega-menu'
import {
  HIRE_TALENT_MEGA_MENU,
  HIRE_TALENT_SIMPLE_MORE_LINKS,
  HIRE_TALENT_SUBNAV_ITEMS,
} from '@/constants/hire-talent.subnav'

const props = withDefaults(
  defineProps<{
    currentSlug: string
    /** `hire`: /hire/* + mega links to hire/browse-freelancers. Default mirrors Find Work. */
    context?: 'jobs' | 'hire'
    /**
     * When true, md+ shows hover mega dropdown. Automatically forced off on `/search/*` and `/category/*`
     * so those flows stay compact; other routes keep this value.
     */
    hoverMegaMenu?: boolean
    /**
     * When true with `hire` context (e.g. talent search), tabs use `/category/:hub` hub URLs
     * (`/category/ai`, …) instead of `/hire/:role`.
     */
    useCategoryUrls?: boolean
  }>(),
  { context: 'jobs', hoverMegaMenu: false, useCategoryUrls: false },
)

const route = useRoute()

/** No full-bleed mega on search / category hub flows (compact nav only). */
const suppressHoverMegaForRoute = computed(() => {
  const p = route.path
  return p.startsWith('/search') || p.startsWith('/category')
})

const effectiveHoverMegaMenu = computed(
  () => props.hoverMegaMenu && !suppressHoverMegaForRoute.value,
)

const navItems = computed<FreelanceJobsSubnavItem[]>(() => {
  const base =
    props.context === 'hire' ? HIRE_TALENT_SUBNAV_ITEMS : FREELANCE_JOBS_SUBNAV_ITEMS
  if (!props.useCategoryUrls || props.context !== 'hire') return base
  return base.map((item) => {
    if (item.megaMenuKey === 'more') return item
    return { ...item, to: `/category/${item.megaMenuKey}` }
  })
})

const hireSimpleMoreLinks = computed(() => {
  if (!props.useCategoryUrls || props.context !== 'hire') return HIRE_TALENT_SIMPLE_MORE_LINKS
  return HIRE_TALENT_SIMPLE_MORE_LINKS.map((row) => ({
    ...row,
    to: row.to.startsWith('/hire/') ? `/category/${row.to.slice('/hire/'.length)}` : row.to,
  }))
})

/** Hire talent compact flows: flyout uses Teleport+fixed so `.subnav-rail` overflow does not clip it. */
const hireSimpleMoreFlyout = computed(
  () => props.context === 'hire' && !effectiveHoverMegaMenu.value,
)

const megaMenu = computed(() => (props.context === 'hire' ? HIRE_TALENT_MEGA_MENU : FREELANCE_JOBS_MEGA_MENU))

/** Align mega links with hub URLs when top tabs use `/category/:hub` (e.g. hire landing). */
function rewriteHireHrefForCategoryHub(href: string): string {
  if (props.useCategoryUrls && props.context === 'hire' && href.startsWith('/hire/')) {
    return `/category/${href.slice('/hire/'.length)}`
  }
  return href
}

const MENU_CLOSE_MS = 240
const MOBILE_CASCADE_CLOSE_MS = 220
/** ≤709px: use modal bottom sheet instead of anchored multi-column dropdown. */
const MOBILE_BROWSE_SHEET_MQ = '(max-width: 709px)'

type MobileCascadeL2Row =
  | { kind: 'link'; label: string; href: string }
  | { kind: 'section'; section: FreelanceJobsMegaMenuSection }

const openKey = ref<FreelanceJobsMegaMenuKey | null>(null)
const simpleMoreOpen = ref(false)
/** After choosing a flyout link, skip :hover reopen (same-page navigation). */
const suppressSimpleMoreReopen = ref(false)
/** Set when simple More flyout exists (hire + !effectiveHoverMegaMenu). */
const simpleMoreWrapperRef = ref<HTMLElement | null>(null)
const subnavRailRef = ref<HTMLElement | null>(null)
const simpleMoreMenuStyle = ref<Record<string, string>>({})
const mdMegaEnabled = ref(false)
const narrowMobileBrowseSheet = ref(false)
const mobileCatOpen = ref(false)
const mobileCatRootRef = ref<HTMLElement | null>(null)
const mobileBrowseTriggerRef = ref<HTMLElement | null>(null)
const mobileBrowseSheetPanelStyle = ref<Record<string, string>>({})
const mobileCatSheetOverlayRef = ref<HTMLElement | null>(null)
const mobileHoverKey = ref<FreelanceJobsMegaMenuKey | null>(null)
const mobileL3Section = ref<FreelanceJobsMegaMenuSection | null>(null)
let closeTimer: ReturnType<typeof setTimeout> | undefined
let mobileCascadeTimer: ReturnType<typeof setTimeout> | undefined

function getMegaColumnsForKey(key: FreelanceJobsMegaMenuKey): FreelanceJobsMegaMenuColumns | null {
  const raw = megaMenu.value[key]
  if (!raw) return null
  if (!props.useCategoryUrls || props.context !== 'hire') return raw
  return raw.map((column) =>
    column.map((section) => ({
      ...section,
      links: section.links.map((link) => ({
        ...link,
        href: rewriteHireHrefForCategoryHub(link.href),
      })),
    })),
  )
}

function l2RowsForMegaKey(key: FreelanceJobsMegaMenuKey): MobileCascadeL2Row[] {
  const cols = getMegaColumnsForKey(key)
  if (!cols) return []
  const rows: MobileCascadeL2Row[] = []
  for (const column of cols) {
    for (const section of column) {
      if (!section.links?.length) continue
      if (section.heading) {
        rows.push({ kind: 'section', section })
      } else {
        for (const link of section.links) {
          rows.push({ kind: 'link', label: link.label, href: link.href })
        }
      }
    }
  }
  return rows
}

function mobileCascadeHasL2(key: FreelanceJobsMegaMenuKey): boolean {
  return l2RowsForMegaKey(key).length > 0
}

const mobileL2Rows = computed(() => {
  if (!mobileHoverKey.value) return []
  return l2RowsForMegaKey(mobileHoverKey.value)
})

const mobileL2AriaLabel = computed(() => {
  const key = mobileHoverKey.value
  if (!key) return 'Submenu'
  const item = navItems.value.find((i) => i.megaMenuKey === key)
  return item ? `${item.label}` : 'Submenu'
})

const mobileSheetShowBack = computed(() => mobileHoverKey.value !== null)

const mobileSheetHeaderTitle = computed(() => {
  const l3 = mobileL3Section.value
  if (l3?.heading) return l3.heading
  const key = mobileHoverKey.value
  if (key) {
    const item = navItems.value.find((i) => i.megaMenuKey === key)
    if (item) return item.label
  }
  return 'Browse Categories'
})

function mobileL2RowKey(row: MobileCascadeL2Row, ri: number): string {
  if (row.kind === 'link') return `l2-link-${ri}-${row.href}`
  return `l2-sec-${ri}-${row.section.heading}-${row.section.links[0]?.href ?? ''}`
}

function mobileL3RowActive(section: FreelanceJobsMegaMenuSection): boolean {
  const cur = mobileL3Section.value
  if (!cur) return false
  return (
    section.heading === cur.heading &&
    section.links.length === cur.links.length &&
    section.links[0]?.href === cur.links[0]?.href
  )
}

function clearMobileCascadeTimer(): void {
  if (mobileCascadeTimer !== undefined) {
    clearTimeout(mobileCascadeTimer)
    mobileCascadeTimer = undefined
  }
}

function scheduleMobileCascadeClose(): void {
  clearMobileCascadeTimer()
  mobileCascadeTimer = window.setTimeout(() => {
    mobileHoverKey.value = null
    mobileL3Section.value = null
  }, MOBILE_CASCADE_CLOSE_MS)
}

function cancelMobileCascadeClose(): void {
  clearMobileCascadeTimer()
}

function onMobileCascadeL1Enter(item: FreelanceJobsSubnavItem): void {
  cancelMobileCascadeClose()
  mobileHoverKey.value = item.megaMenuKey
  mobileL3Section.value = null
}

function onMobileCascadeL2SectionEnter(section: FreelanceJobsMegaMenuSection): void {
  cancelMobileCascadeClose()
  mobileL3Section.value = section
}

function onMobileCascadeL2LinkHover(): void {
  cancelMobileCascadeClose()
  mobileL3Section.value = null
}

function onNarrowSheetPickL1(item: FreelanceJobsSubnavItem): void {
  clearMobileCascadeTimer()
  mobileHoverKey.value = item.megaMenuKey
  mobileL3Section.value = null
}

function onNarrowSheetPickL2Section(section: FreelanceJobsMegaMenuSection): void {
  clearMobileCascadeTimer()
  mobileL3Section.value = section
}

function mobileSheetGoBack(): void {
  clearMobileCascadeTimer()
  if (mobileL3Section.value) {
    mobileL3Section.value = null
    return
  }
  mobileHoverKey.value = null
}

function closeMobileBrowseMenu(): void {
  mobileCatOpen.value = false
  mobileHoverKey.value = null
  mobileL3Section.value = null
  clearMobileCascadeTimer()
  mobileBrowseSheetPanelStyle.value = {}
}

/** Bottom sheet fills from viewport bottom up to the Browse Categories trigger (≤709px). */
function syncMobileBrowseSheetMaxHeight(): void {
  if (typeof window === 'undefined') return
  if (!mobileCatOpen.value || !narrowMobileBrowseSheet.value) {
    mobileBrowseSheetPanelStyle.value = {}
    return
  }
  const btn = mobileBrowseTriggerRef.value
  /** `getBoundingClientRect` is tied to the layout viewport; pair with `innerHeight` (not only visualViewport). */
  const vh = Math.max(1, window.innerHeight || document.documentElement.clientHeight || 0)
  const top = btn ? btn.getBoundingClientRect().top : 0
  let hPx = Math.floor(vh - top)
  if (hPx < 120) hPx = Math.min(120, Math.floor(vh * 0.45))
  if (hPx > vh) hPx = Math.floor(vh)
  /** `max-height` alone does not stretch the panel — content stays short. Force `height` so the sheet actually fills. */
  mobileBrowseSheetPanelStyle.value = {
    height: `${hPx}px`,
    maxHeight: `${hPx}px`,
  }
}

function queueSyncMobileBrowseSheetMaxHeight(): void {
  requestAnimationFrame(() => {
    requestAnimationFrame(() => {
      syncMobileBrowseSheetMaxHeight()
    })
  })
}

function unbindMobileBrowseSheetHeightListeners(): void {
  window.removeEventListener('resize', queueSyncMobileBrowseSheetMaxHeight)
  window.visualViewport?.removeEventListener('resize', queueSyncMobileBrowseSheetMaxHeight)
  window.visualViewport?.removeEventListener('scroll', syncMobileBrowseSheetMaxHeight)
  document.removeEventListener('scroll', syncMobileBrowseSheetMaxHeight, true)
}

function bindMobileBrowseSheetHeightListeners(): void {
  unbindMobileBrowseSheetHeightListeners()
  window.addEventListener('resize', queueSyncMobileBrowseSheetMaxHeight)
  window.visualViewport?.addEventListener('resize', queueSyncMobileBrowseSheetMaxHeight)
  window.visualViewport?.addEventListener('scroll', syncMobileBrowseSheetMaxHeight)
  document.addEventListener('scroll', syncMobileBrowseSheetMaxHeight, true)
}

/**
 * Close mobile “Browse categories” when the user taps/clicks outside the control.
 * Uses capture-phase `pointerdown` so parent handlers that `stopPropagation()` on `click` bubble
 * cannot block outside detection (common with nested interactive UI).
 */
function onMobileCatOutsidePointerDown(e: PointerEvent): void {
  if (e.pointerType === 'mouse' && e.button !== 0) return
  if (!mobileCatOpen.value) return
  const t = e.target
  if (!(t instanceof Node)) return
  const root = mobileCatRootRef.value
  if (root?.contains(t)) return
  const sheetRoot = mobileCatSheetOverlayRef.value
  if (narrowMobileBrowseSheet.value && sheetRoot?.contains(t)) return
  closeMobileBrowseMenu()
}

function onMobileBrowseEscape(e: KeyboardEvent): void {
  if (e.key !== 'Escape' || !mobileCatOpen.value) return
  e.preventDefault()
  closeMobileBrowseMenu()
}

/**
 * ≥992px mega: tabs are normally plain labels (hover opens panel). When hire uses `/category/:hub` URLs,
 * tabs must stay real links so click navigates (e.g. /hire hub and talent search).
 */
const tabLabelIsNonLink = computed(() => {
  if (props.useCategoryUrls && props.context === 'hire') return false
  return effectiveHoverMegaMenu.value && mdMegaEnabled.value
})

const megaColumns = computed((): FreelanceJobsMegaMenuColumns | null => {
  const key = openKey.value
  if (!key) return null
  const raw = megaMenu.value[key]
  if (!raw) return null
  if (!props.useCategoryUrls || props.context !== 'hire') return raw
  return raw.map((column) =>
    column.map((section) => ({
      ...section,
      links: section.links.map((link) => ({
        ...link,
        href: rewriteHireHrefForCategoryHub(link.href),
      })),
    })),
  )
})

const showMegaPanel = computed(() => Boolean(openKey.value && megaColumns.value && megaColumns.value.length > 0))

/** More tab: sidebar + 3 content columns; stack sidebar on its own row below `lg`. */
const moreMegaGridSmClass = computed(() =>
  openKey.value === 'more' ? 'sm:grid-cols-1 sm:gap-y-8' : 'sm:grid-cols-2 sm:gap-8',
)

const moreSidebarNavAriaLabel = computed(() =>
  props.context === 'hire' ? 'Talent categories' : 'Job categories',
)

/** Same scroll box for every mega so switching tabs doesn’t reflow from scrollbar-gutter / overflow changes. */
const megaInnerScrollClass = computed(() => {
  return 'mega-inner-scroll max-h-[min(80vh,52rem)] overflow-y-auto overflow-x-hidden overscroll-y-contain pr-1 [scrollbar-width:thin]'
})

const megaGridLgColsClass = computed(() => {
  if (openKey.value === 'more') {
    return 'lg:grid-cols-[minmax(10.5rem,13rem)_minmax(0,1fr)_minmax(0,1fr)_minmax(0,1fr)] lg:gap-x-10 lg:gap-y-0'
  }
  const n = megaColumns.value?.length ?? 0
  if (n < 2) return ''
  /** Equal-width columns; min from longest line so labels stay on one row (Tailwind needs static class strings). */
  /** minmax(0,1fr) lets columns shrink inside the panel so content doesn’t force a horizontal scrollbar. */
  if (n === 6) return 'lg:grid-cols-[repeat(6,minmax(0,1fr))]'
  if (n === 5) return 'lg:grid-cols-[repeat(5,minmax(0,1fr))]'
  if (n === 4) return 'lg:grid-cols-[repeat(4,minmax(0,1fr))]'
  if (n === 3) return 'lg:grid-cols-[repeat(3,minmax(0,1fr))]'
  return 'lg:grid-cols-[repeat(2,minmax(0,1fr))]'
})

function isMoreSidebarColumn(ci: number): boolean {
  return openKey.value === 'more' && ci === 0
}

function isMegaSidebarPrimaryLink(ci: number, section: { heading: string }): boolean {
  return openKey.value === 'more' && ci === 0 && !section.heading
}

function isActive(item: FreelanceJobsSubnavItem): boolean {
  return item.activeSlugs.includes(props.currentSlug)
}

function clearCloseTimer(): void {
  if (closeTimer !== undefined) {
    clearTimeout(closeTimer)
    closeTimer = undefined
  }
}

function simpleMoreWrapperEl(): HTMLElement | undefined {
  const raw = simpleMoreWrapperRef.value
  const el = (Array.isArray(raw) ? raw[0] : raw) as HTMLElement | undefined
  return el ?? undefined
}

function syncSimpleMoreMenuPosition(): void {
  if (!simpleMoreOpen.value || !hireSimpleMoreFlyout.value) return
  const el = simpleMoreWrapperEl()
  if (!el) return
  const rect = el.getBoundingClientRect()
  simpleMoreMenuStyle.value = {
    left: `${rect.left + rect.width / 2}px`,
    top: `${rect.bottom - 8}px`,
    transform: 'translateX(-50%)',
  }
}

function bindSimpleMorePositionListeners(): void {
  window.addEventListener('scroll', syncSimpleMoreMenuPosition, true)
  window.addEventListener('resize', syncSimpleMoreMenuPosition)
  subnavRailRef.value?.addEventListener('scroll', syncSimpleMoreMenuPosition)
}

function unbindSimpleMorePositionListeners(): void {
  window.removeEventListener('scroll', syncSimpleMoreMenuPosition, true)
  window.removeEventListener('resize', syncSimpleMoreMenuPosition)
  subnavRailRef.value?.removeEventListener('scroll', syncSimpleMoreMenuPosition)
}

function onSimpleMoreWrapperEnter(): void {
  clearCloseTimer()
  simpleMoreOpen.value = true
  void nextTick(() => syncSimpleMoreMenuPosition())
}

function onSimpleMoreMenuItemClick(): void {
  suppressSimpleMoreReopen.value = true
  simpleMoreOpen.value = false
  window.setTimeout(() => {
    suppressSimpleMoreReopen.value = false
  }, 400)
}

function onNavItemEnter(item: FreelanceJobsSubnavItem): void {
  if (props.context === 'hire' && !effectiveHoverMegaMenu.value && item.megaMenuKey === 'more') {
    clearCloseTimer()
    simpleMoreOpen.value = true
    void nextTick(() => syncSimpleMoreMenuPosition())
    return
  }
  simpleMoreOpen.value = false
  openMega(item.megaMenuKey)
}

function openMega(key: FreelanceJobsMegaMenuKey): void {
  if (!effectiveHoverMegaMenu.value || !mdMegaEnabled.value) return
  simpleMoreOpen.value = false
  clearCloseTimer()
  openKey.value = key
}

function scheduleCloseMega(): void {
  clearCloseTimer()
  closeTimer = window.setTimeout(() => {
    openKey.value = null
    simpleMoreOpen.value = false
  }, MENU_CLOSE_MS)
}

function cancelCloseMega(): void {
  clearCloseTimer()
}

function syncMegaBreakpoint(): void {
  if (typeof window === 'undefined') return
  mdMegaEnabled.value = window.matchMedia('(min-width: 992px)').matches
  narrowMobileBrowseSheet.value = window.matchMedia(MOBILE_BROWSE_SHEET_MQ).matches
  if (!mdMegaEnabled.value) {
    openKey.value = null
    simpleMoreOpen.value = false
  } else {
    closeMobileBrowseMenu()
  }
}

watch(
  () => route.fullPath,
  () => {
    closeMobileBrowseMenu()
  },
)

watch(
  () => mobileCatOpen.value && narrowMobileBrowseSheet.value,
  (lock) => {
    if (typeof document === 'undefined') return
    document.body.style.overflow = lock ? 'hidden' : ''
    if (lock) {
      void nextTick(() => {
        queueSyncMobileBrowseSheetMaxHeight()
        bindMobileBrowseSheetHeightListeners()
      })
    } else {
      unbindMobileBrowseSheetHeightListeners()
      mobileBrowseSheetPanelStyle.value = {}
    }
  },
)

watch(effectiveHoverMegaMenu, (enabled) => {
  if (!enabled) {
    openKey.value = null
    simpleMoreOpen.value = false
  }
})

/** If the flyout closes while the pointer never left More, mouseenter on li may not fire again — reopen when still :hover. */
watch(simpleMoreOpen, (open) => {
  if (open) {
    void nextTick(() => {
      if (!simpleMoreOpen.value) return
      syncSimpleMoreMenuPosition()
      bindSimpleMorePositionListeners()
    })
    return
  }
  unbindSimpleMorePositionListeners()
  if (suppressSimpleMoreReopen.value) return
  if (props.context !== 'hire' || effectiveHoverMegaMenu.value) return
  void nextTick(() => {
    const el = simpleMoreWrapperEl()
    if (el?.matches(':hover')) {
      clearCloseTimer()
      simpleMoreOpen.value = true
    }
  })
})

onMounted(() => {
  syncMegaBreakpoint()
  window.addEventListener('resize', syncMegaBreakpoint)
  document.addEventListener('pointerdown', onMobileCatOutsidePointerDown, true)
  window.addEventListener('keydown', onMobileBrowseEscape)
  if (!effectiveHoverMegaMenu.value) {
    openKey.value = null
    simpleMoreOpen.value = false
  }
})

onBeforeUnmount(() => {
  window.removeEventListener('resize', syncMegaBreakpoint)
  document.removeEventListener('pointerdown', onMobileCatOutsidePointerDown, true)
  window.removeEventListener('keydown', onMobileBrowseEscape)
  unbindMobileBrowseSheetHeightListeners()
  document.body.style.overflow = ''
  unbindSimpleMorePositionListeners()
  clearCloseTimer()
  clearMobileCascadeTimer()
})
</script>

<style scoped>
/* Horizontal scroll rail: thin bar + stable gutter so Win classic scrollbars don’t change row height on hover */
.subnav-rail {
  overflow-x: auto;
  overflow-y: hidden;
  scrollbar-gutter: stable;
  scrollbar-width: thin;
}

.subnav-rail::-webkit-scrollbar {
  height: 8px;
}

.subnav-rail::-webkit-scrollbar-thumb {
  border-radius: 9999px;
  background-color: rgb(203 213 225 / 0.9);
}

.mega-inner-scroll {
  scrollbar-width: thin;
}

.mega-inner-scroll::-webkit-scrollbar {
  width: 8px;
}

.mega-inner-scroll::-webkit-scrollbar-thumb {
  border-radius: 9999px;
  background-color: rgb(203 213 225 / 0.9);
}

.mega-inner-scroll::-webkit-scrollbar-corner {
  background-color: transparent;
}

/* Bottom sheet (teleported): fade backdrop + slide panel up */
.browse-cat-sheet-enter-active .browse-cat-sheet-backdrop,
.browse-cat-sheet-leave-active .browse-cat-sheet-backdrop {
  transition: opacity 0.28s cubic-bezier(0.4, 0, 0.2, 1);
}

.browse-cat-sheet-enter-active .browse-cat-sheet-panel,
.browse-cat-sheet-leave-active .browse-cat-sheet-panel {
  transition: transform 0.38s cubic-bezier(0.32, 0.72, 0, 1);
}

.browse-cat-sheet-enter-from .browse-cat-sheet-backdrop,
.browse-cat-sheet-leave-to .browse-cat-sheet-backdrop {
  opacity: 0;
}

.browse-cat-sheet-enter-from .browse-cat-sheet-panel,
.browse-cat-sheet-leave-to .browse-cat-sheet-panel {
  transform: translateY(100%);
}

@media (prefers-reduced-motion: reduce) {
  .browse-cat-sheet-enter-active .browse-cat-sheet-backdrop,
  .browse-cat-sheet-leave-active .browse-cat-sheet-backdrop,
  .browse-cat-sheet-enter-active .browse-cat-sheet-panel,
  .browse-cat-sheet-leave-active .browse-cat-sheet-panel {
    transition-duration: 0.01ms !important;
    transition-timing-function: linear !important;
  }

  .browse-cat-sheet-enter-from .browse-cat-sheet-panel,
  .browse-cat-sheet-leave-to .browse-cat-sheet-panel {
    transform: none;
  }
}

@media (min-width: 1024px) {
  .mega-links-two-col {
    display: grid;
    row-gap: 0.25rem;
    column-gap: 1.25rem;
    grid-template-rows: repeat(var(--mega-rows, 12), minmax(0, auto));
    grid-auto-flow: column;
    grid-template-columns: repeat(2, minmax(0, 1fr));
  }

  .mega-links-two-col > li {
    break-inside: avoid;
  }
}
</style>
