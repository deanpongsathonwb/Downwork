import { BaseService } from '@/services/http/base.service'
import type {
  AccountBalance,
  EarningRecord,
  WithdrawalRecord,
  Transaction,
  WithdrawalPayload,
  AddFundsPayload,
  ConnectsPackage,
  ConnectsBalanceResponse,
} from '@/types'
import type { PaymentMethod } from '@/types'

class PaymentService extends BaseService {
  constructor() {
    super('/payments')
  }

  getBalance() {
    return this.get<AccountBalance>('/balance')
  }

  getEarnings(params?: Record<string, unknown>) {
    return this.get<EarningRecord[]>('/earnings', { params })
  }

  getTransactions(params?: Record<string, unknown>) {
    return this.get<Transaction[]>('/transactions', { params })
  }

  requestWithdrawal(payload: WithdrawalPayload) {
    return this.post<WithdrawalRecord>('/withdrawals', payload)
  }

  getWithdrawals() {
    return this.get<WithdrawalRecord[]>('/withdrawals')
  }

  getPaymentMethods() {
    return this.get<PaymentMethod[]>('/methods')
  }

  addPaymentMethod(payload: Partial<PaymentMethod>) {
    return this.post<PaymentMethod>('/methods', payload)
  }

  removePaymentMethod(id: string) {
    return this.delete<void>(`/methods/${id}`)
  }

  setDefaultPaymentMethod(id: string) {
    return this.patch<void>(`/methods/${id}/default`)
  }

  addFunds(payload: AddFundsPayload) {
    return this.post<Transaction>('/add-funds', payload)
  }

  getConnectsBalance() {
    return this.get<ConnectsBalanceResponse>('/connects')
  }

  buyConnects(packageId: string) {
    return this.post<{ balance: number }>('/connects/buy', { packageId })
  }

  getConnectsPackages() {
    return this.get<ConnectsPackage[]>('/connects/packages')
  }

  downloadInvoice(transactionId: string) {
    return this.get<Blob>(`/transactions/${transactionId}/invoice`, {
      responseType: 'blob',
    })
  }
}

export const paymentService = new PaymentService()
