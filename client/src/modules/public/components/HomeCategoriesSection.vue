<template>
  <section class="bg-white py-16 md:py-20" aria-labelledby="categories-heading">
    <div class="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
      <h2 id="categories-heading" class="text-2xl font-bold tracking-tight text-neutral-900 sm:text-3xl mb-10 md:mb-12">
        Find freelancers for every type of work
      </h2>
      <div
        class="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-4 md:gap-5"
        role="list"
      >
        <RouterLink
          v-for="cat in categories"
          :key="cat.label"
          :to="cat.to"
          class="group rounded-xl border border-transparent bg-white p-5 shadow-[0_1px_3px_rgba(0,0,0,0.08),0_1px_2px_rgba(0,0,0,0.06)] transition-[border-color,box-shadow] duration-200 hover:border-neutral-500 hover:shadow-md"
          role="listitem"
          :aria-label="`Find ${cat.label} freelancers`"
        >
          <HomeCategoryIcon :name="cat.icon" class="mb-4" />
          <p class="text-left text-[15px] font-medium leading-snug text-neutral-900">
            {{ cat.label }}
          </p>
        </RouterLink>
      </div>
    </div>
  </section>
</template>

<script setup lang="ts">
import { RouterLink } from 'vue-router'
import HomeCategoryIcon from '@/modules/public/components/HomeCategoryIcon.vue'
import type { HomeBrowseCategory } from '@/constants/categories'

defineProps<{ categories: HomeBrowseCategory[] }>()
</script>
