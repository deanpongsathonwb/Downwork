<template>
  <div class="space-y-6">
    <h1 class="text-2xl font-bold text-white">Job Moderation</h1>

    <!-- Loading State -->
    <div v-if="adminStore.isLoading" class="space-y-4">
      <div v-for="i in 4" :key="i" class="animate-pulse">
        <div class="bg-slate-900 rounded-2xl border border-slate-800 p-6">
          <div class="bg-slate-700 rounded h-5 w-48 mb-3"></div>
          <div class="bg-slate-700 rounded h-4 w-full mb-2"></div>
          <div class="bg-slate-700 rounded h-4 w-2/3"></div>
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
    <div v-else-if="!pendingJobs.length" class="text-center py-16">
      <div class="text-slate-600 mb-4">
        <svg class="w-16 h-16 mx-auto" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="1.5" d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z"/></svg>
      </div>
      <h3 class="text-lg font-medium text-white mb-1">No pending jobs</h3>
      <p class="text-slate-500">All jobs have been reviewed. Check back later.</p>
    </div>

    <!-- Content -->
    <div v-else class="bg-slate-900 rounded-2xl border border-slate-800 p-6">
      <h2 class="font-semibold text-white mb-4">Pending Review ({{ pendingJobs.length }})</h2>
      <div class="space-y-4">
        <div v-for="job in pendingJobs" :key="job.id" class="bg-slate-800 rounded-xl p-4">
          <div class="flex items-start justify-between gap-4">
            <div class="flex-1">
              <h3 class="font-medium text-white">{{ job.title }}</h3>
              <p class="text-sm text-slate-400 mt-1 line-clamp-2">{{ job.description }}</p>
              <div class="flex gap-2 mt-2">
                <AppBadge variant="blue">{{ job.type }}</AppBadge>
                <AppBadge variant="slate">{{ job.category }}</AppBadge>
              </div>
            </div>
            <div class="flex gap-2 shrink-0">
              <button class="px-3 py-1.5 bg-green-600 text-white text-xs font-medium rounded-lg hover:bg-green-700 transition-colors" @click="approve(job.id ?? '')">✓ Approve</button>
              <button class="px-3 py-1.5 bg-red-600 text-white text-xs font-medium rounded-lg hover:bg-red-700 transition-colors" @click="reject(job.id ?? '')">✕ Reject</button>
            </div>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { onMounted } from 'vue'
import { storeToRefs } from 'pinia'
import { useAdminStore } from '@/stores/admin.store'
import AppBadge from '@/components/ui/AppBadge.vue'

const adminStore = useAdminStore()
const { pendingJobs } = storeToRefs(adminStore)

async function approve(id: string): Promise<void> {
  await adminStore.approveJob(id)
}

async function reject(id: string): Promise<void> {
  await adminStore.rejectJob(id, 'Rejected by admin')
}

function retry() {
  adminStore.fetchPendingJobs()
}

onMounted(() => {
  retry()
})
</script>
