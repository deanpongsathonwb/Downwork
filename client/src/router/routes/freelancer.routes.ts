import type { RouteRecordRaw } from 'vue-router'
import { requiresAuth, requiresRole } from '@/router/guards/auth.guard'

const freelancerGuards = [requiresAuth, requiresRole(['freelancer'])]

export const freelancerRoutes: RouteRecordRaw[] = [
  {
    path: '/freelancer',
    redirect: '/freelancer/dashboard',
    component: () => import('@/layouts/DashboardLayout.vue'),
    beforeEnter: freelancerGuards,
    meta: { title: 'Freelancer', requiresAuth: true, roles: ['freelancer'] },
    children: [
      {
        path: 'dashboard',
        name: 'freelancer-dashboard',
        component: () => import('@/modules/freelancer/pages/DashboardPage.vue'),
        meta: { title: 'Freelancer Dashboard' },
      },
      {
        path: 'proposals',
        name: 'freelancer-proposals',
        component: () => import('@/modules/freelancer/pages/ProposalsPage.vue'),
        meta: { title: 'My Proposals' },
      },
      {
        path: 'saved-jobs',
        name: 'freelancer-saved-jobs',
        component: () => import('@/modules/freelancer/pages/SavedJobsPage.vue'),
        meta: { title: 'Saved Jobs' },
      },
      {
        path: 'contracts',
        name: 'freelancer-contracts',
        component: () => import('@/modules/freelancer/pages/ContractsPage.vue'),
        meta: { title: 'My Contracts' },
      },
      {
        path: 'contracts/:id',
        name: 'freelancer-contract-detail',
        component: () => import('@/modules/freelancer/pages/ContractDetailPage.vue'),
        meta: { title: 'Contract Detail' },
      },
      {
        path: 'contracts/:id/review',
        name: 'freelancer-leave-review',
        component: () => import('@/modules/freelancer/pages/LeaveReviewPage.vue'),
        meta: { title: 'Leave a Review' },
      },
      {
        path: 'earnings',
        name: 'freelancer-earnings',
        component: () => import('@/modules/freelancer/pages/EarningsPage.vue'),
        meta: { title: 'Earnings' },
      },
      {
        path: 'profile',
        name: 'freelancer-profile-edit',
        component: () => import('@/modules/freelancer/pages/ProfileEditPage.vue'),
        meta: { title: 'Edit Profile' },
      },
      {
        path: 'verification',
        name: 'freelancer-verification',
        component: () => import('@/modules/freelancer/pages/KYCVerificationPage.vue'),
        meta: { title: 'Identity Verification' },
      },
      {
        path: 'messages',
        name: 'freelancer-messages',
        component: () => import('@/modules/chat/pages/MessagesPage.vue'),
        meta: { title: 'Messages' },
      },
      {
        path: 'notifications',
        name: 'freelancer-notifications',
        component: () => import('@/modules/notifications/pages/NotificationsPage.vue'),
        meta: { title: 'Notifications' },
      },
      {
        path: 'settings',
        name: 'freelancer-settings',
        component: () => import('@/modules/freelancer/pages/SettingsPage.vue'),
        meta: { title: 'Account Settings' },
      },
    ],
  },
]
