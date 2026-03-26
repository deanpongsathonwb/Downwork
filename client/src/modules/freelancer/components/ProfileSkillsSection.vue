<template>
  <div class="bg-white rounded-2xl border border-slate-200 p-6">
    <div class="flex justify-between items-center mb-4">
      <h2 class="font-semibold text-slate-900">Skills</h2>
      <span class="text-xs text-slate-400">{{ modelValue.length }}/15 skills</span>
    </div>
    <div class="flex gap-2 mb-3">
      <input
        v-model="newSkill"
        type="text"
        placeholder="Add a skill (e.g. Vue.js)..."
        class="flex-1 border border-slate-300 rounded-xl px-4 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-green-500"
        @keydown.enter.prevent="addSkill"
      />
      <AppButton variant="outline" size="sm" :disabled="modelValue.length >= 15" @click="addSkill">Add</AppButton>
    </div>
    <div class="flex flex-wrap gap-2">
      <div
        v-for="(skill, i) in modelValue"
        :key="i"
        class="flex items-center gap-1.5 px-3 py-1.5 bg-slate-100 rounded-lg text-sm text-slate-700"
      >
        {{ skill }}
        <button
          class="text-slate-400 hover:text-red-500 transition-colors"
          :aria-label="`Remove ${skill}`"
          @click="remove(i)"
        >
          <svg class="w-3.5 h-3.5" fill="none" viewBox="0 0 24 24" stroke="currentColor" aria-hidden="true">
            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M6 18L18 6M6 6l12 12" />
          </svg>
        </button>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref } from 'vue'
import AppButton from '@/components/ui/AppButton.vue'

const props = defineProps<{ modelValue: string[] }>()
const emit = defineEmits<{ 'update:modelValue': [value: string[]] }>()

const newSkill = ref('')

function addSkill(): void {
  const trimmed = newSkill.value.trim()
  if (trimmed && !props.modelValue.includes(trimmed) && props.modelValue.length < 15) {
    emit('update:modelValue', [...props.modelValue, trimmed])
    newSkill.value = ''
  }
}

function remove(index: number): void {
  emit('update:modelValue', props.modelValue.filter((_, i) => i !== index))
}
</script>
