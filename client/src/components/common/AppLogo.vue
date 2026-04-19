<template>
  <RouterLink
    :to="homeTarget"
    class="inline-flex items-center gap-2 shrink-0"
    :aria-label="`${appName} – Go to home`"
  >
    <img
      v-if="showMark"
      src="/favicon.svg"
      alt=""
      class="h-9 w-9 rounded-[10px] select-none"
      width="36"
      height="36"
      decoding="async"
    />
    <span
      v-if="showText"
      :class="[
        wordmark ? 'font-normal lowercase tracking-tight' : 'font-bold uppercase',
        textSizeClass,
        textColorClass,
      ]"
    >{{ displayName }}</span>
  </RouterLink>
</template>

<script setup lang="ts">
import { computed } from 'vue'
import { RouterLink } from 'vue-router'
import { APP_CONFIG } from '@/config/app.config'
import { useAuthStore } from '@/stores/auth.store'

interface Props {
  size?: 'sm' | 'md' | 'lg'
  variant?: 'default' | 'dark' | 'admin'
  showText?: boolean
  /** Lowercase wordmark (e.g. auth header). */
  wordmark?: boolean
  /** Green “D” mark beside the wordmark. */
  showMark?: boolean
}

const props = withDefaults(defineProps<Props>(), {
  size: 'md',
  variant: 'default',
  showText: true,
  wordmark: false,
  showMark: false,
})

const appName = APP_CONFIG.name
const auth = useAuthStore()

const homeTarget = computed(() =>
  auth.isAuthenticated && auth.role === 'client'
    ? { name: 'client-job-post-instant-welcome' as const }
    : '/',
)

const displayName = computed(() => (props.wordmark ? appName.toLowerCase() : appName))

const textSizeClass = computed(() => {
  if (props.wordmark) {
    return { sm: 'text-lg', md: 'text-xl', lg: 'text-[1.75rem] leading-none' }[props.size]
  }
  return { sm: 'text-base', md: 'text-xl', lg: 'text-2xl' }[props.size]
})

const textColorClass = computed(() => ({
  default: 'text-slate-900',
  dark: 'text-white',
  admin: 'text-white',
}[props.variant]))
</script>
