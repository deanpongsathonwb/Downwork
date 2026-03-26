<template>
  <AppModal :model-value="modelValue" :title="title" size="sm" @update:model-value="$emit('update:modelValue', $event)">
    <p class="text-sm text-slate-600">{{ message }}</p>
    <template #footer>
      <AppButton variant="outline" @click="$emit('update:modelValue', false)">{{ cancelLabel }}</AppButton>
      <AppButton :variant="confirmVariant" :loading="loading" @click="$emit('confirm')">{{ confirmLabel }}</AppButton>
    </template>
  </AppModal>
</template>

<script setup lang="ts">
import AppModal from './AppModal.vue'
import AppButton from './AppButton.vue'

interface Props {
  modelValue: boolean
  title?: string
  message?: string
  confirmLabel?: string
  cancelLabel?: string
  confirmVariant?: 'primary' | 'danger'
  loading?: boolean
}

withDefaults(defineProps<Props>(), {
  title: 'Confirm Action',
  message: 'Are you sure you want to proceed?',
  confirmLabel: 'Confirm',
  cancelLabel: 'Cancel',
  confirmVariant: 'primary',
  loading: false,
})

defineEmits<{
  'update:modelValue': [value: boolean]
  confirm: []
}>()
</script>
