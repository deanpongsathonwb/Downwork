import { BaseService } from '@/services/http/base.service'
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

class AdminService extends BaseService {
  constructor() {
    super('/admin')
  }

  getStats() {
    return this.get<AdminStats>('/stats')
  }

  getUsers(params?: Record<string, unknown>) {
    return this.get<UserManagementEntry[]>('/users', { params })
  }

  getUser(userId: string) {
    return this.get<UserManagementEntry>(`/users/${userId}`)
  }

  banUser(userId: string, reason: string) {
    return this.patch<void>(`/users/${userId}/ban`, { reason })
  }

  unbanUser(userId: string) {
    return this.patch<void>(`/users/${userId}/unban`)
  }

  suspendUser(userId: string, days: number, reason: string) {
    return this.patch<void>(`/users/${userId}/suspend`, { days, reason })
  }

  deleteUser(userId: string) {
    return this.delete<void>(`/users/${userId}`)
  }

  getPendingJobs() {
    return this.get<Job[]>('/jobs/pending')
  }

  approveJob(jobId: string) {
    return this.patch<void>(`/jobs/${jobId}/approve`)
  }

  rejectJob(jobId: string, reason: string) {
    return this.patch<void>(`/jobs/${jobId}/reject`, { reason })
  }

  getDisputes(status?: string) {
    return this.get<Dispute[]>('/disputes', { params: { status } })
  }

  getDispute(disputeId: string) {
    return this.get<Dispute>(`/disputes/${disputeId}`)
  }

  resolveDispute(disputeId: string, resolution: string, favorOf: string) {
    return this.patch<void>(`/disputes/${disputeId}/resolve`, { resolution, favorOf })
  }

  getKYCSubmissions(status?: string) {
    return this.get<KYCDocument[]>('/kyc', { params: { status } })
  }

  approveKYC(documentId: string) {
    return this.patch<void>(`/kyc/${documentId}/approve`)
  }

  rejectKYC(documentId: string, reason: string) {
    return this.patch<void>(`/kyc/${documentId}/reject`, { reason })
  }

  getReports(status?: string) {
    return this.get<Report[]>('/reports', { params: { status } })
  }

  resolveReport(reportId: string, action: string) {
    return this.patch<void>(`/reports/${reportId}/resolve`, { action })
  }

  getPlatformSettings() {
    return this.get<PlatformSettings>('/settings')
  }

  updatePlatformSettings(payload: Partial<PlatformSettings>) {
    return this.put<PlatformSettings>('/settings', payload)
  }

  updateCommissionRate(rate: number) {
    return this.patch<void>('/settings/commission', { rate })
  }

  getAnalytics(range: 'week' | 'month' | 'year') {
    return this.get<AnalyticsData>('/analytics', { params: { range } })
  }

  exportReport(type: string, format: 'csv' | 'pdf', dateRange?: { from: string; to: string }) {
    return this.get<Blob>('/reports/export', {
      params: { type, format, ...dateRange },
      responseType: 'blob',
    })
  }
}

export const adminService = new AdminService()
