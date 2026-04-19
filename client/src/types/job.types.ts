import type { Skill, User } from './user.types'

export interface FileAttachment {
  id?: string
  name: string
  url: string
  size?: number
  type?: string
}

export interface ScreeningQuestion {
  id: string
  question: string
  required: boolean
}

// ── Job ──────────────────────────────────────────────────────

export type JobStatus =
  | 'draft'
  | 'pending_verification'
  | 'open'
  | 'in_progress'
  | 'completed'
  | 'cancelled'
  | 'paused'
  | 'closed'
export type JobType = 'fixed' | 'hourly'
export type ExperienceLevel = 'entry' | 'intermediate' | 'expert'

export interface JobBudget {
  type: JobType
  /** Fixed project amount */
  amount?: number
  /** Hourly range – minimum */
  min?: number
  /** Hourly range – maximum */
  max?: number
  currency: string
}

export interface Job {
  id: string
  clientId: string
  /** Populated client user (optional, present when fetched with relations) */
  client?: Partial<User>
  title: string
  description: string
  category: string
  subcategory?: string
  skills: Skill[]
  budget: JobBudget
  /** Top-level job type alias (mirrors budget.type) for convenience */
  type?: JobType
  experienceLevel: ExperienceLevel
  duration?: string
  /** Whether the position is remote */
  isRemote?: boolean
  visibility?: 'public' | 'invite_only'
  status: JobStatus
  proposalCount?: number
  viewCount?: number
  savedCount?: number
  tags?: string[]
  attachments?: FileAttachment[]
  screeningQuestions?: ScreeningQuestion[]
  /** Number of Connects needed to apply */
  connectsRequired?: number
  /** Match score (0-100) for personalized ranking */
  matchScore?: number
  /** Project length descriptor */
  projectLength?: string
  createdAt: string
  updatedAt: string
  deadline?: string
}

export interface JobFilters {
  search?: string
  category?: string
  /** Filter by job type ('fixed' | 'hourly') */
  type?: string
  jobType?: string
  experienceLevel?: string
  budgetMin?: number
  budgetMax?: number
  sortBy?: string
  page?: number
  limit?: number
}

export interface CreateJobPayload {
  title: string
  description: string
  category: string
  subcategory?: string
  type: JobType
  budget: JobBudget
  skills: string[]
  experienceLevel: ExperienceLevel
  projectLength?: string
  visibility?: 'public' | 'invite_only' | 'private'
  /** Maps to API `location` (e.g. "Remote") */
  location?: string
  screeningQuestions?: ScreeningQuestion[]
  attachments?: File[]
}

export interface UpdateJobPayload extends Partial<CreateJobPayload> {
  status?: JobStatus
}
