<template>
  <div class="space-y-6">
    <!-- Welcome Banner -->
    <div class="bg-gradient-to-r from-green-600 to-emerald-600 rounded-2xl p-6 text-white">
      <div class="flex flex-col sm:flex-row justify-between gap-4">
        <div>
          <div class="flex items-center gap-3 mb-2">
            <h1 class="text-2xl font-bold">Welcome back, {{ auth.user?.firstName }}! 👋</h1>
            <!-- Badge -->
            <span v-if="freelancerBadge" :class="['text-xs font-bold px-2.5 py-1 rounded-lg', badgeStyle.bg, badgeStyle.text]">
              {{ badgeStyle.icon }} {{ badgeStyle.label }}
            </span>
          </div>
          <p class="text-green-100">Here's what's happening with your freelance business today.</p>
        </div>
        <div class="flex gap-2 shrink-0">
          <RouterLink to="/browse-jobs" class="px-4 py-2 bg-white text-green-700 rounded-xl font-semibold text-sm hover:bg-green-50 transition-colors">
            Find Jobs
          </RouterLink>
          <RouterLink to="/freelancer/profile" class="px-4 py-2 bg-green-700/40 text-white border border-white/30 rounded-xl font-semibold text-sm hover:bg-green-700/60 transition-colors">
            Edit Profile
          </RouterLink>
        </div>
      </div>
    </div>

    <!-- Profile Completeness + Connects Row -->
    <div class="grid grid-cols-1 sm:grid-cols-2 gap-4">
      <!-- Profile Completeness -->
      <div class="bg-white rounded-2xl border border-slate-200 p-5">
        <div class="flex justify-between items-center mb-3">
          <h2 class="font-semibold text-slate-900">Profile Completeness</h2>
          <span :class="['text-sm font-bold', profileCompleteness >= 80 ? 'text-green-600' : 'text-yellow-600']">{{ profileCompleteness }}%</span>
        </div>
        <AppProgressBar :value="profileCompleteness" color="auto" size="md" />
        <div v-if="profileCompleteness < 100" class="mt-3 space-y-1.5">
          <p class="text-xs font-medium text-slate-600">Complete your profile to attract more clients:</p>
          <RouterLink v-for="item in incompleteItems" :key="item.label" :to="item.route" class="flex items-center gap-2 text-xs text-blue-600 hover:text-blue-700 font-medium">
            <svg class="w-3.5 h-3.5" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 4v16m8-8H4"/></svg>
            {{ item.label }}
          </RouterLink>
        </div>
        <p v-else class="text-xs text-green-600 font-medium mt-2">🎉 Your profile is complete!</p>
      </div>

      <!-- Connects Balance -->
      <div class="bg-white rounded-2xl border border-slate-200 p-5">
        <div class="flex justify-between items-center mb-2">
          <h2 class="font-semibold text-slate-900">Connects Balance</h2>
          <RouterLink to="/freelancer/earnings" class="text-xs text-amber-600 font-medium hover:text-amber-700">Buy more →</RouterLink>
        </div>
        <div class="flex items-end gap-2 mb-3">
          <span class="text-4xl font-black text-amber-600">{{ connectsBalance }}</span>
          <span class="text-sm text-slate-500 mb-1">Connects</span>
        </div>
        <div class="space-y-1.5 text-xs text-slate-500">
          <div class="flex justify-between">
            <span>Used this month</span>
            <span class="font-medium text-slate-700">18 Connects</span>
          </div>
          <div class="flex justify-between">
            <span>Next free allocation</span>
            <span class="font-medium text-slate-700">Mar 1 (+10)</span>
          </div>
        </div>
        <RouterLink to="/freelancer/earnings">
          <AppButton variant="outline" size="sm" class="w-full mt-3 border-amber-200 text-amber-700 hover:bg-amber-50">Buy Connects</AppButton>
        </RouterLink>
      </div>
    </div>

    <!-- Stats Grid -->
    <div class="grid grid-cols-2 lg:grid-cols-4 gap-4">
      <div v-for="stat in stats" :key="stat.label" class="bg-white rounded-2xl border border-slate-200 p-5">
        <div class="flex items-center justify-between mb-3">
          <p class="text-sm text-slate-500">{{ stat.label }}</p>
          <div :class="['w-9 h-9 rounded-xl flex items-center justify-center', stat.bgColor]">
            <AppIcon :name="stat.icon" :class="`w-5 h-5 ${stat.iconColor}`" />
          </div>
        </div>
        <p class="text-2xl font-bold text-slate-900">{{ stat.value }}</p>
        <p :class="['text-xs mt-1 font-medium', stat.changePositive ? 'text-green-600' : 'text-red-500']">
          {{ stat.change }}
        </p>
      </div>
    </div>

    <div class="grid grid-cols-1 lg:grid-cols-2 gap-6">
      <!-- Active Contracts -->
      <div class="bg-white rounded-2xl border border-slate-200 p-6">
        <div class="flex justify-between items-center mb-5">
          <h2 class="font-semibold text-slate-900">Active Contracts</h2>
          <RouterLink to="/freelancer/contracts" class="text-xs text-green-600 font-medium hover:text-green-700">View all →</RouterLink>
        </div>
        <div class="space-y-3">
          <div v-if="isLoadingContracts" class="space-y-3">
            <div v-for="i in 2" :key="i" class="h-16 bg-slate-100 rounded-xl animate-pulse" />
          </div>
          <div
            v-for="contract in activeContracts"
            :key="contract.id"
            class="flex items-center gap-3 p-3 bg-slate-50 rounded-xl hover:bg-slate-100 transition-colors cursor-pointer"
            @click="router.push(`/freelancer/contracts/${contract.id}`)"
          >
            <div class="w-10 h-10 bg-blue-100 rounded-xl flex items-center justify-center shrink-0">
              <svg class="w-5 h-5 text-blue-600" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
              </svg>
            </div>
            <div class="flex-1 min-w-0">
              <p class="text-sm font-medium text-slate-900 truncate">{{ contract.title }}</p>
              <p class="text-xs text-slate-500">{{ contract.client?.firstName }} {{ contract.client?.lastName }}</p>
            </div>
            <div class="text-right shrink-0">
              <p class="text-sm font-semibold text-green-700">${{ (contract.totalAmount ?? 0).toLocaleString() }}</p>
              <div class="mt-1">
                <AppProgressBar :value="(contract.totalAmount ?? 0) > 0 ? ((contract.paidAmount ?? 0) / (contract.totalAmount ?? 1)) * 100 : 0" color="blue" size="xs" />
              </div>
            </div>
          </div>
          <p v-if="!isLoadingContracts && !activeContracts.length" class="text-sm text-slate-400 text-center py-4">No active contracts.</p>
        </div>
      </div>

      <!-- Recommended Jobs -->
      <div class="bg-white rounded-2xl border border-slate-200 p-6">
        <div class="flex justify-between items-center mb-5">
          <h2 class="font-semibold text-slate-900">Best Matches</h2>
          <RouterLink to="/browse-jobs" class="text-xs text-green-600 font-medium hover:text-green-700">Browse all →</RouterLink>
        </div>
        <div class="space-y-3">
          <div
            v-for="job in recommendedJobs"
            :key="job.id"
            class="p-3 bg-slate-50 rounded-xl hover:bg-slate-100 transition-colors cursor-pointer group"
            @click="router.push(`/jobs/${job.id}`)"
          >
            <div class="flex justify-between items-start mb-1">
              <p class="text-sm font-medium text-slate-900 group-hover:text-green-600 transition-colors line-clamp-1">{{ job.title }}</p>
              <span class="text-xs font-bold text-green-700 shrink-0 ml-2">${{ job.budget.min ?? job.budget.amount }}{{ job.budget.type === 'hourly' ? '/hr' : '' }}</span>
            </div>
            <div class="flex items-center justify-between">
              <span class="text-xs text-slate-500">{{ job.category }}</span>
              <span class="text-xs bg-green-100 text-green-700 font-semibold px-2 py-0.5 rounded-md">{{ job.matchScore ?? Math.floor(Math.random() * 15 + 85) }}% match</span>
            </div>
          </div>
          <p v-if="!recommendedJobs.length" class="text-sm text-slate-400 text-center py-4">Loading recommendations...</p>
        </div>
      </div>
    </div>

    <!-- Earnings + JSS Overview -->
    <div class="grid grid-cols-1 lg:grid-cols-3 gap-6">
      <!-- Earnings Chart -->
      <div class="lg:col-span-2 bg-white rounded-2xl border border-slate-200 p-6">
        <div class="flex justify-between items-center mb-5">
          <h2 class="font-semibold text-slate-900">Earnings Overview</h2>
          <div class="flex gap-2">
            <button v-for="period in ['Week', 'Month', 'Year']" :key="period" :class="['px-3 py-1.5 text-xs font-medium rounded-lg transition-colors', activePeriod === period ? 'bg-green-600 text-white' : 'text-slate-500 hover:bg-slate-100']" @click="activePeriod = period">
              {{ period }}
            </button>
          </div>
        </div>
        <div class="flex items-end gap-1.5 h-32 mb-2">
          <div v-for="(bar, i) in earningsData" :key="i" class="flex-1 bg-green-100 rounded-t-lg relative group transition-all hover:bg-green-200" :style="{ height: `${bar.pct}%` }">
            <div class="absolute -top-8 left-1/2 -translate-x-1/2 bg-slate-800 text-white text-xs px-1.5 py-1 rounded opacity-0 group-hover:opacity-100 whitespace-nowrap transition-opacity z-10">
              ${{ bar.amount.toLocaleString() }}
            </div>
          </div>
        </div>
        <div class="flex justify-between">
          <span v-for="label in barLabels" :key="label" class="text-xs text-slate-400 flex-1 text-center">{{ label }}</span>
        </div>
        <p class="text-center mt-3 text-lg font-bold text-slate-900">Total: <span class="text-green-600">$4,250</span> this month</p>
      </div>

      <!-- JSS Score -->
      <div class="bg-white rounded-2xl border border-slate-200 p-6">
        <h2 class="font-semibold text-slate-900 mb-4">Job Success Score</h2>
        <div class="text-center mb-4">
          <div class="relative inline-flex items-center justify-center">
            <svg class="w-28 h-28 -rotate-90">
              <circle cx="56" cy="56" r="48" fill="none" stroke="#e2e8f0" stroke-width="8" />
              <circle cx="56" cy="56" r="48" fill="none" stroke="#22c55e" stroke-width="8" stroke-linecap="round" :stroke-dasharray="`${jss * 3.016} 301.6`" />
            </svg>
            <div class="absolute text-center">
              <p class="text-3xl font-black text-green-600">{{ jss }}%</p>
              <p class="text-xs text-slate-500">JSS</p>
            </div>
          </div>
        </div>
        <div class="space-y-2 text-sm">
          <div class="flex justify-between">
            <span class="text-slate-500">Total Jobs</span>
            <span class="font-semibold">89</span>
          </div>
          <div class="flex justify-between">
            <span class="text-slate-500">5-Star Reviews</span>
            <span class="font-semibold text-yellow-500">⭐ 61</span>
          </div>
          <div class="flex justify-between">
            <span class="text-slate-500">Repeat Clients</span>
            <span class="font-semibold">34%</span>
          </div>
        </div>
        <div class="mt-4 p-3 bg-green-50 rounded-xl border border-green-200">
          <p class="text-xs font-semibold text-green-800">🏅 Top Rated Status</p>
          <p class="text-xs text-green-600 mt-0.5">Earned for maintaining 90%+ JSS for 13 weeks</p>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, computed, onMounted } from 'vue'
import { RouterLink, useRouter } from 'vue-router'
import { useAuthStore } from '@/stores/auth.store'
import { useJobStore } from '@/stores/job.store'
import { contractService } from '@/services/api/contract.service'
import type { Contract } from '@/types'
import AppIcon from '@/components/ui/AppIcon.vue'
import AppButton from '@/components/ui/AppButton.vue'
import AppProgressBar from '@/components/ui/AppProgressBar.vue'

const auth = useAuthStore()
const jobStore = useJobStore()
const router = useRouter()
const activePeriod = ref('Month')

const profileCompleteness = ref(72)
const connectsBalance = ref(60)
const jss = ref(98)
const freelancerBadge = ref<'top_rated' | 'rising_talent' | null>('top_rated')
const activeContracts = ref<Contract[]>([])
const isLoadingContracts = ref(false)

const badgeStyle = computed(() => {
  if (freelancerBadge.value === 'top_rated') return { bg: 'bg-yellow-100', text: 'text-yellow-800', icon: '⭐', label: 'Top Rated' }
  if (freelancerBadge.value === 'rising_talent') return { bg: 'bg-purple-100', text: 'text-purple-800', icon: '🚀', label: 'Rising Talent' }
  return { bg: '', text: '', icon: '', label: '' }
})

const incompleteItems = [
  { label: 'Add portfolio items', route: '/freelancer/profile' },
  { label: 'Add education history', route: '/freelancer/profile' },
  { label: 'Upload a profile photo', route: '/freelancer/profile' },
]

onMounted(async () => {
  jobStore.fetchRecommended()
  isLoadingContracts.value = true
  try {
    const res = await contractService.getContracts()
    activeContracts.value = res.data.filter((c) => c.status === 'active')
  } finally {
    isLoadingContracts.value = false
  }
})

const recommendedJobs = computed(() => jobStore.recommendedJobs.slice(0, 4))

const stats = [
  { label: 'Total Earnings', value: '$12,450', change: '+18% this month', icon: 'dollar-sign', bgColor: 'bg-green-100', iconColor: 'text-green-600', changePositive: true },
  { label: 'Active Contracts', value: '3', change: '+1 this week', icon: 'briefcase', bgColor: 'bg-blue-100', iconColor: 'text-blue-600', changePositive: true },
  { label: 'Proposals Sent', value: '7', change: '2 viewed', icon: 'file-text', bgColor: 'bg-purple-100', iconColor: 'text-purple-600', changePositive: true },
  { label: 'Response Rate', value: '98%', change: '+1% this month', icon: 'trending-up', bgColor: 'bg-orange-100', iconColor: 'text-orange-600', changePositive: true },
]

const earningsData = [
  { pct: 40, amount: 850 }, { pct: 65, amount: 1380 }, { pct: 30, amount: 640 },
  { pct: 80, amount: 1700 }, { pct: 55, amount: 1170 }, { pct: 45, amount: 960 }, { pct: 70, amount: 1490 },
]
const barLabels = ['Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat', 'Sun']
</script>
