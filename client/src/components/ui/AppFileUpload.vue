<template>
  <div>
    <label v-if="label" class="text-sm font-medium text-slate-700 block mb-2">{{ label }}</label>

    <!-- Drop zone -->
    <div
      :class="[
        'border-2 border-dashed rounded-xl p-6 text-center transition-colors cursor-pointer',
        isDragging ? 'border-green-500 bg-green-50' : 'border-slate-300 hover:border-green-400 hover:bg-slate-50',
        disabled ? 'opacity-50 cursor-not-allowed' : '',
      ]"
      @dragover.prevent="isDragging = true"
      @dragleave.prevent="isDragging = false"
      @drop.prevent="handleDrop"
      @click="!disabled && fileInput?.click()"
    >
      <input
        ref="fileInput"
        type="file"
        :accept="accept"
        :multiple="multiple"
        class="hidden"
        :disabled="disabled"
        @change="handleFileChange"
      />

      <svg class="w-10 h-10 text-slate-400 mx-auto mb-3" fill="none" viewBox="0 0 24 24" stroke="currentColor">
        <path stroke-linecap="round" stroke-linejoin="round" stroke-width="1.5" d="M7 16a4 4 0 01-.88-7.903A5 5 0 1115.9 6L16 6a5 5 0 011 9.9M15 13l-3-3m0 0l-3 3m3-3v12" />
      </svg>

      <p class="text-sm text-slate-600">
        <span class="font-medium text-green-600">Click to upload</span> or drag & drop
      </p>
      <p class="text-xs text-slate-400 mt-1">
        {{ hint || `${accept || 'Any file type'} · Max ${maxSizeMB}MB${multiple ? ' · Multiple files allowed' : ''}` }}
      </p>
    </div>

    <!-- File list -->
    <div v-if="files.length" class="mt-3 space-y-2">
      <div
        v-for="(file, i) in files"
        :key="i"
        class="flex items-center gap-3 p-3 bg-slate-50 rounded-xl border border-slate-200"
      >
        <div class="w-9 h-9 bg-blue-100 rounded-lg flex items-center justify-center shrink-0">
          <svg class="w-5 h-5 text-blue-600" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
          </svg>
        </div>
        <div class="flex-1 min-w-0">
          <p class="text-sm font-medium text-slate-900 truncate">{{ file.name }}</p>
          <p class="text-xs text-slate-500">{{ formatSize(file.size) }}</p>
        </div>
        <button
          class="p-1.5 text-slate-400 hover:text-red-500 transition-colors rounded-lg hover:bg-red-50"
          @click.stop="removeFile(i)"
        >
          <svg class="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M6 18L18 6M6 6l12 12" />
          </svg>
        </button>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref } from 'vue'

interface Props {
  label?: string
  hint?: string
  accept?: string
  multiple?: boolean
  maxSizeMB?: number
  disabled?: boolean
}

const props = withDefaults(defineProps<Props>(), {
  multiple: false,
  maxSizeMB: 50,
  disabled: false,
})

const emit = defineEmits<{ change: [files: File[]] }>()

const fileInput = ref<HTMLInputElement | null>(null)
const isDragging = ref(false)
const files = ref<File[]>([])

function handleFileChange(e: Event) {
  const input = e.target as HTMLInputElement
  if (input.files) addFiles(Array.from(input.files))
}

function handleDrop(e: DragEvent) {
  isDragging.value = false
  if (e.dataTransfer?.files) addFiles(Array.from(e.dataTransfer.files))
}

function addFiles(newFiles: File[]) {
  const filtered = newFiles.filter((f) => f.size <= props.maxSizeMB * 1024 * 1024)
  if (props.multiple) {
    files.value = [...files.value, ...filtered]
  } else {
    files.value = filtered.slice(0, 1)
  }
  emit('change', files.value)
}

function removeFile(index: number) {
  files.value.splice(index, 1)
  emit('change', files.value)
}

function formatSize(bytes: number): string {
  if (bytes < 1024) return `${bytes} B`
  if (bytes < 1024 * 1024) return `${(bytes / 1024).toFixed(1)} KB`
  return `${(bytes / (1024 * 1024)).toFixed(1)} MB`
}
</script>
