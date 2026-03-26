<template>
  <div class="bg-white rounded-2xl border border-slate-200 p-6">
    <h2 class="font-semibold text-slate-900 mb-4">{{ title }}</h2>
    <div class="divide-y divide-slate-100">
      <div
        v-for="setting in settings"
        :key="setting.key"
        class="flex items-start justify-between py-3.5"
      >
        <div class="mr-4">
          <p class="text-sm font-medium text-slate-900">{{ setting.label }}</p>
          <p class="text-xs text-slate-500 mt-0.5">{{ setting.description }}</p>
        </div>
        <label class="relative inline-flex items-center cursor-pointer shrink-0 mt-0.5">
          <input v-model="setting.enabled" type="checkbox" class="sr-only peer" :aria-label="`Toggle ${setting.label}`" />
          <div class="w-11 h-6 bg-slate-200 peer-focus:ring-2 peer-focus:ring-green-500 rounded-full peer peer-checked:after:translate-x-full peer-checked:bg-green-600 after:content-[''] after:absolute after:top-0.5 after:left-0.5 after:bg-white after:rounded-full after:h-5 after:w-5 after:transition-all" />
        </label>
      </div>
    </div>
    <AppButton v-if="showSave" class="mt-4" size="sm" @click="save">
      Save {{ title }}
    </AppButton>
  </div>
</template>

<script setup lang="ts">
import { reactive } from 'vue'
import { useToastStore } from '@/stores/toast.store'
import AppButton from '@/components/ui/AppButton.vue'

export interface PrivacySetting {
  key: string
  label: string
  description: string
  enabled: boolean
}

const props = withDefaults(defineProps<{
  title?: string
  settings: PrivacySetting[]
  showSave?: boolean
}>(), {
  title: 'Privacy Settings',
  showSave: true,
})

const toast = useToastStore()
const settings = reactive<PrivacySetting[]>(props.settings.map((s) => ({ ...s })))

function save(): void {
  toast.success(`${props.title} Saved`)
}
</script>
