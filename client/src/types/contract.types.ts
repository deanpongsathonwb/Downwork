import type { User } from './user.types'
import type { Job } from './job.types'

// ── Contract ─────────────────────────────────────────────────

export type ContractStatus = 'pending' | 'active' | 'paused' | 'completed' | 'disputed' | 'cancelled'
export type MilestoneStatus =
  | 'pending'
  | 'funded'
  | 'in_progress'
  | 'submitted'
  | 'approved'
  | 'released'
  | 'disputed'
  | 'rejected'

export interface ContractMilestone {
  id: string
  title: string
  description?: string
  amount: number
  dueDate?: string
  status: MilestoneStatus
  submittedAt?: string
  approvedAt?: string
  completedAt?: string
  completionNote?: string
  feedback?: string
}

/** Alias used in some older components and services */
export type Milestone = ContractMilestone

export interface Contract {
  id: string
  jobId: string
  proposalId: string
  clientId: string
  /** Populated client user (optional) */
  client?: Partial<User>
  freelancerId: string
  /** Populated freelancer user (optional) */
  freelancer?: Partial<User>
  title: string
  description?: string
  totalAmount?: number
  /** Amount released so far */
  paidAmount?: number
  /** Contract category / type label */
  type?: string
  hourlyRate?: number
  startDate: string
  endDate?: string
  status: ContractStatus
  milestones: ContractMilestone[]
  currency?: string
  /** Populated job (optional) */
  job?: Partial<Job>
  currentMilestone?: number
  rating?: number
  review?: string
  createdAt: string
  updatedAt: string
}

export interface Review {
  id: string
  contractId: string
  reviewerId: string
  revieweeId: string
  rating: number
  comment: string
  privateNote?: string
  skillRatings?: { skill: string; rating: number }[]
  createdAt: string
}

export interface ReviewRequest {
  contractId: string
  revieweeId: string
  rating: number
  comment: string
  skillRatings: { skill: string; rating: number }[]
  privateNote?: string
}

export interface CreateContractPayload {
  proposalId: string
  title: string
  description?: string
  milestones: { title: string; amount: number; dueDate?: string }[]
}

export interface ReviewPayload {
  contractId: string
  revieweeId: string
  rating: number
  comment: string
  skillRatings?: { skill: string; rating: number }[]
  privateNote?: string
}
