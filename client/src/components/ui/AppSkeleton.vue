<template>
  <div
    :class="[
      'animate-pulse bg-slate-200 rounded',
      props.class,
      roundedClass,
    ]"
    :style="{ width: width, height: height }"
  />
</template>

<script setup lang="ts">
interface Props {
  width?: string
  height?: string
  rounded?: 'sm' | 'md' | 'lg' | 'xl' | '2xl' | 'full'
  class?: string
}

const props = withDefaults(defineProps<Props>(), {
  width: '100%',
  height: '1rem',
  rounded: 'md',
})

const roundedClass = {
  sm: 'rounded-sm',
  md: 'rounded-md',
  lg: 'rounded-lg',
  xl: 'rounded-xl',
  '2xl': 'rounded-2xl',
  full: 'rounded-full',
}[props.rounded]
</script>
