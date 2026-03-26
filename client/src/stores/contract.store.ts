import { defineStore } from 'pinia'
import { ref, computed } from 'vue'
import type { Contract, Milestone, Review, CreateContractPayload, ReviewPayload } from '@/types'
import { contractService } from '@/services/api/contract.service'
import { useToastStore } from './toast.store'
import { logger } from '@/utils/logger'

export const useContractStore = defineStore('contract', () => {
  const toast = useToastStore()

  const contracts = ref<Contract[]>([])
  const selectedContract = ref<Contract | null>(null)
  const isLoading = ref(false)
  const isLoadingDetail = ref(false)
  const error = ref<string | null>(null)

  const activeContracts = computed(() => contracts.value.filter(c => c.status === 'active'))
  const completedContracts = computed(() => contracts.value.filter(c => c.status === 'completed'))
  const disputedContracts = computed(() => contracts.value.filter(c => c.status === 'disputed'))

  async function fetchContracts(status?: string): Promise<void> {
    isLoading.value = true
    error.value = null
    try {
      const res = await contractService.getContracts(status)
      contracts.value = res.data
    } catch (err) {
      logger.catch(err, 'ContractStore.fetchContracts')
      error.value = 'Failed to load contracts.'
    } finally {
      isLoading.value = false
    }
  }

  async function fetchContract(id: string): Promise<void> {
    isLoadingDetail.value = true
    try {
      const res = await contractService.getContract(id)
      selectedContract.value = res.data
    } catch (err) {
      logger.catch(err, 'ContractStore.fetchContract')
      toast.error('Error', 'Could not load contract details.')
    } finally {
      isLoadingDetail.value = false
    }
  }

  async function createContract(payload: CreateContractPayload): Promise<Contract | null> {
    isLoading.value = true
    try {
      const res = await contractService.createContract(payload)
      contracts.value.unshift(res.data)
      toast.success('Contract Created!', 'The contract is now active.')
      return res.data
    } catch (err) {
      logger.catch(err, 'ContractStore.createContract')
      toast.error('Failed', 'Could not create contract.')
      return null
    } finally {
      isLoading.value = false
    }
  }

  async function submitMilestone(contractId: string, milestoneId: string, note?: string): Promise<boolean> {
    try {
      const res = await contractService.submitMilestone(contractId, milestoneId, note)
      _updateMilestone(contractId, milestoneId, res.data)
      toast.success('Milestone Submitted', 'Waiting for client approval.')
      return true
    } catch (err) {
      logger.catch(err, 'ContractStore.submitMilestone')
      toast.error('Failed', 'Could not submit milestone.')
      return false
    }
  }

  async function approveMilestone(contractId: string, milestoneId: string): Promise<boolean> {
    try {
      const res = await contractService.approveMilestone(contractId, milestoneId)
      _updateMilestone(contractId, milestoneId, res.data)
      toast.success('Milestone Approved', 'Payment has been released.')
      return true
    } catch (err) {
      logger.catch(err, 'ContractStore.approveMilestone')
      toast.error('Failed', 'Could not approve milestone.')
      return false
    }
  }

  async function requestRevision(contractId: string, milestoneId: string, reason: string): Promise<boolean> {
    try {
      const res = await contractService.requestRevision(contractId, milestoneId, reason)
      _updateMilestone(contractId, milestoneId, res.data)
      toast.info('Revision Requested', 'The freelancer has been notified.')
      return true
    } catch (err) {
      logger.catch(err, 'ContractStore.requestRevision')
      toast.error('Failed', 'Could not request revision.')
      return false
    }
  }

  async function fundMilestone(contractId: string, milestoneId: string): Promise<boolean> {
    try {
      const res = await contractService.fundMilestone(contractId, milestoneId)
      _updateMilestone(contractId, milestoneId, res.data)
      toast.success('Milestone Funded', 'Funds are now in escrow.')
      return true
    } catch (err) {
      logger.catch(err, 'ContractStore.fundMilestone')
      toast.error('Failed', 'Could not fund milestone.')
      return false
    }
  }

  async function releaseMilestone(contractId: string, milestoneId: string): Promise<boolean> {
    try {
      const res = await contractService.releaseMilestone(contractId, milestoneId)
      _updateMilestone(contractId, milestoneId, res.data)
      toast.success('Payment Released')
      return true
    } catch (err) {
      logger.catch(err, 'ContractStore.releaseMilestone')
      toast.error('Failed', 'Could not release payment.')
      return false
    }
  }

  async function addMilestone(contractId: string, milestone: { title: string; amount: number; dueDate?: string; description?: string }): Promise<boolean> {
    try {
      const res = await contractService.addMilestone(contractId, milestone)
      if (selectedContract.value?.id === contractId) {
        selectedContract.value.milestones.push(res.data)
      }
      toast.success('Milestone Added')
      return true
    } catch (err) {
      logger.catch(err, 'ContractStore.addMilestone')
      toast.error('Failed', 'Could not add milestone.')
      return false
    }
  }

  async function openDispute(contractId: string, reason: string, description: string): Promise<boolean> {
    try {
      await contractService.openDispute(contractId, reason, description)
      const c = contracts.value.find(c => c.id === contractId)
      if (c) c.status = 'disputed'
      if (selectedContract.value?.id === contractId) selectedContract.value.status = 'disputed'
      toast.warning('Dispute Opened', 'Our team will review this case.')
      return true
    } catch (err) {
      logger.catch(err, 'ContractStore.openDispute')
      toast.error('Failed', 'Could not open dispute.')
      return false
    }
  }

  async function leaveReview(contractId: string, payload: ReviewPayload): Promise<Review | null> {
    try {
      const res = await contractService.leaveReview(contractId, payload)
      toast.success('Review Submitted', 'Thank you for your feedback!')
      return res.data
    } catch (err) {
      logger.catch(err, 'ContractStore.leaveReview')
      toast.error('Failed', 'Could not submit review.')
      return null
    }
  }

  async function endContract(contractId: string): Promise<boolean> {
    try {
      const res = await contractService.endContract(contractId)
      const idx = contracts.value.findIndex(c => c.id === contractId)
      if (idx !== -1) contracts.value[idx] = res.data
      if (selectedContract.value?.id === contractId) selectedContract.value = res.data
      toast.success('Contract Ended')
      return true
    } catch (err) {
      logger.catch(err, 'ContractStore.endContract')
      toast.error('Failed', 'Could not end contract.')
      return false
    }
  }

  function _updateMilestone(contractId: string, milestoneId: string, updated: Milestone): void {
    const contract = selectedContract.value?.id === contractId
      ? selectedContract.value
      : contracts.value.find(c => c.id === contractId)
    if (!contract) return
    const idx = contract.milestones.findIndex(m => m.id === milestoneId)
    if (idx !== -1) contract.milestones[idx] = updated
  }

  return {
    contracts,
    selectedContract,
    isLoading,
    isLoadingDetail,
    error,
    activeContracts,
    completedContracts,
    disputedContracts,
    fetchContracts,
    fetchContract,
    createContract,
    submitMilestone,
    approveMilestone,
    requestRevision,
    fundMilestone,
    releaseMilestone,
    addMilestone,
    openDispute,
    leaveReview,
    endContract,
  }
})
