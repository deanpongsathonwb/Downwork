<template>
  <div class="space-y-6">
    <h1 class="text-2xl font-bold text-white">Reports</h1>

    <!-- Loading State -->
    <div v-if="adminStore.isLoading" class="grid grid-cols-1 md:grid-cols-2 gap-4">
      <div v-for="i in 4" :key="i" class="animate-pulse bg-slate-900 border border-slate-800 rounded-2xl p-5">
        <div class="flex items-start gap-4">
          <div class="w-10 h-10 bg-slate-700 rounded-xl shrink-0"></div>
          <div class="flex-1 space-y-2">
            <div class="bg-slate-700 rounded h-5 w-40"></div>
            <div class="bg-slate-700 rounded h-4 w-full"></div>
            <div class="bg-slate-700 rounded h-3 w-24"></div>
          </div>
        </div>
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

    <!-- Empty State -->
    <div v-else-if="!reports.length" class="text-center py-16">
      <div class="text-slate-600 mb-4">
        <svg class="w-16 h-16 mx-auto" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="1.5" d="M9 17v-2m3 2v-4m3 4v-6m2 10H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z"/></svg>
      </div>
      <h3 class="text-lg font-medium text-white mb-1">No reports available</h3>
      <p class="text-slate-500">Reports will be generated as platform data accumulates.</p>
    </div>

    <!-- Content -->
    <div v-else class="grid grid-cols-1 md:grid-cols-2 gap-4">
      <div v-for="report in reports" :key="report.title" class="bg-slate-900 border border-slate-800 rounded-2xl p-5">
        <div class="flex items-start gap-4">
          <div :class="['w-10 h-10 rounded-xl flex items-center justify-center text-xl shrink-0', report.bg]">{{ report.icon }}</div>
          <div class="flex-1">
            <h3 class="font-semibold text-white">{{ report.title }}</h3>
            <p class="text-sm text-slate-400 mt-1">{{ report.description }}</p>
            <button class="mt-3 text-xs text-red-400 font-medium hover:text-red-300 flex items-center gap-1">
              <svg class="w-3.5 h-3.5" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M4 16v1a3 3 0 003 3h10a3 3 0 003-3v-1m-4-4l-4 4m0 0l-4-4m4 4V4" /></svg>
              Download {{ report.format }}
            </button>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { computed, onMounted } from 'vue'
import { useAdminStore } from '@/stores/admin.store'

const adminStore = useAdminStore()

const iconMap: Record<string, { icon: string; bg: string }> = {
  user: { icon: '👤', bg: 'bg-blue-900/40' },
  job: { icon: '📊', bg: 'bg-purple-900/40' },
  review: { icon: '⚖️', bg: 'bg-red-900/40' },
}

const reports = computed(() =>
  adminStore.reports.map(r => ({
    ...r,
    title: r.reason,
    description: r.description ?? `Report #${r.id} — ${r.type}`,
    icon: iconMap[r.type]?.icon ?? '📋',
    bg: iconMap[r.type]?.bg ?? 'bg-slate-900/40',
    format: 'CSV',
  })),
)

function retry() {
  adminStore.fetchReports()
}

onMounted(() => {
  retry()
})
</script>
