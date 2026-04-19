import type { RouteRecordRaw } from 'vue-router'
import { requiresAuth, requiresRole } from '@/router/guards/auth.guard'

const clientGuards = [requiresAuth, requiresRole(['client'])]

export const clientRoutes: RouteRecordRaw[] = [
  /** Full-screen flows (no dashboard chrome / sidebar). */
  {
    path: '/job-post',
    component: () => import('@/layouts/StandaloneFlowLayout.vue'),
    beforeEnter: clientGuards,
    meta: { title: 'Client', requiresAuth: true, roles: ['client'] },
    children: [
      {
        path: 'instant/welcome',
        name: 'client-job-post-instant-welcome',
        component: () => import('@/modules/auth/pages/ClientFirstJobWelcomePage.vue'),
        meta: { title: 'Your first job' },
      },
    ],
  },
  {
    path: '/client/job-post',
    component: () => import('@/layouts/StandaloneFlowLayout.vue'),
    beforeEnter: clientGuards,
    meta: { title: 'Client', requiresAuth: true, roles: ['client'] },
    children: [
      {
        path: 'instant/title',
        name: 'client-new-job-guided',
        component: () => import('@/modules/client/pages/GuidedJobPostPage.vue'),
        meta: { title: 'Post a Job' },
      },
      {
        path: 'instant/review',
        name: 'client-job-post-instant-review',
        component: () => import('@/modules/client/pages/JobPostInstantReviewPage.vue'),
        meta: { title: 'Review' },
      },
    ],
  },
  {
    path: '/client',
    redirect: '/client/dashboard',
    component: () => import('@/layouts/DashboardLayout.vue'),
    beforeEnter: clientGuards,
    meta: { title: 'Client', requiresAuth: true, roles: ['client'] },
    children: [
      {
        path: 'dashboard',
        name: 'client-dashboard',
        component: () => import('@/modules/client/pages/DashboardPage.vue'),
        meta: { title: 'Client Dashboard' },
      },
      {
        path: 'jobs/new',
        name: 'client-new-job',
        component: () => import('@/modules/client/pages/PostJobPage.vue'),
        meta: { title: 'Post a Job' },
      },
      {
        path: 'jobs',
        name: 'client-jobs',
        component: () => import('@/modules/client/pages/MyJobsPage.vue'),
        meta: { title: 'My Jobs' },
      },
      {
        path: 'jobs/:id/proposals',
        name: 'client-job-proposals',
        component: () => import('@/modules/client/pages/ProposalReviewPage.vue'),
        meta: { title: 'Review Proposals' },
      },
      {
        path: 'jobs/:id/edit',
        name: 'client-edit-job',
        component: () => import('@/modules/client/pages/PostJobPage.vue'),
        meta: { title: 'Edit Job' },
      },
      {
        path: 'jobs/:id/invite',
        name: 'client-invite-freelancer',
        component: () => import('@/modules/client/pages/InviteFreelancerPage.vue'),
        meta: { title: 'Invite Freelancers' },
      },
      {
        path: 'contracts',
        name: 'client-contracts',
        component: () => import('@/modules/client/pages/ContractsPage.vue'),
        meta: { title: 'Contracts' },
      },
      {
        path: 'contracts/:id',
        name: 'client-contract-detail',
        component: () => import('@/modules/client/pages/ContractDetailPage.vue'),
        meta: { title: 'Contract Detail' },
      },
      {
        path: 'contracts/:id/review',
        name: 'client-leave-review',
        component: () => import('@/modules/client/pages/LeaveReviewPage.vue'),
        meta: { title: 'Leave a Review' },
      },
      {
        path: 'payments',
        name: 'client-payments',
        component: () => import('@/modules/payments/pages/PaymentsPage.vue'),
        meta: { title: 'Payments' },
      },
      {
        path: 'messages',
        name: 'client-messages',
        component: () => import('@/modules/chat/pages/MessagesPage.vue'),
        meta: { title: 'Messages' },
      },
      {
        path: 'notifications',
        name: 'client-notifications',
        component: () => import('@/modules/notifications/pages/NotificationsPage.vue'),
        meta: { title: 'Notifications' },
      },
      {
        path: 'settings',
        name: 'client-settings',
        component: () => import('@/modules/client/pages/SettingsPage.vue'),
        meta: { title: 'Account Settings' },
      },
    ],
  },
]
