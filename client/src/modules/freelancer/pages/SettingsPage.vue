<template>
  <div class="space-y-6 max-w-3xl">
    <h1 class="text-2xl font-bold text-slate-900">Account Settings</h1>

    <AppTabs v-model="activeTab" :tabs="tabs" variant="pills" />

    <!-- ── ACCOUNT ─────────────────────────────────────────── -->
    <div v-if="activeTab === 'account'" class="space-y-4">
      <div class="bg-white rounded-2xl border border-slate-200 p-6 space-y-4">
        <h2 class="font-semibold text-slate-900">Account Information</h2>
        <AppInput v-model="accountForm.email" label="Email Address" type="email" autocomplete="email" />
        <AppInput v-model="accountForm.phone" label="Phone Number" type="tel" placeholder="+1 (555) 000-0000" />
        <AppSelect v-model="accountForm.timezone" label="Timezone" :options="TIMEZONE_OPTIONS" />
        <AppSelect v-model="accountForm.language" label="Language" :options="LANGUAGE_OPTIONS" />
        <AppButton :loading="saving" @click="save">Save Changes</AppButton>
      </div>
    </div>

    <!-- ── SECURITY ───────────────────────────────────────── -->
    <div v-else-if="activeTab === 'security'" class="space-y-4">
      <SettingsPasswordSection />

      <div class="bg-white rounded-2xl border border-slate-200 p-6">
        <div class="flex items-center justify-between">
          <div>
            <h2 class="font-semibold text-slate-900">Two-Factor Authentication</h2>
            <p class="text-sm text-slate-500 mt-1">Add an extra layer of security to your account.</p>
          </div>
          <RouterLink
            to="/auth/mfa-setup"
            class="px-4 py-2 text-sm font-medium text-green-600 border border-green-600 rounded-xl hover:bg-green-50 transition-colors"
          >
            Enable 2FA
          </RouterLink>
        </div>
      </div>

      <SettingsSessionsList />
    </div>

    <!-- ── PAYMENT ────────────────────────────────────────── -->
    <div v-else-if="activeTab === 'payment'" class="space-y-4">
      <div class="bg-white rounded-2xl border border-slate-200 p-6 space-y-4">
        <div class="flex justify-between items-center">
          <h2 class="font-semibold text-slate-900">Withdrawal Methods</h2>
          <AppButton variant="outline" size="sm" @click="showAddMethodModal = true">+ Add Method</AppButton>
        </div>

        <div class="space-y-3">
          <div
            v-for="method in paymentMethods"
            :key="method.id"
            class="flex items-center justify-between p-4 border border-slate-200 rounded-xl hover:bg-slate-50 transition-colors"
          >
            <div class="flex items-center gap-3">
              <span class="text-2xl" aria-hidden="true">{{ methodIcon(method.type) }}</span>
              <div>
                <p class="text-sm font-semibold text-slate-900">{{ method.label }}</p>
                <p class="text-xs text-slate-500">{{ method.details }}</p>
              </div>
            </div>
            <div class="flex items-center gap-2">
              <span v-if="method.isDefault" class="text-xs text-green-600 font-medium bg-green-50 border border-green-200 px-2 py-0.5 rounded-md">Default</span>
              <button v-else class="text-xs text-blue-600 hover:text-blue-700 font-medium" @click="setDefault(method.id)">Set Default</button>
              <button class="text-xs text-red-500 hover:text-red-600" @click="removeMethod(method.id)">Remove</button>
            </div>
          </div>

          <button
            class="w-full py-3 border-2 border-dashed border-slate-300 rounded-xl text-sm text-slate-500 hover:border-green-400 hover:text-green-600 font-medium transition-colors"
            @click="showAddMethodModal = true"
          >
            + Add Bank Account / PayPal / Payoneer
          </button>
        </div>

        <div class="p-4 bg-slate-50 rounded-xl">
          <p class="text-sm font-medium text-slate-700 mb-1">Service Fee Structure</p>
          <div class="space-y-1 text-xs text-slate-600">
            <div class="flex justify-between"><span>$0–$500 with a client</span><span class="font-semibold">20% fee</span></div>
            <div class="flex justify-between"><span>$500.01–$10,000 with a client</span><span class="font-semibold">10% fee</span></div>
            <div class="flex justify-between"><span>Over $10,000 with a client</span><span class="font-semibold text-green-600">5% fee</span></div>
          </div>
        </div>
      </div>
    </div>

    <!-- ── NOTIFICATIONS ──────────────────────────────────── -->
    <SettingsNotificationsSection
      v-else-if="activeTab === 'notifications'"
      :initial-email-prefs="freelancerEmailPrefs"
    />

    <!-- ── PRIVACY ────────────────────────────────────────── -->
    <div v-else-if="activeTab === 'privacy'" class="space-y-4">
      <SettingsPrivacyToggles title="Privacy Settings" :settings="freelancerPrivacySettings" />

      <!-- Connected Accounts -->
      <div class="bg-white rounded-2xl border border-slate-200 p-6">
        <h2 class="font-semibold text-slate-900 mb-4">Connected Accounts</h2>
        <div class="space-y-3">
          <div
            v-for="account in connectedAccounts"
            :key="account.id"
            class="flex items-center justify-between p-4 border border-slate-200 rounded-xl"
          >
            <div class="flex items-center gap-3">
              <div :class="['w-10 h-10 rounded-xl flex items-center justify-center', account.bgColor]">
                <span class="text-xl" aria-hidden="true">{{ account.icon }}</span>
              </div>
              <div>
                <p class="text-sm font-semibold text-slate-900">{{ account.name }}</p>
                <p class="text-xs text-slate-500">{{ account.connected ? account.username : 'Not connected' }}</p>
              </div>
            </div>
            <AppButton
              v-if="!account.connected"
              variant="outline"
              size="sm"
              @click="connectAccount(account.id)"
            >
              Connect
            </AppButton>
            <AppButton
              v-else
              variant="ghost"
              size="sm"
              class="text-red-500 hover:bg-red-50"
              @click="disconnectAccount(account.id)"
            >
              Disconnect
            </AppButton>
          </div>
        </div>
      </div>

      <SettingsDangerZone />
    </div>
  </div>

  <!-- Add Payment Method Modal -->
  <AppModal v-model="showAddMethodModal" title="Add Withdrawal Method" size="md">
    <div class="space-y-4">
      <div class="grid grid-cols-2 gap-2">
        <button
          v-for="m in methodOptions"
          :key="m.value"
          :class="['p-3 border-2 rounded-xl text-sm font-medium transition-all flex items-center gap-2', newMethod.type === m.value ? 'border-green-500 bg-green-50 text-green-700' : 'border-slate-200 hover:border-slate-300 text-slate-700']"
          @click="newMethod.type = m.value"
        >
          <span class="text-xl" aria-hidden="true">{{ m.icon }}</span>{{ m.label }}
        </button>
      </div>
      <template v-if="newMethod.type === 'bank_transfer'">
        <AppInput v-model="newMethod.accountName" label="Account Holder Name" required />
        <div class="grid grid-cols-2 gap-3">
          <AppInput v-model="newMethod.routingNumber" label="Routing Number" placeholder="9 digits" />
          <AppInput v-model="newMethod.accountNumber" label="Account Number" />
        </div>
      </template>
      <template v-else-if="newMethod.type">
        <AppInput
          v-model="newMethod.email"
          :label="`${methodOptions.find((m) => m.value === newMethod.type)?.label} Email`"
          type="email"
          required
        />
      </template>
    </div>
    <template #footer>
      <AppButton variant="outline" @click="showAddMethodModal = false">Cancel</AppButton>
      <AppButton :disabled="!newMethod.type" @click="submitMethod">Add Method</AppButton>
    </template>
  </AppModal>
</template>

<script setup lang="ts">
import { ref, reactive } from 'vue'
import { RouterLink } from 'vue-router'
import { useAuthStore } from '@/stores/auth.store'
import { useToastStore } from '@/stores/toast.store'
import { usePaymentMethods } from '@/composables/usePaymentMethods'
import { TIMEZONE_OPTIONS, LANGUAGE_OPTIONS } from '@/constants/settings'
import AppInput from '@/components/ui/AppInput.vue'
import AppSelect from '@/components/ui/AppSelect.vue'
import AppButton from '@/components/ui/AppButton.vue'
import AppModal from '@/components/ui/AppModal.vue'
import AppTabs from '@/components/ui/AppTabs.vue'
import SettingsPasswordSection from '@/components/settings/SettingsPasswordSection.vue'
import SettingsSessionsList from '@/components/settings/SettingsSessionsList.vue'
import SettingsNotificationsSection from '@/components/settings/SettingsNotificationsSection.vue'
import SettingsPrivacyToggles from '@/components/settings/SettingsPrivacyToggles.vue'
import SettingsDangerZone from '@/components/settings/SettingsDangerZone.vue'

const auth = useAuthStore()
const toast = useToastStore()
const { paymentMethods, methodOptions, methodIcon, setDefault, removeMethod, addMethod } = usePaymentMethods()

const saving = ref(false)
const activeTab = ref('account')
const showAddMethodModal = ref(false)

const tabs = [
  { label: 'Account', value: 'account' },
  { label: 'Security', value: 'security' },
  { label: 'Payment', value: 'payment' },
  { label: 'Notifications', value: 'notifications' },
  { label: 'Privacy', value: 'privacy' },
]

const accountForm = reactive({
  email: auth.user?.email ?? '',
  phone: '',
  timezone: 'America/New_York',
  language: 'en',
})

const newMethod = reactive({
  type: '',
  email: '',
  accountName: '',
  routingNumber: '',
  accountNumber: '',
})

const connectedAccounts = ref([
  { id: 'google', name: 'Google', icon: '🔵', bgColor: 'bg-blue-50', connected: true, username: 'alex@gmail.com' },
  { id: 'github', name: 'GitHub', icon: '⚫', bgColor: 'bg-slate-100', connected: false, username: '' },
  { id: 'linkedin', name: 'LinkedIn', icon: '🔷', bgColor: 'bg-blue-100', connected: false, username: '' },
])

const freelancerEmailPrefs = [
  { key: 'messages', label: 'New Messages', description: 'When you receive a new message', enabled: true },
  { key: 'proposals', label: 'Proposal Updates', description: 'When a client views or responds to your proposal', enabled: true },
  { key: 'contracts', label: 'Contract Updates', description: 'Milestone approvals, payment releases', enabled: true },
  { key: 'job_alerts', label: 'Job Recommendations', description: 'Personalized job suggestions based on your skills', enabled: false },
  { key: 'marketing', label: 'Product Updates', description: 'Tips, new features, and promotions', enabled: false },
]

const freelancerPrivacySettings = [
  { key: 'show_earnings', label: 'Show Total Earnings', description: 'Display your total earnings ($0K+) on your public profile', enabled: true },
  { key: 'show_activity', label: 'Show Last Active', description: 'Let clients see when you were last active', enabled: true },
  { key: 'allow_search', label: 'Appear in Search Results', description: 'Allow clients to find you in freelancer search', enabled: true },
  { key: 'allow_invites', label: 'Receive Job Invitations', description: 'Let clients invite you to apply for their jobs', enabled: true },
]

async function save(): Promise<void> {
  saving.value = true
  await new Promise((r) => setTimeout(r, 800))
  saving.value = false
  toast.success('Settings Saved')
}

function submitMethod(): void {
  addMethod({ ...newMethod })
  Object.assign(newMethod, { type: '', email: '', accountName: '', routingNumber: '', accountNumber: '' })
  showAddMethodModal.value = false
}

function connectAccount(id: string): void {
  const acc = connectedAccounts.value.find((a) => a.id === id)
  if (acc) { acc.connected = true; acc.username = 'user@example.com' }
  toast.success('Account Connected!')
}

function disconnectAccount(id: string): void {
  const acc = connectedAccounts.value.find((a) => a.id === id)
  if (acc) { acc.connected = false; acc.username = '' }
  toast.info('Account Disconnected')
}
</script>
