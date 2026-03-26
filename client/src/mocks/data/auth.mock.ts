import type { User, AuthTokens } from '@/types'

// ============================================================
// MOCK AUTH DATA
// ============================================================

export const MOCK_FREELANCER_USER: User = {
  id: 'user-freelancer-01',
  email: 'freelancer@demo.com',
  role: 'freelancer',
  firstName: 'Alex',
  lastName: 'Nguyen',
  avatar: undefined,
  isEmailVerified: true,
  is2FAEnabled: false,
  createdAt: '2024-01-15T08:00:00.000Z',
  updatedAt: new Date().toISOString(),
}

export const MOCK_CLIENT_USER: User = {
  id: 'user-client-01',
  email: 'client@demo.com',
  role: 'client',
  firstName: 'Sarah',
  lastName: 'Johnson',
  avatar: undefined,
  isEmailVerified: true,
  is2FAEnabled: false,
  createdAt: '2024-02-10T08:00:00.000Z',
  updatedAt: new Date().toISOString(),
}

export const MOCK_ADMIN_USER: User = {
  id: 'user-admin-01',
  email: 'admin@demo.com',
  role: 'admin',
  firstName: 'Admin',
  lastName: 'User',
  avatar: undefined,
  isEmailVerified: true,
  is2FAEnabled: false,
  createdAt: '2024-01-01T08:00:00.000Z',
  updatedAt: new Date().toISOString(),
}

export const MOCK_TOKENS: AuthTokens = {
  accessToken: 'mock-access-token-dev-only',
  refreshToken: 'mock-refresh-token-dev-only',
  expiresIn: 3600000,
}

/** Pick mock user by email for login simulation */
export function getMockUserByEmail(email: string): User {
  if (email.includes('admin')) return MOCK_ADMIN_USER
  if (email.includes('client')) return MOCK_CLIENT_USER
  return MOCK_FREELANCER_USER
}
