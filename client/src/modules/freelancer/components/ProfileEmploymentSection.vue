<template>
  <div class="bg-white rounded-2xl border border-slate-200 p-6">
    <div class="flex justify-between items-center mb-4">
      <h2 class="font-semibold text-slate-900">Employment History</h2>
      <AppButton variant="outline" size="sm" @click="openModal">+ Add Experience</AppButton>
    </div>
    <div class="space-y-4">
      <div
        v-for="(emp, i) in modelValue"
        :key="i"
        class="flex gap-4 p-4 bg-slate-50 rounded-xl"
      >
        <div class="w-9 h-9 bg-slate-200 rounded-lg flex items-center justify-center shrink-0">
          <svg class="w-4 h-4 text-slate-500" fill="none" viewBox="0 0 24 24" stroke="currentColor" aria-hidden="true">
            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M21 13.255A23.931 23.931 0 0112 15c-3.183 0-6.22-.62-9-1.745M16 6V4a2 2 0 00-2-2h-4a2 2 0 00-2 2v2m4 6h.01M5 20h14a2 2 0 002-2V8a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" />
          </svg>
        </div>
        <div class="flex-1">
          <p class="font-medium text-sm text-slate-900">{{ emp.title }}</p>
          <p class="text-sm text-slate-600">{{ emp.company }}</p>
          <p class="text-xs text-slate-400">{{ emp.startDate }} – {{ emp.isCurrent ? 'Present' : emp.endDate }}</p>
        </div>
        <div class="flex gap-1">
          <button
            class="p-1.5 text-slate-400 hover:text-blue-600 hover:bg-blue-50 rounded-lg transition-colors"
            :aria-label="`Edit ${emp.title}`"
            @click="edit(i)"
          >
            <svg class="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" aria-hidden="true">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z" />
            </svg>
          </button>
          <button
            class="p-1.5 text-slate-400 hover:text-red-500 hover:bg-red-50 rounded-lg transition-colors"
            :aria-label="`Remove ${emp.title}`"
            @click="remove(i)"
          >
            <svg class="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" aria-hidden="true">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
            </svg>
          </button>
        </div>
      </div>
      <p v-if="!modelValue.length" class="text-sm text-slate-400 text-center py-2">Add your work experience.</p>
    </div>
  </div>

  <AppModal v-model="showModal" title="Add Employment" size="md">
    <div class="space-y-4">
      <AppInput v-model="draft.company" label="Company / Organization" required />
      <AppInput v-model="draft.title" label="Your Title" required />
      <div class="grid grid-cols-2 gap-3">
        <AppInput v-model="draft.startDate" label="Start Date" placeholder="e.g. Jan 2020" />
        <AppInput v-model="draft.endDate" label="End Date" placeholder="e.g. Dec 2022" :disabled="draft.isCurrent" />
      </div>
      <div class="flex items-center gap-2">
        <input id="currently-working" v-model="draft.isCurrent" type="checkbox" class="accent-green-600" />
        <label for="currently-working" class="text-sm text-slate-700">I currently work here</label>
      </div>
      <AppTextarea v-model="draft.description" label="Description (optional)" :rows="3" />
    </div>
    <template #footer>
      <AppButton variant="outline" @click="showModal = false">Cancel</AppButton>
      <AppButton @click="save">Add Experience</AppButton>
    </template>
  </AppModal>
</template>

<script setup lang="ts">
import { ref, reactive } from 'vue'
import type { EmploymentItem } from '@/types'
import AppButton from '@/components/ui/AppButton.vue'
import AppInput from '@/components/ui/AppInput.vue'
import AppTextarea from '@/components/ui/AppTextarea.vue'
import AppModal from '@/components/ui/AppModal.vue'

const props = defineProps<{ modelValue: Partial<EmploymentItem>[] }>()
const emit = defineEmits<{ 'update:modelValue': [value: Partial<EmploymentItem>[]] }>()

const showModal = ref(false)
const editIndex = ref<number | null>(null)
const draft = reactive({ company: '', title: '', startDate: '', endDate: '', isCurrent: false, description: '' })

function openModal(): void {
  editIndex.value = null
  Object.assign(draft, { company: '', title: '', startDate: '', endDate: '', isCurrent: false, description: '' })
  showModal.value = true
}

function edit(i: number): void {
  editIndex.value = i
  Object.assign(draft, { ...props.modelValue[i] })
  showModal.value = true
}

function save(): void {
  if (!draft.company || !draft.title) return
  const updated = [...props.modelValue]
  const entry: Partial<EmploymentItem> = { ...draft, id: Date.now().toString() }
  if (editIndex.value !== null) {
    updated[editIndex.value] = entry
  } else {
    updated.push(entry)
  }
  emit('update:modelValue', updated)
  showModal.value = false
}

function remove(index: number): void {
  emit('update:modelValue', props.modelValue.filter((_, i) => i !== index))
}
</script>
