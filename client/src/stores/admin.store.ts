import { defineStore } from 'pinia'
import { ref } from 'vue'
import type {
  AdminStats,
  AnalyticsData,
  Dispute,
  Job,
  KYCDocument,
  PlatformSettings,
  Report,
  UserManagementEntry,
} from '@/types'
import { adminService } from '@/services/api/admin.service'
import { useToastStore } from './toast.store'
import { logger } from '@/utils/logger'

export const useAdminStore = defineStore('admin', () => {
  const toast = useToastStore()

  const stats = ref<AdminStats | null>(null)
  const users = ref<UserManagementEntry[]>([])
  const pendingJobs = ref<Job[]>([])
  const disputes = ref<Dispute[]>([])
  const reports = ref<Report[]>([])
  const kycSubmissions = ref<KYCDocument[]>([])
  const analytics = ref<AnalyticsData | null>(null)
  const platformSettings = ref<PlatformSettings | null>(null)
  const isLoading = ref(false)
  const error = ref<string | null>(null)

  async function fetchStats(): Promise<void> {
    try {
      const res = await adminService.getStats()
      stats.value = res.data
    } catch (err) {
      logger.catch(err, 'AdminStore.fetchStats')
    }
  }

  async function fetchUsers(params?: Record<string, unknown>): Promise<void> {
    isLoading.value = true
    error.value = null
    try {
      const res = await adminService.getUsers(params)
      users.value = res.data
    } catch (err) {
      logger.catch(err, 'AdminStore.fetchUsers')
      error.value = 'Failed to load users.'
    } finally {
      isLoading.value = false
    }
  }

  async function banUser(userId: string, reason: string): Promise<boolean> {
    try {
      await adminService.banUser(userId, reason)
      const u = users.value.find(u => u.id === userId)
      if (u) u.isBanned = true
      toast.success('User Banned')
      return true
    } catch (err) {
      logger.catch(err, 'AdminStore.banUser')
      toast.error('Failed', 'Could not ban user.')
      return false
    }
  }

  async function unbanUser(userId: string): Promise<boolean> {
    try {
      await adminService.unbanUser(userId)
      const u = users.value.find(u => u.id === userId)
      if (u) u.isBanned = false
      toast.success('User Unbanned')
      return true
    } catch (err) {
      logger.catch(err, 'AdminStore.unbanUser')
      toast.error('Failed', 'Could not unban user.')
      return false
    }
  }

  async function suspendUser(userId: string, days: number, reason: string): Promise<boolean> {
    try {
      await adminService.suspendUser(userId, days, reason)
      const u = users.value.find(u => u.id === userId)
      if (u) u.isSuspended = true
      toast.success('User Suspended', `Suspended for ${days} days.`)
      return true
    } catch (err) {
      logger.catch(err, 'AdminStore.suspendUser')
      toast.error('Failed', 'Could not suspend user.')
      return false
    }
  }

  async function fetchPendingJobs(): Promise<void> {
    isLoading.value = true
    try {
      const res = await adminService.getPendingJobs()
      pendingJobs.value = res.data
    } catch (err) {
      logger.catch(err, 'AdminStore.fetchPendingJobs')
      error.value = 'Failed to load pending jobs.'
    } finally {
      isLoading.value = false
    }
  }

  async function approveJob(jobId: string): Promise<boolean> {
    try {
      await adminService.approveJob(jobId)
      pendingJobs.value = pendingJobs.value.filter(j => j.id !== jobId)
      toast.success('Job Approved')
      return true
    } catch (err) {
      logger.catch(err, 'AdminStore.approveJob')
      toast.error('Failed', 'Could not approve job.')
      return false
    }
  }

  async function rejectJob(jobId: string, reason: string): Promise<boolean> {
    try {
      await adminService.rejectJob(jobId, reason)
      pendingJobs.value = pendingJobs.value.filter(j => j.id !== jobId)
      toast.success('Job Rejected')
      return true
    } catch (err) {
      logger.catch(err, 'AdminStore.rejectJob')
      toast.error('Failed', 'Could not reject job.')
      return false
    }
  }

  async function fetchDisputes(status?: string): Promise<void> {
    isLoading.value = true
    try {
      const res = await adminService.getDisputes(status)
      disputes.value = res.data
    } catch (err) {
      logger.catch(err, 'AdminStore.fetchDisputes')
      error.value = 'Failed to load disputes.'
    } finally {
      isLoading.value = false
    }
  }

  async function resolveDispute(disputeId: string, resolution: string, favorOf: string): Promise<boolean> {
    try {
      await adminService.resolveDispute(disputeId, resolution, favorOf)
      const d = disputes.value.find(d => d.id === disputeId)
      if (d) d.status = 'resolved'
      toast.success('Dispute Resolved')
      return true
    } catch (err) {
      logger.catch(err, 'AdminStore.resolveDispute')
      toast.error('Failed', 'Could not resolve dispute.')
      return false
    }
  }

  async function fetchAnalytics(range: 'week' | 'month' | 'year' = 'month'): Promise<void> {
    isLoading.value = true
    try {
      const res = await adminService.getAnalytics(range)
      analytics.value = res.data
    } catch (err) {
      logger.catch(err, 'AdminStore.fetchAnalytics')
    } finally {
      isLoading.value = false
    }
  }

  async function fetchPlatformSettings(): Promise<void> {
    try {
      const res = await adminService.getPlatformSettings()
      platformSettings.value = res.data
    } catch (err) {
      logger.catch(err, 'AdminStore.fetchPlatformSettings')
    }
  }

  async function updatePlatformSettings(payload: Partial<PlatformSettings>): Promise<boolean> {
    try {
      const res = await adminService.updatePlatformSettings(payload)
      platformSettings.value = res.data
      toast.success('Settings Updated')
      return true
    } catch (err) {
      logger.catch(err, 'AdminStore.updatePlatformSettings')
      toast.error('Failed', 'Could not update settings.')
      return false
    }
  }

  async function fetchReports(status?: string): Promise<void> {
    isLoading.value = true
    try {
      const res = await adminService.getReports(status)
      reports.value = res.data
    } catch (err) {
      logger.catch(err, 'AdminStore.fetchReports')
    } finally {
      isLoading.value = false
    }
  }

  async function fetchKYCSubmissions(status?: string): Promise<void> {
    isLoading.value = true
    try {
      const res = await adminService.getKYCSubmissions(status)
      kycSubmissions.value = res.data
    } catch (err) {
      logger.catch(err, 'AdminStore.fetchKYCSubmissions')
    } finally {
      isLoading.value = false
    }
  }

  return {
    stats,
    users,
    pendingJobs,
    disputes,
    reports,
    kycSubmissions,
    analytics,
    platformSettings,
    isLoading,
    error,
    fetchStats,
    fetchUsers,
    banUser,
    unbanUser,
    suspendUser,
    fetchPendingJobs,
    approveJob,
    rejectJob,
    fetchDisputes,
    resolveDispute,
    fetchAnalytics,
    fetchPlatformSettings,
    updatePlatformSettings,
    fetchReports,
    fetchKYCSubmissions,
  }
})
