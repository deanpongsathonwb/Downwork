import type { Job } from './job.types'
import type { ContractMilestone } from './contract.types'
import type { User } from './user.types'

// ── Proposal ─────────────────────────────────────────────────

export interface ProposalAnswer {
  questionId: string
  answer: string
}

export type ProposalStatus =
  | 'pending'
  | 'submitted'
  | 'viewed'
  | 'shortlisted'
  | 'accepted'
  | 'rejected'
  | 'withdrawn'

export interface Proposal {
  id: string
  jobId: string
  /** Populated job (optional) */
  job?: Partial<Job>
  freelancerId: string
  /** Populated freelancer user (optional) */
  freelancer?: Partial<User>
  coverLetter: string
  bidAmount: number
  /** Bid payment type label */
  bidType?: string
  estimatedDuration: string
  attachments?: string[]
  answers?: ProposalAnswer[]
  status: ProposalStatus
  /** Whether the proposal has been shortlisted by the client */
  isShortlisted?: boolean
  /** Proposed milestones (for milestone-based projects) */
  milestones?: Partial<ContractMilestone>[]
  connectsUsed?: number
  submittedAt?: string
  createdAt?: string
  updatedAt: string
}

export interface SubmitProposalPayload {
  jobId: string
  coverLetter: string
  bidAmount: number
  bidType: 'fixed' | 'hourly'
  estimatedDuration: string
  milestones?: { title: string; amount: number; dueDate?: string }[]
  answers?: ProposalAnswer[]
  attachments?: File[]
}
