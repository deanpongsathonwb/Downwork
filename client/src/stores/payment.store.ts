import { defineStore } from 'pinia'
import { ref, computed } from 'vue'
import type {
  AccountBalance,
  EarningRecord,
  WithdrawalRecord,
  Transaction,
  WithdrawalPayload,
  AddFundsPayload,
} from '@/types'
import type { PaymentMethod } from '@/types'
import { paymentService } from '@/services/api/payment.service'
import { useToastStore } from './toast.store'
import { logger } from '@/utils/logger'

export const usePaymentStore = defineStore('payment', () => {
  const toast = useToastStore()

  const balance = ref<AccountBalance | null>(null)
  const earnings = ref<EarningRecord[]>([])
  const withdrawals = ref<WithdrawalRecord[]>([])
  const transactions = ref<Transaction[]>([])
  const paymentMethods = ref<PaymentMethod[]>([])
  const connectsBalance = ref(0)
  const isLoading = ref(false)
  const error = ref<string | null>(null)

  const availableBalance = computed(() => balance.value?.available ?? 0)
  const pendingAmount = computed(() => balance.value?.pending ?? 0)
  const inEscrow = computed(() => balance.value?.inEscrow ?? 0)
  const defaultPaymentMethod = computed(() => paymentMethods.value.find(m => m.isDefault) ?? null)

  async function fetchBalance(): Promise<void> {
    try {
      const res = await paymentService.getBalance()
      balance.value = res.data
    } catch (err) {
      logger.catch(err, 'PaymentStore.fetchBalance')
    }
  }

  async function fetchEarnings(params?: Record<string, unknown>): Promise<void> {
    isLoading.value = true
    error.value = null
    try {
      const res = await paymentService.getEarnings(params)
      earnings.value = res.data
    } catch (err) {
      logger.catch(err, 'PaymentStore.fetchEarnings')
      error.value = 'Failed to load earnings.'
    } finally {
      isLoading.value = false
    }
  }

  async function fetchWithdrawals(): Promise<void> {
    try {
      const res = await paymentService.getWithdrawals()
      withdrawals.value = res.data
    } catch (err) {
      logger.catch(err, 'PaymentStore.fetchWithdrawals')
    }
  }

  async function fetchTransactions(params?: Record<string, unknown>): Promise<void> {
    isLoading.value = true
    try {
      const res = await paymentService.getTransactions(params)
      transactions.value = res.data
    } catch (err) {
      logger.catch(err, 'PaymentStore.fetchTransactions')
      error.value = 'Failed to load transactions.'
    } finally {
      isLoading.value = false
    }
  }

  async function requestWithdrawal(payload: WithdrawalPayload): Promise<boolean> {
    try {
      const res = await paymentService.requestWithdrawal(payload)
      withdrawals.value.unshift(res.data)
      toast.success('Withdrawal Requested', 'Your withdrawal is being processed.')
      await fetchBalance()
      return true
    } catch (err) {
      logger.catch(err, 'PaymentStore.requestWithdrawal')
      toast.error('Failed', 'Could not process withdrawal.')
      return false
    }
  }

  async function fetchPaymentMethods(): Promise<void> {
    try {
      const res = await paymentService.getPaymentMethods()
      paymentMethods.value = res.data
    } catch (err) {
      logger.catch(err, 'PaymentStore.fetchPaymentMethods')
    }
  }

  async function addPaymentMethod(payload: Partial<PaymentMethod>): Promise<boolean> {
    try {
      const res = await paymentService.addPaymentMethod(payload)
      paymentMethods.value.push(res.data)
      toast.success('Payment Method Added')
      return true
    } catch (err) {
      logger.catch(err, 'PaymentStore.addPaymentMethod')
      toast.error('Failed', 'Could not add payment method.')
      return false
    }
  }

  async function removePaymentMethod(id: string): Promise<void> {
    try {
      await paymentService.removePaymentMethod(id)
      paymentMethods.value = paymentMethods.value.filter(m => m.id !== id)
      toast.success('Payment Method Removed')
    } catch (err) {
      logger.catch(err, 'PaymentStore.removePaymentMethod')
      toast.error('Failed', 'Could not remove payment method.')
    }
  }

  async function addFunds(payload: AddFundsPayload): Promise<boolean> {
    try {
      await paymentService.addFunds(payload)
      toast.success('Funds Added', `$${payload.amount} has been added to your balance.`)
      await fetchBalance()
      return true
    } catch (err) {
      logger.catch(err, 'PaymentStore.addFunds')
      toast.error('Failed', 'Could not add funds.')
      return false
    }
  }

  async function fetchConnectsBalance(): Promise<void> {
    try {
      const res = await paymentService.getConnectsBalance()
      connectsBalance.value = res.data.balance
    } catch (err) {
      logger.catch(err, 'PaymentStore.fetchConnectsBalance')
    }
  }

  async function buyConnects(packageId: string): Promise<boolean> {
    try {
      const res = await paymentService.buyConnects(packageId)
      connectsBalance.value = res.data.balance
      toast.success('Connects Purchased!')
      return true
    } catch (err) {
      logger.catch(err, 'PaymentStore.buyConnects')
      toast.error('Failed', 'Could not purchase connects.')
      return false
    }
  }

  return {
    balance,
    earnings,
    withdrawals,
    transactions,
    paymentMethods,
    connectsBalance,
    isLoading,
    error,
    availableBalance,
    pendingAmount,
    inEscrow,
    defaultPaymentMethod,
    fetchBalance,
    fetchEarnings,
    fetchWithdrawals,
    fetchTransactions,
    requestWithdrawal,
    fetchPaymentMethods,
    addPaymentMethod,
    removePaymentMethod,
    addFunds,
    fetchConnectsBalance,
    buyConnects,
  }
})
