import { defineStore } from 'pinia'
import { ref, computed } from 'vue'
import { useRouter } from 'vue-router'
import type { User, AuthTokens, UserRole } from '@/types'
import { authService } from '@/services/api/auth.service'
import { tokenStorage } from '@/services/http/axios.instance'
import { AUTH_CONFIG } from '@/config/app.config'
import { useToastStore } from './toast.store'
import { logger } from '@/utils/logger'

// ============================================================
// AUTH STORE — Pinia Composition API
// ============================================================

export const useAuthStore = defineStore('auth', () => {
  const router = useRouter()
  const toast = useToastStore()

  // ── STATE ────────────────────────────────────────────────
  const user = ref<User | null>(null)
  const tokens = ref<AuthTokens | null>(null)
  const isLoading = ref(false)
  const error = ref<string | null>(null)

  // ── GETTERS ──────────────────────────────────────────────
  const isAuthenticated = computed(() => !!tokens.value?.accessToken && !!user.value)
  const role = computed<UserRole>(() => user.value?.role ?? 'guest')
  const isFreelancer = computed(() => user.value?.role === 'freelancer')
  const isClient = computed(() => user.value?.role === 'client')
  const isAdmin = computed(() => user.value?.role === 'admin')
  const fullName = computed(() =>
    user.value ? `${user.value.firstName} ${user.value.lastName}` : '',
  )
  const hasRole = (requiredRoles: UserRole[]) => requiredRoles.includes(role.value)

  // ── ACTIONS ──────────────────────────────────────────────

  function hydrateFromStorage(): void {
    const storedUser = localStorage.getItem(AUTH_CONFIG.userKey)
    const accessToken = tokenStorage.getAccessToken()
    const refreshToken = tokenStorage.getRefreshToken()

    if (!storedUser || !accessToken || !refreshToken) return

    try {
      const parsed = JSON.parse(storedUser) as User
      // Basic shape validation — guard against tampered localStorage
      if (!parsed?.id || !parsed?.email || !parsed?.role) {
        tokenStorage.clearTokens()
        return
      }
      user.value = parsed
      tokens.value = { accessToken, refreshToken, expiresIn: AUTH_CONFIG.sessionTtlMs }
    } catch (err) {
      logger.catch(err, 'AuthStore.hydrateFromStorage')
      tokenStorage.clearTokens()
    }
  }

  async function login(email: string, password: string): Promise<void> {
    isLoading.value = true
    error.value = null
    try {
      const res = await authService.login({ email, password })
      _setSession(res.data.user, res.data.tokens)
      toast.success('Welcome back!', `Hello, ${res.data.user.firstName}`)
      await _redirectAfterAuth()
    } catch (err: unknown) {
      error.value = _extractError(err)
      toast.error('Login Failed', error.value)
    } finally {
      isLoading.value = false
    }
  }

  async function register(payload: {
    email: string
    password: string
    firstName: string
    lastName: string
    role: 'freelancer' | 'client'
  }): Promise<void> {
    isLoading.value = true
    error.value = null
    try {
      const res = await authService.register(payload)
      _setSession(res.data.user, res.data.tokens)
      toast.success('Account Created!', 'Welcome to Downwork.')
      await _redirectAfterAuth()
    } catch (err: unknown) {
      error.value = _extractError(err)
      toast.error('Registration Failed', error.value)
    } finally {
      isLoading.value = false
    }
  }

  async function logout(): Promise<void> {
    try {
      await authService.logout()
    } catch (err) {
      logger.warn('Logout API call failed — clearing session anyway', err, 'AuthStore')
    } finally {
      _clearSession()
      await router.push('/auth/login')
      toast.info('Logged Out', 'See you next time!')
    }
  }

  async function forgotPassword(email: string): Promise<boolean> {
    isLoading.value = true
    try {
      await authService.forgotPassword(email)
      toast.success('Email Sent', 'Check your inbox for reset instructions.')
      return true
    } catch (err) {
      logger.catch(err, 'AuthStore.forgotPassword')
      return false
    } finally {
      isLoading.value = false
    }
  }

  async function resetPassword(token: string, password: string): Promise<boolean> {
    isLoading.value = true
    try {
      await authService.resetPassword(token, password)
      toast.success('Password Reset', 'You can now log in with your new password.')
      return true
    } catch {
      return false
    } finally {
      isLoading.value = false
    }
  }

  async function verifyEmail(token: string): Promise<boolean> {
    try {
      await authService.verifyEmail(token)
      if (user.value) user.value.isEmailVerified = true
      toast.success('Email Verified', 'Your email has been confirmed.')
      return true
    } catch (err) {
      logger.catch(err, 'AuthStore.verifyEmail')
      return false
    }
  }

  async function getMe(): Promise<void> {
    try {
      const res = await authService.getMe()
      user.value = res.data
      localStorage.setItem(AUTH_CONFIG.userKey, JSON.stringify(res.data))
    } catch (err) {
      logger.catch(err, 'AuthStore.getMe')
    }
  }

  function updateUser(partial: Partial<User>): void {
    if (user.value) {
      Object.assign(user.value, partial)
      localStorage.setItem(AUTH_CONFIG.userKey, JSON.stringify(user.value))
    }
  }

  async function setup2FA(): Promise<{ qrCode: string; secret: string } | null> {
    try {
      const res = await authService.setup2FA()
      return res.data
    } catch (err) {
      logger.catch(err, 'AuthStore.setup2FA')
      toast.error('Failed', 'Could not set up 2FA.')
      return null
    }
  }

  async function verify2FA(code: string): Promise<boolean> {
    try {
      await authService.verify2FA(code)
      if (user.value) user.value.is2FAEnabled = true
      toast.success('2FA Enabled', 'Two-factor authentication is now active.')
      return true
    } catch (err) {
      logger.catch(err, 'AuthStore.verify2FA')
      toast.error('Verification Failed', 'Invalid code. Please try again.')
      return false
    }
  }

  async function disable2FA(code: string): Promise<boolean> {
    try {
      await authService.disable2FA(code)
      if (user.value) user.value.is2FAEnabled = false
      toast.success('2FA Disabled')
      return true
    } catch (err) {
      logger.catch(err, 'AuthStore.disable2FA')
      toast.error('Failed', 'Could not disable 2FA.')
      return false
    }
  }

  async function refreshSession(): Promise<boolean> {
    const refreshToken = tokenStorage.getRefreshToken()
    if (!refreshToken) return false
    try {
      const res = await authService.refreshToken(refreshToken)
      tokens.value = res.data
      tokenStorage.setTokens(res.data.accessToken, res.data.refreshToken)
      return true
    } catch (err) {
      logger.catch(err, 'AuthStore.refreshSession')
      _clearSession()
      return false
    }
  }

  // ── PRIVATE HELPERS ──────────────────────────────────────

  function _setSession(u: User, t: AuthTokens): void {
    user.value = u
    tokens.value = t
    tokenStorage.setTokens(t.accessToken, t.refreshToken)
    localStorage.setItem(AUTH_CONFIG.userKey, JSON.stringify(u))
  }

  function _clearSession(): void {
    user.value = null
    tokens.value = null
    tokenStorage.clearTokens()
  }

  async function _redirectAfterAuth(): Promise<void> {
    const redirect = router.currentRoute.value.query.redirect as string | undefined
    if (redirect && redirect.startsWith('/')) {
      await router.push(redirect)
      return
    }
    const roleRoutes: Record<UserRole, string> = {
      guest: '/',
      freelancer: '/freelancer/dashboard',
      client: '/client/dashboard',
      admin: '/admin/dashboard',
    }
    await router.push(roleRoutes[role.value] ?? '/')
  }

  function _extractError(err: unknown): string {
    if (err instanceof Error) return err.message
    return 'An unexpected error occurred.'
  }

  return {
    // state
    user,
    tokens,
    isLoading,
    error,
    // getters
    isAuthenticated,
    role,
    isFreelancer,
    isClient,
    isAdmin,
    fullName,
    hasRole,
    // actions
    hydrateFromStorage,
    login,
    register,
    logout,
    forgotPassword,
    resetPassword,
    verifyEmail,
    getMe,
    updateUser,
    setup2FA,
    verify2FA,
    disable2FA,
    refreshSession,
  }
})
