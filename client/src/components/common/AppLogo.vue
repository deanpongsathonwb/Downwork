<template>
  <RouterLink to="/" class="inline-flex items-center gap-2 shrink-0" :aria-label="`${appName} – Go to home`">
    <span v-if="showText" :class="['font-bold uppercase', textSizeClass, textColorClass]">{{ appName }}</span>
  </RouterLink>
</template>

<script setup lang="ts">
import { computed } from 'vue'
import { RouterLink } from 'vue-router'
import { APP_CONFIG } from '@/config/app.config'

interface Props {
  size?: 'sm' | 'md' | 'lg'
  variant?: 'default' | 'dark' | 'admin'
  showText?: boolean
}

const props = withDefaults(defineProps<Props>(), {
  size: 'md',
  variant: 'default',
  showText: true,
})

const appName = APP_CONFIG.name

const textSizeClass = computed(() => ({
  sm: 'text-base',
  md: 'text-xl',
  lg: 'text-2xl',
}[props.size]))

const textColorClass = computed(() => ({
  default: 'text-slate-900',
  dark: 'text-white',
  admin: 'text-white',
}[props.variant]))
</script>
