// ── Admin ─────────────────────────────────────────────────────

export type DisputeStatus = 'open' | 'under_review' | 'resolved' | 'escalated' | 'closed'
export type DisputeResolution = 'favor_client' | 'favor_freelancer' | 'split' | 'dismissed'
export type KYCStatus = 'not_started' | 'pending' | 'approved' | 'rejected'
export type ReportStatus = 'pending' | 'reviewed' | 'resolved' | 'dismissed'

export interface AdminStats {
  totalUsers: number
  totalFreelancers: number
  totalClients: number
  totalJobs: number
  totalContracts?: number
  totalRevenue: number
  activeContracts: number
  openDisputes: number
  newUsersThisMonth?: number
  revenueThisMonth?: number
  platformFeeRate?: number
}

export interface Dispute {
  id: string
  contractId: string
  raisedBy: string
  respondent: string
  /** Alias for raisedBy */
  initiatorId?: string
  /** Alias for respondent */
  respondentId?: string
  reason: string
  description: string
  status: DisputeStatus
  resolution?: DisputeResolution
  assignedAdmin?: string
  createdAt: string
  updatedAt?: string
  resolvedAt?: string
}

export interface Report {
  id: string
  reporterId: string
  reportedId: string
  type: 'user' | 'job' | 'review'
  reason: string
  description?: string
  status: ReportStatus
  createdAt: string
}

export interface KYCDocument {
  id: string
  userId: string
  documentType: 'passport' | 'drivers_license' | 'national_id'
  documentUrl: string
  selfieUrl?: string
  status: KYCStatus
  submittedAt: string
  reviewedAt?: string
  rejectionReason?: string
}

export interface PlatformSettings {
  commissionRate: number
  minWithdrawal: number
  maxWithdrawal: number
  maintenanceMode: boolean
  registrationEnabled: boolean
  kycRequired: boolean
  autoApproveJobs: boolean
}

export interface AnalyticsData {
  period: string
  revenue: number[]
  users: number[]
  jobs: number[]
  contracts: number[]
  labels: string[]
}
