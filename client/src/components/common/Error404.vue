<template>
  <div class="min-h-screen bg-slate-50 flex items-center justify-center p-4">
    <div class="text-center max-w-md">
      <p class="text-8xl font-black text-slate-200 mb-4">404</p>
      <h1 class="text-2xl font-bold text-slate-900 mb-2">Page not found</h1>
      <p class="text-slate-500 mb-8">The page you're looking for doesn't exist or has been moved.</p>
      <RouterLink
        to="/"
        class="inline-flex items-center gap-2 px-6 py-3 bg-green-600 text-white font-medium rounded-xl hover:bg-green-700 transition-colors"
      >
        Back to Home
      </RouterLink>
    </div>
  </div>
</template>

<script setup lang="ts">
import { RouterLink } from 'vue-router'
</script>
