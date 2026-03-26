<template>
  <div>
    <!-- Tab Header -->
    <div
      :class="[
        'flex',
        variant === 'pills' ? 'gap-1 bg-slate-100 p-1 rounded-xl w-fit' : '',
        variant === 'underline' ? 'border-b border-slate-200 gap-0' : '',
        variant === 'buttons' ? 'gap-2 flex-wrap' : '',
      ]"
    >
      <button
        v-for="tab in tabs"
        :key="tab.value"
        :disabled="tab.disabled"
        :class="[
          'flex items-center gap-2 font-medium transition-colors disabled:opacity-50 disabled:cursor-not-allowed',
          variant === 'pills'
            ? ['px-4 py-2 text-sm rounded-lg', modelValue === tab.value ? 'bg-white text-slate-900 shadow-sm' : 'text-slate-500 hover:text-slate-700']
            : '',
          variant === 'underline'
            ? ['px-4 py-3 text-sm border-b-2 -mb-px', modelValue === tab.value ? 'border-green-600 text-green-600' : 'border-transparent text-slate-500 hover:text-slate-700 hover:border-slate-300']
            : '',
          variant === 'buttons'
            ? ['px-4 py-2 text-sm rounded-xl border', modelValue === tab.value ? 'bg-blue-600 text-white border-blue-600' : 'bg-white text-slate-600 border-slate-200 hover:border-slate-300']
            : '',
        ]"
        @click="!tab.disabled && $emit('update:modelValue', tab.value)"
      >
        <span v-if="tab.icon" class="w-4 h-4" v-html="tab.icon" />
        {{ tab.label }}
        <span
          v-if="tab.badge !== undefined"
          :class="['inline-flex items-center justify-center w-5 h-5 text-xs font-bold rounded-full', modelValue === tab.value ? 'bg-white text-blue-600' : 'bg-slate-200 text-slate-600']"
        >
          {{ tab.badge }}
        </span>
      </button>
    </div>

    <!-- Tab Content -->
    <div class="mt-4">
      <slot />
    </div>
  </div>
</template>

<script setup lang="ts">
interface Tab {
  label: string
  value: string
  badge?: number | string
  icon?: string
  disabled?: boolean
}

interface Props {
  modelValue: string
  tabs: Tab[]
  variant?: 'pills' | 'underline' | 'buttons'
}

withDefaults(defineProps<Props>(), {
  variant: 'pills',
})

defineEmits<{ 'update:modelValue': [value: string] }>()
</script>
