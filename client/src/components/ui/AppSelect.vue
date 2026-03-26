<template>
  <div class="flex flex-col gap-1.5">
    <label v-if="label" :for="selectId" class="text-sm font-medium text-slate-700">
      {{ label }}
      <span v-if="required" class="text-red-500 ml-0.5">*</span>
    </label>
    <select
      :id="selectId"
      v-model="modelValue"
      :disabled="disabled"
      :required="required"
      :class="[
        'w-full border border-slate-300 rounded-xl px-4 py-2.5 text-sm text-slate-900 bg-white transition-colors focus:outline-none focus:ring-2 focus:ring-green-500 focus:border-transparent disabled:bg-slate-50 appearance-none cursor-pointer',
        error ? 'border-red-400 bg-red-50' : '',
      ]"
    >
      <option v-if="placeholder" value="" disabled>{{ placeholder }}</option>
      <option v-for="opt in options" :key="String(opt.value)" :value="opt.value" :disabled="opt.disabled">
        {{ opt.label }}
      </option>
    </select>
    <p v-if="error" class="text-xs text-red-600">{{ error }}</p>
  </div>
</template>

<script setup lang="ts">
import { computed } from 'vue'
import type { SelectOption } from '@/types'

interface Props {
  modelValue?: string | number
  options: SelectOption[]
  label?: string
  placeholder?: string
  error?: string
  disabled?: boolean
  required?: boolean
  id?: string
}

const props = defineProps<Props>()
const emit = defineEmits<{ 'update:modelValue': [value: string | number] }>()

const selectId = computed(() => props.id ?? `select-${Math.random().toString(36).slice(2)}`)
const modelValue = computed({
  get: () => props.modelValue ?? '',
  set: (v) => emit('update:modelValue', v),
})
</script>
