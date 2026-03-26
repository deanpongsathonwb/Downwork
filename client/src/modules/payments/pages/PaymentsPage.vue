<template>
  <div class="space-y-6">
    <div class="flex items-center justify-between">
      <h1 class="text-2xl font-bold text-slate-900">Payments & Billing</h1>
      <AppButton @click="showAddFundsModal = true">+ Add Funds</AppButton>
    </div>

    <!-- Summary Cards -->
    <div class="grid grid-cols-1 sm:grid-cols-4 gap-4">
      <div class="bg-gradient-to-br from-blue-500 to-indigo-600 rounded-2xl p-5 text-white">
        <p class="text-sm text-blue-100 mb-1">Total Spent</p>
        <p class="text-3xl font-black">${{ totalSpent.toLocaleString() }}</p>
        <p class="text-xs text-blue-200 mt-2">All time</p>
      </div>
      <div class="bg-white rounded-2xl border border-slate-200 p-5">
        <p class="text-sm text-slate-500 mb-1">This Month</p>
        <p class="text-3xl font-bold text-slate-900">${{ paymentStore.pendingAmount.toLocaleString() }}</p>
        <p class="text-xs text-green-600 font-medium mt-2">Current period</p>
      </div>
      <div class="bg-white rounded-2xl border border-slate-200 p-5">
        <p class="text-sm text-slate-500 mb-1">In Escrow</p>
        <p class="text-3xl font-bold text-slate-900">${{ paymentStore.inEscrow.toLocaleString() }}</p>
        <p class="text-xs text-slate-400 mt-2">Across {{ contractStore.activeContracts.length }} active contracts</p>
      </div>
      <div class="bg-white rounded-2xl border border-slate-200 p-5">
        <p class="text-sm text-slate-500 mb-1">Account Balance</p>
        <p class="text-3xl font-bold text-slate-900">${{ paymentStore.availableBalance.toLocaleString() }}</p>
        <p class="text-xs text-blue-600 font-medium mt-2 cursor-pointer" @click="showAddFundsModal = true">Add funds →</p>
      </div>
    </div>

    <!-- Escrow Visualization -->
    <div class="bg-white rounded-2xl border border-slate-200 p-6">
      <h2 class="font-semibold text-slate-900 mb-5">Active Escrow</h2>
      <div class="space-y-4">
        <div v-for="escrow in escrowItems" :key="escrow.id" class="flex items-start gap-4 p-4 bg-slate-50 rounded-xl">
          <div class="w-10 h-10 bg-blue-100 rounded-xl flex items-center justify-center shrink-0">
            <svg class="w-5 h-5 text-blue-600" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M17 9V7a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2m2 4h10a2 2 0 002-2v-6a2 2 0 00-2-2H9a2 2 0 00-2 2v6a2 2 0 002 2zm7-5a2 2 0 11-4 0 2 2 0 014 0z"/></svg>
          </div>
          <div class="flex-1 min-w-0">
            <p class="font-medium text-slate-900 text-sm">{{ escrow.title }}</p>
            <p class="text-xs text-slate-500 mt-0.5">{{ escrow.freelancer }}</p>
            <div class="mt-2">
              <div class="flex justify-between text-xs text-slate-500 mb-1">
                <span>Released: ${{ escrow.released.toLocaleString() }}</span>
                <span>Total: ${{ escrow.total.toLocaleString() }}</span>
              </div>
              <AppProgressBar :value="(escrow.released / escrow.total) * 100" color="blue" size="xs" />
            </div>
          </div>
          <div class="text-right shrink-0">
            <p class="text-sm font-bold text-blue-700">${{ (escrow.total - escrow.released).toLocaleString() }} held</p>
            <RouterLink :to="`/client/contracts/${escrow.contractId}`">
              <span class="text-xs text-green-600 font-medium hover:text-green-700">View Contract →</span>
            </RouterLink>
          </div>
        </div>
      </div>
    </div>

    <!-- Payment Methods -->
    <div class="bg-white rounded-2xl border border-slate-200 p-6">
      <div class="flex justify-between items-center mb-4">
        <h2 class="font-semibold text-slate-900">Payment Methods</h2>
        <AppButton variant="outline" size="sm" @click="showAddCardModal = true">+ Add Card</AppButton>
      </div>
      <div class="space-y-3">
        <div v-for="card in paymentCards" :key="card.id" class="flex items-center gap-4 p-4 border border-slate-200 rounded-xl hover:bg-slate-50 transition-colors">
          <div class="w-12 h-8 bg-gradient-to-br from-slate-700 to-slate-900 rounded-lg flex items-center justify-center text-white text-xs font-bold">
            {{ card.brand.slice(0, 4).toUpperCase() }}
          </div>
          <div class="flex-1">
            <p class="text-sm font-semibold text-slate-900">{{ card.brand }} ending in {{ card.last4 }}</p>
            <p class="text-xs text-slate-500">Expires {{ card.expMonth }}/{{ card.expYear }}</p>
          </div>
          <div class="flex items-center gap-2">
            <span v-if="card.isDefault" class="text-xs text-green-600 font-medium bg-green-50 border border-green-200 px-2 py-0.5 rounded-md">Default</span>
            <button v-else class="text-xs text-blue-600 hover:text-blue-700 font-medium" @click="setDefault(card.id)">Set Default</button>
            <button class="text-xs text-red-500 hover:text-red-600" @click="removeCard(card.id)">Remove</button>
          </div>
        </div>
      </div>
    </div>

    <!-- Transaction History -->
    <div class="bg-white rounded-2xl border border-slate-200 overflow-hidden">
      <div class="px-6 py-4 border-b border-slate-200 flex justify-between items-center">
        <h2 class="font-semibold text-slate-900">Transaction History</h2>
        <div class="flex gap-2">
          <AppSelect v-model="filterMonth" :options="monthOptions" placeholder="All time" class="w-36" />
          <button class="flex items-center gap-1.5 text-sm text-blue-600 font-medium hover:text-blue-700" @click="exportCSV">
            <svg class="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M4 16v1a3 3 0 003 3h10a3 3 0 003-3v-1m-4-4l-4 4m0 0l-4-4m4 4V4"/></svg>
            Export
          </button>
        </div>
      </div>
      <div class="overflow-x-auto">
        <table class="w-full text-sm">
          <thead class="bg-slate-50">
            <tr>
              <th v-for="col in columns" :key="col" class="py-3 px-5 text-left text-xs font-semibold text-slate-500 uppercase tracking-wide">{{ col }}</th>
            </tr>
          </thead>
          <tbody>
            <tr v-for="tx in transactions" :key="tx.id" class="border-b border-slate-100 hover:bg-slate-50 transition-colors">
              <td class="py-3.5 px-5">
                <p class="font-medium text-slate-900">{{ tx.description }}</p>
                <p class="text-xs text-slate-400 mt-0.5">Ref: #{{ tx.id }}</p>
              </td>
              <td class="py-3.5 px-5 text-slate-600">{{ tx.freelancer }}</td>
              <td class="py-3.5 px-5 font-semibold text-red-500">-${{ Math.abs(tx.amount).toLocaleString() }}</td>
              <td class="py-3.5 px-5">
                <AppBadge :variant="tx.status === 'completed' ? 'green' : tx.status === 'pending' ? 'yellow' : 'blue'">
                  {{ tx.status }}
                </AppBadge>
              </td>
              <td class="py-3.5 px-5 text-slate-500">{{ formatDate(tx.date) }}</td>
              <td class="py-3.5 px-5">
                <button class="text-xs text-blue-600 hover:text-blue-700 font-medium flex items-center gap-1" @click="downloadInvoice(tx.id)">
                  <svg class="w-3.5 h-3.5" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M4 16v1a3 3 0 003 3h10a3 3 0 003-3v-1m-4-4l-4 4m0 0l-4-4m4 4V4"/></svg>
                  Invoice
                </button>
              </td>
            </tr>
          </tbody>
        </table>
      </div>
    </div>
  </div>

  <!-- Add Funds Modal -->
  <AppModal v-model="showAddFundsModal" title="Add Funds" size="sm">
    <div class="space-y-4">
      <div>
        <label class="text-sm font-medium text-slate-700 block mb-1.5">Amount (USD)</label>
        <div class="relative">
          <span class="absolute left-3 top-1/2 -translate-y-1/2 text-slate-500 font-medium">$</span>
          <input v-model="addFundsAmount" type="number" min="10" class="w-full pl-7 pr-3 py-2.5 border border-slate-300 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-blue-500" placeholder="0.00" />
        </div>
        <div class="flex gap-2 mt-2">
          <button v-for="amt in [100, 500, 1000, 2500]" :key="amt" class="px-2.5 py-1 text-xs border border-slate-200 rounded-lg hover:bg-slate-50 font-medium" @click="addFundsAmount = amt">
            ${{ amt.toLocaleString() }}
          </button>
        </div>
      </div>
      <div>
        <label class="text-sm font-medium text-slate-700 block mb-2">Payment Method</label>
        <div class="space-y-2">
          <label v-for="card in paymentCards" :key="card.id" :class="['flex items-center gap-3 p-3 border-2 rounded-xl cursor-pointer', selectedCard === card.id ? 'border-blue-500 bg-blue-50' : 'border-slate-200']">
            <input v-model="selectedCard" type="radio" :value="card.id" class="accent-blue-600" />
            <span class="text-sm font-medium text-slate-900">{{ card.brand }} ****{{ card.last4 }}</span>
          </label>
        </div>
      </div>
    </div>
    <template #footer>
      <AppButton variant="outline" @click="showAddFundsModal = false">Cancel</AppButton>
      <AppButton :loading="addingFunds" @click="addFunds">Add ${{ addFundsAmount || '0' }}</AppButton>
    </template>
  </AppModal>

  <!-- Add Card Modal -->
  <AppModal v-model="showAddCardModal" title="Add Credit/Debit Card" size="sm">
    <div class="space-y-4">
      <AppInput v-model="newCard.name" label="Cardholder Name" required />
      <div>
        <label class="text-sm font-medium text-slate-700 block mb-1.5">Card Number</label>
        <input v-model="newCard.number" type="text" maxlength="19" placeholder="1234 5678 9012 3456" class="w-full px-4 py-2.5 border border-slate-300 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-blue-500" />
      </div>
      <div class="grid grid-cols-2 gap-3">
        <AppInput v-model="newCard.expiry" label="Expiry (MM/YY)" placeholder="12/28" />
        <AppInput v-model="newCard.cvv" label="CVV" placeholder="123" type="password" />
      </div>
    </div>
    <template #footer>
      <AppButton variant="outline" @click="showAddCardModal = false">Cancel</AppButton>
      <AppButton @click="addCard">Add Card</AppButton>
    </template>
  </AppModal>
</template>

<script setup lang="ts">
import { ref, reactive, computed, onMounted } from 'vue'
import { RouterLink } from 'vue-router'
import { useToastStore } from '@/stores/toast.store'
import { usePaymentStore } from '@/stores/payment.store'
import { useContractStore } from '@/stores/contract.store'
import { useFormatters } from '@/composables/useFormatters'
import AppBadge from '@/components/ui/AppBadge.vue'
import AppButton from '@/components/ui/AppButton.vue'
import AppModal from '@/components/ui/AppModal.vue'
import AppInput from '@/components/ui/AppInput.vue'
import AppSelect from '@/components/ui/AppSelect.vue'
import AppProgressBar from '@/components/ui/AppProgressBar.vue'

const toast = useToastStore()
const paymentStore = usePaymentStore()
const contractStore = useContractStore()
const { formatDate } = useFormatters()

const showAddFundsModal = ref(false)
const showAddCardModal = ref(false)
const addingFunds = ref(false)
const addFundsAmount = ref(0)
const selectedCard = ref('')
const filterMonth = ref('')

const columns = ['Description', 'Freelancer', 'Amount', 'Status', 'Date', 'Invoice']

const newCard = reactive({ name: '', number: '', expiry: '', cvv: '' })

onMounted(async () => {
  await Promise.all([
    paymentStore.fetchBalance(),
    paymentStore.fetchTransactions(),
    paymentStore.fetchPaymentMethods(),
    contractStore.fetchContracts(),
  ])
  if (paymentStore.defaultPaymentMethod) {
    selectedCard.value = paymentStore.defaultPaymentMethod.id
  }
})

const paymentCards = computed(() =>
  paymentStore.paymentMethods.map((m) => ({
    id: m.id,
    brand: m.type ?? 'Card',
    last4: m.details ?? '****',
    expMonth: '',
    expYear: '',
    isDefault: m.isDefault,
    label: m.label,
  })),
)
const transactions = computed(() =>
  paymentStore.transactions.map((t) => ({
    ...t,
    description: t.reference ?? `Transaction #${t.id}`,
    freelancer: t.toId,
    date: t.completedAt ?? t.createdAt,
  })),
)

const totalSpent = computed(() =>
  transactions.value
    .filter((t) => t.status === 'completed')
    .reduce((s, t) => s + (t.amount ?? 0), 0),
)

const escrowItems = computed(() =>
  contractStore.activeContracts.map((c) => ({
    id: c.id,
    contractId: c.id,
    title: c.title,
    freelancer: c.freelancer ? `${c.freelancer.firstName} ${c.freelancer.lastName}` : '',
    total: c.totalAmount ?? 0,
    released: c.paidAmount ?? 0,
  })),
)

const monthOptions = [
  { label: 'Feb 2026', value: '2026-02' },
  { label: 'Jan 2026', value: '2026-01' },
  { label: 'Dec 2025', value: '2025-12' },
]

function setDefault(id: string) {
  paymentCards.value.forEach((c) => (c.isDefault = c.id === id))
  toast.success('Default Payment Method Updated')
}

async function removeCard(id: string) {
  await paymentStore.removePaymentMethod(id)
}

async function addFunds() {
  if (!addFundsAmount.value || addFundsAmount.value < 10) {
    toast.error('Minimum $10 required')
    return
  }
  addingFunds.value = true
  const ok = await paymentStore.addFunds({ amount: addFundsAmount.value, paymentMethodId: selectedCard.value })
  addingFunds.value = false
  if (ok) showAddFundsModal.value = false
}

async function addCard() {
  if (!newCard.name || !newCard.number) return
  const ok = await paymentStore.addPaymentMethod({
    type: 'bank_transfer' as any,
    label: `${newCard.name} ****${newCard.number.slice(-4)}`,
    details: newCard.number.slice(-4),
    isDefault: false,
  })
  if (ok) {
    Object.assign(newCard, { name: '', number: '', expiry: '', cvv: '' })
    showAddCardModal.value = false
  }
}

function downloadInvoice(id: string) {
  toast.info('Downloading...', `Invoice #${id} is being prepared.`)
}

function exportCSV() {
  toast.info('Export Started', 'Your transaction history CSV is being prepared.')
}
</script>
