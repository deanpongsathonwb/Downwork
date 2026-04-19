<template>
  <section class="py-16 bg-[#f5f5f5]" aria-labelledby="how-it-works-heading">
    <div class="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
      <div class="flex items-center justify-between mb-8 gap-4 flex-wrap">
        <h2 id="how-it-works-heading" class="text-4xl font-semibold text-slate-900">How it works</h2>
        <div
          class="inline-flex items-center rounded-full border border-slate-400 bg-white p-0.5"
          role="tablist"
          aria-label="How it works mode"
        >
          <button
            type="button"
            role="tab"
            :aria-selected="activeMode === 'hiring'"
            class="px-8 py-2 text-base rounded-full transition-colors duration-200 cursor-pointer"
            :class="activeMode === 'hiring' ? 'bg-white border border-slate-900 text-slate-900' : 'text-slate-700'"
            @click="activeMode = 'hiring'"
          >
            For hiring
          </button>
          <button
            type="button"
            role="tab"
            :aria-selected="activeMode === 'findingWork'"
            class="px-8 py-2 text-base rounded-full transition-colors duration-200 cursor-pointer"
            :class="activeMode === 'findingWork' ? 'bg-white border border-slate-900 text-slate-900' : 'text-slate-700'"
            @click="activeMode = 'findingWork'"
          >
            For finding work
          </button>
        </div>
      </div>

      <ol class="grid grid-cols-1 md:grid-cols-3 gap-7 list-none">
        <li
          v-for="(card, index) in cards"
          :key="card.title"
          class="group cursor-pointer"
          @mouseenter="hoveredIndex = index"
          @mouseleave="hoveredIndex = null"
          @focusin="hoveredIndex = index"
          @focusout="hoveredIndex = null"
        >
          <div
            class="h-[210px] rounded-2xl relative overflow-hidden"
            :class="[
              card.mediaTone,
              card.logoTone,
            ]"
            aria-hidden="true"
          >
            <div class="absolute inset-0 bg-gradient-to-tr from-transparent via-white/10 to-black/10" />
            <div class="absolute inset-0 flex items-center justify-center px-2">
              <span class="text-4xl md:text-5xl font-black tracking-tight whitespace-nowrap">Downwork</span>
            </div>
            <div class="absolute right-4 bottom-4 h-10 w-10 rounded-full bg-white/90 flex items-center justify-center text-slate-500 text-xl font-bold">
              <span class="-mt-0.5">||</span>
            </div>
          </div>

          <h3
            class="text-lg sm:text-xl md:text-xl lg:text-2xl leading-tight font-medium text-slate-900 mt-5 mb-2 min-h-[3rem] md:min-h-[3.25rem]"
          >
            {{ card.title }}
          </h3>

          <div
            class="min-h-[124px] transition-opacity duration-200"
            :class="hoveredIndex === index ? 'opacity-100' : 'opacity-0 pointer-events-none'"
          >
            <p class="text-slate-500 text-base leading-snug mb-4">{{ card.description }}</p>
            <button
              type="button"
              class="w-full h-12 rounded-lg bg-[#108a00] text-white text-base font-semibold hover:bg-[#0e7a00] transition-colors cursor-pointer"
            >
              {{ card.cta }}
            </button>
          </div>
        </li>
      </ol>
    </div>
  </section>
</template>

<script setup lang="ts">
import { computed, ref } from 'vue'

type Mode = 'hiring' | 'findingWork'
interface Card {
  title: string
  description: string
  cta: string
  mediaTone: string
  logoTone: string
}

const activeMode = ref<Mode>('hiring')
const hoveredIndex = ref<number | null>(null)

const cardsByMode: Record<Mode, Card[]> = {
  hiring: [
    {
      title: 'Posting jobs is always free',
      description: 'Generate a job post with AI or create your own and filter talent matches.',
      cta: 'Create a job',
      mediaTone: 'bg-gradient-to-br from-lime-200 via-green-100 to-emerald-200',
      logoTone: 'text-slate-900',
    },
    {
      title: 'Get proposals and hire',
      description: 'Screen, interview, or book a consult with an expert before hiring.',
      cta: 'Explore experts',
      mediaTone: 'bg-gradient-to-br from-orange-200 via-amber-100 to-stone-200',
      logoTone: 'text-slate-900',
    },
    {
      title: 'Pay when work is done',
      description: 'Release payments after approving work, by milestone or upon project completion.',
      cta: 'View pricing',
      mediaTone: 'bg-gradient-to-br from-slate-500 via-slate-600 to-slate-700',
      logoTone: 'text-white',
    },
  ],
  findingWork: [
    {
      title: 'Find clients and remote jobs',
      description: 'Create your profile to highlight your best work and attract top clients.',
      cta: 'Create a profile',
      mediaTone: 'bg-black',
      logoTone: 'text-white',
    },
    {
      title: 'Submit proposals for work',
      description: 'Negotiate rates for the projects you want or reply to invites from clients.',
      cta: 'Search jobs',
      mediaTone: 'bg-gradient-to-br from-slate-400 via-zinc-300 to-slate-400',
      logoTone: 'text-slate-900',
    },
    {
      title: 'Get paid as you deliver work',
      description: 'Land a contract, do the work you love, and get paid on time.',
      cta: 'Estimate earnings',
      mediaTone: 'bg-gradient-to-br from-rose-200 via-orange-100 to-yellow-100',
      logoTone: 'text-slate-900',
    },
  ],
}

const cards = computed(() => cardsByMode[activeMode.value])
</script>
