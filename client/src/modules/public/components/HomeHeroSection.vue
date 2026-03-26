<template>
  <section class="relative bg-white pt-4 pb-12" aria-label="Hero">
    <div class="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
      <div 
        class="relative min-h-[560px] flex items-center rounded-[40px] overflow-hidden bg-cover bg-center bg-no-repeat"
        style="background-image: url('https://images.unsplash.com/photo-1522071820081-009f0129c71c?auto=format&fit=crop&q=80&w=2070');"
      >
        <!-- Overlay for better text readability -->
        <div class="absolute inset-0 bg-gradient-to-r from-black/70 via-black/40 to-transparent"></div>

        <div class="relative w-full px-8 md:px-16 py-16">
          <div class="max-w-3xl">
            <h1 class="text-5xl lg:text-7xl font-bold leading-tight mb-6 text-white tracking-tight">
              Hire the experts your<br />
              business needs
            </h1>

            <p class="text-xl md:text-2xl text-white/90 leading-relaxed mb-10 max-w-2xl font-medium">
              Access skilled freelancers ready to help you build and scale — without the full-time commitment
            </p>

            <!-- Action Toggle -->
            <div class="flex items-center bg-black/20 backdrop-blur-md border border-white/10 rounded-full mb-10 overflow-hidden max-w-2xl">
              <button 
                class="flex-1 px-8 py-2.5 rounded-full font-bold transition-all border-2"
                :class="activeTab === 'hire' ? 'bg-white/10 text-white border-white' : 'text-white/80 hover:text-white border-transparent'"
                @click="activeTab = 'hire'"
              >
                I want to hire
              </button>
              <button 
                class="flex-1 px-8 py-2.5 rounded-full font-bold transition-all border-2"
                :class="activeTab === 'work' ? 'bg-white/10 text-white border-white' : 'text-white/80 hover:text-white border-transparent'"
                @click="activeTab = 'work'"
              >
                I want to work
              </button>
            </div>

            <!-- Search Bar -->
            <form class="relative max-w-2xl mb-10" role="search" @submit.prevent="handleSearch">
              <input
                id="hero-search"
                v-model="searchQuery"
                type="text"
                placeholder="Describe what you need to hire for..."
                class="w-full bg-white text-slate-900 placeholder-slate-500 rounded-full py-4 pl-6 pr-32 outline-none text-lg shadow-xl"
              />
              <button 
                type="submit"
                class="absolute right-2 top-2 bottom-2 bg-slate-900 text-white px-8 rounded-full flex items-center gap-2 hover:bg-slate-800 transition-colors"
              >
                <svg class="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
                </svg>
                <span class="font-bold">Search</span>
              </button>
            </form>

            <!-- Popular Tags -->
            <div class="flex flex-nowrap gap-3 items-center overflow-hidden">
              <button
                v-for="tag in popularTags.slice(0, 4)"
                :key="tag"
                class="whitespace-nowrap px-4 py-1.5 rounded-full border border-white/30 text-white text-sm hover:bg-white/10 transition-colors flex items-center gap-2 shrink-0"
                @click="searchByTag(tag)"
              >
                {{ tag }}
                <svg class="w-3 h-3" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M14 5l7 7m0 0l-7 7m7-7H3" />
                </svg>
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  </section>
</template>

<script setup lang="ts">
import { ref } from 'vue'
import { useRouter } from 'vue-router'

interface Stat { value: string; label: string }
const activeTab = ref<'hire' | 'work'>('hire')

defineProps<{
  stats: readonly Stat[]
  popularTags: readonly string[]
}>()

const router = useRouter()
const searchQuery = ref('')

function handleSearch(): void {
  const q = searchQuery.value.trim()
  if (q) router.push({ path: '/browse-jobs', query: { search: q } })
}

function searchByTag(tag: string): void {
  searchQuery.value = tag
  router.push({ path: '/browse-jobs', query: { search: tag } })
}
</script>
