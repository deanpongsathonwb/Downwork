import type { AxiosError } from 'axios';
import axios, { type AxiosInstance, type InternalAxiosRequestConfig, type AxiosResponse } from 'axios'
import { APP_CONFIG, AUTH_CONFIG } from '@/config/app.config'
import { useToastStore } from '@/stores/toast.store'
import { resolveMockRequest } from '@/mocks/mock.handler'
import { logger } from '@/utils/logger'

const USE_MOCK = import.meta.env.VITE_USE_MOCK === 'true'

// ============================================================
// TOKEN MANAGEMENT UTILITIES
// ============================================================

const USE_COOKIE_AUTH = import.meta.env.VITE_USE_COOKIE_AUTH === 'true'

interface TokenStorageAdapter {
  getAccessToken(): string | null
  getRefreshToken(): string | null
  setTokens(access: string, refresh: string): void
  clearTokens(): void
}

const localStorageAdapter: TokenStorageAdapter = {
  getAccessToken: () => localStorage.getItem(AUTH_CONFIG.accessTokenKey),
  getRefreshToken: () => localStorage.getItem(AUTH_CONFIG.refreshTokenKey),
  setTokens(access, refresh) {
    localStorage.setItem(AUTH_CONFIG.accessTokenKey, access)
    localStorage.setItem(AUTH_CONFIG.refreshTokenKey, refresh)
  },
  clearTokens() {
    localStorage.removeItem(AUTH_CONFIG.accessTokenKey)
    localStorage.removeItem(AUTH_CONFIG.refreshTokenKey)
    localStorage.removeItem(AUTH_CONFIG.userKey)
  },
}

/**
 * When using httpOnly cookies the server sets/clears tokens via Set-Cookie
 * headers. The frontend never reads the token directly — Axios sends
 * cookies automatically with `withCredentials: true`.
 */
const cookieAdapter: TokenStorageAdapter = {
  getAccessToken: () => null,
  getRefreshToken: () => null,
  setTokens() { /* server manages cookies */ },
  clearTokens() {
    localStorage.removeItem(AUTH_CONFIG.userKey)
  },
}

export const tokenStorage: TokenStorageAdapter = USE_COOKIE_AUTH ? cookieAdapter : localStorageAdapter

// ============================================================
// AXIOS INSTANCE
// ============================================================

let isRefreshing = false
let failedQueue: Array<{ resolve: (token: string) => void; reject: (err: unknown) => void }> = []

const processQueue = (error: unknown, token: string | null = null): void => {
  failedQueue.forEach((prom) => {
    if (error) {
      prom.reject(error)
    } else if (token) {
      prom.resolve(token)
    }
  })
  failedQueue = []
}

export const createAxiosInstance = (): AxiosInstance => {
  const instance = axios.create({
    baseURL: APP_CONFIG.apiBaseUrl,
    timeout: APP_CONFIG.apiTimeout,
    withCredentials: USE_COOKIE_AUTH,
    headers: {
      'Content-Type': 'application/json',
      Accept: 'application/json',
    },
  })

  // ── MOCK INTERCEPTOR ─────────────────────────────────────────
  if (USE_MOCK) {
    instance.interceptors.request.use(
      async (config: InternalAxiosRequestConfig) => {
        const mockResponse = await resolveMockRequest(config)
        if (mockResponse) {
          // Abort the real request and return mock data by throwing a
          // specially-shaped object that the response interceptor recognises.
          const mockError = Object.assign(new Error('__MOCK__'), {
            __isMock: true,
            __mockResponse: mockResponse,
            config,
            isAxiosError: false,
          })
          return Promise.reject(mockError)
        }
        return config
      },
      (error: AxiosError) => Promise.reject(error),
    )

    instance.interceptors.response.use(
      (response: AxiosResponse) => response,
      (error: unknown) => {
        if (error && typeof error === 'object' && '__isMock' in error) {
          const mockResponse = (error as unknown as { __mockResponse: AxiosResponse }).__mockResponse
          if (mockResponse.status >= 400) {
            return Promise.reject({
              ...error,
              isAxiosError: true,
              response: mockResponse,
            })
          }
          return Promise.resolve(mockResponse)
        }
        return Promise.reject(error)
      },
    )
  }

  // ── REQUEST INTERCEPTOR ──────────────────────────────────────
  instance.interceptors.request.use(
    (config: InternalAxiosRequestConfig) => {
      const token = tokenStorage.getAccessToken()
      if (token) {
        config.headers.Authorization = `Bearer ${token}`
      }
      return config
    },
    (error: AxiosError) => Promise.reject(error),
  )

  // ── RESPONSE INTERCEPTOR ─────────────────────────────────────
  instance.interceptors.response.use(
    (response: AxiosResponse) => response,
    async (error: AxiosError) => {
      // In mock mode all real errors are suppressed — mock interceptor handles them above
      if (USE_MOCK) return Promise.reject(error)

      const originalRequest = error.config as InternalAxiosRequestConfig & { _retry?: boolean }

      // Login/register (and similar) return 401 for invalid input — not an expired session.
      // Do not run refresh + session_expired redirect for those requests.
      const reqUrl = originalRequest.url ?? ''
      const skipRefresh401 =
        reqUrl.includes('/auth/login') ||
        reqUrl.includes('/auth/register') ||
        reqUrl.includes('/auth/forgot-password') ||
        reqUrl.includes('/auth/reset-password') ||
        reqUrl.includes('/auth/verify-email') ||
        reqUrl.includes('/auth/check-email')

      // 401 → attempt token refresh once
      if (error.response?.status === 401 && !originalRequest._retry && !skipRefresh401) {
        if (isRefreshing) {
          return new Promise((resolve, reject) => {
            failedQueue.push({ resolve, reject })
          })
            .then((token) => {
              originalRequest.headers.Authorization = `Bearer ${token as string}`
              return instance(originalRequest)
            })
            .catch((err) => Promise.reject(err))
        }

        originalRequest._retry = true
        isRefreshing = true

        try {
          const refreshToken = tokenStorage.getRefreshToken()
          if (!refreshToken) throw new Error('No refresh token')

          // ── MOCK: in production replace with real refresh endpoint ──
          const { data } = await axios.post(`${APP_CONFIG.apiBaseUrl}/auth/refresh`, {
            refreshToken,
          })

          const newAccessToken: string = data.data.accessToken
          tokenStorage.setTokens(newAccessToken, data.data.refreshToken ?? refreshToken)
          processQueue(null, newAccessToken)
          originalRequest.headers.Authorization = `Bearer ${newAccessToken}`
          return instance(originalRequest)
        } catch (refreshError) {
          processQueue(refreshError, null)
          tokenStorage.clearTokens()
          // Full page redirect — Vue Router is unavailable in the axios layer.
          // Using window.location ensures the app state is fully reset on session expiry.
          window.location.assign('/auth/login?reason=session_expired')
          return Promise.reject(refreshError)
        } finally {
          isRefreshing = false
        }
      }

      // Global error toasts (non-401 errors)
      if (error.response?.status !== 401) {
        try {
          const toast = useToastStore()
          const message =
            (error.response?.data as { message?: string })?.message ??
            'Something went wrong. Please try again.'
          toast.error('Request Failed', message)
        } catch (storeErr) {
          logger.warn('Toast store not yet initialized — could not show error toast', storeErr, 'AxiosInterceptor')
        }
      }

      return Promise.reject(error)
    },
  )

  return instance
}

export const httpClient: AxiosInstance = createAxiosInstance()
