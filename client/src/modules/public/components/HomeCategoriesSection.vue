<template>
  <section class="py-20 bg-slate-50" aria-labelledby="categories-heading">
    <div class="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
      <div class="text-center mb-12">
        <h2 id="categories-heading" class="text-3xl font-bold text-slate-900 mb-3">Browse by Category</h2>
        <p class="text-slate-500">Find professionals in every field</p>
      </div>
      <div class="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
        <RouterLink
          v-for="cat in categories"
          :key="cat.value"
          :to="`/browse-jobs?category=${encodeURIComponent(cat.value)}`"
          class="bg-white rounded-2xl p-6 text-center hover:shadow-md hover:border-green-200 border border-slate-200 transition-all group"
          :aria-label="`Browse ${cat.label} jobs — ${cat.jobCount} available`"
        >
          <div class="text-4xl mb-3" aria-hidden="true">{{ cat.emoji }}</div>
          <p class="font-semibold text-slate-900 text-sm group-hover:text-green-700 transition-colors">{{ cat.label }}</p>
          <p class="text-xs text-slate-500 mt-1">{{ cat.jobCount }} jobs</p>
        </RouterLink>
      </div>
    </div>
  </section>
</template>

<script setup lang="ts">
import { RouterLink } from 'vue-router'
import type { CategoryMeta } from '@/constants/categories'

defineProps<{ categories: CategoryMeta[] }>()
</script>
