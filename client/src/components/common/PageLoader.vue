<template>
  <div
    :class="[
      'flex items-center justify-center',
      fullScreen ? 'fixed inset-0 bg-white/80 backdrop-blur-sm z-50' : heightClass,
    ]"
  >
    <div class="text-center">
      <svg
        :class="['animate-spin text-green-600 mx-auto', sizeClass]"
        fill="none"
        viewBox="0 0 24 24"
      >
        <circle
          class="opacity-25"
          cx="12"
          cy="12"
          r="10"
          stroke="currentColor"
          stroke-width="4"
        />
        <path
          class="opacity-75"
          fill="currentColor"
          d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4z"
        />
      </svg>
      <p v-if="message" class="text-sm text-slate-500 mt-3">
        {{ message }}
      </p>
    </div>
  </div>
</template>

<script setup lang="ts">
import { computed } from 'vue'

interface Props {
  message?: string
  size?: 'sm' | 'md' | 'lg'
  fullScreen?: boolean
  minHeight?: 'sm' | 'md' | 'lg' | 'full'
}

const props = withDefaults(defineProps<Props>(), {
  size: 'md',
  fullScreen: false,
  minHeight: 'md',
})

const sizeClass = computed(() => ({
  sm: 'w-6 h-6',
  md: 'w-10 h-10',
  lg: 'w-14 h-14',
}[props.size]))

const heightClass = computed(() => ({
  sm: 'min-h-[100px]',
  md: 'min-h-[200px]',
  lg: 'min-h-[400px]',
  full: 'min-h-full',
}[props.minHeight]))
</script>
