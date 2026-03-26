<template>
  <div class="space-y-6">
    <h1 class="text-2xl font-bold text-white">Dispute Management</h1>

    <!-- Loading State -->
    <div v-if="adminStore.isLoading" class="space-y-4">
      <div class="grid grid-cols-3 gap-4">
        <div v-for="i in 3" :key="i" class="animate-pulse bg-slate-900 border border-slate-800 rounded-2xl p-4 h-20"></div>
      </div>
      <div class="animate-pulse bg-slate-900 rounded-2xl border border-slate-800 h-64"></div>
    </div>

    <!-- Error State -->
    <div v-else-if="adminStore.error" class="text-center py-16">
      <div class="text-red-400 mb-4">
        <svg class="w-12 h-12 mx-auto" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-2.5L13.732 4c-.77-.833-1.964-.833-2.732 0L4.082 16.5c-.77.833.192 2.5 1.732 2.5z"/></svg>
      </div>
      <p class="text-slate-400 mb-4">{{ adminStore.error }}</p>
      <button class="px-4 py-2 bg-red-600 text-white rounded-lg hover:bg-red-700" @click="retry">Try Again</button>
    </div>

    <!-- Empty State -->
    <div v-else-if="!disputes.length" class="text-center py-16">
      <div class="text-slate-600 mb-4">
        <svg class="w-16 h-16 mx-auto" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="1.5" d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z"/></svg>
      </div>
      <h3 class="text-lg font-medium text-white mb-1">No disputes</h3>
      <p class="text-slate-500">There are currently no disputes to manage.</p>
    </div>

    <!-- Content -->
    <template v-else>
      <div class="grid grid-cols-3 gap-4">
        <div v-for="stat in stats" :key="stat.label" class="bg-slate-900 border border-slate-800 rounded-2xl p-4 text-center">
          <p class="text-3xl font-black" :class="stat.color">{{ stat.value }}</p>
          <p class="text-sm text-slate-400 mt-1">{{ stat.label }}</p>
        </div>
      </div>
      <div class="bg-slate-900 rounded-2xl border border-slate-800 overflow-hidden">
        <div class="overflow-x-auto">
          <table class="w-full text-sm">
            <thead class="bg-slate-800 border-b border-slate-700">
              <tr>
                <th v-for="col in ['ID', 'Contract', 'Reason', 'Status', 'Opened', 'Actions']" :key="col" class="py-3 px-5 text-left text-xs font-semibold text-slate-400 uppercase tracking-wide">{{ col }}</th>
              </tr>
            </thead>
            <tbody>
              <tr v-for="d in disputes" :key="d.id" class="border-b border-slate-800 hover:bg-slate-800/50 transition-colors">
                <td class="py-3.5 px-5 font-mono text-slate-400 text-xs">#{{ d.id }}</td>
                <td class="py-3.5 px-5 font-medium text-white">{{ d.contractId }}</td>
                <td class="py-3.5 px-5 text-slate-400">{{ d.reason }}</td>
                <td class="py-3.5 px-5">
                  <AppBadge :variant="d.status === 'open' ? 'red' : d.status === 'under_review' ? 'yellow' : 'green'">{{ d.status }}</AppBadge>
                </td>
                <td class="py-3.5 px-5 text-slate-400 text-xs">{{ d.createdAt ? new Date(d.createdAt).toLocaleDateString() : '—' }}</td>
                <td class="py-3.5 px-5">
                  <div class="flex gap-2">
                    <button class="text-xs text-blue-400 hover:text-blue-300 font-medium" @click="resolveFor(d.id ?? '', 'freelancer')">→ Freelancer</button>
                    <button class="text-xs text-green-400 hover:text-green-300 font-medium" @click="resolveFor(d.id ?? '', 'client')">→ Client</button>
                  </div>
                </td>
              </tr>
            </tbody>
          </table>
        </div>
      </div>
    </template>
  </div>
</template>

<script setup lang="ts">
import { computed, onMounted } from 'vue'
import { storeToRefs } from 'pinia'
import { useAdminStore } from '@/stores/admin.store'
import AppBadge from '@/components/ui/AppBadge.vue'

const adminStore = useAdminStore()
const { disputes } = storeToRefs(adminStore)

const stats = computed(() => {
  const open = disputes.value.filter(d => d.status === 'open').length
  const review = disputes.value.filter(d => d.status === 'under_review').length
  const resolved = disputes.value.filter(d => d.status === 'resolved').length
  return [
    { label: 'Open', value: open, color: 'text-red-400' },
    { label: 'Under Review', value: review, color: 'text-yellow-400' },
    { label: 'Resolved', value: resolved, color: 'text-green-400' },
  ]
})

async function resolveFor(id: string, favorOf: string): Promise<void> {
  await adminStore.resolveDispute(id, `Resolved in favor of ${favorOf}`, favorOf)
}

function retry() {
  adminStore.fetchDisputes()
}

onMounted(() => {
  retry()
})
</script>
