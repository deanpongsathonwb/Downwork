import { BaseService } from '@/services/http/base.service'
import type { AuthTokens, LoginPayload, RegisterPayload, User } from '@/types'

interface AuthResult {
  user: User
  tokens: AuthTokens
}

class AuthService extends BaseService {
  constructor() {
    super('/auth')
  }

  login(payload: LoginPayload) {
    return this.post<AuthResult>('/login', payload)
  }

  register(payload: RegisterPayload) {
    return this.post<AuthResult>('/register', payload)
  }

  logout() {
    return this.post<void>('/logout')
  }

  refreshToken(refreshToken: string) {
    return this.post<AuthTokens>('/refresh', { refreshToken })
  }

  forgotPassword(email: string) {
    return this.post<void>('/forgot-password', { email })
  }

  resetPassword(token: string, password: string) {
    return this.post<void>('/reset-password', { token, password })
  }

  verifyEmail(token: string) {
    return this.post<void>('/verify-email', { token })
  }

  resendVerificationEmail() {
    return this.post<void>('/resend-verification')
  }

  setup2FA() {
    return this.post<{ qrCode: string; secret: string }>('/2fa/setup')
  }

  verify2FA(code: string) {
    return this.post<void>('/2fa/verify', { code })
  }

  disable2FA(code: string) {
    return this.post<void>('/2fa/disable', { code })
  }

  getMe() {
    return this.get<User>('/me')
  }

  changeEmail(newEmail: string, password: string) {
    return this.post<void>('/change-email', { newEmail, password })
  }

  deleteAccount(password: string) {
    return this.post<void>('/delete-account', { password })
  }

  deactivateAccount() {
    return this.post<void>('/deactivate')
  }

  getSessions() {
    return this.get<{ id: string; device: string; ip: string; lastActive: string; isCurrent: boolean }[]>('/sessions')
  }

  revokeSession(sessionId: string) {
    return this.delete<void>(`/sessions/${sessionId}`)
  }

  revokeAllSessions() {
    return this.delete<void>('/sessions')
  }
}

export const authService = new AuthService()
