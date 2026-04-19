<template>
  <section class="relative bg-white pt-4 pb-12" aria-label="Hero">
    <div class="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
      <div 
        class="relative min-h-[560px] flex items-center rounded-[40px] overflow-hidden bg-cover bg-center bg-no-repeat"
        style="background-image: url('https://images.unsplash.com/photo-1522071820081-009f0129c71c?auto=format&fit=crop&q=80&w=2070');"
      >
        <!-- Overlay for better text readability -->
        <div class="absolute inset-0 bg-gradient-to-r from-black/70 via-black/40 to-transparent"></div>

        <div class="relative w-full h-full px-8 md:px-16 py-16">
          <div class="max-w-3xl">
            <h1
              class="font-bold mb-6 text-white tracking-tight text-balance leading-[1.08] sm:leading-tight text-[clamp(1.75rem,5vw+0.65rem,4.5rem)]"
            >
              Hire the experts your<br class="hidden min-[420px]:block" />
              <span class="min-[420px]:hidden">&nbsp;</span>business needs
            </h1>

            <p
              class="text-white/90 leading-relaxed mb-10 max-w-2xl font-medium text-pretty text-[clamp(1rem,2.1vw+0.82rem,1.5rem)]"
            >
              Access skilled freelancers ready to help you build and scale
              <br class="hidden sm:block" />
              <span class="sm:hidden">&nbsp;</span>— without the full-time commitment
            </p>

            <!-- Action Toggle -->
            <div class="flex items-center bg-black/20 backdrop-blur-md border border-white/10 rounded-full mb-10 overflow-hidden max-w-2xl">
              <button 
                class="flex-1 px-8 py-2.5 rounded-full font-bold transition-all border-2 cursor-pointer"
                :class="activeTab === 'hire' ? 'bg-white/10 text-white border-white' : 'text-white/80 hover:text-white border-transparent'"
                @click="activeTab = 'hire'"
              >
                I want to hire
              </button>
              <button 
                class="flex-1 px-8 py-2.5 rounded-full font-bold transition-all border-2 cursor-pointer"
                :class="activeTab === 'work' ? 'bg-white/10 text-white border-white' : 'text-white/80 hover:text-white border-transparent'"
                @click="activeTab = 'work'"
              >
                I want to work
              </button>
            </div>

            <!-- Search Bar -->
            <div class="relative max-w-2xl mb-10">
              <form
                class="relative"
                :class="activeTab === 'hire' ? '' : 'invisible pointer-events-none'"
                role="search"
                data-hero-search-anchor
                @submit.prevent="handleSearch"
              >
                <input
                  id="hero-search"
                  v-model="searchQuery"
                  type="text"
                  :placeholder="heroSearchPlaceholder"
                  class="w-full min-w-0 bg-white text-slate-900 rounded-full py-3 pl-4 pr-14 outline-none shadow-xl text-[clamp(0.9375rem,1.25vw+0.65rem,1.125rem)] placeholder:text-slate-500 placeholder:opacity-100 sm:py-4 sm:pl-6 sm:pr-32"
                />
                <button 
                  type="submit"
                  class="absolute right-2 top-2 bottom-2 bg-slate-900 text-white rounded-full flex items-center gap-1.5 hover:bg-slate-800 transition-colors cursor-pointer px-3.5 sm:gap-2 sm:px-8"
                  aria-label="Search jobs"
                >
                  <svg class="w-5 h-5 shrink-0" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
                  </svg>
                  <span class="font-bold hidden sm:inline">Search</span>
                </button>
              </form>

              <div
                v-if="activeTab === 'work'"
                class="absolute inset-0 flex flex-col items-center justify-center gap-3 text-center px-2"
              >
                <p class="max-w-xl text-xl lg:text-2xl font-semibold leading-tight text-white">
                  Build your freelancing career on Downwork
                </p>
                <button
                  type="button"
                  class="inline-flex shrink-0 items-center justify-center rounded-lg bg-green-600 px-6 py-2.5 text-lg font-semibold text-white hover:bg-green-500 transition-colors cursor-pointer"
                  @click="goToBrowseJobs"
                >
                  Explore recently posted jobs
                </button>
              </div>
            </div>

            <!-- Popular Tags: real links so the browser status bar shows the destination URL on hover (like Upwork). -->
            <div class="absolute left-8 right-8 md:left-16 md:right-16 bottom-6 flex flex-nowrap gap-3 items-center overflow-hidden">
              <RouterLink
                v-for="tag in popularTags.slice(0, 4)"
                :key="tag.label"
                :to="hireTalentPath(tag.slug)"
                class="whitespace-nowrap px-4 py-1.5 rounded-full border border-white/30 text-white text-sm hover:bg-white/10 transition-colors inline-flex items-center gap-2 shrink-0 cursor-pointer no-underline"
              >
                {{ tag.label }}
                <svg class="w-3 h-3 shrink-0" fill="none" viewBox="0 0 24 24" stroke="currentColor" aria-hidden="true">
                  <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M14 5l7 7m0 0l-7 7m7-7H3" />
                </svg>
              </RouterLink>
            </div>
          </div>
        </div>
      </div>
    </div>
  </section>
</template>

<script setup lang="ts">
import { computed, onMounted, onUnmounted, ref } from 'vue'
import { RouterLink, useRouter } from 'vue-router'
import { hireTalentPath } from '@/constants/hire-talent.landing'

interface Stat { value: string; label: string }
interface HeroPopularTag {
  label: string
  slug: string
}
const activeTab = ref<'hire' | 'work'>('hire')

defineProps<{
  stats: readonly Stat[]
  popularTags: readonly HeroPopularTag[]
}>()

const router = useRouter()
const searchQuery = ref('')
const viewportWidth = ref(typeof window !== 'undefined' ? window.innerWidth : 1024)

function syncViewportWidth(): void {
  viewportWidth.value = window.innerWidth
}

const heroSearchPlaceholder = computed(() => {
  const w = viewportWidth.value
  if (w < 400) return 'Skills, role, or project…'
  if (w < 640) return 'What do you need to hire for?'
  if (w < 1024) return 'Describe what you need to hire for…'
  return 'Describe the skills or role you want to hire for…'
})

onMounted(() => {
  syncViewportWidth()
  window.addEventListener('resize', syncViewportWidth, { passive: true })
})

onUnmounted(() => {
  window.removeEventListener('resize', syncViewportWidth)
})

function handleSearch(): void {
  const q = searchQuery.value.trim()
  if (q) router.push({ path: '/browse-jobs', query: { search: q } })
}

function goToBrowseJobs(): void {
  router.push({ path: '/freelance-jobs' })
}
</script>
