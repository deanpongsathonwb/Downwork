<template>
  <div class="relative inline-flex" @mouseenter="show = true" @mouseleave="show = false">
    <slot />
    <Transition name="tooltip">
      <div
        v-if="show && text"
        :class="[
          'absolute z-50 px-2.5 py-1.5 text-xs font-medium text-white bg-slate-800 rounded-lg whitespace-nowrap pointer-events-none shadow-lg',
          positionClass,
        ]"
      >
        {{ text }}
        <div :class="['absolute w-2 h-2 bg-slate-800 rotate-45', arrowClass]" />
      </div>
    </Transition>
  </div>
</template>

<script setup lang="ts">
import { ref, computed } from 'vue'

interface Props {
  text?: string
  position?: 'top' | 'bottom' | 'left' | 'right'
}

const props = withDefaults(defineProps<Props>(), { position: 'top' })

const show = ref(false)

const positionClass = computed(() => ({
  top: 'bottom-full left-1/2 -translate-x-1/2 mb-2',
  bottom: 'top-full left-1/2 -translate-x-1/2 mt-2',
  left: 'right-full top-1/2 -translate-y-1/2 mr-2',
  right: 'left-full top-1/2 -translate-y-1/2 ml-2',
})[props.position])

const arrowClass = computed(() => ({
  top: 'top-full left-1/2 -translate-x-1/2 -mt-1',
  bottom: 'bottom-full left-1/2 -translate-x-1/2 -mb-1',
  left: 'left-full top-1/2 -translate-y-1/2 -ml-1',
  right: 'right-full top-1/2 -translate-y-1/2 -mr-1',
})[props.position])
</script>

<style scoped>
.tooltip-enter-active, .tooltip-leave-active { transition: opacity 0.15s, transform 0.15s; }
.tooltip-enter-from, .tooltip-leave-to { opacity: 0; transform: scale(0.95); }
</style>
