// ── Notifications ─────────────────────────────────────────────

export type NotificationType =
  | 'new_proposal'
  | 'proposal_accepted'
  | 'proposal_rejected'
  | 'contract_started'
  | 'milestone_submitted'
  | 'milestone_approved'
  | 'payment_received'
  | 'new_message'
  | 'review_received'
  | 'job_invite'
  | 'contract_completed'
  | 'dispute_opened'
  | 'system'
  // Shorthand aliases used in mock data
  | 'proposal'
  | 'contract'
  | 'message'
  | 'info'
  | 'warning'
  | 'success'

export interface AppNotification {
  id: string
  userId: string
  type: NotificationType
  title: string
  message: string
  link?: string
  isRead: boolean
  createdAt: string
}
