<template>
  <RouterView />
  <ToastContainer />
</template>

<script setup lang="ts">
import { onMounted } from 'vue'
import { RouterView } from 'vue-router'
import { useAuthStore } from '@/stores/auth.store'
import ToastContainer from '@/components/common/ToastContainer.vue'

const auth = useAuthStore()

// Restore session from localStorage on app boot
onMounted(() => {
  auth.hydrateFromStorage()
})
</script>
