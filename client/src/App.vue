<template>
  <RouterView />
  <ToastContainer />
</template>

<script setup lang="ts">
import { onMounted } from 'vue'
import { RouterView } from 'vue-router'
import { useAuthStore } from '@/stores/auth.store'
import { useUIStore } from '@/stores/ui.store'
import ToastContainer from '@/components/common/ToastContainer.vue'

const auth = useAuthStore()
const ui = useUIStore()

// Restore session from localStorage on app boot
onMounted(() => {
  ui.initTheme()
  auth.hydrateFromStorage()
})
</script>
