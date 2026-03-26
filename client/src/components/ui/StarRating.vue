<template>
  <div class="flex items-center gap-0.5">
    <button
      v-for="i in 5"
      :key="i"
      :disabled="!interactive"
      :class="[
        'transition-transform',
        interactive ? 'hover:scale-110 cursor-pointer' : 'cursor-default',
      ]"
      type="button"
      @click="interactive && emit('update:modelValue', i)"
      @mouseover="interactive && (hovered = i)"
      @mouseleave="interactive && (hovered = 0)"
    >
      <svg
        :class="[sizeClass, (hovered || modelValue) >= i ? 'text-yellow-400 fill-yellow-400' : 'text-slate-300 fill-slate-300']"
        viewBox="0 0 24 24"
        stroke="none"
      >
        <polygon points="12 2 15.09 8.26 22 9.27 17 14.14 18.18 21.02 12 17.77 5.82 21.02 7 14.14 2 9.27 8.91 8.26 12 2" />
      </svg>
    </button>
    <span v-if="showValue && modelValue" class="text-sm text-slate-600 ml-1">{{ modelValue.toFixed(1) }}</span>
  </div>
</template>

<script setup lang="ts">
import { ref, computed } from 'vue'

interface Props {
  modelValue?: number
  interactive?: boolean
  size?: 'sm' | 'md' | 'lg'
  showValue?: boolean
}

const props = withDefaults(defineProps<Props>(), {
  modelValue: 0,
  interactive: false,
  size: 'md',
  showValue: false,
})

const emit = defineEmits<{ 'update:modelValue': [value: number] }>()
const hovered = ref(0)

const sizeClass = computed(() => ({ sm: 'w-4 h-4', md: 'w-5 h-5', lg: 'w-6 h-6' }[props.size]))
</script>
