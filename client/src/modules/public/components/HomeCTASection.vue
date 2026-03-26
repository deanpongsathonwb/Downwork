<template>
  <section class="py-20 bg-green-600" aria-labelledby="cta-heading">
    <div class="max-w-4xl mx-auto px-4 text-center">
      <h2 id="cta-heading" class="text-4xl font-black text-white mb-4">Ready to get started?</h2>
      <p class="text-green-100 text-lg mb-8">Join over 2 million freelancers and clients on Downwork.</p>
      <div class="flex flex-col sm:flex-row gap-4 justify-center">
        <RouterLink
          to="/auth/register"
          class="px-8 py-4 bg-white text-green-700 font-bold rounded-2xl hover:bg-green-50 transition-colors text-sm"
        >
          Find Work
        </RouterLink>
        <RouterLink
          to="/auth/register"
          class="px-8 py-4 bg-green-700 text-white font-bold rounded-2xl hover:bg-green-800 transition-colors text-sm border border-green-500"
        >
          Hire Freelancers
        </RouterLink>
      </div>
    </div>
  </section>
</template>

<script setup lang="ts">
import { RouterLink } from 'vue-router'
</script>
