import type { JobStatus, ContractStatus, MilestoneStatus, ProposalStatus, DisputeStatus } from '@/types'

export const JOB_STATUS_LABELS: Record<JobStatus, string> = {
  draft: 'Draft',
  open: 'Open',
  in_progress: 'In Progress',
  completed: 'Completed',
  cancelled: 'Cancelled',
  paused: 'Paused',
  closed: 'Closed',
}

export const CONTRACT_STATUS_LABELS: Record<ContractStatus, string> = {
  pending: 'Pending',
  active: 'Active',
  paused: 'Paused',
  completed: 'Completed',
  disputed: 'Disputed',
  cancelled: 'Cancelled',
}

export const MILESTONE_STATUS_LABELS: Record<MilestoneStatus, string> = {
  pending: 'Pending',
  funded: 'Funded',
  in_progress: 'In Progress',
  submitted: 'Submitted',
  approved: 'Approved',
  released: 'Released',
  disputed: 'Disputed',
  rejected: 'Rejected',
}

export const PROPOSAL_STATUS_LABELS: Record<ProposalStatus, string> = {
  pending: 'Pending',
  submitted: 'Submitted',
  viewed: 'Viewed',
  shortlisted: 'Shortlisted',
  accepted: 'Accepted',
  rejected: 'Rejected',
  withdrawn: 'Withdrawn',
}

export const DISPUTE_STATUS_LABELS: Record<DisputeStatus, string> = {
  open: 'Open',
  under_review: 'Under Review',
  resolved: 'Resolved',
  escalated: 'Escalated',
  closed: 'Closed',
}
