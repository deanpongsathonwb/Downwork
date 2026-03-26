import { BaseService } from '@/services/http/base.service'
import type { FreelancerProfile, ClientProfile, User } from '@/types'

interface FreelancerSearchParams {
  search?: string
  category?: string
  minRate?: number
  maxRate?: number
  rating?: number
  availability?: string
  sortBy?: string
  page?: number
  limit?: number
}

class UserService extends BaseService {
  constructor() {
    super('/users')
  }

  getFreelancers(params?: FreelancerSearchParams) {
    return this.get<(User & FreelancerProfile)[]>('/freelancers', { params })
  }

  getFreelancerProfile(userId: string) {
    return this.get<User & FreelancerProfile>(`/${userId}/freelancer-profile`)
  }

  getClientProfile(userId: string) {
    return this.get<User & ClientProfile>(`/${userId}/client-profile`)
  }

  updateFreelancerProfile(payload: Partial<FreelancerProfile>) {
    return this.put<FreelancerProfile>('/me/freelancer-profile', payload)
  }

  updateClientProfile(payload: Partial<ClientProfile>) {
    return this.put<ClientProfile>('/me/client-profile', payload)
  }

  updateAvatar(formData: FormData) {
    return this.upload<{ avatarUrl: string }>('/me/avatar', formData)
  }

  updatePassword(currentPassword: string, newPassword: string) {
    return this.put<void>('/me/password', { currentPassword, newPassword })
  }

  updateAccountSettings(payload: Partial<User>) {
    return this.patch<User>('/me', payload)
  }

  updateNotificationPreferences(prefs: Record<string, boolean>) {
    return this.put<void>('/me/notification-preferences', prefs)
  }
}

export const userService = new UserService()
