import type { AxiosRequestConfig, AxiosResponse } from 'axios'
import { MOCK_JOBS, MOCK_PROPOSALS } from './data/jobs.mock'
import { getMockUserByEmail, MOCK_TOKENS, MOCK_FREELANCER_USER } from './data/auth.mock'
import { MOCK_CONTRACTS } from './data/contracts.mock'
import { MOCK_NOTIFICATIONS } from './data/notifications.mock'
import { MOCK_CONVERSATIONS, MOCK_MESSAGES } from './data/chat.mock'
import { MOCK_EARNINGS, MOCK_WITHDRAWALS } from './data/earnings.mock'
import { MOCK_FREELANCERS } from './data/freelancers.mock'
import type { ApiResponse, Job, JobFilters } from '@/types'

// ============================================================
// MOCK API HANDLER
// Intercepts axios requests and returns fake AxiosResponse
// objects based on URL pattern matching.
// ============================================================

function makeResponse<T>(data: T, message = 'OK', meta?: ApiResponse<T>['meta']): AxiosResponse<ApiResponse<T>> {
  const payload: ApiResponse<T> = { data, message, success: true, ...(meta ? { meta } : {}) }
  return {
    data: payload,
    status: 200,
    statusText: 'OK',
    headers: {},
    config: {} as never,
  }
}

function delay(ms = 300): Promise<void> {
  return new Promise((resolve) => setTimeout(resolve, ms))
}

function parseBody(config: AxiosRequestConfig): Record<string, unknown> {
  if (!config.data) return {}
  return typeof config.data === 'string' ? JSON.parse(config.data) : config.data
}

// ── FILTER HELPERS ───────────────────────────────────────────

function applyJobFilters(jobs: Job[], params: JobFilters = {}): Job[] {
  let result = [...jobs]
  if (params.search) {
    const q = params.search.toLowerCase()
    result = result.filter(
      (j) =>
        j.title.toLowerCase().includes(q) ||
        j.description.toLowerCase().includes(q) ||
        j.skills.some((s) => s.name.toLowerCase().includes(q)),
    )
  }
  if (params.category) result = result.filter((j) => j.category === params.category)
  if (params.type) result = result.filter((j) => j.type === params.type)
  if (params.experienceLevel) result = result.filter((j) => j.experienceLevel === params.experienceLevel)
  if (params.budgetMin) result = result.filter((j) => (j.budget.min ?? j.budget.amount ?? 0) >= Number(params.budgetMin))
  if (params.budgetMax) result = result.filter((j) => (j.budget.max ?? j.budget.amount ?? Infinity) <= Number(params.budgetMax))

  if (params.sortBy) {
    switch (params.sortBy) {
      case 'newest':
        result.sort((a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime())
        break
      case 'budget_desc':
        result.sort((a, b) => {
          const budgetA = a.budget.max ?? a.budget.amount ?? a.budget.min ?? 0
          const budgetB = b.budget.max ?? b.budget.amount ?? b.budget.min ?? 0
          return budgetB - budgetA
        })
        break
      case 'proposals_desc':
        result.sort((a, b) => (b.proposalCount ?? 0) - (a.proposalCount ?? 0))
        break
    }
  }

  return result
}

// ── ROUTE RESOLVER ───────────────────────────────────────────

export async function resolveMockRequest(
  config: AxiosRequestConfig,
): Promise<AxiosResponse | null> {
  const method = (config.method ?? 'get').toLowerCase()
  const rawUrl = config.url ?? ''

  const url = rawUrl.replace(/^https?:\/\/[^/]+\/api\/v1/, '').replace(/\/$/, '')

  await delay(100 + Math.random() * 300)

  // ── AUTH ──────────────────────────────────────────────────

  if (method === 'post' && url === '/auth/login') {
    const body = parseBody(config)
    const user = getMockUserByEmail((body.email as string) ?? '')
    return makeResponse({ user, tokens: MOCK_TOKENS }, 'Login successful')
  }

  if (method === 'post' && url === '/auth/register') {
    const body = parseBody(config)
    const user = {
      ...MOCK_FREELANCER_USER,
      id: `user-${Date.now()}`,
      email: body.email,
      firstName: body.firstName,
      lastName: body.lastName,
      role: body.role ?? 'freelancer',
    }
    return makeResponse({ user, tokens: MOCK_TOKENS }, 'Account created')
  }

  if (method === 'post' && url === '/auth/logout') {
    return makeResponse(null, 'Logged out')
  }

  if (method === 'post' && (url === '/auth/refresh' || url === '/auth/token/refresh')) {
    return makeResponse(MOCK_TOKENS, 'Token refreshed')
  }

  if (method === 'get' && url === '/auth/me') {
    return makeResponse(MOCK_FREELANCER_USER, 'Profile fetched')
  }

  if (method === 'post' && url === '/auth/forgot-password') {
    return makeResponse(null, 'Reset email sent')
  }

  if (method === 'post' && url === '/auth/reset-password') {
    return makeResponse(null, 'Password reset successfully')
  }

  if (method === 'post' && url === '/auth/verify-email') {
    return makeResponse(null, 'Email verified')
  }

  if (method === 'post' && url === '/auth/2fa/setup') {
    return makeResponse({ qrCode: 'data:image/png;base64,mock', secret: 'MOCK2FASECRET' })
  }

  if (method === 'post' && url === '/auth/2fa/verify') {
    return makeResponse(null, '2FA verified')
  }

  if (method === 'post' && url === '/auth/2fa/disable') {
    return makeResponse(null, '2FA disabled')
  }

  if (method === 'post' && url === '/auth/resend-verification') {
    return makeResponse(null, 'Verification email sent')
  }

  if (method === 'get' && url === '/auth/sessions') {
    return makeResponse([
      { id: 'session-001', device: 'Chrome on Windows', ip: '192.168.1.10', lastActive: new Date().toISOString(), current: true },
      { id: 'session-002', device: 'Safari on iPhone', ip: '10.0.0.5', lastActive: new Date(Date.now() - 2 * 60 * 60 * 1000).toISOString(), current: false },
      { id: 'session-003', device: 'Firefox on macOS', ip: '172.16.0.3', lastActive: new Date(Date.now() - 24 * 60 * 60 * 1000).toISOString(), current: false },
    ], 'Sessions fetched')
  }

  if (method === 'post' && url === '/auth/change-email') {
    return makeResponse(null, 'Email change initiated')
  }

  if (method === 'post' && url === '/auth/delete-account') {
    return makeResponse(null, 'Account deleted')
  }

  if (method === 'post' && url === '/auth/deactivate') {
    return makeResponse(null, 'Account deactivated')
  }

  // DELETE /auth/sessions (all)
  if (method === 'delete' && url === '/auth/sessions') {
    return makeResponse(null, 'All sessions revoked')
  }

  // DELETE /auth/sessions/:id
  const revokeSessionMatch = url.match(/^\/auth\/sessions\/([^/]+)$/)
  if (method === 'delete' && revokeSessionMatch) {
    return makeResponse(null, 'Session revoked')
  }

  // ── JOBS ──────────────────────────────────────────────────

  if (method === 'get' && url === '/jobs/recommendations') {
    return makeResponse(MOCK_JOBS.slice(0, 3), 'Recommended jobs')
  }

  if (method === 'get' && url === '/jobs/my-jobs') {
    return makeResponse(MOCK_JOBS.slice(0, 5), 'My jobs fetched')
  }

  if (method === 'get' && url === '/jobs/saved') {
    return makeResponse(MOCK_JOBS.slice(2, 5).map((j) => ({ ...j, savedAt: new Date(Date.now() - 3600000).toISOString() })), 'Saved jobs fetched')
  }

  if (method === 'get' && url === '/jobs') {
    const params = (config.params ?? {}) as JobFilters
    const page = Number(params.page ?? 1)
    const limit = Number(params.limit ?? 12)
    const filtered = applyJobFilters(MOCK_JOBS, params)
    const total = filtered.length
    const start = (page - 1) * limit
    const paged = filtered.slice(start, start + limit)
    return makeResponse(paged, 'Jobs fetched', {
      total,
      page,
      limit,
      totalPages: Math.ceil(total / limit),
      hasNextPage: start + limit < total,
      hasPrevPage: page > 1,
    })
  }

  // GET /jobs/:id/proposals
  const jobProposalsMatch = url.match(/^\/jobs\/([^/]+)\/proposals$/)
  if (method === 'get' && jobProposalsMatch) {
    const jobProposals = MOCK_PROPOSALS.filter((p) => p.jobId === jobProposalsMatch[1])
    return makeResponse(jobProposals, 'Proposals fetched')
  }

  // PATCH /jobs/:id/close
  const closeJobMatch = url.match(/^\/jobs\/([^/]+)\/close$/)
  if (method === 'patch' && closeJobMatch) {
    const job = MOCK_JOBS.find((j) => j.id === closeJobMatch[1])
    if (job) return makeResponse({ ...job, status: 'closed' }, 'Job closed')
  }

  // POST /jobs/:id/save
  const saveJobMatch = url.match(/^\/jobs\/([^/]+)\/save$/)
  if (method === 'post' && saveJobMatch) {
    return makeResponse(null, 'Job saved')
  }

  // DELETE /jobs/:id/save
  const unsaveJobMatch = url.match(/^\/jobs\/([^/]+)\/save$/)
  if (method === 'delete' && unsaveJobMatch) {
    return makeResponse(null, 'Job unsaved')
  }

  // GET /jobs/:id
  const jobDetailMatch = url.match(/^\/jobs\/([^/]+)$/)
  if (method === 'get' && jobDetailMatch) {
    const job = MOCK_JOBS.find((j) => j.id === jobDetailMatch[1]) ?? MOCK_JOBS[0]
    return makeResponse(job, 'Job detail')
  }

  // POST /jobs
  if (method === 'post' && url === '/jobs') {
    const body = parseBody(config)
    const newJob: Job = {
      id: `job-${Date.now()}`,
      clientId: 'user-client-01',
      proposalCount: 0,
      status: 'open',
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
      isRemote: true,
      ...body,
    } as Job
    return makeResponse(newJob, 'Job created')
  }

  // PUT /jobs/:id
  const updateJobMatch = url.match(/^\/jobs\/([^/]+)$/)
  if (method === 'put' && updateJobMatch) {
    const body = parseBody(config)
    const existing = MOCK_JOBS.find((j) => j.id === updateJobMatch[1]) ?? MOCK_JOBS[0]
    return makeResponse({ ...existing, ...body, updatedAt: new Date().toISOString() }, 'Job updated')
  }

  // DELETE /jobs/:id
  if (method === 'delete' && url.match(/^\/jobs\/[^/]+$/)) {
    return makeResponse(null, 'Job deleted')
  }

  // ── PROPOSALS ─────────────────────────────────────────────

  if (method === 'get' && url === '/proposals') {
    return makeResponse(MOCK_PROPOSALS, 'Proposals fetched')
  }

  if (method === 'post' && url === '/proposals') {
    const body = parseBody(config)
    return makeResponse({ id: `prop-${Date.now()}`, ...body, status: 'submitted', createdAt: new Date().toISOString() }, 'Proposal submitted')
  }

  // PATCH /proposals/:id/accept
  const acceptProposalMatch = url.match(/^\/proposals\/([^/]+)\/accept$/)
  if (method === 'patch' && acceptProposalMatch) {
    const proposal = MOCK_PROPOSALS[0]
    return makeResponse({ ...proposal, id: acceptProposalMatch[1], status: 'accepted' }, 'Proposal accepted')
  }

  // PATCH /proposals/:id/reject
  const rejectProposalMatch = url.match(/^\/proposals\/([^/]+)\/reject$/)
  if (method === 'patch' && rejectProposalMatch) {
    const proposal = MOCK_PROPOSALS[0]
    return makeResponse({ ...proposal, id: rejectProposalMatch[1], status: 'rejected' }, 'Proposal rejected')
  }

  // PATCH /proposals/:id/shortlist
  const shortlistProposalMatch = url.match(/^\/proposals\/([^/]+)\/shortlist$/)
  if (method === 'patch' && shortlistProposalMatch) {
    const proposal = MOCK_PROPOSALS[0]
    return makeResponse({ ...proposal, id: shortlistProposalMatch[1], isShortlisted: !(proposal as unknown as Record<string, unknown>).isShortlisted }, 'Shortlist toggled')
  }

  // GET /proposals/:id
  const proposalDetailMatch = url.match(/^\/proposals\/([^/]+)$/)
  if (method === 'get' && proposalDetailMatch) {
    return makeResponse({ ...MOCK_PROPOSALS[0], id: proposalDetailMatch[1] }, 'Proposal fetched')
  }

  // DELETE /proposals/:id
  const deleteProposalMatch = url.match(/^\/proposals\/([^/]+)$/)
  if (method === 'delete' && deleteProposalMatch) {
    return makeResponse(null, 'Proposal withdrawn')
  }

  // ── USERS ─────────────────────────────────────────────────

  if (method === 'get' && url === '/users/freelancers') {
    return makeResponse(MOCK_FREELANCERS, 'Freelancers fetched')
  }

  if (method === 'post' && url === '/users/me/avatar') {
    return makeResponse({ avatarUrl: '/avatars/mock.jpg' }, 'Avatar uploaded')
  }

  if (method === 'put' && url === '/users/me/password') {
    return makeResponse(null, 'Password updated')
  }

  if (method === 'put' && url === '/users/me/freelancer-profile') {
    const body = parseBody(config)
    return makeResponse({ ...MOCK_FREELANCERS[0], ...body }, 'Freelancer profile updated')
  }

  if (method === 'put' && url === '/users/me/client-profile') {
    const body = parseBody(config)
    return makeResponse({
      id: 'user-client-01',
      companyName: 'TechStart Inc.',
      industry: 'Technology',
      website: 'https://techstart.io',
      description: 'Building the next generation of SaaS tools.',
      ...body,
    }, 'Client profile updated')
  }

  if (method === 'put' && url === '/users/me/notification-preferences') {
    return makeResponse(null, 'Preferences updated')
  }

  if (method === 'patch' && url === '/users/me') {
    const body = parseBody(config)
    return makeResponse({ ...MOCK_FREELANCER_USER, ...body }, 'User updated')
  }

  // GET /users/:id/freelancer-profile
  const freelancerProfileMatch = url.match(/^\/users\/([^/]+)\/freelancer-profile$/)
  if (method === 'get' && freelancerProfileMatch) {
    return makeResponse(MOCK_FREELANCERS[0], 'Freelancer profile fetched')
  }

  // GET /users/:id/client-profile
  const clientProfileMatch = url.match(/^\/users\/([^/]+)\/client-profile$/)
  if (method === 'get' && clientProfileMatch) {
    return makeResponse({
      id: clientProfileMatch[1],
      companyName: 'TechStart Inc.',
      industry: 'Technology',
      website: 'https://techstart.io',
      description: 'Building the next generation of SaaS tools.',
      totalJobsPosted: 12,
      totalSpent: 48200,
      memberSince: '2023-06-01T00:00:00Z',
      rating: 4.8,
      location: 'San Francisco, USA',
    }, 'Client profile fetched')
  }

  // GET /users/:id (generic fallback)
  if (method === 'get' && url.match(/^\/users\/[^/]+$/)) {
    return makeResponse(MOCK_FREELANCER_USER, 'User fetched')
  }

  // PUT /users/:id (generic fallback)
  if (method === 'put' && url.match(/^\/users\/[^/]+$/)) {
    const body = parseBody(config)
    return makeResponse({ ...MOCK_FREELANCER_USER, ...body }, 'User updated')
  }

  // ── CONTRACTS ─────────────────────────────────────────────

  if (method === 'get' && url === '/contracts') {
    return makeResponse(MOCK_CONTRACTS, 'Contracts fetched')
  }

  if (method === 'post' && url === '/contracts') {
    const body = parseBody(config)
    return makeResponse({
      id: `contract-${Date.now()}`,
      status: 'active',
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
      milestones: [],
      paidAmount: 0,
      currency: 'USD',
      ...body,
    }, 'Contract created')
  }

  // PATCH /contracts/:id/milestones/:milestoneId/approve
  const milestoneApproveMatch = url.match(/^\/contracts\/([^/]+)\/milestones\/([^/]+)\/approve$/)
  if (method === 'patch' && milestoneApproveMatch) {
    return makeResponse({
      id: milestoneApproveMatch[2],
      contractId: milestoneApproveMatch[1],
      status: 'approved',
      updatedAt: new Date().toISOString(),
    }, 'Milestone approved')
  }

  // PATCH /contracts/:id/milestones/:milestoneId/submit
  const milestoneSubmitMatch = url.match(/^\/contracts\/([^/]+)\/milestones\/([^/]+)\/submit$/)
  if (method === 'patch' && milestoneSubmitMatch) {
    return makeResponse({
      id: milestoneSubmitMatch[2],
      contractId: milestoneSubmitMatch[1],
      status: 'submitted',
      updatedAt: new Date().toISOString(),
    }, 'Milestone submitted')
  }

  // PATCH /contracts/:id/milestones/:milestoneId/revise
  const milestoneReviseMatch = url.match(/^\/contracts\/([^/]+)\/milestones\/([^/]+)\/revise$/)
  if (method === 'patch' && milestoneReviseMatch) {
    return makeResponse({
      id: milestoneReviseMatch[2],
      contractId: milestoneReviseMatch[1],
      status: 'in_progress',
      updatedAt: new Date().toISOString(),
    }, 'Milestone revision requested')
  }

  // PATCH /contracts/:id/milestones/:milestoneId/fund
  const milestoneFundMatch = url.match(/^\/contracts\/([^/]+)\/milestones\/([^/]+)\/fund$/)
  if (method === 'patch' && milestoneFundMatch) {
    return makeResponse({
      id: milestoneFundMatch[2],
      contractId: milestoneFundMatch[1],
      status: 'funded',
      updatedAt: new Date().toISOString(),
    }, 'Milestone funded')
  }

  // PATCH /contracts/:id/milestones/:milestoneId/release
  const milestoneReleaseMatch = url.match(/^\/contracts\/([^/]+)\/milestones\/([^/]+)\/release$/)
  if (method === 'patch' && milestoneReleaseMatch) {
    return makeResponse({
      id: milestoneReleaseMatch[2],
      contractId: milestoneReleaseMatch[1],
      status: 'released',
      updatedAt: new Date().toISOString(),
    }, 'Milestone payment released')
  }

  // POST /contracts/:id/dispute
  const contractDisputeMatch = url.match(/^\/contracts\/([^/]+)\/dispute$/)
  if (method === 'post' && contractDisputeMatch) {
    return makeResponse(null, 'Dispute opened')
  }

  // POST /contracts/:id/review
  const contractReviewMatch = url.match(/^\/contracts\/([^/]+)\/review$/)
  if (method === 'post' && contractReviewMatch) {
    const body = parseBody(config)
    return makeResponse({
      id: `review-${Date.now()}`,
      contractId: contractReviewMatch[1],
      rating: body.rating ?? 5,
      comment: body.comment ?? '',
      ...body,
      createdAt: new Date().toISOString(),
    }, 'Review submitted')
  }

  // PATCH /contracts/:id/end
  const contractEndMatch = url.match(/^\/contracts\/([^/]+)\/end$/)
  if (method === 'patch' && contractEndMatch) {
    const contract = MOCK_CONTRACTS.find((c) => c.id === contractEndMatch[1]) ?? MOCK_CONTRACTS[0]
    return makeResponse({ ...contract, status: 'completed', updatedAt: new Date().toISOString() }, 'Contract ended')
  }

  // GET /contracts/:id
  const contractDetailMatch = url.match(/^\/contracts\/([^/]+)$/)
  if (method === 'get' && contractDetailMatch) {
    const contract = MOCK_CONTRACTS.find((c) => c.id === contractDetailMatch[1]) ?? MOCK_CONTRACTS[0]
    return makeResponse(contract, 'Contract fetched')
  }

  // ── NOTIFICATIONS ─────────────────────────────────────────

  if (method === 'get' && url === '/notifications/unread-count') {
    return makeResponse({ count: 3 }, 'Unread count fetched')
  }

  if (method === 'get' && url === '/notifications') {
    return makeResponse(MOCK_NOTIFICATIONS, 'Notifications fetched')
  }

  if (method === 'patch' && url.match(/^\/notifications\/[^/]+\/read$/)) {
    return makeResponse(null, 'Marked as read')
  }

  if (method === 'patch' && url === '/notifications/read-all') {
    return makeResponse(null, 'All notifications marked as read')
  }

  // DELETE /notifications/:id
  const deleteNotificationMatch = url.match(/^\/notifications\/([^/]+)$/)
  if (method === 'delete' && deleteNotificationMatch) {
    return makeResponse(null, 'Notification deleted')
  }

  // ── CHAT ──────────────────────────────────────────────────

  if (method === 'get' && url === '/conversations') {
    return makeResponse(MOCK_CONVERSATIONS, 'Conversations fetched')
  }

  if (method === 'post' && url === '/conversations') {
    return makeResponse(MOCK_CONVERSATIONS[0], 'Conversation started')
  }

  // PATCH /conversations/:id/read
  const markReadMatch = url.match(/^\/conversations\/([^/]+)\/read$/)
  if (method === 'patch' && markReadMatch) {
    return makeResponse(null, 'Marked as read')
  }

  // POST /conversations/:id/offer
  const offerMatch = url.match(/^\/conversations\/([^/]+)\/offer$/)
  if (method === 'post' && offerMatch) {
    const body = parseBody(config)
    return makeResponse({
      id: `msg-${Date.now()}`,
      conversationId: offerMatch[1],
      senderId: 'user-freelancer-01',
      content: '',
      type: 'offer',
      offer: { id: `offer-${Date.now()}`, status: 'pending', ...body },
      isRead: false,
      createdAt: new Date().toISOString(),
    }, 'Offer sent')
  }

  // POST /conversations/:id/messages/file
  const uploadFileMatch = url.match(/^\/conversations\/([^/]+)\/messages\/file$/)
  if (method === 'post' && uploadFileMatch) {
    const fileName = 'uploaded-file'
    return makeResponse({
      id: `msg-${Date.now()}`,
      conversationId: uploadFileMatch[1],
      senderId: 'user-freelancer-01',
      content: '',
      type: 'file',
      attachments: [{
        id: `att-${Date.now()}`,
        name: fileName,
        url: '#',
        size: 102400,
        mimeType: 'application/octet-stream',
        uploadedAt: new Date().toISOString(),
      }],
      isRead: false,
      createdAt: new Date().toISOString(),
    }, 'File uploaded')
  }

  const messagesMatch = url.match(/^\/conversations\/([^/]+)\/messages$/)
  if (method === 'get' && messagesMatch) {
    const msgs = MOCK_MESSAGES[messagesMatch[1]] ?? []
    return makeResponse(msgs, 'Messages fetched')
  }

  if (method === 'post' && url.match(/^\/conversations\/[^/]+\/messages$/)) {
    const body = parseBody(config)
    return makeResponse({
      id: `msg-${Date.now()}`,
      conversationId: url.split('/')[2],
      senderId: 'user-freelancer-01',
      content: body.content ?? '',
      type: 'text',
      isRead: false,
      createdAt: new Date().toISOString(),
    }, 'Message sent')
  }

  // ── ADMIN ─────────────────────────────────────────────────

  if (method === 'get' && url === '/admin/stats') {
    return makeResponse({
      totalUsers: 12450,
      totalFreelancers: 8200,
      totalClients: 4250,
      totalJobs: 32800,
      activeContracts: 1540,
      totalRevenue: 4820000,
      openDisputes: 23,
      newUsersThisMonth: 842,
      revenueThisMonth: 210500,
      platformFeeRate: 20,
    }, 'Stats fetched')
  }

  if (method === 'get' && url === '/admin/users') {
    return makeResponse([
      { id: 'user-freelancer-01', email: 'freelancer@demo.com', role: 'freelancer', firstName: 'Alex', lastName: 'Nguyen', isEmailVerified: true, isBanned: false, isSuspended: false, createdAt: '2024-01-15T08:00:00.000Z', lastLoginAt: new Date().toISOString() },
      { id: 'user-client-01', email: 'client@demo.com', role: 'client', firstName: 'Sarah', lastName: 'Johnson', isEmailVerified: true, isBanned: false, isSuspended: false, createdAt: '2024-02-10T08:00:00.000Z', lastLoginAt: new Date(Date.now() - 60 * 60 * 1000).toISOString() },
      { id: 'user-client-05', email: 'anna@demo.com', role: 'client', firstName: 'Anna', lastName: 'Williams', isEmailVerified: true, isBanned: false, isSuspended: false, createdAt: '2024-03-01T08:00:00.000Z', lastLoginAt: new Date(Date.now() - 5 * 24 * 60 * 60 * 1000).toISOString() },
      { id: 'user-client-03', email: 'emily@demo.com', role: 'client', firstName: 'Emily', lastName: 'Rodriguez', isEmailVerified: false, isBanned: false, isSuspended: true, createdAt: '2024-03-20T08:00:00.000Z' },
    ], 'Users fetched')
  }

  if (method === 'get' && url === '/admin/disputes') {
    return makeResponse([
      { id: 'dispute-001', contractId: 'contract-003', reason: 'Work quality did not meet agreed standards', description: 'The high-fidelity designs were incomplete and did not follow the style guide provided.', status: 'open', initiatorId: 'user-client-03', respondentId: 'user-freelancer-01', createdAt: new Date(Date.now() - 2 * 24 * 60 * 60 * 1000).toISOString(), updatedAt: new Date(Date.now() - 1 * 24 * 60 * 60 * 1000).toISOString() },
      { id: 'dispute-002', contractId: 'contract-002', reason: 'Late delivery', description: 'Project was delivered 3 days past the agreed deadline.', status: 'resolved', resolution: 'Both parties agreed on a 10% discount. Case closed.', initiatorId: 'user-client-05', respondentId: 'user-freelancer-01', createdAt: new Date(Date.now() - 30 * 24 * 60 * 60 * 1000).toISOString(), updatedAt: new Date(Date.now() - 25 * 24 * 60 * 60 * 1000).toISOString() },
    ], 'Disputes fetched')
  }

  if (method === 'get' && url === '/admin/analytics') {
    return makeResponse({
      revenue: { total: 4820000, thisMonth: 210500, lastMonth: 195000, growth: 7.9 },
      users: { total: 12450, active: 8900, newThisMonth: 842, churnRate: 2.1 },
      jobs: { total: 32800, open: 4200, completed: 26800, avgBudget: 4500 },
      contracts: { active: 1540, completed: 28500, disputed: 23, avgValue: 3800 },
      topCategories: [
        { name: 'Web Development', jobs: 12400, revenue: 1850000 },
        { name: 'Mobile Apps', jobs: 6200, revenue: 980000 },
        { name: 'Design', jobs: 5800, revenue: 720000 },
        { name: 'Data Science', jobs: 3400, revenue: 620000 },
        { name: 'Marketing', jobs: 2800, revenue: 350000 },
      ],
    }, 'Analytics fetched')
  }

  if (method === 'get' && url === '/admin/settings') {
    return makeResponse({
      platformName: 'Downwork',
      commissionRate: 20,
      minWithdrawal: 50,
      maxWithdrawal: 10000,
      supportEmail: 'support@downwork.com',
      maintenanceMode: false,
      signupEnabled: true,
      requireEmailVerification: true,
      autoApproveJobs: false,
      disputeResolutionDays: 14,
    }, 'Settings fetched')
  }

  if (method === 'put' && url === '/admin/settings') {
    const body = parseBody(config)
    return makeResponse({
      platformName: 'Downwork',
      commissionRate: 20,
      minWithdrawal: 50,
      maxWithdrawal: 10000,
      supportEmail: 'support@downwork.com',
      maintenanceMode: false,
      signupEnabled: true,
      requireEmailVerification: true,
      autoApproveJobs: false,
      disputeResolutionDays: 14,
      ...body,
    }, 'Settings updated')
  }

  if (method === 'get' && url === '/admin/reports') {
    return makeResponse([
      { id: 'report-001', type: 'user', targetId: 'user-freelancer-01', reason: 'Spam messages', status: 'pending', reportedBy: 'user-client-01', createdAt: new Date(Date.now() - 3 * 24 * 60 * 60 * 1000).toISOString() },
      { id: 'report-002', type: 'job', targetId: 'job-005', reason: 'Misleading description', status: 'reviewed', reportedBy: 'user-freelancer-01', createdAt: new Date(Date.now() - 7 * 24 * 60 * 60 * 1000).toISOString() },
      { id: 'report-003', type: 'user', targetId: 'user-client-03', reason: 'Abusive behaviour', status: 'resolved', reportedBy: 'user-freelancer-01', createdAt: new Date(Date.now() - 14 * 24 * 60 * 60 * 1000).toISOString() },
    ], 'Reports fetched')
  }

  if (method === 'get' && url === '/admin/kyc') {
    return makeResponse([
      { id: 'kyc-001', userId: 'user-freelancer-01', userName: 'Alex Nguyen', documentType: 'passport', status: 'pending', submittedAt: new Date(Date.now() - 2 * 24 * 60 * 60 * 1000).toISOString() },
      { id: 'kyc-002', userId: 'user-client-01', userName: 'Sarah Johnson', documentType: 'drivers_license', status: 'approved', submittedAt: new Date(Date.now() - 10 * 24 * 60 * 60 * 1000).toISOString(), reviewedAt: new Date(Date.now() - 9 * 24 * 60 * 60 * 1000).toISOString() },
      { id: 'kyc-003', userId: 'user-client-03', userName: 'Emily Rodriguez', documentType: 'national_id', status: 'rejected', submittedAt: new Date(Date.now() - 5 * 24 * 60 * 60 * 1000).toISOString(), reviewedAt: new Date(Date.now() - 4 * 24 * 60 * 60 * 1000).toISOString(), rejectionReason: 'Document expired' },
    ], 'KYC submissions fetched')
  }

  if (method === 'get' && url === '/admin/jobs/pending') {
    return makeResponse(MOCK_JOBS.slice(0, 3).map((j) => ({ ...j, status: 'open' })), 'Pending jobs fetched')
  }

  // PATCH /admin/users/:id/ban
  const banUserMatch = url.match(/^\/admin\/users\/([^/]+)\/ban$/)
  if (method === 'patch' && banUserMatch) {
    return makeResponse(null, 'User banned')
  }

  // PATCH /admin/users/:id/unban
  const unbanUserMatch = url.match(/^\/admin\/users\/([^/]+)\/unban$/)
  if (method === 'patch' && unbanUserMatch) {
    return makeResponse(null, 'User unbanned')
  }

  // PATCH /admin/users/:id/suspend
  const suspendUserMatch = url.match(/^\/admin\/users\/([^/]+)\/suspend$/)
  if (method === 'patch' && suspendUserMatch) {
    return makeResponse(null, 'User suspended')
  }

  // PATCH /admin/jobs/:id/approve
  const approveJobMatch = url.match(/^\/admin\/jobs\/([^/]+)\/approve$/)
  if (method === 'patch' && approveJobMatch) {
    return makeResponse(null, 'Job approved')
  }

  // PATCH /admin/jobs/:id/reject
  const rejectJobMatch = url.match(/^\/admin\/jobs\/([^/]+)\/reject$/)
  if (method === 'patch' && rejectJobMatch) {
    return makeResponse(null, 'Job rejected')
  }

  // PATCH /admin/disputes/:id/resolve
  const resolveDisputeMatch = url.match(/^\/admin\/disputes\/([^/]+)\/resolve$/)
  if (method === 'patch' && resolveDisputeMatch) {
    return makeResponse(null, 'Dispute resolved')
  }

  // PATCH /admin/settings/commission
  if (method === 'patch' && url === '/admin/settings/commission') {
    return makeResponse(null, 'Commission updated')
  }

  // ── EARNINGS / PAYMENTS ───────────────────────────────────

  if (method === 'get' && url === '/earnings') {
    return makeResponse(MOCK_EARNINGS, 'Earnings fetched')
  }

  if (method === 'get' && url === '/withdrawals') {
    return makeResponse(MOCK_WITHDRAWALS, 'Withdrawals fetched')
  }

  if (method === 'post' && url === '/withdrawals') {
    const body = parseBody(config)
    return makeResponse({
      id: `withdraw-${Date.now()}`,
      amount: body.amount,
      currency: body.currency ?? 'USD',
      method: body.method ?? 'Bank Transfer',
      status: 'pending',
      requestedAt: new Date().toISOString(),
    }, 'Withdrawal requested')
  }

  // ── PAYMENTS ──────────────────────────────────────────────

  if (method === 'get' && url === '/payments/balance') {
    return makeResponse({ available: 3100, pending: 1750, inEscrow: 1500, currency: 'USD' }, 'Balance fetched')
  }

  if (method === 'get' && url === '/payments/earnings') {
    return makeResponse(MOCK_EARNINGS, 'Earnings fetched')
  }

  if (method === 'get' && url === '/payments/withdrawals') {
    return makeResponse(MOCK_WITHDRAWALS, 'Withdrawals fetched')
  }

  if (method === 'post' && url === '/payments/withdrawals') {
    const body = parseBody(config)
    return makeResponse({
      id: `withdraw-${Date.now()}`,
      amount: body.amount,
      currency: body.currency ?? 'USD',
      method: body.method ?? 'Bank Transfer',
      status: 'pending',
      requestedAt: new Date().toISOString(),
    }, 'Withdrawal requested')
  }

  if (method === 'get' && url === '/payments/methods') {
    return makeResponse([
      { id: 'pm-001', type: 'bank_account', label: 'Chase ****4829', isDefault: true, addedAt: '2024-01-10T00:00:00Z' },
      { id: 'pm-002', type: 'paypal', label: 'alex@demo.com', isDefault: false, addedAt: '2024-02-15T00:00:00Z' },
      { id: 'pm-003', type: 'card', label: 'Visa ****1234', isDefault: false, addedAt: '2024-03-20T00:00:00Z' },
    ], 'Payment methods fetched')
  }

  if (method === 'post' && url === '/payments/methods') {
    const body = parseBody(config)
    return makeResponse({
      id: `pm-${Date.now()}`,
      isDefault: false,
      addedAt: new Date().toISOString(),
      ...body,
    }, 'Payment method added')
  }

  if (method === 'post' && url === '/payments/add-funds') {
    const body = parseBody(config)
    return makeResponse({
      id: `txn-${Date.now()}`,
      type: 'deposit',
      amount: body.amount ?? 100,
      currency: 'USD',
      status: 'completed',
      createdAt: new Date().toISOString(),
    }, 'Funds added')
  }

  if (method === 'get' && url === '/payments/transactions') {
    return makeResponse([
      { id: 'txn-001', type: 'deposit', amount: 500, currency: 'USD', status: 'completed', description: 'Added funds', createdAt: new Date(Date.now() - 10 * 24 * 60 * 60 * 1000).toISOString() },
      { id: 'txn-002', type: 'escrow', amount: 1500, currency: 'USD', status: 'completed', description: 'Escrow for SaaS Dashboard Development', createdAt: new Date(Date.now() - 8 * 24 * 60 * 60 * 1000).toISOString() },
      { id: 'txn-003', type: 'release', amount: 500, currency: 'USD', status: 'completed', description: 'Milestone payment — Project Setup', createdAt: new Date(Date.now() - 5 * 24 * 60 * 60 * 1000).toISOString() },
      { id: 'txn-004', type: 'withdrawal', amount: 1600, currency: 'USD', status: 'completed', description: 'Withdrawal to Chase ****4829', createdAt: new Date(Date.now() - 3 * 24 * 60 * 60 * 1000).toISOString() },
      { id: 'txn-005', type: 'fee', amount: 100, currency: 'USD', status: 'completed', description: 'Platform service fee', createdAt: new Date(Date.now() - 2 * 24 * 60 * 60 * 1000).toISOString() },
    ], 'Transactions fetched')
  }

  if (method === 'get' && url === '/payments/connects/packages') {
    return makeResponse([
      { id: 'pkg-10', connects: 10, price: 1.50, currency: 'USD' },
      { id: 'pkg-20', connects: 20, price: 2.80, currency: 'USD' },
      { id: 'pkg-40', connects: 40, price: 5.00, currency: 'USD', popular: true },
      { id: 'pkg-80', connects: 80, price: 9.00, currency: 'USD' },
    ], 'Packages fetched')
  }

  if (method === 'get' && url === '/payments/connects') {
    return makeResponse({ balance: 80, history: [] }, 'Connects balance fetched')
  }

  if (method === 'post' && url === '/payments/connects/buy') {
    return makeResponse({ balance: 100 }, 'Connects purchased')
  }

  // PATCH /payments/methods/:id/default
  const defaultMethodMatch = url.match(/^\/payments\/methods\/([^/]+)\/default$/)
  if (method === 'patch' && defaultMethodMatch) {
    return makeResponse(null, 'Default set')
  }

  // DELETE /payments/methods/:id
  const deleteMethodMatch = url.match(/^\/payments\/methods\/([^/]+)$/)
  if (method === 'delete' && deleteMethodMatch) {
    return makeResponse(null, 'Method removed')
  }

  // ── KYC ───────────────────────────────────────────────────

  if (method === 'get' && url === '/kyc/status') {
    return makeResponse({ status: 'not_started' }, 'KYC status fetched')
  }

  if (method === 'post' && url === '/kyc/submit') {
    return makeResponse({
      id: `kyc-${Date.now()}`,
      documentType: 'passport',
      status: 'pending',
      submittedAt: new Date().toISOString(),
    }, 'KYC submitted')
  }

  // ── REVIEWS ───────────────────────────────────────────────

  const userReviewsMatch = url.match(/^\/reviews\/user\/([^/]+)$/)
  if (method === 'get' && userReviewsMatch) {
    return makeResponse([
      { id: 'review-001', contractId: 'contract-002', reviewerId: 'user-client-05', reviewerName: 'Anna Williams', rating: 5, comment: 'Excellent work on the Django API. Very professional and delivered ahead of schedule.', createdAt: new Date(Date.now() - 5 * 24 * 60 * 60 * 1000).toISOString() },
      { id: 'review-002', contractId: 'contract-001', reviewerId: 'user-client-01', reviewerName: 'Sarah Johnson', rating: 4.5, comment: 'Great communication and solid Vue.js skills. Would hire again.', createdAt: new Date(Date.now() - 15 * 24 * 60 * 60 * 1000).toISOString() },
      { id: 'review-003', contractId: 'contract-004', reviewerId: 'user-client-02', reviewerName: 'Mark Chen', rating: 5, comment: 'Delivered a perfect React Native app. Top-notch developer!', createdAt: new Date(Date.now() - 30 * 24 * 60 * 60 * 1000).toISOString() },
    ], 'Reviews fetched')
  }

  // ── INVITATIONS ───────────────────────────────────────────

  if (method === 'post' && url === '/invitations') {
    const body = parseBody(config)
    return makeResponse({
      id: `invite-${Date.now()}`,
      status: 'pending',
      createdAt: new Date().toISOString(),
      ...body,
    }, 'Invitation sent')
  }

  if (method === 'get' && url === '/invitations/received') {
    return makeResponse([
      { id: 'invite-001', jobId: 'job-001', jobTitle: 'Senior Vue.js Developer for SaaS Dashboard', clientId: 'user-client-01', clientName: 'Sarah Johnson', message: 'We loved your profile! Would you be interested in this project?', status: 'pending', createdAt: new Date(Date.now() - 1 * 24 * 60 * 60 * 1000).toISOString() },
      { id: 'invite-002', jobId: 'job-013', jobTitle: 'Full Stack Node.js Developer — Healthcare Platform', clientId: 'user-client-13', clientName: 'Jessica Taylor', message: 'Your experience with Node.js and React is exactly what we need.', status: 'pending', createdAt: new Date(Date.now() - 3 * 24 * 60 * 60 * 1000).toISOString() },
    ], 'Invitations fetched')
  }

  return null
}
