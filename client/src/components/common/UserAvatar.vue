<template>
  <div
    :class="[
      'rounded-full flex items-center justify-center shrink-0 font-semibold overflow-hidden',
      sizeClass,
      !src ? colorClass : '',
    ]"
  >
    <img v-if="src" :src="src" :alt="name" class="w-full h-full object-cover" />
    <span v-else :class="textSizeClass">{{ initials }}</span>
  </div>
</template>

<script setup lang="ts">
import { computed } from 'vue'

interface Props {
  name?: string
  src?: string
  size?: 'xs' | 'sm' | 'md' | 'lg' | 'xl'
}

const props = withDefaults(defineProps<Props>(), { name: 'User', size: 'md' })

const initials = computed(() => {
  const parts = (props.name ?? 'U').split(' ')
  return parts
    .slice(0, 2)
    .map((p) => p[0]?.toUpperCase() ?? '')
    .join('')
})

const colors = ['bg-violet-500 text-white', 'bg-blue-500 text-white', 'bg-green-500 text-white', 'bg-orange-500 text-white', 'bg-pink-500 text-white', 'bg-teal-500 text-white']
const colorClass = computed(() => {
  const idx = (props.name?.charCodeAt(0) ?? 0) % colors.length
  return colors[idx]
})

const sizeClass = computed(() => ({
  xs: 'w-6 h-6',
  sm: 'w-8 h-8',
  md: 'w-10 h-10',
  lg: 'w-14 h-14',
  xl: 'w-20 h-20',
}[props.size]))

const textSizeClass = computed(() => ({
  xs: 'text-xs',
  sm: 'text-xs',
  md: 'text-sm',
  lg: 'text-lg',
  xl: 'text-2xl',
}[props.size]))
</script>
