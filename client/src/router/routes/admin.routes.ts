import type { RouteRecordRaw } from 'vue-router'
import { requiresAuth, requiresRole } from '@/router/guards/auth.guard'

const adminGuards = [requiresAuth, requiresRole(['admin'])]

export const adminRoutes: RouteRecordRaw[] = [
  {
    path: '/admin',
    redirect: '/admin/dashboard',
    component: () => import('@/layouts/AdminLayout.vue'),
    beforeEnter: adminGuards,
    meta: { title: 'Admin', requiresAuth: true, roles: ['admin'] },
    children: [
      {
        path: 'dashboard',
        name: 'admin-dashboard',
        component: () => import('@/modules/admin/pages/AdminDashboardPage.vue'),
        meta: { title: 'Admin Dashboard' },
      },
      {
        path: 'users',
        name: 'admin-users',
        component: () => import('@/modules/admin/pages/UserManagementPage.vue'),
        meta: { title: 'User Management' },
      },
      {
        path: 'jobs',
        name: 'admin-jobs',
        component: () => import('@/modules/admin/pages/JobModerationPage.vue'),
        meta: { title: 'Job Moderation' },
      },
      {
        path: 'disputes',
        name: 'admin-disputes',
        component: () => import('@/modules/admin/pages/DisputeManagementPage.vue'),
        meta: { title: 'Dispute Management' },
      },
      {
        path: 'analytics',
        name: 'admin-analytics',
        component: () => import('@/modules/admin/pages/AnalyticsPage.vue'),
        meta: { title: 'Analytics' },
      },
      {
        path: 'reports',
        name: 'admin-reports',
        component: () => import('@/modules/admin/pages/ReportsPage.vue'),
        meta: { title: 'Reports' },
      },
      {
        path: 'settings',
        name: 'admin-settings',
        component: () => import('@/modules/admin/pages/AdminSettingsPage.vue'),
        meta: { title: 'Platform Settings' },
      },
    ],
  },
]
