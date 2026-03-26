<template>
  <aside class="lg:w-72 shrink-0" aria-label="Job filters">
    <div class="bg-white rounded-2xl border border-slate-200 p-5 sticky top-24">
      <div class="flex items-center justify-between mb-5">
        <h2 class="font-semibold text-slate-900">Filters</h2>
        <button
          class="text-xs text-green-600 hover:text-green-700 font-medium"
          type="button"
          @click="emit('reset')"
        >
          Clear all
        </button>
      </div>

      <div class="space-y-5">
        <!-- Search -->
        <AppInput
          :model-value="filters.search ?? ''"
          placeholder="Search jobs..."
          @update:model-value="update('search', String($event) || undefined)"
          @keydown.enter="emit('apply')"
        >
          <template #prefix>
            <svg class="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" aria-hidden="true">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
            </svg>
          </template>
        </AppInput>

        <!-- Category -->
        <AppSelect
          :model-value="filters.category ?? ''"
          label="Category"
          :options="CATEGORY_OPTIONS"
          placeholder="All Categories"
          @update:model-value="update('category', String($event) || undefined)"
        />

        <!-- Job Type -->
        <fieldset>
          <legend class="text-sm font-medium text-slate-700 mb-2">Job Type</legend>
          <div class="space-y-2">
            <label v-for="type in JOB_TYPES" :key="type.value" class="flex items-center gap-2 cursor-pointer">
              <input
                type="checkbox"
                :value="type.value"
                :checked="filters.type === type.value"
                class="accent-green-600"
                :aria-label="`${type.label} jobs`"
                @change="update('type', filters.type === type.value ? undefined : type.value)"
              />
              <span class="text-sm text-slate-600">{{ type.label }}</span>
            </label>
          </div>
        </fieldset>

        <!-- Experience Level -->
        <fieldset>
          <legend class="text-sm font-medium text-slate-700 mb-2">Experience Level</legend>
          <div class="space-y-2">
            <label v-for="level in EXPERIENCE_LEVELS" :key="level.value" class="flex items-center gap-2 cursor-pointer">
              <input
                type="checkbox"
                :value="level.value"
                :checked="filters.experienceLevel === level.value"
                class="accent-green-600"
                :aria-label="`${level.label} experience level`"
                @change="update('experienceLevel', filters.experienceLevel === level.value ? undefined : level.value)"
              />
              <span class="text-sm text-slate-600">{{ level.label }}</span>
            </label>
          </div>
        </fieldset>

        <!-- Budget Range -->
        <div>
          <p class="text-sm font-medium text-slate-700 mb-2">Budget Range (USD)</p>
          <div class="flex gap-2">
            <AppInput
              :model-value="filters.budgetMin?.toString() ?? ''"
              type="number"
              placeholder="Min"
              :min="0"
              @update:model-value="update('budgetMin', $event ? Number($event) : undefined)"
            />
            <AppInput
              :model-value="filters.budgetMax?.toString() ?? ''"
              type="number"
              placeholder="Max"
              :min="0"
              @update:model-value="update('budgetMax', $event ? Number($event) : undefined)"
            />
          </div>
        </div>

        <AppButton class="w-full" type="button" @click="emit('apply')">Apply Filters</AppButton>
      </div>
    </div>
  </aside>
</template>

<script setup lang="ts">
import type { JobFilters, JobType } from '@/types'
import { CATEGORY_OPTIONS } from '@/constants/categories'
import AppInput from '@/components/ui/AppInput.vue'
import AppSelect from '@/components/ui/AppSelect.vue'
import AppButton from '@/components/ui/AppButton.vue'

const props = defineProps<{ filters: JobFilters }>()
const emit = defineEmits<{
  'update:filters': [filters: JobFilters]
  apply: []
  reset: []
}>()

const JOB_TYPES: { label: string; value: JobType }[] = [
  { label: 'Hourly Rate', value: 'hourly' },
  { label: 'Fixed Price', value: 'fixed' },
]

const EXPERIENCE_LEVELS = [
  { label: 'Entry Level',   value: 'entry'        },
  { label: 'Intermediate',  value: 'intermediate' },
  { label: 'Expert',        value: 'expert'       },
]

function update<K extends keyof JobFilters>(key: K, value: JobFilters[K]): void {
  emit('update:filters', { ...props.filters, [key]: value })
}
</script>
