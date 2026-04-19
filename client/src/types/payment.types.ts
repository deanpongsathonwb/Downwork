// ── Payments & Earnings ───────────────────────────────────────

export type EarningStatus = 'available' | 'pending' | 'in_review' | 'paid' | 'withdrawn' | 'held'
export type WithdrawalStatus = 'requested' | 'processing' | 'completed' | 'failed' | 'cancelled'
export type TransactionType = 'milestone' | 'hourly' | 'bonus' | 'refund'
export type PaymentStatus = 'pending' | 'processing' | 'completed' | 'failed' | 'refunded'

export interface EarningRecord {
  id: string
  contractId: string
  jobTitle: string
  clientName: string
  amount: number
  currency: string
  status: EarningStatus
  type: TransactionType
  date: string
}

export interface WithdrawalRecord {
  id: string
  amount: number
  currency: string
  method: string
  status: WithdrawalStatus
  requestedAt: string
  completedAt?: string
}

export interface Transaction {
  id: string
  contractId?: string
  milestoneId?: string
  fromId: string
  toId: string
  amount: number
  currency: string
  platformFee: number
  status: PaymentStatus
  type: TransactionType
  reference?: string
  createdAt: string
  completedAt?: string
}

export interface AccountBalance {
  available: number
  pending: number
  inEscrow: number
  currency: string
}

export interface WithdrawalPayload {
  amount: number
  methodId: string
  currency?: string
}

export interface AddFundsPayload {
  amount: number
  paymentMethodId: string
}

export interface ConnectsPackage {
  id: string
  amount: number
  price: number
  bonus?: number
}

/** GET /payments/connects */
export interface ConnectsBalanceResponse {
  balance: number
  /** Sum of connectsUsed on proposals this calendar month */
  usedThisMonth: number
  /** Proposals submitted this calendar month */
  applicationsThisMonth: number
  recentPurchases: { id: string; description: string; createdAt: string }[]
}
