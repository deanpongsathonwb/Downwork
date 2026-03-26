<template>
  <Suspense>
    <template #default>
      <slot />
    </template>
    <template #fallback>
      <div :class="['flex items-center justify-center', heightClass]">
        <div class="text-center">
          <svg
            class="animate-spin w-8 h-8 text-green-600 mx-auto mb-3"
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
          <p v-if="message" class="text-sm text-slate-500">
            {{ message }}
          </p>
        </div>
      </div>
    </template>
  </Suspense>
</template>

<script setup lang="ts">
import { computed } from 'vue'

interface Props {
  message?: string
  minHeight?: 'sm' | 'md' | 'lg' | 'full' | 'screen'
}

const props = withDefaults(defineProps<Props>(), {
  message: 'Loading...',
  minHeight: 'md',
})

const heightClass = computed(() => ({
  sm: 'min-h-[100px]',
  md: 'min-h-[200px]',
  lg: 'min-h-[400px]',
  full: 'min-h-full',
  screen: 'min-h-screen',
}[props.minHeight]))
</script>
