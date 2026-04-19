import { createRouter, createWebHistory, type RouteRecordRaw } from 'vue-router'
import { APP_CONFIG } from '@/config/app.config'
import { getHireTalentLanding, getHireTalentTitleMetaSegment } from '@/constants/hire-talent.landing'
import { useAuthStore } from '@/stores/auth.store'
import { publicRoutes } from './routes/public.routes'
import { authRoutes } from './routes/auth.routes'
import { freelancerRoutes } from './routes/freelancer.routes'
import { clientRoutes } from './routes/client.routes'
import { adminRoutes } from './routes/admin.routes'

// ============================================================
// ERROR & FALLBACK ROUTES
// ============================================================

const errorRoutes: RouteRecordRaw[] = [
  {
    path: '/403',
    name: '403',
    component: () => import('@/components/common/Error403.vue'),
    meta: { title: 'Access Denied' },
  },
  {
    path: '/404',
    name: 'static-404',
    component: () => import('@/components/common/Error404.vue'),
    meta: { title: 'Page Not Found' },
  },
  {
    path: '/:pathMatch(.*)*',
    name: '404',
    component: () => import('@/components/common/Error404.vue'),
    meta: { title: 'Page Not Found' },
  },
]

// ============================================================
// ROUTER INSTANCE
// ============================================================

const router = createRouter({
  history: createWebHistory(import.meta.env.BASE_URL),
  routes: [
    ...publicRoutes,
    ...authRoutes,
    ...freelancerRoutes,
    ...clientRoutes,
    ...adminRoutes,
    ...errorRoutes,
  ],
  scrollBehavior(to, _from, savedPosition) {
    if (savedPosition) return savedPosition
    if (to.hash) return { el: to.hash, behavior: 'smooth' }
    return { top: 0 }
  },
})

// ── GLOBAL NAVIGATION GUARD: auth & role checks ────────────
router.beforeEach((to) => {
  if (to.matched.some(r => r.beforeEnter)) return

  try {
    const auth = useAuthStore()

    if (to.meta.requiresAuth && !auth.isAuthenticated) {
      return { path: '/auth/login', query: { redirect: to.fullPath } }
    }

    if (to.meta.roles && Array.isArray(to.meta.roles)) {
      if (!auth.isAuthenticated) {
        return { path: '/auth/login', query: { redirect: to.fullPath } }
      }
      if (!to.meta.roles.includes(auth.role)) {
        return { path: '/403' }
      }
    }
  } catch {
    // Pinia not yet initialized — allow navigation
  }
})

// ── GLOBAL NAVIGATION HOOK: page title (e.g. "Review - Downwork") ──
// Keep /, /search/jobs, /search/talent titles aligned with the inline script in index.html (first paint).
router.afterEach((to) => {
  const homeTitle = `${APP_CONFIG.name} | Hire Top Freelance Talent with Confidence`
  const brand = APP_CONFIG.name

  if (to.name === 'hire-talent-landing') {
    const slug = typeof to.params.slug === 'string' ? to.params.slug : ''
    const landing = getHireTalentLanding(slug)
    if (landing) {
      document.title = `${getHireTalentTitleMetaSegment(landing)} - ${brand}`
      return
    }
  }

  if (to.name === 'job-search') {
    document.title = `Search Freelance Jobs on ${brand}`
    return
  }

  if (to.name === 'talent-search') {
    document.title = `Search Freelance Talent on ${brand}`
    return
  }

  if (to.name === 'freelance-jobs-index') {
    document.title = `Freelance Jobs on ${brand}: Work Remote & Earn Online`
    return
  }

  const pageTitle = to.meta.title as string | undefined

  if (to.name === 'home') {
    document.title = homeTitle
  } else if (to.name === 'login') {
    document.title = `${brand} Login - Log in to your ${brand} account`
  } else if (to.name === 'signup') {
    document.title = `Sign up for ${brand} | Client & Freelancer Accounts`
  } else {
    document.title = pageTitle ? `${pageTitle} - ${brand}` : homeTitle
  }
})

export default router
