<template>
  <div class="bg-white rounded-2xl border border-slate-200 p-6">
    <div class="flex justify-between items-center mb-4">
      <h2 class="font-semibold text-slate-900">Portfolio</h2>
      <AppButton variant="outline" size="sm" @click="openAddModal">+ Add Item</AppButton>
    </div>
    <div class="grid grid-cols-2 gap-4">
      <div
        v-for="(item, i) in modelValue"
        :key="i"
        class="border border-slate-200 rounded-xl overflow-hidden"
      >
        <div class="h-32 bg-gradient-to-br from-slate-100 to-slate-200 flex items-center justify-center">
          <span class="text-3xl" aria-hidden="true">🎨</span>
        </div>
        <div class="p-3">
          <p class="text-sm font-medium text-slate-900 truncate">{{ item.title }}</p>
          <div class="flex gap-2 mt-2">
            <AppButton variant="outline" size="xs" @click="openEditModal(i)">Edit</AppButton>
            <AppButton variant="ghost" size="xs" class="text-red-500 hover:bg-red-50" @click="remove(i)">Remove</AppButton>
          </div>
        </div>
      </div>
    </div>
    <p v-if="!modelValue.length" class="text-sm text-slate-400 text-center py-4">
      Showcase your best work to attract clients.
    </p>
  </div>

  <AppModal v-model="showModal" title="Add Portfolio Item" size="md">
    <div class="space-y-4">
      <AppInput v-model="draft.title" label="Project Title" required />
      <AppTextarea v-model="draft.description" label="Description" :rows="3" />
      <AppInput v-model="draft.projectUrl" label="Project URL (optional)" placeholder="https://..." />
      <div>
        <label class="text-sm font-medium text-slate-700 block mb-1.5">Technologies Used</label>
        <div class="flex gap-2 mb-2">
          <input
            v-model="newTech"
            type="text"
            placeholder="Add technology..."
            class="flex-1 border border-slate-300 rounded-xl px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-green-500"
            @keydown.enter.prevent="addTech"
          />
          <AppButton variant="outline" size="sm" @click="addTech">Add</AppButton>
        </div>
        <div class="flex flex-wrap gap-1.5">
          <span
            v-for="(t, i) in draft.technologies"
            :key="i"
            class="flex items-center gap-1 px-2.5 py-1 bg-blue-50 text-blue-700 text-xs rounded-lg font-medium"
          >
            {{ t }}
            <button aria-label="Remove" @click="draft.technologies.splice(i, 1)">×</button>
          </span>
        </div>
      </div>
      <AppFileUpload label="Project Image (optional)" accept=".jpg,.jpeg,.png,.webp" hint="Max 5MB" />
    </div>
    <template #footer>
      <AppButton variant="outline" @click="showModal = false">Cancel</AppButton>
      <AppButton @click="save">{{ editIndex !== null ? 'Save Changes' : 'Add Item' }}</AppButton>
    </template>
  </AppModal>
</template>

<script setup lang="ts">
import { ref, reactive } from 'vue'
import type { PortfolioItem } from '@/types'
import AppButton from '@/components/ui/AppButton.vue'
import AppInput from '@/components/ui/AppInput.vue'
import AppTextarea from '@/components/ui/AppTextarea.vue'
import AppModal from '@/components/ui/AppModal.vue'
import AppFileUpload from '@/components/ui/AppFileUpload.vue'

const props = defineProps<{ modelValue: Partial<PortfolioItem>[] }>()
const emit = defineEmits<{ 'update:modelValue': [value: Partial<PortfolioItem>[]] }>()

const showModal = ref(false)
const editIndex = ref<number | null>(null)
const newTech = ref('')

const draft = reactive({ title: '', description: '', projectUrl: '', technologies: [] as string[] })

function openAddModal(): void {
  editIndex.value = null
  Object.assign(draft, { title: '', description: '', projectUrl: '', technologies: [] })
  showModal.value = true
}

function openEditModal(i: number): void {
  editIndex.value = i
  const item = props.modelValue[i]
  Object.assign(draft, {
    title: item.title ?? '',
    description: item.description ?? '',
    projectUrl: item.projectUrl ?? '',
    technologies: [...(item.technologies ?? [])],
  })
  showModal.value = true
}

function addTech(): void {
  const t = newTech.value.trim()
  if (t && !draft.technologies.includes(t)) {
    draft.technologies.push(t)
    newTech.value = ''
  }
}

function save(): void {
  if (!draft.title.trim()) return
  const updated = [...props.modelValue]
  const entry: Partial<PortfolioItem> = {
    ...draft,
    id: Date.now().toString(),
    createdAt: new Date().toISOString(),
    technologies: [...draft.technologies],
  }
  if (editIndex.value !== null) {
    updated[editIndex.value] = { ...updated[editIndex.value], ...entry }
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
