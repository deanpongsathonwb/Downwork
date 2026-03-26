import { describe, it, expect, vi, beforeEach } from 'vitest'
import { requiresAuth, requiresGuest, requiresRole, requiresEmailVerification } from '../auth.guard'
import type { RouteLocationNormalized } from 'vue-router'

const mockAuthStore = {
  isAuthenticated: false,
  get role() {
    return this.user?.role ?? 'guest'
  },
  user: null as { role?: string; isEmailVerified?: boolean } | null,
}

vi.mock('@/stores/auth.store', () => ({
  useAuthStore: () => mockAuthStore,
}))

function createMockRoute(path: string = '/'): RouteLocationNormalized {
  return {
    path,
    fullPath: path,
    name: undefined,
    params: {},
    query: {},
    hash: '',
    matched: [],
    meta: {},
    redirectedFrom: undefined,
  }
}

describe('Auth Guards', () => {
  beforeEach(() => {
    mockAuthStore.isAuthenticated = false
    mockAuthStore.user = null
  })

  describe('requiresAuth', () => {
    it('redirects to login when not authenticated', () => {
      const to = createMockRoute('/dashboard')
      const from = createMockRoute('/')

      const result = requiresAuth(to, from)

      expect(result).toEqual({
        path: '/auth/login',
        query: { redirect: '/dashboard' },
      })
    })

    it('allows access when authenticated', () => {
      mockAuthStore.isAuthenticated = true
      mockAuthStore.user = { role: 'freelancer' }

      const to = createMockRoute('/dashboard')
      const from = createMockRoute('/')

      const result = requiresAuth(to, from)

      expect(result).toBeUndefined()
    })
  })

  describe('requiresGuest', () => {
    it('allows access when not authenticated', () => {
      const to = createMockRoute('/auth/login')
      const from = createMockRoute('/')

      const result = requiresGuest(to, from)

      expect(result).toBeUndefined()
    })

    it('redirects freelancer to freelancer dashboard when authenticated', () => {
      mockAuthStore.isAuthenticated = true
      mockAuthStore.user = { role: 'freelancer' }

      const to = createMockRoute('/auth/login')
      const from = createMockRoute('/')

      const result = requiresGuest(to, from)

      expect(result).toEqual({ path: '/freelancer/dashboard' })
    })

    it('redirects client to client dashboard when authenticated', () => {
      mockAuthStore.isAuthenticated = true
      mockAuthStore.user = { role: 'client' }

      const to = createMockRoute('/auth/login')
      const from = createMockRoute('/')

      const result = requiresGuest(to, from)

      expect(result).toEqual({ path: '/client/dashboard' })
    })

    it('redirects admin to admin dashboard when authenticated', () => {
      mockAuthStore.isAuthenticated = true
      mockAuthStore.user = { role: 'admin' }

      const to = createMockRoute('/auth/login')
      const from = createMockRoute('/')

      const result = requiresGuest(to, from)

      expect(result).toEqual({ path: '/admin/dashboard' })
    })
  })

  describe('requiresRole', () => {
    it('redirects to login when not authenticated', () => {
      const guard = requiresRole(['freelancer'])
      const to = createMockRoute('/freelancer/dashboard')
      const from = createMockRoute('/')

      const result = guard(to, from)

      expect(result).toEqual({
        path: '/auth/login',
        query: { redirect: '/freelancer/dashboard' },
      })
    })

    it('redirects to 403 when role does not match', () => {
      mockAuthStore.isAuthenticated = true
      mockAuthStore.user = { role: 'client' }

      const guard = requiresRole(['freelancer'])
      const to = createMockRoute('/freelancer/dashboard')
      const from = createMockRoute('/')

      const result = guard(to, from)

      expect(result).toEqual({ path: '/403' })
    })

    it('allows access when role matches', () => {
      mockAuthStore.isAuthenticated = true
      mockAuthStore.user = { role: 'freelancer' }

      const guard = requiresRole(['freelancer'])
      const to = createMockRoute('/freelancer/dashboard')
      const from = createMockRoute('/')

      const result = guard(to, from)

      expect(result).toBeUndefined()
    })

    it('allows access when user has one of multiple allowed roles', () => {
      mockAuthStore.isAuthenticated = true
      mockAuthStore.user = { role: 'admin' }

      const guard = requiresRole(['admin', 'client'])
      const to = createMockRoute('/admin/dashboard')
      const from = createMockRoute('/')

      const result = guard(to, from)

      expect(result).toBeUndefined()
    })
  })

  describe('requiresEmailVerification', () => {
    it('allows access when not authenticated', () => {
      const to = createMockRoute('/some-page')
      const from = createMockRoute('/')

      const result = requiresEmailVerification(to, from)

      expect(result).toBeUndefined()
    })

    it('redirects to verify-email when email is not verified', () => {
      mockAuthStore.isAuthenticated = true
      mockAuthStore.user = { isEmailVerified: false }

      const to = createMockRoute('/sensitive-page')
      const from = createMockRoute('/')

      const result = requiresEmailVerification(to, from)

      expect(result).toEqual({ path: '/auth/verify-email' })
    })

    it('allows access when email is verified', () => {
      mockAuthStore.isAuthenticated = true
      mockAuthStore.user = { isEmailVerified: true }

      const to = createMockRoute('/sensitive-page')
      const from = createMockRoute('/')

      const result = requiresEmailVerification(to, from)

      expect(result).toBeUndefined()
    })
  })
})
