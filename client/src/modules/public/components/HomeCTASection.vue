<template>
  <section class="bg-white py-12 md:py-16" aria-labelledby="cta-heading">
    <div class="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
      <div
        class="rounded-3xl bg-gradient-to-r from-lime-400 via-lime-500 to-emerald-700 px-6 py-16 text-center shadow-sm md:px-12 md:py-20"
      >
        <h2
          id="cta-heading"
          class="mx-auto mb-10 text-center text-[clamp(0.75rem,calc(2.1vw+0.2rem),2.25rem)] font-bold tracking-tight whitespace-nowrap text-white"
        >
          Find freelancers who can help you build what's next
        </h2>
        <RouterLink
          :to="{ name: 'talent-search' }"
          class="inline-flex items-center justify-center rounded-lg bg-white px-8 py-3.5 text-sm font-semibold text-slate-900 shadow-sm transition-colors hover:bg-slate-50"
        >
          Explore freelancers
        </RouterLink>
      </div>
    </div>
  </section>
</template>

<script setup lang="ts">
import { RouterLink } from 'vue-router'
</script>
