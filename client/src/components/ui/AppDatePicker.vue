<template>
  <div class="relative">
    <label v-if="label" class="text-sm font-medium text-slate-700 block mb-1.5">
      {{ label }}<span v-if="required" class="text-red-500 ml-0.5">*</span>
    </label>
    <div class="relative">
      <input
        :value="modelValue"
        type="date"
        :min="min"
        :max="max"
        :disabled="disabled"
        :class="[
          'w-full px-4 py-2.5 border rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-green-500 transition-colors',
          disabled ? 'bg-slate-50 text-slate-400 cursor-not-allowed border-slate-200' : 'border-slate-300 bg-white',
        ]"
        @change="$emit('update:modelValue', ($event.target as HTMLInputElement).value)"
      />
    </div>
    <p v-if="hint" class="text-xs text-slate-500 mt-1">{{ hint }}</p>
  </div>
</template>

<script setup lang="ts">
interface Props {
  modelValue?: string
  label?: string
  hint?: string
  min?: string
  max?: string
  required?: boolean
  disabled?: boolean
}

withDefaults(defineProps<Props>(), { disabled: false, required: false })
defineEmits<{ 'update:modelValue': [value: string] }>()
</script>
