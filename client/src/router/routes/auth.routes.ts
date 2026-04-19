import type { RouteRecordRaw } from 'vue-router'
import { requiresGuest, requiresAuth, requiresClient } from '@/router/guards/auth.guard'

export const authRoutes: RouteRecordRaw[] = [
  {
    path: '/settings',
    component: () => import('@/layouts/PublicLayout.vue'),
    beforeEnter: requiresAuth,
    children: [
      {
        path: 'close-account',
        name: 'close-account',
        component: () => import('@/modules/auth/pages/CloseAccountPage.vue'),
        meta: { title: 'Close account' },
      },
    ],
  },
  {
    path: '/auth',
    component: () => import('@/layouts/AuthLayout.vue'),
    beforeEnter: requiresGuest,
    children: [
      {
        path: 'login',
        name: 'login',
        component: () => import('@/modules/auth/pages/LoginPage.vue'),
        meta: { title: 'Log in' },
      },
      {
        path: 'signup',
        name: 'signup',
        component: () => import('@/modules/auth/pages/RegisterPage.vue'),
        meta: { title: 'Sign up' },
      },
      {
        path: 'register',
        redirect: { name: 'signup' },
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
    path: '/client-onboarding/company-size',
    name: 'client-business-onboarding',
    component: () => import('@/modules/auth/pages/ClientBusinessOnboardingPage.vue'),
    meta: { title: 'Welcome' },
    beforeEnter: requiresClient,
  },
  {
    path: '/auth/client-first-job',
    redirect: { name: 'client-job-post-instant-welcome' },
  },
  {
    path: '/signup/registration-success',
    name: 'registration-success',
    component: () => import('@/modules/auth/pages/RegistrationSuccessPage.vue'),
    meta: { title: 'Welcome' },
    beforeEnter: requiresAuth,
  },
  {
    path: '/signup/please-verify',
    name: 'please-verify',
    component: () => import('@/modules/auth/pages/PleaseVerifyPage.vue'),
    meta: { title: 'Please verify email' },
    beforeEnter: requiresAuth,
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
