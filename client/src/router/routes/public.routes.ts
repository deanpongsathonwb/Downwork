import type { RouteLocationNormalized, RouteLocationRaw, RouteRecordRaw } from 'vue-router'
import { redirectClientFromPublicHome, requiresAuth, requiresRole } from '@/router/guards/auth.guard'
import { getFreelanceJobLanding } from '@/constants/freelance-jobs.landing'
import { getHireTalentLanding, resolveHireCategorySlug } from '@/constants/hire-talent.landing'

function hireTalentLandingEnter(to: RouteLocationNormalized): RouteLocationRaw | true {
  const raw = typeof to.params.slug === 'string' ? to.params.slug : ''
  if (raw === 'more') {
    return { name: 'talent-search' }
  }
  const resolved = resolveHireCategorySlug(raw)
  if (!getHireTalentLanding(resolved)) {
    return { name: 'static-404' }
  }
  return true
}

function freelanceJobsLandingEnter(to: RouteLocationNormalized): RouteLocationRaw | true {
  const slug = typeof to.params.slug === 'string' ? to.params.slug : ''
  const landing = getFreelanceJobLanding(slug)
  if (!landing) {
    return { name: 'static-404' }
  }
  const m = to.meta as { title?: string }
  m.title = `${landing.heroSkill} Jobs`
  return true
}

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
        beforeEnter: redirectClientFromPublicHome,
      },
      {
        path: 'browse-jobs',
        name: 'browse-jobs',
        component: () => import('@/modules/jobs/pages/BrowseJobsPage.vue'),
        meta: { title: 'Browse Jobs' },
      },
      {
        path: 'freelance-jobs',
        name: 'freelance-jobs-index',
        component: () => import('@/modules/jobs/pages/FreelanceJobsIndexPage.vue'),
        meta: { title: 'Freelance Jobs: Work Remote & Earn Online' },
      },
      {
        path: 'freelance-jobs/:slug',
        name: 'freelance-jobs-landing',
        component: () => import('@/modules/jobs/pages/FreelanceJobsLandingPage.vue'),
        meta: { title: 'Find Work' },
        beforeEnter: freelanceJobsLandingEnter,
      },
      {
        path: 'hire',
        name: 'hire-hub',
        component: () => import('@/modules/public/pages/HireHubPage.vue'),
        meta: { title: 'Hire Freelancers' },
      },
      {
        path: 'hire/:slug',
        name: 'hire-talent-landing',
        component: () => import('@/modules/public/pages/HireTalentLandingPage.vue'),
        meta: { title: 'Hire talent' },
        beforeEnter: hireTalentLandingEnter,
      },
      {
        path: 'category/:slug',
        name: 'hire-talent-category',
        component: () => import('@/modules/public/pages/HireTalentLandingPage.vue'),
        meta: { title: 'Hire talent' },
        beforeEnter: hireTalentLandingEnter,
      },
      {
        path: 'browse-freelancers',
        name: 'browse-freelancers',
        component: () => import('@/modules/public/pages/BrowseFreelancersPage.vue'),
        meta: { title: 'Browse Freelancers' },
      },
      {
        path: 'search/talent',
        name: 'talent-search',
        component: () => import('@/modules/public/pages/TalentSearchPage.vue'),
        /** Browser title set in router `afterEach` (parallel to job search). */
        meta: { title: 'Search Freelance Talent' },
      },
      {
        path: 'search/jobs',
        name: 'job-search',
        component: () => import('@/modules/public/pages/JobSearchPage.vue'),
        /** Browser title set in router `afterEach` (Upwork-style: “Search Freelance Jobs on …”). */
        meta: { title: 'Search Freelance Jobs' },
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
        redirect: '/pricing/client',
      },
      {
        path: 'pricing/client',
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
