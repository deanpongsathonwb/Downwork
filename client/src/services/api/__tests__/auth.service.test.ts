import { describe, it, expect, vi, beforeEach } from 'vitest'
import { authService } from '../auth.service'
import { httpClient } from '@/services/http/axios.instance'

vi.mock('@/services/http/axios.instance', () => ({
  httpClient: {
    get: vi.fn(),
    post: vi.fn(),
    put: vi.fn(),
    patch: vi.fn(),
    delete: vi.fn(),
  },
}))

describe('AuthService', () => {
  beforeEach(() => {
    vi.clearAllMocks()
  })

  describe('login', () => {
    it('calls POST /auth/login with credentials', async () => {
      const mockResponse = {
        data: {
          data: {
            user: { id: '1', email: 'test@example.com' },
            tokens: { accessToken: 'abc', refreshToken: 'xyz' },
          },
        },
      }
      vi.mocked(httpClient.post).mockResolvedValue(mockResponse)

      const payload = { email: 'test@example.com', password: 'password123' }
      await authService.login(payload)

      expect(httpClient.post).toHaveBeenCalledWith('/auth/login', payload, undefined)
    })
  })

  describe('register', () => {
    it('calls POST /auth/register with user data', async () => {
      const mockResponse = { data: { data: { user: {}, tokens: {} } } }
      vi.mocked(httpClient.post).mockResolvedValue(mockResponse)

      const payload = {
        email: 'new@example.com',
        password: 'password123',
        firstName: 'John',
        lastName: 'Doe',
        role: 'freelancer' as const,
      }
      await authService.register(payload)

      expect(httpClient.post).toHaveBeenCalledWith('/auth/register', payload, undefined)
    })
  })

  describe('logout', () => {
    it('calls POST /auth/logout', async () => {
      const mockResponse = { data: { data: null } }
      vi.mocked(httpClient.post).mockResolvedValue(mockResponse)

      await authService.logout()

      expect(httpClient.post).toHaveBeenCalledWith('/auth/logout', undefined, undefined)
    })
  })

  describe('refreshToken', () => {
    it('calls POST /auth/refresh with refresh token', async () => {
      const mockResponse = {
        data: { data: { accessToken: 'new-access', refreshToken: 'new-refresh' } },
      }
      vi.mocked(httpClient.post).mockResolvedValue(mockResponse)

      await authService.refreshToken('old-refresh-token')

      expect(httpClient.post).toHaveBeenCalledWith(
        '/auth/refresh',
        { refreshToken: 'old-refresh-token' },
        undefined,
      )
    })
  })

  describe('forgotPassword', () => {
    it('calls POST /auth/forgot-password with email', async () => {
      const mockResponse = { data: { data: null } }
      vi.mocked(httpClient.post).mockResolvedValue(mockResponse)

      await authService.forgotPassword('test@example.com')

      expect(httpClient.post).toHaveBeenCalledWith(
        '/auth/forgot-password',
        { email: 'test@example.com' },
        undefined,
      )
    })
  })

  describe('resetPassword', () => {
    it('calls POST /auth/reset-password with token and password', async () => {
      const mockResponse = { data: { data: null } }
      vi.mocked(httpClient.post).mockResolvedValue(mockResponse)

      await authService.resetPassword('reset-token', 'newPassword123')

      expect(httpClient.post).toHaveBeenCalledWith(
        '/auth/reset-password',
        { token: 'reset-token', password: 'newPassword123' },
        undefined,
      )
    })
  })

  describe('verifyEmail', () => {
    it('calls POST /auth/verify-email with token', async () => {
      const mockResponse = { data: { data: null } }
      vi.mocked(httpClient.post).mockResolvedValue(mockResponse)

      await authService.verifyEmail('verify-token')

      expect(httpClient.post).toHaveBeenCalledWith(
        '/auth/verify-email',
        { token: 'verify-token' },
        undefined,
      )
    })
  })

  describe('setup2FA', () => {
    it('calls POST /auth/2fa/setup', async () => {
      const mockResponse = {
        data: { data: { qrCode: 'base64...', secret: 'ABCD1234' } },
      }
      vi.mocked(httpClient.post).mockResolvedValue(mockResponse)

      await authService.setup2FA()

      expect(httpClient.post).toHaveBeenCalledWith('/auth/2fa/setup', undefined, undefined)
    })
  })

  describe('verify2FA', () => {
    it('calls POST /auth/2fa/verify with code', async () => {
      const mockResponse = { data: { data: null } }
      vi.mocked(httpClient.post).mockResolvedValue(mockResponse)

      await authService.verify2FA('123456')

      expect(httpClient.post).toHaveBeenCalledWith(
        '/auth/2fa/verify',
        { code: '123456' },
        undefined,
      )
    })
  })

  describe('getMe', () => {
    it('calls GET /auth/me', async () => {
      const mockResponse = { data: { data: { id: '1', email: 'test@example.com' } } }
      vi.mocked(httpClient.get).mockResolvedValue(mockResponse)

      await authService.getMe()

      expect(httpClient.get).toHaveBeenCalledWith('/auth/me', undefined)
    })
  })
})
