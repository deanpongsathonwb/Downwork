import { BaseService } from '@/services/http/base.service'
import type { Proposal, SubmitProposalPayload } from '@/types'

class ProposalService extends BaseService {
  constructor() {
    super('/proposals')
  }

  submit(payload: SubmitProposalPayload) {
    return this.post<Proposal>('', payload)
  }

  getMyProposals(status?: string) {
    return this.get<Proposal[]>('', { params: { status } })
  }

  getProposal(id: string) {
    return this.get<Proposal>(`/${id}`)
  }

  updateProposal(id: string, payload: Partial<SubmitProposalPayload>) {
    return this.put<Proposal>(`/${id}`, payload)
  }

  withdraw(id: string) {
    return this.delete<void>(`/${id}`)
  }

  accept(id: string) {
    return this.patch<Proposal>(`/${id}/accept`)
  }

  reject(id: string) {
    return this.patch<Proposal>(`/${id}/reject`)
  }

  shortlist(id: string) {
    return this.patch<Proposal>(`/${id}/shortlist`)
  }
}

export const proposalService = new ProposalService()
