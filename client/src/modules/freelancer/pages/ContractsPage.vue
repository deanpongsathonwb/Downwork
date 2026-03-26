<template>
  <div class="space-y-6">
    <h1 class="text-2xl font-bold text-slate-900">My Contracts</h1>

    <!-- Loading State -->
    <div v-if="contractStore.isLoading" class="space-y-4">
      <div v-for="i in 4" :key="i" class="animate-pulse bg-white rounded-2xl border border-slate-200 p-6 h-36"></div>
    </div>

    <!-- Error State -->
    <div v-else-if="contractStore.error" class="text-center py-16">
      <div class="text-red-400 mb-4">
        <svg class="w-12 h-12 mx-auto" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-2.5L13.732 4c-.77-.833-1.964-.833-2.732 0L4.082 16.5c-.77.833.192 2.5 1.732 2.5z"/></svg>
      </div>
      <p class="text-gray-600 mb-4">{{ contractStore.error }}</p>
      <button class="px-4 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700" @click="retry">Try Again</button>
    </div>

    <!-- Content -->
    <template v-else>
    <div class="flex gap-1 bg-slate-100 p-1 rounded-xl w-fit">
      <button v-for="tab in tabs" :key="tab.value" :class="['px-4 py-2 text-sm font-medium rounded-lg transition-colors', activeTab === tab.value ? 'bg-white text-slate-900 shadow-sm' : 'text-slate-500 hover:text-slate-700']" @click="activeTab = tab.value">
        {{ tab.label }}
      </button>
    </div>

    <div class="space-y-4">
      <div
        v-for="contract in filteredContracts"
        :key="contract.id"
        class="bg-white rounded-2xl border border-slate-200 p-6 hover:shadow-md transition-shadow cursor-pointer"
        @click="router.push(`/freelancer/contracts/${contract.id}`)"
      >
        <div class="flex items-start justify-between gap-4">
          <div>
            <h3 class="font-semibold text-slate-900 mb-1">{{ contract.title }}</h3>
            <p class="text-sm text-slate-500">with {{ contract.client?.firstName }} {{ contract.client?.lastName }}</p>
            <div class="flex gap-2 mt-3">
              <AppBadge :variant="contract.status === 'active' ? 'green' : contract.status === 'completed' ? 'blue' : 'red'" dot>
                {{ contract.status }}
              </AppBadge>
              <AppBadge variant="slate">{{ contract.type }} rate</AppBadge>
            </div>
          </div>
          <div class="text-right shrink-0">
            <p class="text-xl font-bold text-slate-900">${{ (contract.totalAmount ?? 0).toLocaleString() }}</p>
            <p class="text-sm text-green-600 font-medium">${{ (contract.paidAmount ?? 0).toLocaleString() }} paid</p>
          </div>
        </div>

        <!-- Milestone Progress -->
        <div v-if="contract.milestones.length" class="mt-4 pt-4 border-t border-slate-100">
          <p class="text-xs text-slate-500 mb-2">Milestones Progress</p>
          <div class="flex gap-2">
            <div
              v-for="m in contract.milestones"
              :key="m.id"
              :class="['flex-1 h-2 rounded-full', m.status === 'approved' ? 'bg-green-500' : m.status === 'submitted' ? 'bg-yellow-400' : 'bg-slate-200']"
            />
          </div>
          <p class="text-xs text-slate-500 mt-1">
            {{ contract.milestones.filter((m) => m.status === 'approved').length }} / {{ contract.milestones.length }} completed
          </p>
        </div>
      </div>

      <div v-if="!filteredContracts.length" class="text-center py-16">
        <div class="text-slate-300 mb-4">
          <svg class="w-16 h-16 mx-auto" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="1.5" d="M20 13V6a2 2 0 00-2-2H6a2 2 0 00-2 2v7m16 0v5a2 2 0 01-2 2H6a2 2 0 01-2-2v-5m16 0h-2.586a1 1 0 00-.707.293l-2.414 2.414a1 1 0 01-.707.293h-2.172a1 1 0 01-.707-.293l-2.414-2.414A1 1 0 006.586 13H4"/></svg>
        </div>
        <h3 class="text-lg font-medium text-slate-900 mb-1">No contracts</h3>
        <p class="text-slate-500">Contracts in this category will appear here.</p>
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

const router = useRouter()
const contractStore = useContractStore()
const activeTab = ref('active')

const tabs = [
  { label: 'Active', value: 'active' },
  { label: 'Completed', value: 'completed' },
  { label: 'Disputed', value: 'disputed' },
]

function retry() {
  contractStore.fetchContracts()
}

onMounted(() => {
  retry()
})

const filteredContracts = computed(() => contractStore.contracts.filter((c) => c.status === activeTab.value))
</script>
