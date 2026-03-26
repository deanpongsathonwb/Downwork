<template>
  <slot v-if="!hasError" />
  <div v-else class="min-h-[200px] flex items-center justify-center p-8">
    <div class="text-center max-w-md">
      <div
        class="w-16 h-16 mx-auto mb-4 bg-red-100 rounded-full flex items-center justify-center"
      >
        <svg
          class="w-8 h-8 text-red-500"
          fill="none"
          viewBox="0 0 24 24"
          stroke="currentColor"
        >
          <path
            stroke-linecap="round"
            stroke-linejoin="round"
            stroke-width="2"
            d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z"
          />
        </svg>
      </div>
      <h3 class="text-lg font-semibold text-slate-900 mb-2">
        {{ title }}
      </h3>
      <p class="text-sm text-slate-600 mb-4">
        {{ message }}
      </p>
      <button
        v-if="showRetry"
        class="inline-flex items-center gap-2 px-4 py-2 bg-slate-900 text-white text-sm font-medium rounded-lg hover:bg-slate-800 transition-colors"
        @click="handleRetry"
      >
        <svg class="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
          <path
            stroke-linecap="round"
            stroke-linejoin="round"
            stroke-width="2"
            d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15"
          />
        </svg>
        Try Again
      </button>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, onErrorCaptured } from 'vue'
import { logger } from '@/utils/logger'

interface Props {
  title?: string
  message?: string
  showRetry?: boolean
}

withDefaults(defineProps<Props>(), {
  title: 'Something went wrong',
  message: 'An unexpected error occurred. Please try again or refresh the page.',
  showRetry: true,
})

const emit = defineEmits<{
  error: [error: Error, info: string]
  retry: []
}>()

const hasError = ref(false)
const capturedError = ref<Error | null>(null)

onErrorCaptured((error: Error, _instance, info: string) => {
  hasError.value = true
  capturedError.value = error

  logger.error(`ErrorBoundary caught: ${error.message}`, { error, info }, 'ErrorBoundary')

  emit('error', error, info)

  return false
})

function handleRetry(): void {
  hasError.value = false
  capturedError.value = null
  emit('retry')
}

defineExpose({
  hasError,
  capturedError,
  reset: handleRetry,
})
</script>
