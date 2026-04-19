<template>
  <div class="space-y-6">
    <!-- Welcome Banner -->
    <div class="bg-gradient-to-r from-green-600 to-emerald-600 rounded-2xl p-6 text-white">
      <div class="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
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
        <div v-if="isLoadingProfile" class="space-y-3 animate-pulse">
          <div class="h-4 bg-slate-100 rounded w-1/2" />
          <div class="h-3 bg-slate-100 rounded" />
          <div class="h-3 bg-slate-100 rounded w-3/4" />
        </div>
        <template v-else>
          <div class="flex justify-between items-center mb-3">
            <h2 class="font-semibold text-slate-900">Profile Completeness</h2>
            <span :class="['text-sm font-bold', profileCompleteness >= 80 ? 'text-green-600' : 'text-yellow-600']">{{ profileCompleteness }}%</span>
          </div>
          <AppProgressBar :value="profileCompleteness" color="auto" size="md" />
          <div v-if="profileCompleteness < 100 && incompleteItems.length" class="mt-3 space-y-1.5">
            <p class="text-xs font-medium text-slate-600">Complete your profile to attract more clients:</p>
            <RouterLink v-for="item in incompleteItems" :key="item.labelWithKey" :to="item.route" class="flex items-center gap-2 text-xs text-blue-600 hover:text-blue-700 font-medium">
              <svg class="w-3.5 h-3.5" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 4v16m8-8H4"/></svg>
              {{ item.label }}
            </RouterLink>
          </div>
          <p v-else-if="profileCompleteness >= 100" class="text-xs text-green-600 font-medium mt-2">🎉 Your profile is complete!</p>
        </template>
      </div>

      <!-- Connects -->
      <div class="bg-white rounded-2xl border border-slate-200 p-5">
        <div v-if="isLoadingProfile" class="space-y-3 animate-pulse">
          <div class="h-4 bg-slate-100 rounded w-1/2" />
          <div class="h-10 bg-slate-100 rounded w-1/3" />
        </div>
        <template v-else>
          <h2 class="font-semibold text-slate-900 mb-3">Connects</h2>
          <div class="flex items-end gap-2">
            <span class="text-4xl font-black text-amber-600">{{ connectsDetail.balance }}</span>
            <span class="text-sm text-slate-500 mb-1">available</span>
          </div>
          <dl class="mt-4 space-y-2 text-xs text-slate-600">
            <div class="flex justify-between gap-2">
              <dt>Applications this month</dt>
              <dd class="font-semibold text-slate-800 tabular-nums">{{ connectsDetail.applicationsThisMonth }}</dd>
            </div>
            <div v-if="connectsDetail.usedThisMonth > 0" class="flex justify-between gap-2">
              <dt>Connects used (this month)</dt>
              <dd class="font-semibold text-slate-800 tabular-nums">{{ connectsDetail.usedThisMonth }}</dd>
            </div>
          </dl>
          <div v-if="connectsDetail.recentPurchases.length" class="mt-4 pt-4 border-t border-slate-100">
            <p class="text-xs font-medium text-slate-500 mb-2">Recent purchases</p>
            <ul class="space-y-1.5 text-xs text-slate-700">
              <li v-for="row in connectsDetail.recentPurchases.slice(0, 3)" :key="row.id" class="flex justify-between gap-2">
                <span class="truncate" :title="row.description">{{ row.description }}</span>
                <time class="text-slate-400 shrink-0 tabular-nums" :datetime="row.createdAt">{{ formatShortDate(row.createdAt) }}</time>
              </li>
            </ul>
          </div>
          <p v-else class="mt-4 text-xs text-slate-500">Buy Connects on the earnings page when you need more to apply.</p>
          <RouterLink to="/freelancer/earnings" class="block mt-4">
            <AppButton variant="outline" size="sm" class="w-full border-amber-200 text-amber-700 hover:bg-amber-50">
              Buy Connects
            </AppButton>
          </RouterLink>
        </template>
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
        <p :class="['text-xs mt-1 font-medium', stat.changePositive ? 'text-slate-500' : 'text-red-500']">
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
              <p class="text-sm font-semibold text-green-700">${{ Number(contract.totalAmount ?? 0).toLocaleString() }}</p>
              <div class="mt-1">
                <AppProgressBar :value="Number(contract.totalAmount ?? 0) > 0 ? (Number(contract.paidAmount ?? 0) / Number(contract.totalAmount ?? 1)) * 100 : 0" color="blue" size="xs" />
              </div>
            </div>
          </div>
          <p v-if="!isLoadingContracts && !activeContracts.length" class="text-sm text-slate-400 text-center py-4">No active contracts.</p>
        </div>
      </div>

      <!-- Recommended Jobs -->
      <div class="bg-white rounded-2xl border border-slate-200 p-6">
        <div class="flex justify-between items-center mb-5">
          <h2 class="font-semibold text-slate-900">Recent Open Jobs</h2>
          <RouterLink to="/browse-jobs" class="text-xs text-green-600 font-medium hover:text-green-700">Browse all →</RouterLink>
        </div>
        <div class="space-y-3">
          <div v-if="isLoadingRecommended" class="space-y-3">
            <div v-for="i in 3" :key="i" class="h-14 bg-slate-100 rounded-xl animate-pulse" />
          </div>
          <template v-else>
            <div
              v-for="job in recommendedJobs"
              :key="job.id"
              class="p-3 bg-slate-50 rounded-xl hover:bg-slate-100 transition-colors cursor-pointer group"
              @click="router.push(`/jobs/${job.id}`)"
            >
              <div class="flex justify-between items-start mb-1">
                <p class="text-sm font-medium text-slate-900 group-hover:text-green-600 transition-colors line-clamp-1">{{ job.title }}</p>
                <span class="text-xs font-bold text-green-700 shrink-0 ml-2">{{ formatJobBudget(job) }}</span>
              </div>
              <div class="flex items-center justify-between">
                <span class="text-xs text-slate-500">{{ job.category }}</span>
                <span v-if="job.matchScore != null" class="text-xs bg-green-100 text-green-700 font-semibold px-2 py-0.5 rounded-md">{{ job.matchScore }}% match</span>
              </div>
            </div>
            <p v-if="!recommendedJobs.length" class="text-sm text-slate-400 text-center py-4">No open jobs right now.</p>
          </template>
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
            <button v-for="period in periodOptions" :key="period" :class="['px-3 py-1.5 text-xs font-medium rounded-lg transition-colors', activePeriod === period ? 'bg-green-600 text-white' : 'text-slate-500 hover:bg-slate-100']" @click="activePeriod = period">
              {{ period }}
            </button>
          </div>
        </div>
        <div v-if="isLoadingEarnings" class="h-32 mb-2 flex items-center justify-center text-slate-400 text-sm">Loading earnings…</div>
        <template v-else>
          <div class="flex items-end h-32 mb-2 min-h-[8rem]" :class="activePeriod === 'Year' ? 'gap-0.5' : 'gap-1.5'">
            <div
              v-for="(bar, i) in earningsData"
              :key="i"
              class="flex-1 min-w-0 bg-green-100 rounded-t-lg relative group transition-all hover:bg-green-200"
              :style="{ height: `${Math.max(bar.pct, 2)}%` }"
            >
              <div class="absolute -top-8 left-1/2 -translate-x-1/2 bg-slate-800 text-white text-xs px-1.5 py-1 rounded opacity-0 group-hover:opacity-100 whitespace-nowrap transition-opacity z-10 pointer-events-none">
                ${{ bar.amount.toLocaleString() }}
              </div>
            </div>
          </div>
          <div class="flex justify-between gap-0.5">
            <span v-for="label in barLabels" :key="label" class="text-[10px] sm:text-xs text-slate-400 flex-1 min-w-0 text-center truncate">{{ label }}</span>
          </div>
          <p class="text-center mt-3 text-lg font-bold text-slate-900">
            Total: <span class="text-green-600">${{ earningsPeriodTotal.toLocaleString() }}</span>
            <span class="text-sm font-normal text-slate-500"> · {{ earningsPeriodCaption }}</span>
          </p>
        </template>
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
            <span class="text-slate-500">Completed jobs</span>
            <span class="font-semibold">{{ completedJobsDisplay }}</span>
          </div>
          <div class="flex justify-between">
            <span class="text-slate-500">Reviews</span>
            <span class="font-semibold text-yellow-500">⭐ {{ reviewCountDisplay }} <span v-if="avgRatingDisplay !== null" class="text-slate-700">({{ avgRatingDisplay.toFixed(1) }})</span></span>
          </div>
        </div>
        <div v-if="jss >= 90" class="mt-4 p-3 bg-green-50 rounded-xl border border-green-200">
          <p class="text-xs font-semibold text-green-800">🏅 Strong success rate</p>
          <p class="text-xs text-green-600 mt-0.5">Keep delivering great work to maintain your score.</p>
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
import { userService } from '@/services/api/user.service'
import { proposalService } from '@/services/api/proposal.service'
import { paymentService } from '@/services/api/payment.service'
import type { Contract, Job, Proposal, ConnectsBalanceResponse } from '@/types'
import AppIcon from '@/components/ui/AppIcon.vue'
import AppButton from '@/components/ui/AppButton.vue'
import AppProgressBar from '@/components/ui/AppProgressBar.vue'

/** API merges freelancer fields onto the user object */
type MergedFreelancer = Record<string, unknown> & {
  profileCompleteness?: number
  connectsBalance?: number
  completedJobs?: number
  reviewCount?: number
  totalEarnings?: unknown
  successRate?: unknown
  rating?: unknown
  title?: string
  bio?: string
  portfolioItems?: unknown
  education?: unknown
  freelancerProfile?: Record<string, unknown>
}

type PaymentTx = {
  net?: unknown
  amount?: unknown
  createdAt: string
  type: string
  status: string
}

const auth = useAuthStore()
const jobStore = useJobStore()
const router = useRouter()
const periodOptions = ['Week', 'Month', 'Year'] as const
type EarningsPeriod = (typeof periodOptions)[number]
const activePeriod = ref<EarningsPeriod>('Month')

const freelancerProfile = ref<MergedFreelancer | null>(null)
const connectsDetail = ref<ConnectsBalanceResponse>({
  balance: 0,
  usedThisMonth: 0,
  applicationsThisMonth: 0,
  recentPurchases: [],
})
const activeContracts = ref<Contract[]>([])
const myProposals = ref<Proposal[]>([])
const paymentTransactions = ref<PaymentTx[]>([])

const isLoadingProfile = ref(true)
const isLoadingContracts = ref(false)
const isLoadingRecommended = ref(true)
const isLoadingEarnings = ref(true)

function toNum(v: unknown): number {
  if (typeof v === 'number' && !Number.isNaN(v)) return v
  const n = parseFloat(String(v ?? '0').replace(/,/g, ''))
  return Number.isFinite(n) ? n : 0
}

const profileCompleteness = computed(() => {
  const p = freelancerProfile.value
  if (!p) return 0
  const raw =
    p.profileCompleteness ??
    (p.freelancerProfile?.profileCompleteness as number | undefined)
  return Math.min(100, Math.max(0, Math.round(Number(raw) || 0)))
})

const incompleteItems = computed(() => {
  const items: { label: string; route: string; labelWithKey: string }[] = []
  const u = auth.user
  const p = freelancerProfile.value
  if (!u || !p) return items

  if (!u.avatar) items.push({ label: 'Upload a profile photo', route: '/freelancer/profile', labelWithKey: 'avatar' })

  const portfolioLen = Array.isArray(p.portfolioItems) ? p.portfolioItems.length : 0
  const educationLen = Array.isArray(p.education) ? p.education.length : 0

  if (portfolioLen < 1) {
    items.push({ label: 'Add portfolio items', route: '/freelancer/profile', labelWithKey: 'portfolio' })
  }
  if (educationLen < 1) {
    items.push({ label: 'Add education history', route: '/freelancer/profile', labelWithKey: 'education' })
  }
  if (!(p.title && String(p.title).trim())) {
    items.push({ label: 'Add a professional title', route: '/freelancer/profile', labelWithKey: 'title' })
  }
  if (!(p.bio && String(p.bio).trim())) {
    items.push({ label: 'Write your bio', route: '/freelancer/profile', labelWithKey: 'bio' })
  }

  return items.slice(0, 6)
})

const freelancerBadge = computed<'top_rated' | null>(() => {
  const sr = toNum(freelancerProfile.value?.successRate)
  return sr >= 90 ? 'top_rated' : null
})

const badgeStyle = computed(() => {
  if (freelancerBadge.value === 'top_rated') {
    return { bg: 'bg-yellow-100', text: 'text-yellow-800', icon: '⭐', label: 'Top Rated' }
  }
  return { bg: '', text: '', icon: '', label: '' }
})

const recommendedJobs = computed(() => jobStore.recommendedJobs.slice(0, 4))

const stats = computed(() => {
  const p = freelancerProfile.value
  const te = p ? toNum(p.totalEarnings) : 0
  const ac = activeContracts.value.length
  const propCount = myProposals.value.length
  const shortlisted = myProposals.value.filter((x) => x.status === 'shortlisted').length
  const sr = p ? toNum(p.successRate) : 0

  return [
    {
      label: 'Total Earnings',
      value: `$${te.toLocaleString()}`,
      change: 'Lifetime total (profile)',
      icon: 'dollar-sign',
      bgColor: 'bg-green-100',
      iconColor: 'text-green-600',
      changePositive: true,
    },
    {
      label: 'Active Contracts',
      value: String(ac),
      change: 'In progress',
      icon: 'briefcase',
      bgColor: 'bg-blue-100',
      iconColor: 'text-blue-600',
      changePositive: true,
    },
    {
      label: 'Proposals',
      value: String(propCount),
      change: shortlisted ? `${shortlisted} shortlisted` : 'Submitted & active',
      icon: 'file-text',
      bgColor: 'bg-purple-100',
      iconColor: 'text-purple-600',
      changePositive: true,
    },
    {
      label: 'Success rate',
      value: `${Math.round(sr)}%`,
      change: 'From your profile',
      icon: 'trending-up',
      bgColor: 'bg-orange-100',
      iconColor: 'text-orange-600',
      changePositive: sr >= 50,
    },
  ]
})

function txNet(t: PaymentTx): number {
  return toNum(t.net ?? t.amount)
}

function buildEarningsChart(txs: PaymentTx[], period: string) {
  const completed = txs.filter((t) => t.type === 'payment' && t.status === 'completed')
  const now = new Date()

  if (period === 'Week') {
    const days: Date[] = []
    for (let i = 6; i >= 0; i--) {
      const d = new Date(now)
      d.setHours(0, 0, 0, 0)
      d.setDate(d.getDate() - i)
      days.push(d)
    }
    const amounts = days.map((day) => {
      const start = new Date(day)
      const end = new Date(day)
      end.setDate(end.getDate() + 1)
      return completed
        .filter((t) => {
          const dt = new Date(t.createdAt)
          return dt >= start && dt < end
        })
        .reduce((s, t) => s + txNet(t), 0)
    })
    const labels = days.map((d) => d.toLocaleDateString(undefined, { weekday: 'short' }))
    return finalizeChart(amounts, labels, 'this week')
  }

  if (period === 'Month') {
    const amounts: number[] = []
    const labels: string[] = []
    for (let b = 6; b >= 0; b--) {
      const end = new Date(now)
      end.setHours(23, 59, 59, 999)
      end.setDate(end.getDate() - b * 4)
      const start = new Date(end)
      start.setHours(0, 0, 0, 0)
      start.setDate(start.getDate() - 3)
      const sum = completed
        .filter((t) => {
          const dt = new Date(t.createdAt)
          return dt >= start && dt <= end
        })
        .reduce((s, t) => s + txNet(t), 0)
      amounts.push(sum)
      labels.push(`${start.getMonth() + 1}/${start.getDate()}`)
    }
    return finalizeChart(amounts, labels, 'last 28 days')
  }

  const year = now.getFullYear()
  const amounts: number[] = []
  const labels: string[] = []
  for (let m = 0; m < 12; m++) {
    const start = new Date(year, m, 1)
    const end = new Date(year, m + 1, 1)
    const sum = completed
      .filter((t) => {
        const dt = new Date(t.createdAt)
        return dt >= start && dt < end
      })
      .reduce((s, t) => s + txNet(t), 0)
    amounts.push(sum)
    labels.push(start.toLocaleDateString(undefined, { month: 'short' }))
  }
  return finalizeChart(amounts, labels, String(year))
}

function finalizeChart(amounts: number[], labels: string[], periodLabel: string) {
  const max = Math.max(...amounts, 1e-6)
  const bars = amounts.map((amount) => ({ pct: (amount / max) * 100, amount }))
  const total = amounts.reduce((a, b) => a + b, 0)
  return { bars, labels, total, periodLabel }
}

const earningsChart = computed(() => buildEarningsChart(paymentTransactions.value, activePeriod.value))

const earningsData = computed(() => earningsChart.value.bars)
const barLabels = computed(() => earningsChart.value.labels)
const earningsPeriodTotal = computed(() => earningsChart.value.total)
const earningsPeriodCaption = computed(() => earningsChart.value.periodLabel)

const jss = computed(() => {
  const s = toNum(freelancerProfile.value?.successRate)
  return Math.min(100, Math.max(0, Math.round(s)))
})

const completedJobsDisplay = computed(() => String(freelancerProfile.value?.completedJobs ?? 0))
const reviewCountDisplay = computed(() => String(freelancerProfile.value?.reviewCount ?? 0))
const avgRatingDisplay = computed(() => {
  const r = toNum(freelancerProfile.value?.rating)
  if (r <= 0) return null
  return r
})

function formatJobBudget(job: Job): string {
  const b = job.budget
  if (!b) return '—'
  if (b.type === 'hourly') {
    const lo = b.min ?? b.amount
    const hi = b.max
    if (lo != null && hi != null) return `$${lo}–${hi}/hr`
    return `$${lo ?? 0}/hr`
  }
  return `$${b.amount ?? 0}`
}

function formatShortDate(iso: string): string {
  try {
    return new Date(iso).toLocaleDateString(undefined, { month: 'short', day: 'numeric' })
  } catch {
    return ''
  }
}

onMounted(async () => {
  const userId = auth.user?.id
  if (!userId) {
    isLoadingProfile.value = false
    isLoadingRecommended.value = false
    isLoadingEarnings.value = false
    return
  }

  isLoadingContracts.value = true

  try {
    const [profileRes, contractsRes, proposalsRes, earningsRes, connectsRes] = await Promise.all([
      userService.getFreelancerProfile(userId),
      contractService.getContracts(),
      proposalService.getMyProposals(),
      paymentService.getEarnings(),
      paymentService.getConnectsBalance(),
      jobStore.fetchRecommended(),
    ])

    freelancerProfile.value = profileRes.data as unknown as MergedFreelancer
    activeContracts.value = contractsRes.data.filter((c) => c.status === 'active')
    myProposals.value = proposalsRes.data
    paymentTransactions.value = Array.isArray(earningsRes.data) ? (earningsRes.data as unknown as PaymentTx[]) : []
    const c = connectsRes.data
    connectsDetail.value = {
      balance: c?.balance ?? toNum(freelancerProfile.value?.connectsBalance),
      usedThisMonth: c?.usedThisMonth ?? 0,
      applicationsThisMonth: c?.applicationsThisMonth ?? 0,
      recentPurchases: Array.isArray(c?.recentPurchases) ? c.recentPurchases : [],
    }
  } catch {
    freelancerProfile.value = null
  } finally {
    isLoadingProfile.value = false
    isLoadingContracts.value = false
    isLoadingRecommended.value = false
    isLoadingEarnings.value = false
  }
})
</script>
