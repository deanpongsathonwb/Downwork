import { defineStore } from 'pinia'
import { ref, computed } from 'vue'
import type {
  Job,
  JobFilters,
  PaginationMeta,
  CreateJobPayload,
  UpdateJobPayload,
  SavedJob,
  PaginatedResponse,
} from '@/types'
import { jobService } from '@/services/api/job.service'
import { useToastStore } from './toast.store'
import { logger } from '@/utils/logger'

/** Unwrap list + meta when the API wraps a paginated body inside TransformInterceptor’s `data`. */
function jobsListFromFetchResponse(res: {
  data: Job[] | PaginatedResponse<Job>
  meta?: PaginationMeta | null
}): { list: Job[]; meta: PaginationMeta | null } {
  const payload = res.data
  if (Array.isArray(payload)) {
    return { list: payload, meta: res.meta ?? null }
  }
  const meta = payload.meta
  const normalizedMeta: PaginationMeta | null = meta
    ? {
        page: meta.page,
        limit: meta.limit,
        total: meta.total,
        totalPages: meta.totalPages,
        hasNextPage: meta.hasNextPage ?? (meta as PaginationMeta & { hasMore?: boolean }).hasMore,
        hasPrevPage: meta.hasPrevPage,
      }
    : null
  return { list: payload.data, meta: normalizedMeta }
}

// ============================================================
// JOB STORE — Pinia Composition API
// ============================================================

export const useJobStore = defineStore('job', () => {
  const toast = useToastStore()

  // ── STATE ────────────────────────────────────────────────
  const jobs = ref<Job[]>([])
  const selectedJob = ref<Job | null>(null)
  const recommendedJobs = ref<Job[]>([])
  const filters = ref<JobFilters>({ page: 1, limit: 12 })
  const pagination = ref<PaginationMeta | null>(null)
  const isLoading = ref(false)
  const isLoadingDetail = ref(false)
  const error = ref<string | null>(null)

  // ── GETTERS ──────────────────────────────────────────────
  const hasMore = computed(() => pagination.value?.hasNextPage ?? false)
  const totalJobs = computed(() => pagination.value?.total ?? 0)
  const openJobs = computed(() => jobs.value.filter((j) => j.status === 'open'))

  // ── ACTIONS ──────────────────────────────────────────────

  async function fetchJobs(newFilters?: Partial<JobFilters>, append = false): Promise<void> {
    if (newFilters) filters.value = { ...filters.value, ...newFilters }
    isLoading.value = true
    error.value = null
    try {
      const res = await jobService.getJobs(filters.value)
      const { list, meta } = jobsListFromFetchResponse(res)
      jobs.value = append ? [...jobs.value, ...list] : list
      pagination.value = meta
    } catch (err) {
      logger.catch(err, 'JobStore.fetchJobs')
      error.value = 'Failed to load jobs.'
    } finally {
      isLoading.value = false
    }
  }

  async function fetchJob(id: string): Promise<void> {
    isLoadingDetail.value = true
    try {
      const res = await jobService.getJob(id)
      selectedJob.value = res.data
    } catch (err) {
      logger.catch(err, 'JobStore.fetchJob')
      toast.error('Job Not Found', 'This job may have been removed.')
    } finally {
      isLoadingDetail.value = false
    }
  }

  async function fetchRecommended(): Promise<void> {
    try {
      const res = await jobService.getRecommendedJobs()
      recommendedJobs.value = res.data
    } catch (err) {
      logger.warn('Failed to fetch recommended jobs', err, 'JobStore')
    }
  }

  async function createJob(
    payload: CreateJobPayload,
    options?: { successToast?: boolean },
  ): Promise<Job | null> {
    isLoading.value = true
    try {
      const res = await jobService.createJob(payload)
      jobs.value.unshift(res.data)
      if (options?.successToast !== false) {
        toast.success('Job Posted!', 'Your job is now live.')
      }
      return res.data
    } catch (err) {
      logger.catch(err, 'JobStore.createJob')
      toast.error('Failed', 'Could not create job. Please try again.')
      return null
    } finally {
      isLoading.value = false
    }
  }

  async function updateJob(id: string, payload: UpdateJobPayload): Promise<boolean> {
    try {
      const res = await jobService.updateJob(id, payload)
      const idx = jobs.value.findIndex((j) => j.id === id)
      if (idx !== -1) jobs.value[idx] = res.data
      if (selectedJob.value?.id === id) selectedJob.value = res.data
      toast.success('Job Updated')
      return true
    } catch (err) {
      logger.catch(err, 'JobStore.updateJob')
      toast.error('Update Failed')
      return false
    }
  }

  async function closeJob(id: string): Promise<void> {
    try {
      await jobService.closeJob(id)
      const idx = jobs.value.findIndex((j) => j.id === id)
      if (idx !== -1) jobs.value[idx].status = 'closed'
      toast.success('Job Closed')
    } catch {
      toast.error('Could not close job.')
    }
  }

  async function deleteJob(id: string): Promise<void> {
    try {
      await jobService.deleteJob(id)
      jobs.value = jobs.value.filter((j) => j.id !== id)
      toast.success('Job Deleted')
    } catch (err) {
      logger.catch(err, 'JobStore.deleteJob')
      toast.error('Could not delete job.')
    }
  }

  function setFilter(key: keyof JobFilters, value: unknown): void {
    filters.value = { ...filters.value, [key]: value, page: 1 }
  }

  function resetFilters(): void {
    filters.value = { page: 1, limit: 12 }
  }

  function nextPage(): void {
    if (hasMore.value) {
      filters.value.page = (filters.value.page ?? 1) + 1
      fetchJobs(undefined, true)
    }
  }

  const savedJobs = ref<SavedJob[]>([])

  async function saveJob(jobId: string): Promise<void> {
    try {
      await jobService.saveJob(jobId)
      toast.success('Job Saved')
    } catch (err) {
      logger.catch(err, 'JobStore.saveJob')
    }
  }

  async function unsaveJob(jobId: string): Promise<void> {
    try {
      await jobService.unsaveJob(jobId)
      savedJobs.value = savedJobs.value.filter(j => j.jobId !== jobId)
      toast.success('Job Unsaved')
    } catch (err) {
      logger.catch(err, 'JobStore.unsaveJob')
    }
  }

  async function fetchSavedJobs(): Promise<void> {
    isLoading.value = true
    try {
      const res = await jobService.getSavedJobs()
      savedJobs.value = res.data
    } catch (err) {
      logger.catch(err, 'JobStore.fetchSavedJobs')
      error.value = 'Failed to load saved jobs.'
    } finally {
      isLoading.value = false
    }
  }

  async function fetchMyJobs(status?: string): Promise<void> {
    isLoading.value = true
    error.value = null
    try {
      const res = await jobService.getMyJobs(status)
      jobs.value = res.data
    } catch (err) {
      logger.catch(err, 'JobStore.fetchMyJobs')
      error.value = 'Failed to load your jobs.'
    } finally {
      isLoading.value = false
    }
  }

  return {
    jobs,
    selectedJob,
    recommendedJobs,
    filters,
    pagination,
    isLoading,
    isLoadingDetail,
    error,
    hasMore,
    totalJobs,
    openJobs,
    fetchJobs,
    fetchJob,
    fetchRecommended,
    createJob,
    updateJob,
    closeJob,
    deleteJob,
    setFilter,
    resetFilters,
    nextPage,
    savedJobs,
    saveJob,
    unsaveJob,
    fetchSavedJobs,
    fetchMyJobs,
  }
})
