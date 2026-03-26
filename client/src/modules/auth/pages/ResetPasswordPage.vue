<template>
  <div>
    <div class="mb-6">
      <h1 class="text-2xl font-bold text-slate-900">Set new password</h1>
      <p class="text-slate-500 mt-1 text-sm">Choose a strong new password.</p>
    </div>

    <form class="space-y-4" @submit.prevent="handleSubmit">
      <AppInput v-model="form.password" label="New Password" type="password" placeholder="Min. 8 characters" required :error="errors.password" />
      <AppInput v-model="form.confirm" label="Confirm Password" type="password" placeholder="Repeat password" required :error="errors.confirm" />
      <AppButton type="submit" class="w-full" size="lg" :loading="auth.isLoading">
        Reset Password
      </AppButton>
    </form>
  </div>
</template>

<script setup lang="ts">
import { reactive } from 'vue'
import { useRoute } from 'vue-router'
import { useAuthStore } from '@/stores/auth.store'
import AppInput from '@/components/ui/AppInput.vue'
import AppButton from '@/components/ui/AppButton.vue'

const auth = useAuthStore()
const route = useRoute()
const token = route.query.token as string

const form = reactive({ password: '', confirm: '' })
const errors = reactive({ password: '', confirm: '' })

async function handleSubmit(): Promise<void> {
  errors.password = ''
  errors.confirm = ''
  if (form.password.length < 8) { errors.password = 'Min. 8 characters.'; return }
  if (form.password !== form.confirm) { errors.confirm = 'Passwords do not match.'; return }
  await auth.resetPassword(token, form.password)
}
</script>
