import { BaseService } from '@/services/http/base.service'
import type { Contract, Milestone, Review, CreateContractPayload, ReviewPayload } from '@/types'

class ContractService extends BaseService {
  constructor() {
    super('/contracts')
  }

  getContracts(status?: string) {
    return this.get<Contract[]>('', { params: { status } })
  }

  getContract(id: string) {
    return this.get<Contract>(`/${id}`)
  }

  createContract(payload: CreateContractPayload) {
    return this.post<Contract>('', payload)
  }

  approveMilestone(contractId: string, milestoneId: string) {
    return this.patch<Milestone>(`/${contractId}/milestones/${milestoneId}/approve`)
  }

  submitMilestone(contractId: string, milestoneId: string, note?: string) {
    return this.patch<Milestone>(`/${contractId}/milestones/${milestoneId}/submit`, { note })
  }

  requestRevision(contractId: string, milestoneId: string, reason: string) {
    return this.patch<Milestone>(`/${contractId}/milestones/${milestoneId}/revise`, { reason })
  }

  fundMilestone(contractId: string, milestoneId: string) {
    return this.patch<Milestone>(`/${contractId}/milestones/${milestoneId}/fund`)
  }

  releaseMilestone(contractId: string, milestoneId: string) {
    return this.patch<Milestone>(`/${contractId}/milestones/${milestoneId}/release`)
  }

  addMilestone(contractId: string, milestone: { title: string; amount: number; dueDate?: string; description?: string }) {
    return this.post<Milestone>(`/${contractId}/milestones`, milestone)
  }

  updateMilestone(contractId: string, milestoneId: string, payload: Partial<Milestone>) {
    return this.put<Milestone>(`/${contractId}/milestones/${milestoneId}`, payload)
  }

  deleteMilestone(contractId: string, milestoneId: string) {
    return this.delete<void>(`/${contractId}/milestones/${milestoneId}`)
  }

  openDispute(contractId: string, reason: string, description: string) {
    return this.post<void>(`/${contractId}/dispute`, { reason, description })
  }

  leaveReview(contractId: string, payload: ReviewPayload) {
    return this.post<Review>(`/${contractId}/review`, payload)
  }

  endContract(contractId: string) {
    return this.patch<Contract>(`/${contractId}/end`)
  }

  pauseContract(contractId: string) {
    return this.patch<Contract>(`/${contractId}/pause`)
  }

  resumeContract(contractId: string) {
    return this.patch<Contract>(`/${contractId}/resume`)
  }
}

export const contractService = new ContractService()
