<template>
  <div class="space-y-6">
    <div class="flex items-center justify-between">
      <h1 class="text-2xl font-bold text-slate-900">Earnings</h1>
      <div class="text-right text-xs text-slate-500">
        <p>Next billing cycle: <strong>Mar 1, 2026</strong></p>
        <p>Service fee tier: <strong class="text-green-600">20%</strong> (0–$500 lifetime)</p>
      </div>
    </div>

    <!-- Loading State -->
    <div v-if="paymentStore.isLoading" class="space-y-6">
      <div class="grid grid-cols-1 sm:grid-cols-3 gap-4">
        <div v-for="i in 3" :key="i" class="animate-pulse bg-white rounded-2xl border border-slate-200 p-5 h-28"></div>
      </div>
      <div class="animate-pulse bg-white rounded-2xl border border-slate-200 h-64"></div>
    </div>

    <!-- Error State -->
    <div v-else-if="paymentStore.error" class="text-center py-16">
      <div class="text-red-400 mb-4">
        <svg class="w-12 h-12 mx-auto" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-2.5L13.732 4c-.77-.833-1.964-.833-2.732 0L4.082 16.5c-.77.833.192 2.5 1.732 2.5z"/></svg>
      </div>
      <p class="text-gray-600 mb-4">{{ paymentStore.error }}</p>
      <button class="px-4 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700" @click="retry">Try Again</button>
    </div>

    <!-- Content -->
    <template v-else>
    <!-- Summary Cards -->
    <div class="grid grid-cols-1 sm:grid-cols-3 gap-4">
      <div class="bg-gradient-to-br from-green-500 to-emerald-600 rounded-2xl p-5 text-white">
        <p class="text-sm text-green-100 mb-1">Available to Withdraw</p>
        <p class="text-3xl font-black">$3,250.00</p>
        <AppButton
          variant="secondary"
          size="sm"
          class="mt-4 bg-white text-green-700 hover:bg-green-50 font-semibold"
          @click="showWithdrawModal = true"
        >
          Withdraw Funds
        </AppButton>
      </div>
      <div class="bg-white rounded-2xl border border-slate-200 p-5">
        <p class="text-sm text-slate-500 mb-1">Pending Clearance</p>
        <p class="text-3xl font-bold text-slate-900">$1,800.00</p>
        <p class="text-xs text-slate-400 mt-2">Clears in 5 business days</p>
        <div class="h-1.5 bg-slate-100 rounded-full mt-3">
          <div class="h-1.5 bg-yellow-400 rounded-full" style="width: 70%" role="progressbar" aria-valuenow="70" aria-valuemin="0" aria-valuemax="100" />
        </div>
      </div>
      <div class="bg-white rounded-2xl border border-slate-200 p-5">
        <p class="text-sm text-slate-500 mb-1">Total Earned (All Time)</p>
        <p class="text-3xl font-bold text-slate-900">$12,450.00</p>
        <p class="text-xs text-green-600 font-medium mt-2">↑ $4,250 this month</p>
      </div>
    </div>

    <!-- Connects Balance -->
    <div class="bg-amber-50 border border-amber-200 rounded-2xl p-5 flex items-center justify-between">
      <div class="flex items-center gap-3">
        <div class="w-10 h-10 bg-amber-100 rounded-xl flex items-center justify-center">
          <svg class="w-5 h-5 text-amber-600" fill="none" viewBox="0 0 24 24" stroke="currentColor" aria-hidden="true">
            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M13 10V3L4 14h7v7l9-11h-7z" />
          </svg>
        </div>
        <div>
          <p class="font-semibold text-amber-900">Connects Balance: <strong>60 Connects</strong></p>
          <p class="text-xs text-amber-700">Used to apply for jobs. You receive 10 free Connects per month.</p>
        </div>
      </div>
      <AppButton
        variant="outline"
        size="sm"
        class="border-amber-300 text-amber-700 hover:bg-amber-100"
        @click="showBuyConnectsModal = true"
      >
        Buy More
      </AppButton>
    </div>

    <AppTabs v-model="activeTab" :tabs="tabs" variant="pills" />

    <!-- Earnings Table -->
    <div v-if="activeTab === 'earnings'" class="bg-white rounded-2xl border border-slate-200 overflow-hidden">
      <div class="px-6 py-4 border-b border-slate-200 flex justify-between items-center">
        <h2 class="font-semibold text-slate-900">Earnings History</h2>
        <button
          class="flex items-center gap-1.5 text-sm text-blue-600 font-medium hover:text-blue-700"
          @click="exportCSV"
        >
          <svg class="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" aria-hidden="true">
            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M4 16v1a3 3 0 003 3h10a3 3 0 003-3v-1m-4-4l-4 4m0 0l-4-4m4 4V4" />
          </svg>
          Export CSV
        </button>
      </div>
      <div class="overflow-x-auto">
        <table class="w-full text-sm">
          <thead class="bg-slate-50 border-b border-slate-200">
            <tr>
              <th v-for="col in earningCols" :key="col" class="py-3 px-5 text-left text-xs font-semibold text-slate-500 uppercase tracking-wide">{{ col }}</th>
            </tr>
          </thead>
          <tbody>
            <tr v-for="earning in earnings" :key="earning.id" class="border-b border-slate-100 hover:bg-slate-50 transition-colors">
              <td class="py-3.5 px-5">
                <p class="font-medium text-slate-900">{{ earning.jobTitle }}</p>
                <p class="text-xs text-slate-400 mt-0.5">Contract #{{ earning.contractId }}</p>
              </td>
              <td class="py-3.5 px-5 text-slate-600">{{ earning.clientName }}</td>
              <td class="py-3.5 px-5">
                <AppBadge :variant="earning.type === 'milestone' ? 'blue' : earning.type === 'hourly' ? 'purple' : 'yellow'">{{ earning.type }}</AppBadge>
              </td>
              <td class="py-3.5 px-5 font-semibold text-green-700">+${{ earning.amount.toLocaleString() }}</td>
              <td class="py-3.5 px-5 text-slate-500">-${{ (earning.amount * 0.2).toFixed(0) }}</td>
              <td class="py-3.5 px-5 font-bold text-slate-900">${{ (earning.amount * 0.8).toFixed(0) }}</td>
              <td class="py-3.5 px-5">
                <AppBadge :variant="earning.status === 'available' ? 'green' : earning.status === 'pending' ? 'yellow' : 'slate'">{{ earning.status }}</AppBadge>
              </td>
              <td class="py-3.5 px-5 text-slate-500">{{ formatDate(earning.date) }}</td>
            </tr>
          </tbody>
        </table>
      </div>
    </div>

    <!-- Withdrawals Table -->
    <div v-else-if="activeTab === 'withdrawals'" class="bg-white rounded-2xl border border-slate-200 overflow-hidden">
      <div class="overflow-x-auto">
        <table class="w-full text-sm">
          <thead class="bg-slate-50 border-b border-slate-200">
            <tr>
              <th v-for="col in withdrawalCols" :key="col" class="py-3 px-5 text-left text-xs font-semibold text-slate-500 uppercase tracking-wide">{{ col }}</th>
            </tr>
          </thead>
          <tbody>
            <tr v-for="w in withdrawals" :key="w.id" class="border-b border-slate-100 hover:bg-slate-50 transition-colors">
              <td class="py-3.5 px-5 font-semibold text-slate-900">-${{ w.amount.toLocaleString() }}</td>
              <td class="py-3.5 px-5">
                <div class="flex items-center gap-2">
                  <span class="text-lg" aria-hidden="true">{{ methodIcon(w.method) }}</span>
                  <span class="text-slate-600">{{ w.method }}</span>
                </div>
              </td>
              <td class="py-3.5 px-5">
                <AppBadge :variant="w.status === 'completed' ? 'green' : w.status === 'processing' ? 'blue' : 'yellow'">{{ w.status }}</AppBadge>
              </td>
              <td class="py-3.5 px-5 text-slate-500">{{ formatDate(w.requestedAt) }}</td>
              <td class="py-3.5 px-5 text-slate-500">{{ w.completedAt ? formatDate(w.completedAt) : '—' }}</td>
            </tr>
          </tbody>
        </table>
      </div>
    </div>

    <!-- Connects Tab -->
    <div v-else-if="activeTab === 'connects'" class="bg-white rounded-2xl border border-slate-200 p-6">
      <div class="text-center mb-6">
        <p class="text-4xl font-black text-amber-600">60</p>
        <p class="text-sm text-slate-500 mt-1">Available Connects</p>
      </div>
      <div class="space-y-3 mb-6">
        <div
          v-for="pkg in connectsPackages"
          :key="pkg.connects"
          :class="['p-4 border-2 rounded-xl flex items-center justify-between cursor-pointer transition-all', selectedPackage?.connects === pkg.connects ? 'border-amber-500 bg-amber-50' : 'border-slate-200 hover:border-slate-300']"
          role="radio"
          :aria-checked="selectedPackage?.connects === pkg.connects"
          tabindex="0"
          @click="selectedPackage = pkg"
          @keydown.enter="selectedPackage = pkg"
        >
          <div>
            <p class="font-bold text-slate-900">{{ pkg.connects }} Connects</p>
            <p v-if="pkg.bonus" class="text-xs text-green-600 font-medium">+{{ pkg.bonus }} bonus Connects</p>
          </div>
          <p class="text-lg font-bold text-slate-900">${{ pkg.price }}</p>
        </div>
      </div>
      <AppButton class="w-full" :disabled="!selectedPackage" @click="buyConnects">
        Buy {{ selectedPackage?.connects ?? '' }} Connects for ${{ selectedPackage?.price ?? '' }}
      </AppButton>
    </div>
  </template>
  </div>

  <!-- Withdrawal Modal -->
  <AppModal v-model="showWithdrawModal" title="Withdraw Funds" size="md">
    <div class="space-y-4">
      <div class="p-4 bg-green-50 rounded-xl border border-green-200">
        <p class="text-sm text-green-800 font-medium">Available: <strong class="text-lg">$3,250.00</strong></p>
        <p class="text-xs text-green-600 mt-0.5">Minimum withdrawal: $50.00</p>
      </div>

      <div>
        <label class="text-sm font-medium text-slate-700 block mb-1.5" for="withdraw-amount">Amount to Withdraw (USD)</label>
        <div class="relative">
          <span class="absolute left-3 top-1/2 -translate-y-1/2 text-slate-500 font-medium" aria-hidden="true">$</span>
          <input
            id="withdraw-amount"
            v-model="withdrawForm.amount"
            type="number"
            min="50"
            max="3250"
            class="w-full pl-7 pr-3 py-2.5 border border-slate-300 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-green-500"
            placeholder="0.00"
          />
        </div>
        <div class="flex gap-2 mt-2">
          <button
            v-for="amt in [100, 500, 1000, 3250]"
            :key="amt"
            class="px-2.5 py-1 text-xs border border-slate-200 rounded-lg hover:bg-slate-50 font-medium"
            @click="withdrawForm.amount = amt"
          >
            ${{ amt.toLocaleString() }}
          </button>
        </div>
      </div>

      <div>
        <p class="text-sm font-medium text-slate-700 mb-2">Withdraw To</p>
        <div class="space-y-2">
          <label
            v-for="method in paymentMethods"
            :key="method.id"
            :class="['flex items-center gap-3 p-3 border-2 rounded-xl cursor-pointer transition-all', withdrawForm.methodId === method.id ? 'border-green-500 bg-green-50' : 'border-slate-200 hover:border-slate-300']"
          >
            <input v-model="withdrawForm.methodId" type="radio" :value="method.id" class="accent-green-600" />
            <span class="text-xl" aria-hidden="true">{{ methodIcon(method.type) }}</span>
            <div>
              <p class="text-sm font-medium text-slate-900">{{ method.label }}</p>
              <p class="text-xs text-slate-500">{{ method.details }}</p>
            </div>
            <span v-if="method.isDefault" class="ml-auto text-xs text-green-600 font-medium bg-green-50 border border-green-200 px-2 py-0.5 rounded-md">Default</span>
          </label>
          <button
            class="w-full py-2.5 border-2 border-dashed border-slate-300 rounded-xl text-sm text-slate-500 hover:border-green-400 hover:text-green-600 font-medium transition-colors"
            @click="showWithdrawModal = false; showAddMethodModal = true"
          >
            + Add Payment Method
          </button>
        </div>
      </div>

      <div class="p-3 bg-slate-50 rounded-xl text-xs text-slate-500 space-y-1">
        <p>Estimated arrival: <strong class="text-slate-700">1–3 business days</strong></p>
        <p>Transaction fee: <strong class="text-slate-700">$1.00 flat fee</strong></p>
      </div>
    </div>
    <template #footer>
      <AppButton variant="outline" @click="showWithdrawModal = false">Cancel</AppButton>
      <AppButton
        :loading="withdrawing"
        :disabled="!withdrawForm.methodId || !withdrawForm.amount || Number(withdrawForm.amount) < 50"
        @click="processWithdrawal"
      >
        Withdraw ${{ withdrawForm.amount || '0' }}
      </AppButton>
    </template>
  </AppModal>

  <!-- Add Payment Method Modal -->
  <AppModal v-model="showAddMethodModal" title="Add Payment Method" size="md">
    <div class="space-y-4">
      <div class="grid grid-cols-2 gap-3">
        <button
          v-for="m in methodOptions"
          :key="m.value"
          :class="['p-4 border-2 rounded-xl text-center transition-all', newMethod.type === m.value ? 'border-green-500 bg-green-50' : 'border-slate-200 hover:border-slate-300']"
          @click="newMethod.type = m.value"
        >
          <span class="block text-2xl mb-1" aria-hidden="true">{{ m.icon }}</span>
          <span class="text-sm font-medium text-slate-700">{{ m.label }}</span>
        </button>
      </div>

      <template v-if="newMethod.type === 'bank_transfer'">
        <AppInput v-model="newMethod.accountName" label="Account Holder Name" required />
        <div class="grid grid-cols-2 gap-3">
          <AppInput v-model="newMethod.routingNumber" label="Routing Number" placeholder="9 digits" />
          <AppInput v-model="newMethod.accountNumber" label="Account Number" />
        </div>
        <AppSelect v-model="newMethod.accountType" label="Account Type" :options="[{ label: 'Checking', value: 'checking' }, { label: 'Savings', value: 'savings' }]" />
      </template>
      <template v-else-if="newMethod.type === 'paypal'">
        <AppInput v-model="newMethod.email" label="PayPal Email" type="email" required placeholder="your@paypal.com" />
      </template>
      <template v-else-if="newMethod.type === 'payoneer'">
        <AppInput v-model="newMethod.email" label="Payoneer Account Email" type="email" required />
      </template>
      <template v-else-if="newMethod.type === 'wise'">
        <AppInput v-model="newMethod.email" label="Wise Account Email" type="email" required />
        <AppSelect v-model="newMethod.currency" label="Preferred Currency" :options="CURRENCY_OPTIONS" />
      </template>
    </div>
    <template #footer>
      <AppButton variant="outline" @click="showAddMethodModal = false">Cancel</AppButton>
      <AppButton :disabled="!newMethod.type" @click="submitMethod">Add Method</AppButton>
    </template>
  </AppModal>

  <!-- Buy Connects Modal -->
  <AppModal v-model="showBuyConnectsModal" title="Buy Connects" size="sm">
    <div class="space-y-3">
      <div
        v-for="pkg in connectsPackages"
        :key="pkg.connects"
        :class="['p-4 border-2 rounded-xl flex items-center justify-between cursor-pointer transition-all', selectedPackage?.connects === pkg.connects ? 'border-amber-500 bg-amber-50' : 'border-slate-200 hover:border-slate-300']"
        @click="selectedPackage = pkg"
      >
        <div>
          <p class="font-bold text-slate-900">{{ pkg.connects }} Connects</p>
          <p v-if="pkg.bonus" class="text-xs text-green-600">+{{ pkg.bonus }} bonus Connects</p>
        </div>
        <p class="text-lg font-bold">${{ pkg.price }}</p>
      </div>
    </div>
    <template #footer>
      <AppButton variant="outline" @click="showBuyConnectsModal = false">Cancel</AppButton>
      <AppButton :disabled="!selectedPackage" @click="buyConnects">Buy Now</AppButton>
    </template>
  </AppModal>
</template>

<script setup lang="ts">
import { ref, reactive, computed, onMounted } from 'vue'
import { usePaymentStore } from '@/stores/payment.store'
import { useToastStore } from '@/stores/toast.store'
import { usePaymentMethods } from '@/composables/usePaymentMethods'
import { useFormatters } from '@/composables/useFormatters'
import { CURRENCY_OPTIONS } from '@/constants/settings'
import AppBadge from '@/components/ui/AppBadge.vue'
import AppButton from '@/components/ui/AppButton.vue'
import AppModal from '@/components/ui/AppModal.vue'
import AppInput from '@/components/ui/AppInput.vue'
import AppSelect from '@/components/ui/AppSelect.vue'
import AppTabs from '@/components/ui/AppTabs.vue'

const toast = useToastStore()
const paymentStore = usePaymentStore()
const { methodOptions, methodIcon } = usePaymentMethods()
const { formatDate } = useFormatters()

const activeTab = ref('earnings')
const showWithdrawModal = ref(false)
const showAddMethodModal = ref(false)
const showBuyConnectsModal = ref(false)
const withdrawing = ref(false)
const selectedPackage = ref<{ connects: number; price: number; bonus?: number } | null>(null)

const tabs = [
  { label: 'Earnings', value: 'earnings' },
  { label: 'Withdrawals', value: 'withdrawals' },
  { label: 'Connects', value: 'connects' },
]

const earningCols = ['Job', 'Client', 'Type', 'Gross', 'Fee', 'Net', 'Status', 'Date']
const withdrawalCols = ['Amount', 'Method', 'Status', 'Requested', 'Completed']

const withdrawForm = reactive({ amount: 0, methodId: '' })
const newMethod = reactive({ type: '', email: '', accountName: '', routingNumber: '', accountNumber: '', accountType: '', currency: 'USD' })

const connectsPackages = [
  { connects: 20, price: 3, id: 'pkg_20' },
  { connects: 40, price: 6, bonus: 5, id: 'pkg_40' },
  { connects: 80, price: 12, bonus: 15, id: 'pkg_80' },
  { connects: 150, price: 20, bonus: 40, id: 'pkg_150' },
]

const earnings = computed(() => paymentStore.earnings)
const withdrawals = computed(() => paymentStore.withdrawals)
const paymentMethods = computed(() => paymentStore.paymentMethods)

async function retry() {
  await Promise.all([
    paymentStore.fetchBalance(),
    paymentStore.fetchEarnings(),
    paymentStore.fetchWithdrawals(),
    paymentStore.fetchPaymentMethods(),
    paymentStore.fetchConnectsBalance(),
  ])
}

onMounted(async () => {
  await retry()
})

async function processWithdrawal(): Promise<void> {
  if (!withdrawForm.amount || Number(withdrawForm.amount) < 50) {
    toast.error('Minimum withdrawal', 'A minimum of $50 is required to withdraw.')
    return
  }
  withdrawing.value = true
  const success = await paymentStore.requestWithdrawal({
    amount: Number(withdrawForm.amount),
    methodId: withdrawForm.methodId,
  })
  withdrawing.value = false
  if (success) {
    showWithdrawModal.value = false
    withdrawForm.amount = 0
    withdrawForm.methodId = ''
  }
}

async function submitMethod(): Promise<void> {
  const success = await paymentStore.addPaymentMethod({
    type: newMethod.type as any,
    label: newMethod.type === 'bank_transfer'
      ? `Bank ****${newMethod.accountNumber?.slice(-4) ?? '0000'}`
      : newMethod.type,
    details: newMethod.email || (newMethod.accountNumber ? `****${newMethod.accountNumber.slice(-4)}` : ''),
    isDefault: paymentMethods.value.length === 0,
  })
  if (success) {
    Object.assign(newMethod, { type: '', email: '', accountName: '', routingNumber: '', accountNumber: '', accountType: '', currency: 'USD' })
    showAddMethodModal.value = false
  }
}

async function buyConnects(): Promise<void> {
  if (!selectedPackage.value) return
  const pkg = connectsPackages.find(p => p.connects === selectedPackage.value!.connects)
  const success = await paymentStore.buyConnects(pkg?.id ?? '')
  if (success) {
    showBuyConnectsModal.value = false
    selectedPackage.value = null
  }
}

function exportCSV(): void {
  toast.info('Export Started', 'Your earnings CSV is being prepared.')
}
</script>
