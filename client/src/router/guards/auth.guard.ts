import type { RouteLocationNormalized, RouteLocationRaw } from 'vue-router'
import { useAuthStore } from '@/stores/auth.store'
import type { UserRole } from '@/types'

// ============================================================
// ROUTE GUARD UTILITIES
// ============================================================

/**
 * requiresAuth — redirect unauthenticated users to login
 */
export function requiresAuth(
  to: RouteLocationNormalized,
  _from: RouteLocationNormalized,
): RouteLocationRaw | undefined {
  const auth = useAuthStore()
  if (!auth.isAuthenticated) {
    return { path: '/auth/login', query: { redirect: to.fullPath } }
  }
}

/**
 * requiresGuest — redirect authenticated users away from auth pages
 */
export function requiresGuest(
  _to: RouteLocationNormalized,
  _from: RouteLocationNormalized,
): RouteLocationRaw | undefined {
  const auth = useAuthStore()
  if (auth.isAuthenticated) {
    const roleRedirectMap: Record<UserRole, string> = {
      guest: '/',
      freelancer: '/freelancer/dashboard',
      client: '/client/dashboard',
      admin: '/admin/dashboard',
    }
    return { path: roleRedirectMap[auth.role] }
  }
}

/**
 * requiresRole — restrict page to specific roles
 */
export function requiresRole(roles: UserRole[]) {
  return (
    to: RouteLocationNormalized,
    _from: RouteLocationNormalized,
  ): RouteLocationRaw | undefined => {
    const auth = useAuthStore()
    if (!auth.isAuthenticated) {
      return { path: '/auth/login', query: { redirect: to.fullPath } }
    } else if (!roles.includes(auth.role)) {
      return { path: '/403' }
    }
  }
}

/** Post-registration client onboarding — only `client` role. */
export function requiresClient(
  to: RouteLocationNormalized,
  _from: RouteLocationNormalized,
): RouteLocationRaw | undefined {
  const auth = useAuthStore()
  if (!auth.isAuthenticated) {
    return { path: '/auth/login', query: { redirect: to.fullPath } }
  }
  if (auth.role !== 'client') {
    const roleRedirectMap: Record<UserRole, string> = {
      guest: '/',
      freelancer: '/freelancer/dashboard',
      client: '/client/dashboard',
      admin: '/admin/dashboard',
    }
    return { path: roleRedirectMap[auth.role] }
  }
}

/**
 * requiresOnboarding — redirect unverified users to email verification
 */
export function requiresOnboarding(
  _to: RouteLocationNormalized,
  _from: RouteLocationNormalized,
): RouteLocationRaw | undefined {
  const auth = useAuthStore()
  if (auth.isAuthenticated && auth.user && !auth.user.isEmailVerified) {
    return { path: '/auth/verify-email' }
  }
}

/**
 * requiresEmailVerification — block unverified users from sensitive pages
 */
export function requiresEmailVerification(
  _to: RouteLocationNormalized,
  _from: RouteLocationNormalized,
): RouteLocationRaw | undefined {
  const auth = useAuthStore()
  if (auth.isAuthenticated && !auth.user?.isEmailVerified) {
    return { path: '/auth/verify-email' }
  }
}

/** Logged-in clients use the job-post welcome flow instead of the public marketing home. */
export function redirectClientFromPublicHome(
  _to: RouteLocationNormalized,
  _from: RouteLocationNormalized,
): RouteLocationRaw | undefined {
  const auth = useAuthStore()
  if (auth.isAuthenticated && auth.role === 'client') {
    return { name: 'client-job-post-instant-welcome' }
  }
}
