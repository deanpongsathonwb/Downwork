<template>
  <div class="min-h-screen flex flex-col bg-white">
    <PublicNavbar />

    <main class="flex-1 min-w-0 overflow-x-hidden">
      <RouterView />
    </main>

    <div class="shrink-0 pb-4 pt-2 sm:pb-6 lg:pb-8">
      <PublicFooter />
    </div>
  </div>
</template>

<script setup lang="ts">
import { RouterView } from 'vue-router'
import PublicNavbar from '@/components/layout/PublicNavbar.vue'
import PublicFooter from '@/components/layout/PublicFooter.vue'
</script>
