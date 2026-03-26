<template>
  <div class="space-y-6">
    <h1 class="text-2xl font-bold text-white">Platform Overview</h1>

    <!-- Loading State -->
    <div v-if="adminStore.isLoading" class="space-y-6">
      <div class="grid grid-cols-2 lg:grid-cols-4 gap-4">
        <div v-for="i in 4" :key="i" class="animate-pulse bg-slate-900 rounded-2xl border border-slate-800 p-5">
          <div class="bg-slate-700 rounded h-4 w-24 mb-3"></div>
          <div class="bg-slate-700 rounded h-7 w-20 mb-1"></div>
          <div class="bg-slate-700 rounded h-3 w-16"></div>
        </div>
      </div>
      <div class="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <div v-for="i in 2" :key="i" class="animate-pulse bg-slate-900 rounded-2xl border border-slate-800 p-6 h-64"></div>
      </div>
    </div>

    <!-- Error State -->
    <div v-else-if="adminStore.error" class="text-center py-16">
      <div class="text-red-400 mb-4">
        <svg class="w-12 h-12 mx-auto" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-2.5L13.732 4c-.77-.833-1.964-.833-2.732 0L4.082 16.5c-.77.833.192 2.5 1.732 2.5z"/></svg>
      </div>
      <p class="text-slate-400 mb-4">{{ adminStore.error }}</p>
      <button class="px-4 py-2 bg-red-600 text-white rounded-lg hover:bg-red-700" @click="retry">Try Again</button>
    </div>

    <!-- Content -->
    <template v-else>
      <!-- KPI Cards -->
      <div class="grid grid-cols-2 lg:grid-cols-4 gap-4">
        <div v-for="kpi in kpis" :key="kpi.label" class="bg-slate-900 rounded-2xl border border-slate-800 p-5">
          <p class="text-sm text-slate-400 mb-3">{{ kpi.label }}</p>
          <p class="text-2xl font-bold text-white">{{ kpi.value }}</p>
          <p :class="['text-xs mt-1 font-medium', kpi.positive ? 'text-green-400' : 'text-red-400']">
            {{ kpi.change }}
          </p>
        </div>
      </div>

      <div class="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <!-- Recent Disputes -->
        <div class="bg-slate-900 rounded-2xl border border-slate-800 p-6">
          <div class="flex justify-between items-center mb-5">
            <h2 class="font-semibold text-white">Recent Disputes</h2>
            <RouterLink to="/admin/disputes" class="text-xs text-red-400 font-medium hover:text-red-300">View all →</RouterLink>
          </div>
          <div class="space-y-3">
            <div v-for="dispute in recentDisputes" :key="dispute.id" class="flex items-center justify-between p-3 bg-slate-800 rounded-xl">
              <div>
                <p class="text-sm font-medium text-white">Dispute #{{ dispute.id }}</p>
                <p class="text-xs text-slate-400">{{ dispute.reason }}</p>
              </div>
              <AppBadge :variant="dispute.status === 'open' ? 'red' : 'yellow'">{{ dispute.status }}</AppBadge>
            </div>
          </div>
        </div>

        <!-- Platform Analytics -->
        <div class="bg-slate-900 rounded-2xl border border-slate-800 p-6">
          <h2 class="font-semibold text-white mb-5">Revenue (Last 7 Days)</h2>
          <div class="flex items-end gap-2 h-32">
            <div
              v-for="(bar, i) in revenueData"
              :key="i"
              class="flex-1 bg-red-900/50 hover:bg-red-800/50 rounded-t-lg transition-colors group relative"
              :style="{ height: `${bar.pct}%` }"
            >
              <div class="absolute -top-7 left-1/2 -translate-x-1/2 bg-slate-700 text-white text-xs px-1.5 py-0.5 rounded opacity-0 group-hover:opacity-100 whitespace-nowrap transition-opacity">
                ${{ bar.amount }}
              </div>
            </div>
          </div>
          <div class="flex justify-between mt-2">
            <span v-for="label in dayLabels" :key="label" class="text-xs text-slate-500 flex-1 text-center">{{ label }}</span>
          </div>
          <p class="text-center text-white font-bold text-lg mt-3">$<span class="text-red-400">12,450</span> total</p>
        </div>
      </div>

      <!-- Recent Activity -->
      <div class="bg-slate-900 rounded-2xl border border-slate-800 p-6">
        <h2 class="font-semibold text-white mb-5">Recent Platform Activity</h2>
        <div class="space-y-3">
          <div v-for="activity in activities" :key="activity.id" class="flex items-center gap-4 p-3 bg-slate-800 rounded-xl">
            <div :class="['w-8 h-8 rounded-lg flex items-center justify-center text-sm shrink-0', activity.bgColor]">
              {{ activity.icon }}
            </div>
            <div class="flex-1">
              <p class="text-sm text-white">{{ activity.message }}</p>
              <p class="text-xs text-slate-500">{{ activity.time }}</p>
            </div>
            <AppBadge :variant="activity.badgeVariant">{{ activity.badge }}</AppBadge>
          </div>
        </div>
      </div>
    </template>
  </div>
</template>

<script setup lang="ts">
import { computed, onMounted } from 'vue'
import { RouterLink } from 'vue-router'
import { useAdminStore } from '@/stores/admin.store'
import AppBadge from '@/components/ui/AppBadge.vue'

const adminStore = useAdminStore()

const kpis = computed(() => {
  const s = adminStore.stats
  if (!s) return []
  return [
    { label: 'Total Users', value: s.totalUsers.toLocaleString(), change: s.newUsersThisMonth ? `+${s.newUsersThisMonth} this month` : '', positive: true },
    { label: 'Active Contracts', value: s.activeContracts.toLocaleString(), change: '', positive: true },
    { label: 'Platform Revenue', value: `$${s.totalRevenue.toLocaleString()}`, change: s.revenueThisMonth ? `$${s.revenueThisMonth.toLocaleString()} this month` : '', positive: true },
    { label: 'Open Disputes', value: String(s.openDisputes), change: '', positive: s.openDisputes === 0 },
  ]
})

const recentDisputes = computed(() =>
  adminStore.disputes.slice(0, 3).map(d => ({
    id: d.id,
    reason: d.reason,
    status: d.status,
  })),
)

const revenueData = [
  { pct: 50, amount: '1,820' }, { pct: 70, amount: '2,540' }, { pct: 40, amount: '1,460' },
  { pct: 85, amount: '3,080' }, { pct: 60, amount: '2,180' }, { pct: 45, amount: '1,640' }, { pct: 75, amount: '2,730' },
]
const dayLabels = ['Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat', 'Sun']

const activities = [
  { id: 1, icon: '👤', message: 'New freelancer registered: Alex Johnson', time: '2 minutes ago', badge: 'new', badgeVariant: 'green' as const, bgColor: 'bg-green-900/40' },
  { id: 2, icon: '📋', message: 'New job posted: Senior Vue.js Developer', time: '15 minutes ago', badge: 'pending', badgeVariant: 'yellow' as const, bgColor: 'bg-yellow-900/40' },
  { id: 3, icon: '⚠️', message: 'Dispute opened on contract #C-2891', time: '1 hour ago', badge: 'dispute', badgeVariant: 'red' as const, bgColor: 'bg-red-900/40' },
  { id: 4, icon: '💰', message: 'Payment of $4,500 released to Mark Davis', time: '2 hours ago', badge: 'payment', badgeVariant: 'blue' as const, bgColor: 'bg-blue-900/40' },
]

function retry() {
  adminStore.fetchStats()
  adminStore.fetchDisputes()
}

onMounted(() => {
  retry()
})
</script>
