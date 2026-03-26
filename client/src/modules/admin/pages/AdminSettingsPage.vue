<template>
  <div class="space-y-6 max-w-2xl">
    <h1 class="text-2xl font-bold text-white">Platform Settings</h1>

    <!-- Loading State -->
    <div v-if="isLoading" class="space-y-6">
      <div v-for="i in 2" :key="i" class="animate-pulse bg-slate-900 rounded-2xl border border-slate-800 p-6">
        <div class="bg-slate-700 rounded h-5 w-40 mb-4"></div>
        <div class="space-y-4">
          <div v-for="j in 3" :key="j">
            <div class="bg-slate-700 rounded h-4 w-48 mb-2"></div>
            <div class="bg-slate-700 rounded h-10 w-24"></div>
          </div>
        </div>
      </div>
    </div>

    <!-- Error State -->
    <div v-else-if="loadError" class="text-center py-16">
      <div class="text-red-400 mb-4">
        <svg class="w-12 h-12 mx-auto" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-2.5L13.732 4c-.77-.833-1.964-.833-2.732 0L4.082 16.5c-.77.833.192 2.5 1.732 2.5z"/></svg>
      </div>
      <p class="text-slate-400 mb-4">{{ loadError }}</p>
      <button class="px-4 py-2 bg-red-600 text-white rounded-lg hover:bg-red-700" @click="retry">Try Again</button>
    </div>

    <!-- Content -->
    <template v-else>
    <div class="bg-slate-900 rounded-2xl border border-slate-800 p-6 space-y-4">
      <h2 class="font-semibold text-white">Commission & Fees</h2>
      <div>
        <label class="text-sm text-slate-400 block mb-2">Service Fee Tier 1 (first $500)</label>
        <div class="flex items-center gap-3">
          <input v-model="fees.tier1" type="number" min="0" max="100" class="w-24 px-3 py-2 bg-slate-800 border border-slate-700 rounded-xl text-white text-sm focus:outline-none focus:ring-2 focus:ring-red-500" />
          <span class="text-slate-400">%</span>
        </div>
      </div>
      <div>
        <label class="text-sm text-slate-400 block mb-2">Service Fee Tier 2 ($500–$10,000)</label>
        <div class="flex items-center gap-3">
          <input v-model="fees.tier2" type="number" min="0" max="100" class="w-24 px-3 py-2 bg-slate-800 border border-slate-700 rounded-xl text-white text-sm focus:outline-none focus:ring-2 focus:ring-red-500" />
          <span class="text-slate-400">%</span>
        </div>
      </div>
      <div>
        <label class="text-sm text-slate-400 block mb-2">Service Fee Tier 3 (over $10,000)</label>
        <div class="flex items-center gap-3">
          <input v-model="fees.tier3" type="number" min="0" max="100" class="w-24 px-3 py-2 bg-slate-800 border border-slate-700 rounded-xl text-white text-sm focus:outline-none focus:ring-2 focus:ring-red-500" />
          <span class="text-slate-400">%</span>
        </div>
      </div>
      <button class="px-4 py-2.5 bg-red-600 text-white text-sm font-medium rounded-xl hover:bg-red-700 transition-colors" @click="saveSettings">
        Save Fee Settings
      </button>
    </div>

    <div class="bg-slate-900 rounded-2xl border border-slate-800 p-6 space-y-4">
      <h2 class="font-semibold text-white">Platform Features</h2>
      <div v-for="feature in features" :key="feature.label" class="flex items-center justify-between py-2.5 border-b border-slate-800 last:border-0">
        <div>
          <p class="text-sm font-medium text-white">{{ feature.label }}</p>
          <p class="text-xs text-slate-500">{{ feature.description }}</p>
        </div>
        <label class="relative inline-flex items-center cursor-pointer">
          <input v-model="feature.enabled" type="checkbox" class="sr-only peer" />
          <div class="w-11 h-6 bg-slate-700 peer-focus:ring-2 peer-focus:ring-red-500 rounded-full peer peer-checked:after:translate-x-full peer-checked:bg-red-600 after:content-[''] after:absolute after:top-0.5 after:left-0.5 after:bg-white after:rounded-full after:h-5 after:w-5 after:transition-all" />
        </label>
      </div>
    </div>
    </template>
  </div>
</template>

<script setup lang="ts">
import { ref, reactive, onMounted, watch } from 'vue'
import { useAdminStore } from '@/stores/admin.store'

const adminStore = useAdminStore()
const isLoading = ref(true)
const loadError = ref<string | null>(null)

const fees = reactive({ tier1: 20, tier2: 10, tier3: 5 })

const features = reactive([
  { label: 'Email Verification Required', description: 'Users must verify email before posting jobs or proposals', key: 'registrationEnabled' as const, enabled: true },
  { label: 'Job Moderation', description: 'New jobs require admin approval before going live', key: 'autoApproveJobs' as const, enabled: false },
  { label: 'ID Verification', description: 'Enable identity verification for freelancers', key: 'kycRequired' as const, enabled: true },
  { label: 'Maintenance Mode', description: 'Show maintenance page to all non-admin users', key: 'maintenanceMode' as const, enabled: false },
])

watch(
  () => adminStore.platformSettings,
  (s) => {
    if (!s) return
    fees.tier1 = s.commissionRate
    fees.tier2 = Math.round(s.commissionRate / 2)
    fees.tier3 = Math.round(s.commissionRate / 4)
    features[0].enabled = s.registrationEnabled
    features[1].enabled = !s.autoApproveJobs
    features[2].enabled = s.kycRequired
    features[3].enabled = s.maintenanceMode
  },
  { immediate: true },
)

async function saveSettings(): Promise<void> {
  await adminStore.updatePlatformSettings({
    commissionRate: fees.tier1,
    registrationEnabled: features[0].enabled,
    autoApproveJobs: !features[1].enabled,
    kycRequired: features[2].enabled,
    maintenanceMode: features[3].enabled,
  })
}

async function retry() {
  isLoading.value = true
  loadError.value = null
  try {
    await adminStore.fetchPlatformSettings()
  } catch {
    loadError.value = 'Failed to load platform settings.'
  } finally {
    isLoading.value = false
  }
}

onMounted(() => {
  retry()
})
</script>
