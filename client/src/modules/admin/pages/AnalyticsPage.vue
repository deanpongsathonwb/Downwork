<template>
  <div class="space-y-6">
    <div class="flex justify-between items-center">
      <h1 class="text-2xl font-bold text-white">Analytics</h1>
      <div class="flex gap-2">
        <button v-for="r in ['Week', 'Month', 'Year']" :key="r" :class="['px-4 py-2 text-sm font-medium rounded-xl transition-colors', range === r ? 'bg-red-600 text-white' : 'bg-slate-800 text-slate-400 hover:bg-slate-700']" @click="range = r">
          {{ r }}
        </button>
      </div>
    </div>

    <!-- Loading State -->
    <div v-if="adminStore.isLoading" class="space-y-6">
      <div class="grid grid-cols-2 lg:grid-cols-4 gap-4">
        <div v-for="i in 4" :key="i" class="animate-pulse bg-slate-900 rounded-2xl border border-slate-800 p-5">
          <div class="bg-slate-700 rounded h-3 w-20 mb-2"></div>
          <div class="bg-slate-700 rounded h-7 w-24 mb-1"></div>
          <div class="bg-slate-700 rounded h-3 w-16"></div>
        </div>
      </div>
      <div class="animate-pulse bg-slate-900 rounded-2xl border border-slate-800 p-6 h-64"></div>
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
      <div class="grid grid-cols-2 lg:grid-cols-4 gap-4">
        <div v-for="metric in metrics" :key="metric.label" class="bg-slate-900 rounded-2xl border border-slate-800 p-5">
          <p class="text-xs text-slate-400 uppercase tracking-wide mb-2">{{ metric.label }}</p>
          <p class="text-2xl font-black text-white">{{ metric.value }}</p>
          <p :class="['text-xs mt-1 font-medium', metric.up ? 'text-green-400' : 'text-red-400']">
            {{ metric.up ? '↑' : '↓' }} {{ metric.change }}
          </p>
        </div>
      </div>

      <!-- Revenue Chart -->
      <div class="bg-slate-900 rounded-2xl border border-slate-800 p-6">
        <h2 class="font-semibold text-white mb-5">Revenue Breakdown</h2>
        <div class="grid grid-cols-2 gap-6">
          <div>
            <p class="text-sm text-slate-400 mb-3">By Category</p>
            <div class="space-y-2">
              <div v-for="cat in categoryRevenue" :key="cat.name">
                <div class="flex justify-between text-xs text-slate-300 mb-1">
                  <span>{{ cat.name }}</span>
                  <span>{{ cat.pct }}%</span>
                </div>
                <div class="h-2 bg-slate-800 rounded-full">
                  <div class="h-2 bg-red-500 rounded-full transition-all" :style="{ width: `${cat.pct}%` }" />
                </div>
              </div>
            </div>
          </div>
          <div>
            <p class="text-sm text-slate-400 mb-3">Top Performing Skills</p>
            <div class="space-y-2">
              <div v-for="(skill, i) in topSkills" :key="skill" class="flex items-center gap-2">
                <span class="text-xs text-slate-500 w-4">{{ i + 1 }}.</span>
                <span class="text-sm text-slate-300">{{ skill }}</span>
              </div>
            </div>
          </div>
        </div>
      </div>
    </template>
  </div>
</template>

<script setup lang="ts">
import { ref, computed, watch, onMounted } from 'vue'
import { useAdminStore } from '@/stores/admin.store'

const adminStore = useAdminStore()

const range = ref('Month')

const rangeParam = computed<'week' | 'month' | 'year'>(() => range.value.toLowerCase() as 'week' | 'month' | 'year')

const metrics = computed(() => {
  const a = adminStore.analytics
  if (!a) return []
  const totalRevenue = a.revenue.reduce((s, v) => s + v, 0)
  const totalUsers = a.users.reduce((s, v) => s + v, 0)
  const totalJobs = a.jobs.reduce((s, v) => s + v, 0)
  const totalContracts = a.contracts.reduce((s, v) => s + v, 0)
  return [
    { label: 'Total Revenue', value: `$${totalRevenue.toLocaleString()}`, change: '', up: true },
    { label: 'New Users', value: totalUsers.toLocaleString(), change: '', up: true },
    { label: 'Jobs Posted', value: totalJobs.toLocaleString(), change: '', up: true },
    { label: 'Contracts Completed', value: totalContracts.toLocaleString(), change: '', up: true },
  ]
})

const categoryRevenue = [
  { name: 'Web Development', pct: 38 },
  { name: 'Design & Creative', pct: 22 },
  { name: 'Mobile Apps', pct: 18 },
  { name: 'Writing', pct: 12 },
  { name: 'Data Science', pct: 10 },
]

const topSkills = ['Vue.js', 'React', 'Python', 'Figma', 'Node.js', 'TypeScript', 'Flutter', 'AWS']

watch(range, () => {
  adminStore.fetchAnalytics(rangeParam.value)
})

function retry() {
  adminStore.fetchAnalytics(rangeParam.value)
}

onMounted(() => {
  retry()
})
</script>
