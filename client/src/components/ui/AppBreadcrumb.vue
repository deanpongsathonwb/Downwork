<template>
  <nav class="flex items-center gap-1.5 text-sm">
    <template v-for="(item, i) in items" :key="i">
      <RouterLink
        v-if="item.route && i < items.length - 1"
        :to="item.route"
        class="text-slate-500 hover:text-slate-700 transition-colors font-medium"
      >
        {{ item.label }}
      </RouterLink>
      <span
        v-else
        :class="['font-medium', i === items.length - 1 ? 'text-slate-900' : 'text-slate-500']"
      >
        {{ item.label }}
      </span>

      <svg
        v-if="i < items.length - 1"
        class="w-3.5 h-3.5 text-slate-300 shrink-0"
        fill="none"
        viewBox="0 0 24 24"
        stroke="currentColor"
      >
        <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 5l7 7-7 7" />
      </svg>
    </template>
  </nav>
</template>

<script setup lang="ts">
import { RouterLink } from 'vue-router'
import type { BreadcrumbItem } from '@/types'

defineProps<{ items: BreadcrumbItem[] }>()
</script>
