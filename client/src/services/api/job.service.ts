import { BaseService } from '@/services/http/base.service'
import type {
  Job,
  JobFilters,
  Proposal,
  CreateJobPayload,
  UpdateJobPayload,
  SavedJob,
  PaginatedResponse,
} from '@/types'

function optionalNumber(value: unknown): number | undefined {
  if (value === undefined || value === null || value === '') return undefined
  const n = typeof value === 'number' ? value : Number(value)
  return Number.isFinite(n) ? n : undefined
}

/** Nest `CreateJobDto` uses flat budget fields; client uses `type` + nested `budget`. */
function toCreateJobDtoBody(payload: CreateJobPayload): Record<string, unknown> {
  const body: Record<string, unknown> = {
    title: payload.title,
    description: payload.description,
    category: payload.category,
    skills: payload.skills ?? [],
    budgetType: payload.type,
    budgetMin: optionalNumber(payload.budget?.min),
    budgetMax: optionalNumber(payload.budget?.max),
    duration: payload.projectLength,
    experienceLevel: payload.experienceLevel,
  }
  if (payload.subcategory) body.subcategory = payload.subcategory
  if (payload.visibility) body.visibility = payload.visibility
  if (payload.location) body.location = payload.location
  if (payload.screeningQuestions?.length) {
    body.screeningQuestions = payload.screeningQuestions.map((q, i) => ({
      id: q.id ?? `sq-${i}`,
      question: q.question,
      required: q.required,
    }))
  }
  return body
}

function toUpdateJobDtoBody(payload: UpdateJobPayload): Record<string, unknown> {
  const body: Record<string, unknown> = {}
  if (payload.title !== undefined) body.title = payload.title
  if (payload.description !== undefined) body.description = payload.description
  if (payload.category !== undefined) body.category = payload.category
  if (payload.subcategory !== undefined) body.subcategory = payload.subcategory
  if (payload.skills !== undefined) body.skills = payload.skills
  if (payload.type !== undefined) body.budgetType = payload.type
  if (payload.budget !== undefined) {
    const min = optionalNumber(payload.budget.min)
    const max = optionalNumber(payload.budget.max)
    if (min !== undefined) body.budgetMin = min
    if (max !== undefined) body.budgetMax = max
    if (payload.budget.amount !== undefined) {
      const fixed = optionalNumber(payload.budget.amount)
      if (fixed !== undefined) body.budgetFixed = fixed
    }
  }
  if (payload.projectLength !== undefined) body.duration = payload.projectLength
  if (payload.experienceLevel !== undefined) body.experienceLevel = payload.experienceLevel
  if (payload.screeningQuestions !== undefined) {
    body.screeningQuestions = payload.screeningQuestions.map((q, i) => ({
      id: q.id ?? `sq-${i}`,
      question: q.question,
      required: q.required,
    }))
  }
  return body
}

class JobService extends BaseService {
  constructor() {
    super('/jobs')
  }

  getJobs(filters?: JobFilters) {
    return this.get<PaginatedResponse<Job>>('', { params: filters })
  }

  getJob(id: string) {
    return this.get<Job>(`/${id}`)
  }

  createJob(payload: CreateJobPayload) {
    return this.post<Job>('', toCreateJobDtoBody(payload))
  }

  updateJob(id: string, payload: UpdateJobPayload) {
    return this.put<Job>(`/${id}`, toUpdateJobDtoBody(payload))
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
