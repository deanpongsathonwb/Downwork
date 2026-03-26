import type { RouteRecordRaw } from 'vue-router'
import { requiresGuest, requiresAuth } from '@/router/guards/auth.guard'

export const authRoutes: RouteRecordRaw[] = [
  {
    path: '/auth',
    component: () => import('@/layouts/AuthLayout.vue'),
    beforeEnter: requiresGuest,
    children: [
      {
        path: 'login',
        name: 'login',
        component: () => import('@/modules/auth/pages/LoginPage.vue'),
        meta: { title: 'Sign In' },
      },
      {
        path: 'register',
        name: 'register',
        component: () => import('@/modules/auth/pages/RegisterPage.vue'),
        meta: { title: 'Create Account' },
      },
      {
        path: 'forgot-password',
        name: 'forgot-password',
        component: () => import('@/modules/auth/pages/ForgotPasswordPage.vue'),
        meta: { title: 'Reset Password' },
      },
      {
        path: 'reset-password',
        name: 'reset-password',
        component: () => import('@/modules/auth/pages/ResetPasswordPage.vue'),
        meta: { title: 'Set New Password' },
      },
    ],
  },
  {
    path: '/auth/onboarding',
    name: 'onboarding',
    component: () => import('@/modules/auth/pages/OnboardingPage.vue'),
    meta: { title: 'Complete Your Profile' },
    beforeEnter: requiresAuth,
  },
  {
    path: '/auth/verify-email',
    name: 'verify-email',
    component: () => import('@/modules/auth/pages/VerifyEmailPage.vue'),
    meta: { title: 'Verify Email' },
  },
  {
    path: '/auth/mfa-setup',
    name: 'mfa-setup',
    component: () => import('@/modules/auth/pages/TwoFactorSetupPage.vue'),
    meta: { title: 'MFA Setup' },
    beforeEnter: requiresAuth,
  },
]
