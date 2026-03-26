import { BaseService } from '@/services/http/base.service'
import type { Job, JobFilters, Proposal, CreateJobPayload, UpdateJobPayload, SavedJob } from '@/types'

class JobService extends BaseService {
  constructor() {
    super('/jobs')
  }

  getJobs(filters?: JobFilters) {
    return this.get<Job[]>('', { params: filters })
  }

  getJob(id: string) {
    return this.get<Job>(`/${id}`)
  }

  createJob(payload: CreateJobPayload) {
    return this.post<Job>('', payload)
  }

  updateJob(id: string, payload: UpdateJobPayload) {
    return this.put<Job>(`/${id}`, payload)
  }

  deleteJob(id: string) {
    return this.delete<void>(`/${id}`)
  }

  getJobProposals(jobId: string) {
    return this.get<Proposal[]>(`/${jobId}/proposals`)
  }

  closeJob(id: string) {
    return this.patch<Job>(`/${id}/close`)
  }

  pauseJob(id: string) {
    return this.patch<Job>(`/${id}/pause`)
  }

  reopenJob(id: string) {
    return this.patch<Job>(`/${id}/reopen`)
  }

  getRecommendedJobs() {
    return this.get<Job[]>('/recommendations')
  }

  getMyJobs(status?: string) {
    return this.get<Job[]>('/my-jobs', { params: { status } })
  }

  saveJob(jobId: string) {
    return this.post<void>(`/${jobId}/save`)
  }

  unsaveJob(jobId: string) {
    return this.delete<void>(`/${jobId}/save`)
  }

  getSavedJobs() {
    return this.get<SavedJob[]>('/saved')
  }

  inviteFreelancer(jobId: string, freelancerId: string, message?: string) {
    return this.post<void>(`/${jobId}/invite`, { freelancerId, message })
  }
}

export const jobService = new JobService()
