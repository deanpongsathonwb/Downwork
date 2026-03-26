<template>
  <div class="bg-white rounded-2xl border border-red-200 p-6">
    <h2 class="font-semibold text-red-800 mb-1">Danger Zone</h2>
    <p class="text-sm text-slate-500 mb-4">These actions are permanent and cannot be undone.</p>

    <div class="space-y-3">
      <div class="flex items-center justify-between p-4 border border-slate-200 rounded-xl">
        <div>
          <p class="text-sm font-semibold text-slate-900">Deactivate Account</p>
          <p class="text-xs text-slate-500">Temporarily hide your profile. You can reactivate anytime.</p>
        </div>
        <AppButton
          variant="outline"
          size="sm"
          class="border-yellow-300 text-yellow-700 hover:bg-yellow-50"
          @click="showDeactivateModal = true"
        >
          Deactivate
        </AppButton>
      </div>

      <div class="flex items-center justify-between p-4 border border-red-200 bg-red-50 rounded-xl">
        <div>
          <p class="text-sm font-semibold text-red-800">Delete Account</p>
          <p class="text-xs text-red-600">Permanently delete your account and all data. This cannot be reversed.</p>
        </div>
        <AppButton variant="danger" size="sm" @click="showDeleteModal = true">Delete Account</AppButton>
      </div>
    </div>
  </div>

  <AppConfirmModal
    v-model="showDeactivateModal"
    title="Deactivate Account?"
    message="Your profile will be hidden and you won't receive new work. You can reactivate by signing in again."
    confirm-label="Deactivate"
    confirm-variant="primary"
    @confirm="handleDeactivate"
  />

  <AppModal v-model="showDeleteModal" title="Delete Account" size="sm">
    <div class="space-y-4">
      <div class="p-3 bg-red-50 rounded-xl border border-red-200">
        <p class="text-sm text-red-700 font-medium">This action is permanent and cannot be undone.</p>
        <p class="text-xs text-red-600 mt-1">All your data will be permanently removed.</p>
      </div>
      <AppInput v-model="deleteConfirm" label='Type "DELETE" to confirm' placeholder="DELETE" />
    </div>
    <template #footer>
      <AppButton variant="outline" @click="showDeleteModal = false">Cancel</AppButton>
      <AppButton
        variant="danger"
        :disabled="deleteConfirm !== 'DELETE'"
        :loading="deleting"
        @click="handleDelete"
      >
        Delete My Account
      </AppButton>
    </template>
  </AppModal>
</template>

<script setup lang="ts">
import { ref } from 'vue'
import { useAuthStore } from '@/stores/auth.store'
import { useToastStore } from '@/stores/toast.store'
import { authService } from '@/services/api/auth.service'
import { logger } from '@/utils/logger'
import AppButton from '@/components/ui/AppButton.vue'
import AppModal from '@/components/ui/AppModal.vue'
import AppConfirmModal from '@/components/ui/AppConfirmModal.vue'
import AppInput from '@/components/ui/AppInput.vue'

const auth = useAuthStore()
const toast = useToastStore()

const showDeactivateModal = ref(false)
const showDeleteModal = ref(false)
const deleteConfirm = ref('')
const deleting = ref(false)

async function handleDeactivate(): Promise<void> {
  try {
    await authService.deactivateAccount()
    toast.info('Account Deactivated', 'Your profile is now hidden. You can reactivate anytime.')
    auth.logout()
  } catch (err) {
    logger.catch(err, 'SettingsDangerZone.handleDeactivate')
    toast.error('Failed', 'Could not deactivate account.')
  }
}

async function handleDelete(): Promise<void> {
  deleting.value = true
  try {
    await authService.deleteAccount(deleteConfirm.value)
    showDeleteModal.value = false
    toast.success('Account Deleted', 'Your account has been permanently deleted.')
    auth.logout()
  } catch (err) {
    logger.catch(err, 'SettingsDangerZone.handleDelete')
    toast.error('Failed', 'Could not delete account.')
  } finally {
    deleting.value = false
  }
}
</script>
