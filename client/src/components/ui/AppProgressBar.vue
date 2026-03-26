<template>
  <div>
    <div v-if="label || showValue" class="flex justify-between items-center mb-1.5">
      <span v-if="label" class="text-sm font-medium text-slate-700">{{ label }}</span>
      <span v-if="showValue" class="text-sm font-semibold" :class="valueColor">{{ value }}%</span>
    </div>
    <div :class="['w-full rounded-full overflow-hidden', heightClass, trackClass]">
      <div
        :class="['rounded-full transition-all duration-500', fillClass]"
        :style="{ width: `${Math.min(100, Math.max(0, value))}%` }"
      />
    </div>
    <p v-if="description" class="text-xs text-slate-500 mt-1">{{ description }}</p>
  </div>
</template>

<script setup lang="ts">
import { computed } from 'vue'

interface Props {
  value: number
  label?: string
  description?: string
  showValue?: boolean
  size?: 'xs' | 'sm' | 'md' | 'lg'
  color?: 'green' | 'blue' | 'yellow' | 'red' | 'purple' | 'auto'
}

const props = withDefaults(defineProps<Props>(), {
  showValue: false,
  size: 'sm',
  color: 'green',
})

const heightClass = computed(() => ({
  xs: 'h-1',
  sm: 'h-2',
  md: 'h-3',
  lg: 'h-4',
})[props.size])

const trackClass = 'bg-slate-200'

const effectiveColor = computed(() => {
  if (props.color !== 'auto') return props.color
  if (props.value >= 80) return 'green'
  if (props.value >= 50) return 'yellow'
  return 'red'
})

const fillClass = computed(() => ({
  green: 'bg-green-500',
  blue: 'bg-blue-500',
  yellow: 'bg-yellow-400',
  red: 'bg-red-500',
  purple: 'bg-purple-500',
})[effectiveColor.value])

const valueColor = computed(() => ({
  green: 'text-green-600',
  blue: 'text-blue-600',
  yellow: 'text-yellow-600',
  red: 'text-red-600',
  purple: 'text-purple-600',
})[effectiveColor.value])
</script>
