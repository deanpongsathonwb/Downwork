import { defineStore } from 'pinia'
import { ref, computed } from 'vue'
import type { Proposal, SubmitProposalPayload } from '@/types'
import { proposalService } from '@/services/api/proposal.service'
import { useToastStore } from './toast.store'
import { logger } from '@/utils/logger'

export const useProposalStore = defineStore('proposal', () => {
  const toast = useToastStore()

  const proposals = ref<Proposal[]>([])
  const selectedProposal = ref<Proposal | null>(null)
  const isLoading = ref(false)
  const isSubmitting = ref(false)
  const error = ref<string | null>(null)

  const pendingProposals = computed(() => proposals.value.filter(p => ['pending', 'submitted'].includes(p.status)))
  const activeProposals = computed(() => proposals.value.filter(p => ['viewed', 'shortlisted'].includes(p.status)))
  const acceptedProposals = computed(() => proposals.value.filter(p => p.status === 'accepted'))

  async function fetchMyProposals(status?: string): Promise<void> {
    isLoading.value = true
    error.value = null
    try {
      const res = await proposalService.getMyProposals(status)
      proposals.value = res.data
    } catch (err) {
      logger.catch(err, 'ProposalStore.fetchMyProposals')
      error.value = 'Failed to load proposals.'
    } finally {
      isLoading.value = false
    }
  }

  async function fetchProposal(id: string): Promise<void> {
    isLoading.value = true
    try {
      const res = await proposalService.getProposal(id)
      selectedProposal.value = res.data
    } catch (err) {
      logger.catch(err, 'ProposalStore.fetchProposal')
      toast.error('Error', 'Could not load proposal details.')
    } finally {
      isLoading.value = false
    }
  }

  async function submitProposal(payload: SubmitProposalPayload): Promise<Proposal | null> {
    isSubmitting.value = true
    try {
      const res = await proposalService.submit(payload)
      proposals.value.unshift(res.data)
      toast.success('Proposal Submitted!', 'Your proposal has been sent to the client.')
      return res.data
    } catch (err) {
      logger.catch(err, 'ProposalStore.submitProposal')
      toast.error('Submission Failed', 'Could not submit your proposal. Please try again.')
      return null
    } finally {
      isSubmitting.value = false
    }
  }

  async function withdrawProposal(id: string): Promise<boolean> {
    try {
      await proposalService.withdraw(id)
      const idx = proposals.value.findIndex(p => p.id === id)
      if (idx !== -1) proposals.value[idx].status = 'withdrawn'
      toast.success('Proposal Withdrawn')
      return true
    } catch (err) {
      logger.catch(err, 'ProposalStore.withdrawProposal')
      toast.error('Failed', 'Could not withdraw proposal.')
      return false
    }
  }

  async function acceptProposal(id: string): Promise<boolean> {
    try {
      const res = await proposalService.accept(id)
      const idx = proposals.value.findIndex(p => p.id === id)
      if (idx !== -1) proposals.value[idx] = res.data
      toast.success('Proposal Accepted!', 'A contract will be created.')
      return true
    } catch (err) {
      logger.catch(err, 'ProposalStore.acceptProposal')
      toast.error('Failed', 'Could not accept proposal.')
      return false
    }
  }

  async function rejectProposal(id: string): Promise<boolean> {
    try {
      await proposalService.reject(id)
      const idx = proposals.value.findIndex(p => p.id === id)
      if (idx !== -1) proposals.value[idx].status = 'rejected'
      toast.success('Proposal Declined')
      return true
    } catch (err) {
      logger.catch(err, 'ProposalStore.rejectProposal')
      toast.error('Failed', 'Could not decline proposal.')
      return false
    }
  }

  async function shortlistProposal(id: string): Promise<void> {
    try {
      await proposalService.shortlist(id)
      const p = proposals.value.find(p => p.id === id)
      if (p) {
        p.isShortlisted = !p.isShortlisted
        p.status = p.isShortlisted ? 'shortlisted' : 'submitted'
      }
    } catch (err) {
      logger.catch(err, 'ProposalStore.shortlistProposal')
    }
  }

  return {
    proposals,
    selectedProposal,
    isLoading,
    isSubmitting,
    error,
    pendingProposals,
    activeProposals,
    acceptedProposals,
    fetchMyProposals,
    fetchProposal,
    submitProposal,
    withdrawProposal,
    acceptProposal,
    rejectProposal,
    shortlistProposal,
  }
})
