<template>
  <div class="flex flex-col gap-1.5">
    <label v-if="label" :for="textareaId" class="text-sm font-medium text-slate-700">
      {{ label }}
      <span v-if="required" class="text-red-500 ml-0.5">*</span>
    </label>
    <textarea
      :id="textareaId"
      v-model="modelValue"
      :rows="rows"
      :placeholder="placeholder"
      :disabled="disabled"
      :required="required"
      :maxlength="maxlength"
      :class="[
        'w-full border rounded-xl px-4 py-2.5 text-sm text-slate-900 placeholder-slate-400 transition-colors focus:outline-none focus:ring-2 focus:ring-green-500 focus:border-transparent disabled:bg-slate-50 resize-y',
        error ? 'border-red-400 bg-red-50' : 'border-slate-300 bg-white',
      ]"
    />
    <div class="flex justify-between">
      <p v-if="error" class="text-xs text-red-600">{{ error }}</p>
      <p v-if="maxlength && modelValue" class="text-xs text-slate-400 ml-auto">
        {{ String(modelValue).length }}/{{ maxlength }}
      </p>
    </div>
  </div>
</template>

<script setup lang="ts">
import { computed } from 'vue'

interface Props {
  modelValue?: string
  label?: string
  placeholder?: string
  rows?: number
  error?: string
  disabled?: boolean
  required?: boolean
  maxlength?: number
  id?: string
}

const props = withDefaults(defineProps<Props>(), { rows: 4 })
const emit = defineEmits<{ 'update:modelValue': [value: string] }>()

const textareaId = computed(() => props.id ?? `textarea-${Math.random().toString(36).slice(2)}`)
const modelValue = computed({
  get: () => props.modelValue ?? '',
  set: (v) => emit('update:modelValue', v),
})
</script>
