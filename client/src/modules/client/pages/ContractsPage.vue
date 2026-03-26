<template>
  <div class="space-y-6">
    <h1 class="text-2xl font-bold text-slate-900">Contracts</h1>

    <!-- Loading State -->
    <div v-if="contractStore.isLoading" class="space-y-4">
      <div v-for="i in 4" :key="i" class="animate-pulse">
        <div class="bg-white rounded-2xl border border-slate-200 p-6 h-32"></div>
      </div>
    </div>

    <!-- Error State -->
    <div v-else-if="contractStore.error" class="text-center py-16">
      <div class="text-red-400 mb-4">
        <svg class="w-12 h-12 mx-auto" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-2.5L13.732 4c-.77-.833-1.964-.833-2.732 0L4.082 16.5c-.77.833.192 2.5 1.732 2.5z"/></svg>
      </div>
      <p class="text-gray-600 mb-4">{{ contractStore.error }}</p>
      <button class="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700" @click="retry">Try Again</button>
    </div>

    <!-- Content -->
    <template v-else>
    <div class="flex gap-1 bg-slate-100 p-1 rounded-xl w-fit">
      <button v-for="tab in ['Active', 'Completed', 'Disputed']" :key="tab" :class="['px-4 py-2 text-sm font-medium rounded-lg transition-colors', activeTab === tab ? 'bg-white text-slate-900 shadow-sm' : 'text-slate-500 hover:text-slate-700']" @click="activeTab = tab">
        {{ tab }}
      </button>
    </div>
    <div class="space-y-4">
      <div v-for="contract in contracts" :key="contract.id" class="bg-white rounded-2xl border border-slate-200 p-6 cursor-pointer hover:shadow-md transition-shadow" @click="router.push(`/client/contracts/${contract.id}`)">
        <div class="flex items-start justify-between gap-4">
          <div class="flex items-center gap-3">
            <UserAvatar :name="`${contract.freelancer?.firstName} ${contract.freelancer?.lastName}`" size="md" />
            <div>
              <h3 class="font-semibold text-slate-900">{{ contract.title }}</h3>
              <p class="text-sm text-slate-500">{{ contract.freelancer?.firstName }} {{ contract.freelancer?.lastName }}</p>
            </div>
          </div>
          <div class="text-right">
            <p class="font-bold text-slate-900 text-lg">${{ (contract.totalAmount ?? 0).toLocaleString() }}</p>
            <AppBadge :variant="contract.status === 'active' ? 'green' : 'slate'" dot>{{ contract.status }}</AppBadge>
          </div>
        </div>
        <div class="mt-4 pt-4 border-t border-slate-100 flex justify-between items-center">
          <p class="text-sm text-slate-500">Started {{ contract.startDate ? new Date(contract.startDate).toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' }) : '—' }}</p>
          <p class="text-sm text-blue-600 font-medium">${{ (contract.paidAmount ?? 0).toLocaleString() }} paid</p>
        </div>
      </div>
      <div v-if="!contracts.length" class="text-center py-16">
        <div class="text-slate-300 mb-4">
          <svg class="w-16 h-16 mx-auto" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="1.5" d="M20 13V6a2 2 0 00-2-2H6a2 2 0 00-2 2v7m16 0v5a2 2 0 01-2 2H6a2 2 0 01-2-2v-5m16 0h-2.586a1 1 0 00-.707.293l-2.414 2.414a1 1 0 01-.707.293h-2.172a1 1 0 01-.707-.293l-2.414-2.414A1 1 0 006.586 13H4"/></svg>
        </div>
        <h3 class="text-lg font-semibold text-slate-900 mb-1">No {{ activeTab.toLowerCase() }} contracts yet</h3>
        <p class="text-sm text-slate-500">{{ activeTab === 'Active' ? 'Hire a freelancer to start a contract.' : 'Contracts will appear here when their status changes.' }}</p>
      </div>
    </div>
    </template>
  </div>
</template>

<script setup lang="ts">
import { ref, computed, onMounted } from 'vue'
import { useRouter } from 'vue-router'
import { useContractStore } from '@/stores/contract.store'
import AppBadge from '@/components/ui/AppBadge.vue'
import UserAvatar from '@/components/common/UserAvatar.vue'

const router = useRouter()
const contractStore = useContractStore()
const activeTab = ref('Active')

function retry() {
  contractStore.fetchContracts()
}

onMounted(() => retry())

const contracts = computed(() => {
  const status = activeTab.value.toLowerCase()
  return contractStore.contracts.filter((c) => c.status === status)
})
</script>
