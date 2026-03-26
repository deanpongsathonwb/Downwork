<template>
  <div class="min-h-screen bg-gradient-to-br from-slate-900 via-green-950 to-slate-900 flex items-center justify-center p-4">
    <div class="w-full max-w-md">
      <!-- Logo -->
      <div class="text-center mb-8 flex justify-center">
        <AppLogo size="lg" variant="dark" />
      </div>

      <!-- Card -->
      <div class="bg-white rounded-2xl shadow-2xl p-8">
        <RouterView />
      </div>

      <!-- Footer links -->
      <p class="text-center text-slate-400 text-sm mt-6">
        &copy; {{ year }} Downwork. All rights reserved.
      </p>
    </div>
  </div>
</template>

<script setup lang="ts">
import { computed } from 'vue'
import { RouterView } from 'vue-router'
import AppLogo from '@/components/common/AppLogo.vue'

const year = computed(() => new Date().getFullYear())
</script>
