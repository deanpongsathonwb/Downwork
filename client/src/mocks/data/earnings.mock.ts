import type { EarningRecord, WithdrawalRecord } from '@/types'

// ============================================================
// MOCK EARNINGS & WITHDRAWAL DATA
// ============================================================

export const MOCK_EARNINGS: EarningRecord[] = [
  {
    id: 'earn-001',
    contractId: 'contract-001',
    jobTitle: 'SaaS Dashboard Development',
    clientName: 'Sarah Johnson',
    amount: 500,
    currency: 'USD',
    status: 'available',
    type: 'milestone',
    date: new Date(Date.now() - 12 * 24 * 60 * 60 * 1000).toISOString(),
  },
  {
    id: 'earn-002',
    contractId: 'contract-002',
    jobTitle: 'Django REST API Development',
    clientName: 'Anna Williams',
    amount: 2600,
    currency: 'USD',
    status: 'available',
    type: 'hourly',
    date: new Date(Date.now() - 10 * 24 * 60 * 60 * 1000).toISOString(),
  },
  {
    id: 'earn-003',
    contractId: 'contract-002',
    jobTitle: 'Django REST API Development',
    clientName: 'Anna Williams',
    amount: 1600,
    currency: 'USD',
    status: 'withdrawn',
    type: 'hourly',
    date: new Date(Date.now() - 20 * 24 * 60 * 60 * 1000).toISOString(),
  },
  {
    id: 'earn-004',
    contractId: 'contract-001',
    jobTitle: 'SaaS Dashboard Development',
    clientName: 'Sarah Johnson',
    amount: 150,
    currency: 'USD',
    status: 'held',
    type: 'bonus',
    date: new Date(Date.now() - 5 * 24 * 60 * 60 * 1000).toISOString(),
  },
  {
    id: 'earn-005',
    contractId: 'contract-003',
    jobTitle: 'FinTech UI/UX Redesign',
    clientName: 'Emily Rodriguez',
    amount: 1600,
    currency: 'USD',
    status: 'pending',
    type: 'milestone',
    date: new Date(Date.now() - 2 * 24 * 60 * 60 * 1000).toISOString(),
  },
]

export const MOCK_WITHDRAWALS: WithdrawalRecord[] = [
  {
    id: 'withdraw-001',
    amount: 1600,
    currency: 'USD',
    method: 'Bank Transfer',
    status: 'completed',
    requestedAt: new Date(Date.now() - 22 * 24 * 60 * 60 * 1000).toISOString(),
    completedAt: new Date(Date.now() - 19 * 24 * 60 * 60 * 1000).toISOString(),
  },
  {
    id: 'withdraw-002',
    amount: 500,
    currency: 'USD',
    method: 'PayPal',
    status: 'processing',
    requestedAt: new Date(Date.now() - 2 * 24 * 60 * 60 * 1000).toISOString(),
  },
]
