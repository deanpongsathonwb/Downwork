import { ref } from 'vue'
import { createSharedComposable } from '@vueuse/core'
import { useToastStore } from '@/stores/toast.store'
import { PAYMENT_METHOD_OPTIONS } from '@/constants/settings'
import type { PaymentMethod } from '@/types'

const INITIAL_METHODS: PaymentMethod[] = [
  { id: 'm1', type: 'bank_transfer', label: 'Chase Bank', details: '****4521', isDefault: true, addedAt: '' },
  { id: 'm2', type: 'paypal', label: 'PayPal', details: 'alex@example.com', isDefault: false, addedAt: '' },
]

function _usePaymentMethods() {
  const toast = useToastStore()
  const paymentMethods = ref<PaymentMethod[]>(INITIAL_METHODS.map((m) => ({ ...m })))

  /** Returns the emoji icon for a given payment method type or label string */
  function methodIcon(typeOrLabel: string): string {
    const lower = typeOrLabel.toLowerCase()
    if (lower.includes('bank') || lower === 'bank_transfer') return '🏦'
    if (lower === 'paypal') return '🅿️'
    if (lower === 'payoneer') return '💳'
    if (lower === 'wise') return '💸'
    return '💰'
  }

  function setDefault(id: string): void {
    paymentMethods.value.forEach((m) => (m.isDefault = m.id === id))
    toast.success('Default Payment Method Updated')
  }

  function removeMethod(id: string): void {
    paymentMethods.value = paymentMethods.value.filter((m) => m.id !== id)
    toast.info('Payment Method Removed')
  }

  function addMethod(newMethod: {
    type: string
    email?: string
    accountName?: string
    accountNumber?: string
    routingNumber?: string
  }): void {
    if (!newMethod.type) return
    const isFirst = paymentMethods.value.length === 0
    paymentMethods.value.push({
      id: Date.now().toString(),
      type: newMethod.type as PaymentMethod['type'],
      label:
        newMethod.type === 'bank_transfer'
          ? `Bank ****${newMethod.accountNumber?.slice(-4) ?? '0000'}`
          : PAYMENT_METHOD_OPTIONS.find((m) => m.value === newMethod.type)?.label ?? newMethod.type,
      details:
        newMethod.email ||
        (newMethod.accountNumber ? `****${newMethod.accountNumber.slice(-4)}` : ''),
      isDefault: isFirst,
      addedAt: new Date().toISOString(),
    })
    toast.success('Payment Method Added!')
  }

  return {
    paymentMethods,
    methodOptions: PAYMENT_METHOD_OPTIONS,
    methodIcon,
    setDefault,
    removeMethod,
    addMethod,
  }
}

export const usePaymentMethods = createSharedComposable(_usePaymentMethods)
