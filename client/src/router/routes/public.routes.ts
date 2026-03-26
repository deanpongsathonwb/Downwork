import type { RouteRecordRaw } from 'vue-router'
import { requiresAuth, requiresRole } from '@/router/guards/auth.guard'

export const publicRoutes: RouteRecordRaw[] = [
  {
    path: '/',
    component: () => import('@/layouts/PublicLayout.vue'),
    children: [
      {
        path: '',
        name: 'home',
        component: () => import('@/modules/public/pages/HomePage.vue'),
        meta: { title: 'Hire Top Freelance Talent with Confidence' },
      },
      {
        path: 'browse-jobs',
        name: 'browse-jobs',
        component: () => import('@/modules/jobs/pages/BrowseJobsPage.vue'),
        meta: { title: 'Browse Jobs' },
      },
      {
        path: 'browse-freelancers',
        name: 'browse-freelancers',
        component: () => import('@/modules/public/pages/BrowseFreelancersPage.vue'),
        meta: { title: 'Browse Freelancers' },
      },
      {
        path: 'jobs/:id',
        name: 'job-detail',
        component: () => import('@/modules/jobs/pages/JobDetailPage.vue'),
        meta: { title: 'Job Detail' },
      },
      {
        path: 'jobs/:id/apply',
        name: 'submit-proposal',
        component: () => import('@/modules/freelancer/pages/SubmitProposalPage.vue'),
        meta: { title: 'Submit Proposal' },
        beforeEnter: [requiresAuth, requiresRole(['freelancer'])],
      },
      {
        path: 'freelancers/:id',
        name: 'freelancer-profile',
        component: () => import('@/modules/freelancer/pages/FreelancerProfilePage.vue'),
        meta: { title: 'Freelancer Profile' },
      },
      {
        path: 'pricing',
        name: 'pricing',
        component: () => import('@/modules/public/pages/PricingPage.vue'),
        meta: { title: 'Pricing & Membership' },
      },
      {
        path: 'about',
        name: 'about',
        component: () => import('@/modules/public/pages/AboutPage.vue'),
        meta: { title: 'About Us' },
      },
      {
        path: 'help',
        name: 'help',
        component: () => import('@/modules/public/pages/HelpPage.vue'),
        meta: { title: 'Help & FAQ' },
      },
      {
        path: 'contact',
        name: 'contact',
        component: () => import('@/modules/public/pages/ContactPage.vue'),
        meta: { title: 'Contact Us' },
      },
      {
        path: 'privacy-policy',
        name: 'privacy-policy',
        component: () => import('@/modules/public/pages/PrivacyPolicyPage.vue'),
        meta: { title: 'Privacy Policy' },
      },
      {
        path: 'terms-of-service',
        name: 'terms-of-service',
        component: () => import('@/modules/public/pages/TermsOfServicePage.vue'),
        meta: { title: 'Terms of Service' },
      },
      {
        path: 'cookie-policy',
        name: 'cookie-policy',
        component: () => import('@/modules/public/pages/CookiePolicyPage.vue'),
        meta: { title: 'Cookie Policy' },
      },
    ],
  },
]
