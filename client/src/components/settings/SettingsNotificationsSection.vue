<template>
  <div class="space-y-4">
    <div class="bg-white rounded-2xl border border-slate-200 p-6">
      <h2 class="font-semibold text-slate-900 mb-5">Email Notifications</h2>
      <div class="divide-y divide-slate-100">
        <div
          v-for="pref in emailPrefs"
          :key="pref.key"
          class="flex items-center justify-between py-3.5"
        >
          <div>
            <p class="text-sm font-medium text-slate-900">{{ pref.label }}</p>
            <p class="text-xs text-slate-500 mt-0.5">{{ pref.description }}</p>
          </div>
          <label class="relative inline-flex items-center cursor-pointer ml-4 shrink-0">
            <input v-model="pref.enabled" type="checkbox" class="sr-only peer" :aria-label="`Toggle ${pref.label}`" />
            <div class="w-11 h-6 bg-slate-200 peer-focus:ring-2 peer-focus:ring-green-500 rounded-full peer peer-checked:after:translate-x-full peer-checked:bg-green-600 after:content-[''] after:absolute after:top-0.5 after:left-0.5 after:bg-white after:rounded-full after:h-5 after:w-5 after:transition-all" />
          </label>
        </div>
      </div>
    </div>

    <div class="bg-white rounded-2xl border border-slate-200 p-6">
      <h2 class="font-semibold text-slate-900 mb-5">Push Notifications</h2>
      <div class="divide-y divide-slate-100">
        <div
          v-for="pref in pushPrefs"
          :key="pref.key"
          class="flex items-center justify-between py-3.5"
        >
          <div>
            <p class="text-sm font-medium text-slate-900">{{ pref.label }}</p>
            <p class="text-xs text-slate-500 mt-0.5">{{ pref.description }}</p>
          </div>
          <label class="relative inline-flex items-center cursor-pointer ml-4 shrink-0">
            <input v-model="pref.enabled" type="checkbox" class="sr-only peer" :aria-label="`Toggle ${pref.label}`" />
            <div class="w-11 h-6 bg-slate-200 peer-focus:ring-2 peer-focus:ring-green-500 rounded-full peer peer-checked:after:translate-x-full peer-checked:bg-green-600 after:content-[''] after:absolute after:top-0.5 after:left-0.5 after:bg-white after:rounded-full after:h-5 after:w-5 after:transition-all" />
          </label>
        </div>
      </div>
      <AppButton class="mt-4" size="sm" @click="save">Save Preferences</AppButton>
    </div>
  </div>
</template>

<script setup lang="ts">
import { reactive } from 'vue'
import { useToastStore } from '@/stores/toast.store'
import AppButton from '@/components/ui/AppButton.vue'

export interface NotifPref {
  key: string
  label: string
  description: string
  enabled: boolean
}

const props = withDefaults(defineProps<{
  initialEmailPrefs?: NotifPref[]
  initialPushPrefs?: NotifPref[]
}>(), {
  initialEmailPrefs: () => [
    { key: 'messages', label: 'New Messages', description: 'When you receive a new message', enabled: true },
    { key: 'updates', label: 'Contract Updates', description: 'Milestone submissions and approvals', enabled: true },
    { key: 'payments', label: 'Payment Receipts', description: 'Confirmations for payments and escrow', enabled: true },
    { key: 'job_alerts', label: 'Job Recommendations', description: 'Personalized job suggestions', enabled: false },
    { key: 'marketing', label: 'Product Updates', description: 'Tips, new features, and promotions', enabled: false },
  ],
  initialPushPrefs: () => [
    { key: 'push_messages', label: 'New Messages', description: 'Real-time message alerts', enabled: true },
    { key: 'push_payments', label: 'Payment Received', description: 'When funds are released', enabled: true },
    { key: 'push_proposals', label: 'Proposal Activity', description: 'Proposal views and responses', enabled: false },
  ],
})

const toast = useToastStore()

const emailPrefs = reactive<NotifPref[]>(props.initialEmailPrefs.map((p) => ({ ...p })))
const pushPrefs = reactive<NotifPref[]>(props.initialPushPrefs.map((p) => ({ ...p })))

function save(): void {
  toast.success('Notification Preferences Saved')
}
</script>
