<template>
  <div class="bg-white rounded-2xl border border-slate-200 p-6 space-y-4">
    <h2 class="font-semibold text-slate-900">Change Password</h2>
    <AppInput v-model="form.current" label="Current Password" type="password" autocomplete="current-password" />
    <AppInput
      v-model="form.new"
      label="New Password"
      type="password"
      autocomplete="new-password"
      hint="At least 8 characters, include numbers and symbols"
    />
    <AppInput v-model="form.confirm" label="Confirm New Password" type="password" autocomplete="new-password" />
    <AppButton :loading="loading" @click="submit">Update Password</AppButton>
  </div>
</template>

<script setup lang="ts">
import { reactive, computed } from 'vue'
import { useUserStore } from '@/stores/user.store'
import { useToastStore } from '@/stores/toast.store'
import AppInput from '@/components/ui/AppInput.vue'
import AppButton from '@/components/ui/AppButton.vue'

const userStore = useUserStore()
const toast = useToastStore()

const form = reactive({ current: '', new: '', confirm: '' })

const loading = computed(() => userStore.isUpdating)

async function submit(): Promise<void> {
  if (!form.current || !form.new) {
    toast.error('All fields are required')
    return
  }
  if (form.new !== form.confirm) {
    toast.error('Passwords do not match')
    return
  }
  if (form.new.length < 8) {
    toast.error('Password must be at least 8 characters')
    return
  }
  const ok = await userStore.changePassword(form.current, form.new)
  if (ok) {
    Object.assign(form, { current: '', new: '', confirm: '' })
  }
}
</script>
