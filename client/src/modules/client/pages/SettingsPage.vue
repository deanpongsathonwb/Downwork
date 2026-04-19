<template>
  <div class="max-w-3xl space-y-6">
    <h1 class="text-2xl font-bold text-slate-900">Account Settings</h1>

    <AppTabs v-model="activeTab" :tabs="tabs" variant="underline" />

    <!-- ── ACCOUNT ─────────────────────────────────────────── -->
    <template v-if="activeTab === 'account'">
      <div class="bg-white rounded-2xl border border-slate-200 p-6 space-y-4">
        <h2 class="font-semibold text-slate-900">Personal Information</h2>
        <div class="grid grid-cols-2 gap-4">
          <AppInput v-model="form.firstName" label="First Name" />
          <AppInput v-model="form.lastName" label="Last Name" />
        </div>
        <AppInput v-model="form.companyName" label="Company Name (Optional)" />
        <AppInput v-model="form.email" label="Email Address" type="email" />
        <AppInput v-model="form.phone" label="Phone Number" type="tel" />
        <div class="grid grid-cols-2 gap-4">
          <AppSelect v-model="form.timezone" label="Timezone" :options="TIMEZONE_OPTIONS" />
          <AppSelect v-model="form.language" label="Language" :options="LANGUAGE_OPTIONS" />
        </div>
        <AppButton :loading="saving" @click="save">Save Changes</AppButton>
      </div>

      <div class="bg-white rounded-2xl border border-slate-200 p-6 space-y-4">
        <h2 class="font-semibold text-slate-900">Company Details</h2>
        <AppInput v-model="form.website" label="Company Website" placeholder="https://..." />
        <AppSelect v-model="form.industry" label="Industry" :options="industryOptions" />
        <AppSelect v-model="form.companySize" label="Company Size" :options="companySizeOptions" />
        <AppTextarea v-model="form.bio" label="About Your Company" :rows="4" placeholder="Tell freelancers about your company..." />
        <AppButton variant="outline" :loading="saving" @click="save">Update Company Info</AppButton>
      </div>
    </template>

    <!-- ── SECURITY ───────────────────────────────────────── -->
    <template v-if="activeTab === 'security'">
      <SettingsPasswordSection />

      <div class="bg-white rounded-2xl border border-slate-200 p-6">
        <div class="flex items-start justify-between">
          <div>
            <h2 class="font-semibold text-slate-900">Two-Factor Authentication</h2>
            <p class="text-sm text-slate-500 mt-1">Add an extra layer of security to your account.</p>
          </div>
          <AppBadge variant="slate">Disabled</AppBadge>
        </div>
        <AppButton variant="outline" class="mt-4" @click="router.push('/auth/mfa-setup')">Set Up 2FA</AppButton>
      </div>

      <SettingsSessionsList />
    </template>

    <!-- ── PAYMENT ────────────────────────────────────────── -->
    <template v-if="activeTab === 'payment'">
      <div class="bg-white rounded-2xl border border-slate-200 p-6">
        <div class="flex items-center justify-between mb-4">
          <h2 class="font-semibold text-slate-900">Payment Methods</h2>
          <AppButton size="sm" @click="showAddCardModal = true">+ Add Card</AppButton>
        </div>
        <div class="space-y-3">
          <div
            v-for="card in paymentMethods"
            :key="card.id"
            class="flex items-center justify-between p-4 bg-slate-50 rounded-xl border border-slate-200"
          >
            <div class="flex items-center gap-3">
              <span class="text-2xl" aria-hidden="true">{{ card.brand === 'visa' ? '💳' : '🃏' }}</span>
              <div>
                <p class="text-sm font-medium text-slate-900">{{ card.brand.toUpperCase() }} ending in {{ card.last4 }}</p>
                <p class="text-xs text-slate-500">Expires {{ card.expiry }}</p>
              </div>
            </div>
            <div class="flex items-center gap-2">
              <AppBadge v-if="card.isDefault" variant="green">Default</AppBadge>
              <button v-else class="text-xs text-blue-600 hover:text-blue-700 font-medium" @click="setDefaultCard(card.id)">Set Default</button>
              <button class="text-xs text-red-500 hover:text-red-700 font-medium ml-2" @click="removeCard(card.id)">Remove</button>
            </div>
          </div>
          <p v-if="!paymentMethods.length" class="text-center py-8 text-slate-400 text-sm">
            No payment methods added yet.
          </p>
        </div>
      </div>

      <div class="bg-white rounded-2xl border border-slate-200 p-6">
        <h2 class="font-semibold text-slate-900 mb-2">Billing Information</h2>
        <p class="text-sm text-slate-500 mb-4">Used for invoice generation and tax purposes.</p>
        <div class="space-y-4">
          <AppInput v-model="billing.address" label="Billing Address" />
          <div class="grid grid-cols-2 gap-4">
            <AppInput v-model="billing.city" label="City" />
            <AppInput v-model="billing.postalCode" label="Postal Code" />
          </div>
          <AppInput v-model="billing.country" label="Country" />
          <AppInput v-model="billing.vatNumber" label="VAT / Tax Number (Optional)" />
          <AppButton variant="outline" @click="saveBilling">Save Billing Info</AppButton>
        </div>
      </div>
    </template>

    <!-- ── NOTIFICATIONS ──────────────────────────────────── -->
    <SettingsNotificationsSection
      v-if="activeTab === 'notifications'"
      :initial-email-prefs="clientEmailPrefs"
    />

    <!-- ── PRIVACY ────────────────────────────────────────── -->
    <template v-if="activeTab === 'privacy'">
      <SettingsPrivacyToggles title="Privacy Settings" :settings="clientPrivacySettings" />
      <SettingsDangerZone />
    </template>

    <!-- Add Card Modal -->
    <AppModal v-model="showAddCardModal" title="Add Credit / Debit Card" size="sm">
      <div class="space-y-4">
        <AppInput v-model="newCard.number" label="Card Number" placeholder="1234 5678 9012 3456" />
        <div class="grid grid-cols-2 gap-4">
          <AppInput v-model="newCard.expiry" label="Expiry Date" placeholder="MM/YY" />
          <AppInput v-model="newCard.cvc" label="CVC" placeholder="123" />
        </div>
        <AppInput v-model="newCard.name" label="Cardholder Name" />
      </div>
      <template #footer>
        <AppButton variant="outline" @click="showAddCardModal = false">Cancel</AppButton>
        <AppButton @click="addCard">Add Card</AppButton>
      </template>
    </AppModal>
  </div>
</template>

<script setup lang="ts">
import { ref, reactive, onMounted } from 'vue'
import { useRouter } from 'vue-router'
import { useAuthStore } from '@/stores/auth.store'
import { useUserStore } from '@/stores/user.store'
import { useToastStore } from '@/stores/toast.store'
import { userService } from '@/services/api/user.service'
import { logger } from '@/utils/logger'
import { TIMEZONE_OPTIONS, LANGUAGE_OPTIONS } from '@/constants/settings'
import type { SelectOption } from '@/types'
import AppTabs from '@/components/ui/AppTabs.vue'
import AppInput from '@/components/ui/AppInput.vue'
import AppTextarea from '@/components/ui/AppTextarea.vue'
import AppSelect from '@/components/ui/AppSelect.vue'
import AppButton from '@/components/ui/AppButton.vue'
import AppBadge from '@/components/ui/AppBadge.vue'
import AppModal from '@/components/ui/AppModal.vue'
import SettingsPasswordSection from '@/components/settings/SettingsPasswordSection.vue'
import SettingsSessionsList from '@/components/settings/SettingsSessionsList.vue'
import SettingsNotificationsSection from '@/components/settings/SettingsNotificationsSection.vue'
import SettingsPrivacyToggles from '@/components/settings/SettingsPrivacyToggles.vue'
import SettingsDangerZone from '@/components/settings/SettingsDangerZone.vue'

const auth = useAuthStore()
const userStore = useUserStore()
const toast = useToastStore()
const router = useRouter()

const activeTab = ref('account')
const saving = ref(false)
const showAddCardModal = ref(false)

const tabs = [
  { label: 'Account', value: 'account' },
  { label: 'Security', value: 'security' },
  { label: 'Payment', value: 'payment' },
  { label: 'Notifications', value: 'notifications' },
  { label: 'Privacy', value: 'privacy' },
]

const form = reactive({
  firstName: auth.user?.firstName ?? '',
  lastName: auth.user?.lastName ?? '',
  companyName: '',
  email: auth.user?.email ?? '',
  phone: auth.user?.phone ?? '',
  timezone: auth.user?.timezone ?? 'America/New_York',
  language: 'en',
  website: '',
  industry: 'tech',
  companySize: '10-99',
  bio: '',
})

const billing = reactive({
  address: '123 Main Street',
  city: 'San Francisco',
  postalCode: '94102',
  country: 'United States',
  vatNumber: '',
})

const newCard = reactive({ number: '', expiry: '', cvc: '', name: '' })

const paymentMethods = ref([
  { id: 'c1', brand: 'visa', last4: '4242', expiry: '12/27', isDefault: true },
  { id: 'c2', brand: 'mastercard', last4: '5555', expiry: '08/26', isDefault: false },
])

const industryOptions: SelectOption[] = [
  { label: 'Technology', value: 'tech' },
  { label: 'Marketing & Advertising', value: 'marketing' },
  { label: 'E-Commerce', value: 'ecommerce' },
  { label: 'Finance', value: 'finance' },
  { label: 'Healthcare', value: 'healthcare' },
  { label: 'Education', value: 'education' },
  { label: 'Other', value: 'other' },
]

const companySizeOptions: SelectOption[] = [
  { label: 'Just me', value: '1' },
  { label: '2–9 employees', value: '2-9' },
  { label: '10–99 employees', value: '10-99' },
  { label: '100–999 employees', value: '100-999' },
  { label: '1000+ employees', value: '1000+' },
]

const clientEmailPrefs = [
  { key: 'new_proposals', label: 'New Proposals', description: 'When freelancers apply to your jobs', enabled: true },
  { key: 'contract_updates', label: 'Contract Updates', description: 'Milestone submissions and approvals', enabled: true },
  { key: 'messages', label: 'New Messages', description: 'When you receive a direct message', enabled: true },
  { key: 'payment_receipts', label: 'Payment Receipts', description: 'Confirmations for payments and escrow', enabled: true },
  { key: 'job_recommendations', label: 'Job Alerts', description: 'Tips and recommended freelancers', enabled: false },
  { key: 'marketing', label: 'Product Updates', description: 'News, features, and promotions', enabled: false },
]

const clientPrivacySettings = [
  { key: 'show_company', label: 'Show Company Name Publicly', description: 'Freelancers can see your company on job posts', enabled: true },
  { key: 'show_spending', label: 'Show Total Spent', description: 'Display your total spend on your profile', enabled: false },
  { key: 'receive_invites', label: 'Allow Freelancer Messages', description: 'Freelancers can message you directly', enabled: true },
  { key: 'show_last_active', label: 'Show Last Active Status', description: 'Display when you were last online', enabled: false },
]

function applyProfileToForm(): void {
  const u = auth.user
  const cp = userStore.clientProfile
  if (u) {
    form.firstName = u.firstName ?? ''
    form.lastName = u.lastName ?? ''
    form.email = u.email ?? ''
    form.phone = u.phone ?? ''
    form.timezone = u.timezone ?? 'America/New_York'
  }
  if (cp) {
    form.companyName = cp.companyName ?? ''
    form.website = cp.website ?? ''
    form.industry = cp.industry || 'tech'
    form.companySize = cp.companySize || '10-99'
    form.bio = cp.description ?? ''
  }
}

async function loadProfile(): Promise<void> {
  const uid = auth.user?.id
  if (!uid) return
  try {
    await auth.getMe()
    await userStore.fetchClientProfile(uid)
    applyProfileToForm()
  } catch (err) {
    logger.catch(err, 'ClientSettingsPage.loadProfile')
  }
}

onMounted(() => {
  void loadProfile()
})

async function save(): Promise<void> {
  const uid = auth.user?.id
  if (!uid) {
    toast.error('Not signed in', 'Please log in again.')
    return
  }
  saving.value = true
  try {
    await userService.updateAccountSettings({
      firstName: form.firstName,
      lastName: form.lastName,
      email: form.email,
      phone: form.phone,
      timezone: form.timezone,
    })
    await userService.updateClientProfile({
      companyName: form.companyName || undefined,
      website: form.website || undefined,
      industry: form.industry,
      companySize: form.companySize,
      description: form.bio || undefined,
    })
    await auth.getMe()
    await userStore.fetchClientProfile(uid)
    applyProfileToForm()
    toast.success('Settings Saved', 'Your information has been updated.')
  } catch (err) {
    logger.catch(err, 'ClientSettingsPage.save')
  } finally {
    saving.value = false
  }
}

function setDefaultCard(id: string): void {
  paymentMethods.value = paymentMethods.value.map((c) => ({ ...c, isDefault: c.id === id }))
  toast.success('Default Card Updated')
}

function removeCard(id: string): void {
  paymentMethods.value = paymentMethods.value.filter((c) => c.id !== id)
  toast.info('Card Removed')
}

function addCard(): void {
  paymentMethods.value.push({
    id: `c${Date.now()}`,
    brand: 'visa',
    last4: newCard.number.slice(-4) || '0000',
    expiry: newCard.expiry,
    isDefault: false,
  })
  Object.assign(newCard, { number: '', expiry: '', cvc: '', name: '' })
  showAddCardModal.value = false
  toast.success('Card Added', 'Your new card has been saved.')
}

function saveBilling(): void {
  toast.success('Billing Info Saved')
}
</script>
