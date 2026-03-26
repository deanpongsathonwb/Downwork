<template>
  <div class="space-y-6">
    <!-- Welcome Banner -->
    <div class="bg-gradient-to-r from-blue-600 to-indigo-600 rounded-2xl p-6 text-white">
      <div class="flex flex-col sm:flex-row justify-between gap-4">
        <div>
          <h1 class="text-2xl font-bold">Welcome back, {{ auth.user?.firstName }}! 🏢</h1>
          <p class="text-blue-100 mt-1">Manage your projects and find top talent for your next big thing.</p>
        </div>
        <div class="flex gap-2 shrink-0">
          <RouterLink to="/client/jobs/new" class="px-4 py-2 bg-white text-blue-700 rounded-xl font-semibold text-sm hover:bg-blue-50 transition-colors">
            + Post a Job
          </RouterLink>
          <RouterLink to="/browse-freelancers" class="px-4 py-2 bg-blue-700/40 text-white border border-white/30 rounded-xl font-semibold text-sm hover:bg-blue-700/60 transition-colors">
            Find Talent
          </RouterLink>
        </div>
      </div>
    </div>

    <!-- Loading State -->
    <div v-if="isLoading" class="space-y-6">
      <div class="grid grid-cols-2 lg:grid-cols-4 gap-4">
        <div v-for="i in 4" :key="i" class="animate-pulse bg-white rounded-2xl border border-slate-200 p-5">
          <div class="bg-slate-200 rounded h-4 w-20 mb-3"></div>
          <div class="bg-slate-200 rounded h-7 w-24 mb-1"></div>
          <div class="bg-slate-200 rounded h-3 w-16"></div>
        </div>
      </div>
      <div class="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <div v-for="i in 3" :key="i" class="animate-pulse bg-white rounded-2xl border border-slate-200 p-6 h-48"></div>
      </div>
    </div>

    <!-- Error State -->
    <div v-else-if="error" class="text-center py-16">
      <div class="text-red-400 mb-4">
        <svg class="w-12 h-12 mx-auto" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-2.5L13.732 4c-.77-.833-1.964-.833-2.732 0L4.082 16.5c-.77.833.192 2.5 1.732 2.5z"/></svg>
      </div>
      <p class="text-gray-600 mb-4">{{ error }}</p>
      <button class="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700" @click="retry">Try Again</button>
    </div>

    <!-- Content -->
    <template v-else>
    <!-- Stats -->
    <div class="grid grid-cols-2 lg:grid-cols-4 gap-4">
      <div v-for="stat in stats" :key="stat.label" class="bg-white rounded-2xl border border-slate-200 p-5">
        <div class="flex items-center justify-between mb-3">
          <p class="text-sm text-slate-500">{{ stat.label }}</p>
          <div :class="['w-9 h-9 rounded-xl flex items-center justify-center', stat.bgColor]">
            <svg :class="['w-5 h-5', stat.iconColor]" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" :d="stat.iconPath" />
            </svg>
          </div>
        </div>
        <p class="text-2xl font-bold text-slate-900">{{ stat.value }}</p>
        <p class="text-xs mt-1 font-medium text-slate-500">{{ stat.sub }}</p>
      </div>
    </div>

    <!-- Escrow + Hiring Overview -->
    <div class="grid grid-cols-1 lg:grid-cols-3 gap-6">
      <!-- Open Jobs + Proposals -->
      <div class="bg-white rounded-2xl border border-slate-200 p-6">
        <div class="flex justify-between items-center mb-5">
          <h2 class="font-semibold text-slate-900">Open Jobs</h2>
          <RouterLink to="/client/jobs" class="text-xs text-blue-600 font-medium hover:text-blue-700">Manage →</RouterLink>
        </div>
        <div class="space-y-3">
          <div
            v-for="job in openJobs"
            :key="job.id"
            class="p-3 bg-slate-50 rounded-xl hover:bg-slate-100 transition-colors cursor-pointer"
            @click="router.push(`/client/jobs/${job.id}/proposals`)"
          >
            <div class="flex items-center justify-between mb-1">
              <p class="text-sm font-medium text-slate-900 truncate flex-1 mr-2">{{ job.title }}</p>
              <AppBadge variant="green" dot>open</AppBadge>
            </div>
            <div class="flex items-center justify-between text-xs text-slate-500">
              <span>{{ job.proposalCount }} proposals</span>
              <span class="text-blue-600 font-medium">Review →</span>
            </div>
          </div>
          <RouterLink to="/client/jobs/new" class="block text-center py-3 border-2 border-dashed border-slate-200 rounded-xl text-sm text-slate-400 hover:border-blue-400 hover:text-blue-600 transition-colors font-medium">
            + Post New Job
          </RouterLink>
        </div>
      </div>

      <!-- Active Contracts -->
      <div class="bg-white rounded-2xl border border-slate-200 p-6">
        <div class="flex justify-between items-center mb-5">
          <h2 class="font-semibold text-slate-900">Active Contracts</h2>
          <RouterLink to="/client/contracts" class="text-xs text-blue-600 font-medium hover:text-blue-700">View all →</RouterLink>
        </div>
        <div class="space-y-3">
          <div
            v-for="contract in activeContracts"
            :key="contract.id"
            class="flex items-center gap-3 p-3 bg-slate-50 rounded-xl hover:bg-slate-100 transition-colors cursor-pointer"
            @click="router.push(`/client/contracts/${contract.id}`)"
          >
            <UserAvatar :name="`${contract.freelancer?.firstName} ${contract.freelancer?.lastName}`" size="sm" />
            <div class="flex-1 min-w-0">
              <p class="text-sm font-medium text-slate-900 truncate">{{ contract.title }}</p>
              <p class="text-xs text-slate-500">{{ contract.freelancer?.firstName }} {{ contract.freelancer?.lastName }}</p>
              <AppProgressBar :value="(contract.milestones.filter(m => ['approved', 'released'].includes(m.status)).length / Math.max(contract.milestones.length, 1)) * 100" color="blue" size="xs" class="mt-1" />
            </div>
            <p class="text-sm font-bold text-blue-700 shrink-0">${{ (contract.totalAmount ?? 0).toLocaleString() }}</p>
          </div>
          <p v-if="!activeContracts.length" class="text-center text-slate-400 text-sm py-4">No active contracts.</p>
        </div>
      </div>

      <!-- Escrow Summary -->
      <div class="bg-white rounded-2xl border border-slate-200 p-6">
        <h2 class="font-semibold text-slate-900 mb-4">Escrow Summary</h2>
        <div class="text-center mb-4">
          <p class="text-3xl font-black text-blue-600">${{ escrowTotal.toLocaleString() }}</p>
          <p class="text-sm text-slate-500 mt-1">Total in Escrow</p>
        </div>
        <div class="space-y-2">
          <div v-for="item in escrowItems" :key="item.id" class="flex justify-between text-xs">
            <span class="text-slate-600 truncate mr-2">{{ item.title }}</span>
            <span class="font-semibold text-blue-700 shrink-0">${{ item.amount.toLocaleString() }}</span>
          </div>
        </div>
        <div class="border-t border-slate-100 pt-3 mt-3">
          <RouterLink to="/client/payments" class="text-xs text-blue-600 font-medium hover:text-blue-700 flex items-center gap-1">
            View all payments →
          </RouterLink>
        </div>
      </div>
    </div>

    <!-- Hiring Pipeline -->
    <div class="bg-white rounded-2xl border border-slate-200 p-6">
      <h2 class="font-semibold text-slate-900 mb-5">Hiring Pipeline</h2>
      <div class="grid grid-cols-4 gap-4">
        <div v-for="stage in pipeline" :key="stage.label" class="text-center">
          <div :class="['w-16 h-16 rounded-2xl flex items-center justify-center mx-auto mb-2', stage.bgColor]">
            <span class="text-2xl font-black" :class="stage.textColor">{{ stage.count }}</span>
          </div>
          <p class="text-xs font-medium text-slate-700">{{ stage.label }}</p>
          <p class="text-xs text-slate-400 mt-0.5">{{ stage.sub }}</p>
        </div>
      </div>
      <div class="relative mt-4">
        <div class="absolute top-1/2 left-0 right-0 h-0.5 bg-slate-200 -translate-y-1/2" />
        <div class="absolute top-1/2 left-0 h-0.5 bg-blue-400 -translate-y-1/2 transition-all" style="width: 60%" />
      </div>
    </div>

    <!-- Recommended Freelancers -->
    <div class="bg-white rounded-2xl border border-slate-200 p-6">
      <div class="flex justify-between items-center mb-5">
        <h2 class="font-semibold text-slate-900">Recommended Freelancers</h2>
        <RouterLink to="/browse-freelancers" class="text-xs text-blue-600 font-medium hover:text-blue-700">Browse all →</RouterLink>
      </div>
      <div class="grid grid-cols-1 sm:grid-cols-3 gap-4">
        <RouterLink
          v-for="freelancer in recommendedFreelancers"
          :key="freelancer.id"
          :to="`/freelancers/${freelancer.id}`"
          class="flex items-start gap-3 p-4 bg-slate-50 rounded-xl hover:bg-slate-100 transition-colors border border-slate-200"
        >
          <UserAvatar :name="freelancer.name" size="md" />
          <div class="flex-1 min-w-0">
            <div class="flex items-center gap-1.5 mb-0.5">
              <p class="text-sm font-semibold text-slate-900 truncate">{{ freelancer.name }}</p>
              <span v-if="freelancer.badge" class="text-xs text-yellow-700 font-bold">⭐</span>
            </div>
            <p class="text-xs text-slate-500 truncate">{{ freelancer.title }}</p>
            <div class="flex items-center justify-between mt-1.5">
              <div class="flex items-center gap-1 text-xs text-slate-500">
                <svg class="w-3 h-3 text-yellow-400" fill="currentColor" viewBox="0 0 20 20"><path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z"/></svg>
                {{ freelancer.rating }}
              </div>
              <span class="text-xs font-bold text-green-700">${{ freelancer.hourlyRate }}/hr</span>
            </div>
          </div>
        </RouterLink>
      </div>
    </div>
    </template>
  </div>
</template>

<script setup lang="ts">
import { ref, computed, onMounted } from 'vue'
import { RouterLink, useRouter } from 'vue-router'
import { useAuthStore } from '@/stores/auth.store'
import { useJobStore } from '@/stores/job.store'
import { useContractStore } from '@/stores/contract.store'
import { usePaymentStore } from '@/stores/payment.store'
import { useUserStore } from '@/stores/user.store'
import AppBadge from '@/components/ui/AppBadge.vue'
import AppProgressBar from '@/components/ui/AppProgressBar.vue'
import UserAvatar from '@/components/common/UserAvatar.vue'

const auth = useAuthStore()
const router = useRouter()
const jobStore = useJobStore()
const contractStore = useContractStore()
const paymentStore = usePaymentStore()
const userStore = useUserStore()

const isLoading = ref(true)
const error = ref<string | null>(null)

async function retry() {
  isLoading.value = true
  error.value = null
  try {
    await Promise.all([
      jobStore.fetchMyJobs(),
      contractStore.fetchContracts(),
      paymentStore.fetchBalance(),
      userStore.fetchFreelancers(),
    ])
  } catch {
    error.value = 'Failed to load dashboard data.'
  } finally {
    isLoading.value = false
  }
}

onMounted(() => {
  retry()
})

const openJobs = computed(() => jobStore.jobs.filter((j) => j.status === 'open'))
const activeContracts = computed(() => contractStore.activeContracts)

const totalPaid = computed(() =>
  contractStore.contracts.reduce((sum, c) => sum + (c.paidAmount ?? 0), 0),
)
const escrowTotal = computed(() => paymentStore.inEscrow)

const escrowItems = computed(() =>
  contractStore.activeContracts.map((c) => ({
    id: c.id,
    title: c.title,
    amount: (c.totalAmount ?? 0) - (c.paidAmount ?? 0),
  })),
)

const totalProposals = computed(() =>
  jobStore.jobs.reduce((sum, j) => sum + (j.proposalCount ?? 0), 0),
)

const stats = computed(() => [
  { label: 'Total Spent', value: `$${totalPaid.value.toLocaleString()}`, sub: 'All time', bgColor: 'bg-blue-100', iconColor: 'text-blue-600', iconPath: 'M12 8c-1.657 0-3 .895-3 2s1.343 2 3 2 3 .895 3 2-1.343 2-3 2m0-8c1.11 0 2.08.402 2.599 1M12 8V7m0 1v8m0 0v1m0-1c-1.11 0-2.08-.402-2.599-1M21 12a9 9 0 11-18 0 9 9 0 0118 0z' },
  { label: 'In Escrow', value: `$${escrowTotal.value.toLocaleString()}`, sub: `${activeContracts.value.length} active contracts`, bgColor: 'bg-purple-100', iconColor: 'text-purple-600', iconPath: 'M17 9V7a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2m2 4h10a2 2 0 002-2v-6a2 2 0 00-2-2H9a2 2 0 00-2 2v6a2 2 0 002 2zm7-5a2 2 0 11-4 0 2 2 0 014 0z' },
  { label: 'Open Jobs', value: String(openJobs.value.length), sub: 'Accepting proposals', bgColor: 'bg-green-100', iconColor: 'text-green-600', iconPath: 'M21 13.255A23.931 23.931 0 0112 15c-3.183 0-6.22-.62-9-1.745M16 6V4a2 2 0 00-2-2h-4a2 2 0 00-2 2v2m4 6h.01M5 20h14a2 2 0 002-2V8a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z' },
  { label: 'Total Hires', value: String(contractStore.contracts.length), sub: 'Freelancers hired', bgColor: 'bg-orange-100', iconColor: 'text-orange-600', iconPath: 'M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857M7 20H2v-2a3 3 0 015.356-1.857M7 20v-2c0-.656.126-1.283.356-1.857m0 0a5.002 5.002 0 019.288 0M15 7a3 3 0 11-6 0 3 3 0 016 0zm6 3a2 2 0 11-4 0 2 2 0 014 0zM7 10a2 2 0 11-4 0 2 2 0 014 0z' },
])

const pipeline = computed(() => [
  { label: 'Job Posted', sub: `${openJobs.value.length} open jobs`, count: openJobs.value.length, bgColor: 'bg-slate-100', textColor: 'text-slate-700' },
  { label: 'Proposals', sub: `${totalProposals.value} received`, count: totalProposals.value, bgColor: 'bg-blue-100', textColor: 'text-blue-700' },
  { label: 'Shortlisted', sub: 'shortlisted', count: 0, bgColor: 'bg-yellow-100', textColor: 'text-yellow-700' },
  { label: 'Hired', sub: `${activeContracts.value.length} in progress`, count: activeContracts.value.length, bgColor: 'bg-green-100', textColor: 'text-green-700' },
])

const recommendedFreelancers = computed(() =>
  userStore.freelancersList.slice(0, 3).map((f) => ({
    id: f.id,
    name: `${f.firstName} ${f.lastName}`,
    title: f.title ?? '',
    rating: f.rating ?? 0,
    hourlyRate: f.hourlyRate ?? 0,
    badge: f.badge ?? null,
  })),
)
</script>
