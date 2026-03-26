<template>
  <div class="bg-white rounded-2xl border border-slate-200 p-6">
    <div class="flex justify-between items-center mb-4">
      <h2 class="font-semibold text-slate-900">Languages</h2>
      <AppButton variant="outline" size="sm" @click="showModal = true">+ Add Language</AppButton>
    </div>
    <div class="space-y-2">
      <div
        v-for="(lang, i) in modelValue"
        :key="i"
        class="flex items-center justify-between p-3 bg-slate-50 rounded-xl"
      >
        <div>
          <p class="text-sm font-medium text-slate-900">{{ lang.name }}</p>
          <p class="text-xs text-slate-500 capitalize">{{ lang.proficiency }}</p>
        </div>
        <button
          class="text-slate-400 hover:text-red-500"
          :aria-label="`Remove ${lang.name}`"
          @click="remove(i)"
        >
          <svg class="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" aria-hidden="true">
            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M6 18L18 6M6 6l12 12" />
          </svg>
        </button>
      </div>
      <p v-if="!modelValue.length" class="text-sm text-slate-400 text-center py-2">No languages added yet.</p>
    </div>
  </div>

  <AppModal v-model="showModal" title="Add Language" size="sm">
    <div class="space-y-3">
      <AppInput v-model="newLang.name" label="Language" placeholder="e.g. English, Spanish" />
      <AppSelect v-model="newLang.proficiency" label="Proficiency" :options="proficiencyOptions" />
    </div>
    <template #footer>
      <AppButton variant="outline" @click="showModal = false">Cancel</AppButton>
      <AppButton @click="addLanguage">Add Language</AppButton>
    </template>
  </AppModal>
</template>

<script setup lang="ts">
import { ref, reactive } from 'vue'
import type { Language } from '@/types'
import AppButton from '@/components/ui/AppButton.vue'
import AppInput from '@/components/ui/AppInput.vue'
import AppSelect from '@/components/ui/AppSelect.vue'
import AppModal from '@/components/ui/AppModal.vue'

const props = defineProps<{ modelValue: Language[] }>()
const emit = defineEmits<{ 'update:modelValue': [value: Language[]] }>()

const showModal = ref(false)
const newLang = reactive<{ name: string; proficiency: Language['proficiency'] }>({
  name: '',
  proficiency: 'conversational',
})

const proficiencyOptions = [
  { label: 'Basic', value: 'basic' },
  { label: 'Conversational', value: 'conversational' },
  { label: 'Fluent', value: 'fluent' },
  { label: 'Native / Bilingual', value: 'native' },
]

function addLanguage(): void {
  if (!newLang.name.trim()) return
  emit('update:modelValue', [...props.modelValue, { name: newLang.name, proficiency: newLang.proficiency }])
  newLang.name = ''
  showModal.value = false
}

function remove(index: number): void {
  emit('update:modelValue', props.modelValue.filter((_, i) => i !== index))
}
</script>
