import { createRouter, createWebHistory, type RouteRecordRaw } from 'vue-router'
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

// ── GLOBAL NAVIGATION HOOK: page title ─────────────────────
router.afterEach((to) => {
  const baseTitle = 'Downwork | Hire Top Freelance Talent with Confidence'
  const pageTitle = to.meta.title as string | undefined
  
  if (to.name === 'home') {
    document.title = baseTitle
  } else {
    document.title = pageTitle ? `${pageTitle} | Downwork` : baseTitle
  }
})

export default router
