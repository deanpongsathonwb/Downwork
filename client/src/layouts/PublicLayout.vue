<template>
  <div class="min-h-screen flex flex-col bg-white">
    <PublicNavbar />

    <main class="flex-1">
      <RouterView />
    </main>

    <PublicFooter />
  </div>
</template>

<script setup lang="ts">
import { RouterView } from 'vue-router'
import PublicNavbar from '@/components/layout/PublicNavbar.vue'
import PublicFooter from '@/components/layout/PublicFooter.vue'
</script>
