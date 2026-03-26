<template>
  <div v-if="totalPages > 1" class="flex items-center justify-between gap-4">
    <p class="text-sm text-slate-500">
      Showing <strong>{{ from }}–{{ to }}</strong> of <strong>{{ total }}</strong> results
    </p>

    <div class="flex items-center gap-1">
      <!-- Prev -->
      <button
        :disabled="currentPage === 1"
        class="p-2 rounded-lg border border-slate-200 text-slate-600 hover:bg-slate-50 disabled:opacity-40 disabled:cursor-not-allowed transition-colors"
        @click="$emit('update:currentPage', currentPage - 1)"
      >
        <svg class="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
          <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M15 19l-7-7 7-7" />
        </svg>
      </button>

      <!-- Page numbers -->
      <template v-for="page in visiblePages" :key="page">
        <span v-if="page === '...'" class="px-2 text-slate-400 text-sm">…</span>
        <button
          v-else
          :class="[
            'w-9 h-9 rounded-lg text-sm font-medium transition-colors',
            page === currentPage
              ? 'bg-green-600 text-white'
              : 'border border-slate-200 text-slate-600 hover:bg-slate-50',
          ]"
          @click="$emit('update:currentPage', page as number)"
        >
          {{ page }}
        </button>
      </template>

      <!-- Next -->
      <button
        :disabled="currentPage === totalPages"
        class="p-2 rounded-lg border border-slate-200 text-slate-600 hover:bg-slate-50 disabled:opacity-40 disabled:cursor-not-allowed transition-colors"
        @click="$emit('update:currentPage', currentPage + 1)"
      >
        <svg class="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
          <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 5l7 7-7 7" />
        </svg>
      </button>
    </div>
  </div>
</template>

<script setup lang="ts">
import { computed } from 'vue'

interface Props {
  currentPage: number
  totalPages: number
  total: number
  perPage?: number
}

const props = withDefaults(defineProps<Props>(), { perPage: 12 })
defineEmits<{ 'update:currentPage': [page: number] }>()

const from = computed(() => Math.min((props.currentPage - 1) * props.perPage + 1, props.total))
const to = computed(() => Math.min(props.currentPage * props.perPage, props.total))

const visiblePages = computed(() => {
  const pages: (number | '...')[] = []
  const total = props.totalPages
  const current = props.currentPage

  if (total <= 7) {
    return Array.from({ length: total }, (_, i) => i + 1)
  }

  pages.push(1)
  if (current > 3) pages.push('...')
  for (let i = Math.max(2, current - 1); i <= Math.min(total - 1, current + 1); i++) {
    pages.push(i)
  }
  if (current < total - 2) pages.push('...')
  pages.push(total)

  return pages
})
</script>
