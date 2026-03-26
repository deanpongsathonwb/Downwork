<template>
  <div class="divide-y divide-slate-200 border border-slate-200 rounded-2xl overflow-hidden">
    <div v-for="(item, i) in items" :key="i">
      <button
        class="w-full flex items-center justify-between px-5 py-4 text-left hover:bg-slate-50 transition-colors"
        @click="toggle(i)"
      >
        <span class="font-medium text-slate-900 text-sm">{{ item.question }}</span>
        <svg
          :class="['w-5 h-5 text-slate-400 transition-transform duration-200 shrink-0 ml-4', openIndex === i ? 'rotate-180' : '']"
          fill="none"
          viewBox="0 0 24 24"
          stroke="currentColor"
        >
          <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M19 9l-7 7-7-7" />
        </svg>
      </button>
      <Transition name="accordion">
        <div v-if="openIndex === i" class="px-5 pb-4">
          <p class="text-sm text-slate-600 leading-relaxed">{{ item.answer }}</p>
        </div>
      </Transition>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref } from 'vue'

interface AccordionItem {
  question: string
  answer: string
}

defineProps<{ items: AccordionItem[] }>()

const openIndex = ref<number | null>(null)

function toggle(i: number) {
  openIndex.value = openIndex.value === i ? null : i
}
</script>

<style scoped>
.accordion-enter-active, .accordion-leave-active { transition: all 0.2s ease; overflow: hidden; }
.accordion-enter-from, .accordion-leave-to { max-height: 0; opacity: 0; }
.accordion-enter-to, .accordion-leave-from { max-height: 400px; opacity: 1; }
</style>
