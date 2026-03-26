import { BaseService } from '@/services/http/base.service'
import type { Invitation } from '@/types'

class InvitationService extends BaseService {
  constructor() {
    super('/invitations')
  }

  send(jobId: string, freelancerId: string, message?: string) {
    return this.post<Invitation>('', { jobId, freelancerId, message })
  }

  getReceived() {
    return this.get<Invitation[]>('/received')
  }

  getSentForJob(jobId: string) {
    return this.get<Invitation[]>(`/job/${jobId}`)
  }

  accept(id: string) {
    return this.patch<void>(`/${id}/accept`)
  }

  decline(id: string) {
    return this.patch<void>(`/${id}/decline`)
  }
}

export const invitationService = new InvitationService()
