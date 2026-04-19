<template>
  <div class="relative" ref="dropdownRef">
    <div @click="toggle">
      <slot name="trigger" />
    </div>
    <Transition
      enter-active-class="transition ease-out duration-100"
      enter-from-class="transform opacity-0 scale-95"
      enter-to-class="transform opacity-100 scale-100"
      leave-active-class="transition ease-in duration-75"
      leave-from-class="transform opacity-100 scale-100"
      leave-to-class="transform opacity-0 scale-95"
    >
      <div
        v-if="isOpen"
        class="absolute z-50 mt-2 rounded-lg focus:outline-none"
        :class="[
          alignRight ? 'right-0' : 'left-0',
          widthClass,
          props.plain ? '' : 'bg-white shadow-lg ring-1 ring-black/5',
        ]"
      >
        <div :class="props.plain ? '' : 'py-1'">
          <slot />
        </div>
      </div>
    </Transition>
  </div>
</template>

<script setup lang="ts">
import { ref, onMounted, onBeforeUnmount } from 'vue'

interface Props {
  alignRight?: boolean
  width?: 'sm' | 'md' | 'lg' | 'xl' | '2xl'
  plain?: boolean
}

const props = withDefaults(defineProps<Props>(), {
  alignRight: true,
  width: 'md',
  plain: false,
})

const isOpen = ref(false)
const dropdownRef = ref<HTMLElement | null>(null)

const widthClass = {
  sm: 'w-40',
  md: 'w-48',
  lg: 'w-56',
  xl: 'w-64',
  '2xl': 'w-72',
}[props.width]

function toggle() {
  isOpen.value = !isOpen.value
}

function close() {
  isOpen.value = false
}

function handleClickOutside(e: MouseEvent) {
  if (dropdownRef.value && !dropdownRef.value.contains(e.target as Node)) {
    close()
  }
}

function handleEscape(e: KeyboardEvent) {
  if (e.key === 'Escape') close()
}

onMounted(() => {
  document.addEventListener('click', handleClickOutside)
  document.addEventListener('keydown', handleEscape)
})

onBeforeUnmount(() => {
  document.removeEventListener('click', handleClickOutside)
  document.removeEventListener('keydown', handleEscape)
})

defineExpose({ close })
</script>
