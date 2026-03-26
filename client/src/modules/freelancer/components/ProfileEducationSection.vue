<template>
  <div class="bg-white rounded-2xl border border-slate-200 p-6">
    <div class="flex justify-between items-center mb-4">
      <h2 class="font-semibold text-slate-900">Education</h2>
      <AppButton variant="outline" size="sm" @click="openModal">+ Add Education</AppButton>
    </div>
    <div class="space-y-3">
      <div
        v-for="(edu, i) in modelValue"
        :key="i"
        class="flex gap-4 p-4 bg-slate-50 rounded-xl"
      >
        <div class="w-9 h-9 bg-blue-50 rounded-lg flex items-center justify-center shrink-0">
          <svg class="w-4 h-4 text-blue-600" fill="none" viewBox="0 0 24 24" stroke="currentColor" aria-hidden="true">
            <path d="M12 14l9-5-9-5-9 5 9 5z" />
            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 14l6.16-3.422a12.083 12.083 0 01.665 6.479A11.952 11.952 0 0112 20.055a11.952 11.952 0 00-6.824-2.998 12.078 12.078 0 01.665-6.479L12 14z" />
          </svg>
        </div>
        <div class="flex-1">
          <p class="font-medium text-sm text-slate-900">{{ edu.degree }}, {{ edu.fieldOfStudy }}</p>
          <p class="text-sm text-slate-600">{{ edu.school }}</p>
          <p class="text-xs text-slate-400">{{ edu.startYear }} – {{ edu.endYear ?? 'Present' }}</p>
        </div>
        <button
          class="p-1.5 text-slate-400 hover:text-red-500 hover:bg-red-50 rounded-lg transition-colors self-start"
          :aria-label="`Remove ${edu.school}`"
          @click="remove(i)"
        >
          <svg class="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" aria-hidden="true">
            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M6 18L18 6M6 6l12 12" />
          </svg>
        </button>
      </div>
      <p v-if="!modelValue.length" class="text-sm text-slate-400 text-center py-2">Add your educational background.</p>
    </div>
  </div>

  <AppModal v-model="showModal" title="Add Education" size="md">
    <div class="space-y-4">
      <AppInput v-model="draft.school" label="School / University" required />
      <div class="grid grid-cols-2 gap-3">
        <AppInput v-model="draft.degree" label="Degree" placeholder="e.g. Bachelor of Science" />
        <AppInput v-model="draft.fieldOfStudy" label="Field of Study" placeholder="e.g. Computer Science" />
      </div>
      <div class="grid grid-cols-2 gap-3">
        <AppInput v-model="draft.startYear" type="number" label="Start Year" placeholder="2018" />
        <AppInput v-model="draft.endYear" type="number" label="End Year" placeholder="2022" />
      </div>
    </div>
    <template #footer>
      <AppButton variant="outline" @click="showModal = false">Cancel</AppButton>
      <AppButton @click="save">Add Education</AppButton>
    </template>
  </AppModal>
</template>

<script setup lang="ts">
import { ref, reactive } from 'vue'
import type { EducationItem } from '@/types'
import AppButton from '@/components/ui/AppButton.vue'
import AppInput from '@/components/ui/AppInput.vue'
import AppModal from '@/components/ui/AppModal.vue'

const props = defineProps<{ modelValue: Partial<EducationItem>[] }>()
const emit = defineEmits<{ 'update:modelValue': [value: Partial<EducationItem>[]] }>()

const showModal = ref(false)
const draft = reactive({ school: '', degree: '', fieldOfStudy: '', startYear: '', endYear: '' })

function openModal(): void {
  Object.assign(draft, { school: '', degree: '', fieldOfStudy: '', startYear: '', endYear: '' })
  showModal.value = true
}

function save(): void {
  if (!draft.school || !draft.degree) return
  emit('update:modelValue', [
    ...props.modelValue,
    {
      id: Date.now().toString(),
      school: draft.school,
      degree: draft.degree,
      fieldOfStudy: draft.fieldOfStudy,
      startYear: Number(draft.startYear),
      endYear: draft.endYear ? Number(draft.endYear) : undefined,
    },
  ])
  showModal.value = false
}

function remove(index: number): void {
  emit('update:modelValue', props.modelValue.filter((_, i) => i !== index))
}
</script>
