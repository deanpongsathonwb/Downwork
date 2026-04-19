import { defineStore } from 'pinia'
import { ref, computed } from 'vue'
import type { FreelancerProfile, ClientProfile, User } from '@/types'
import { userService } from '@/services/api/user.service'
import { useAuthStore } from './auth.store'
import { useToastStore } from './toast.store'
import { logger } from '@/utils/logger'

export const useUserStore = defineStore('user', () => {
  const auth = useAuthStore()
  const toast = useToastStore()

  const freelancerProfile = ref<(User & FreelancerProfile) | null>(null)
  const clientProfile = ref<(User & ClientProfile) | null>(null)
  const freelancersList = ref<(User & FreelancerProfile)[]>([])
  const isLoading = ref(false)
  const isUpdating = ref(false)
  const error = ref<string | null>(null)

  const profileCompleteness = computed(() => {
    if (!freelancerProfile.value) return 0
    const p = freelancerProfile.value
    let score = 0
    if (p.title) score += 15
    if (p.bio) score += 15
    if (p.hourlyRate) score += 10
    if (p.skills.length > 0) score += 15
    if (p.portfolio.length > 0) score += 15
    if (p.educationHistory.length > 0) score += 10
    if (p.employmentHistory.length > 0) score += 10
    if (p.languages.length > 0) score += 10
    return Math.min(score, 100)
  })

  async function fetchFreelancerProfile(userId: string): Promise<void> {
    isLoading.value = true
    error.value = null
    try {
      const res = await userService.getFreelancerProfile(userId)
      freelancerProfile.value = res.data
    } catch (err) {
      logger.catch(err, 'UserStore.fetchFreelancerProfile')
      error.value = 'Failed to load profile.'
    } finally {
      isLoading.value = false
    }
  }

  async function fetchClientProfile(userId: string): Promise<void> {
    isLoading.value = true
    try {
      const res = await userService.getClientProfile(userId)
      clientProfile.value = res.data
    } catch (err) {
      logger.catch(err, 'UserStore.fetchClientProfile')
      error.value = 'Failed to load profile.'
    } finally {
      isLoading.value = false
    }
  }

  async function updateFreelancerProfile(payload: Partial<FreelancerProfile>): Promise<boolean> {
    isUpdating.value = true
    try {
      const res = await userService.updateFreelancerProfile(payload)
      if (freelancerProfile.value) {
        Object.assign(freelancerProfile.value, res.data)
      }
      toast.success('Profile Updated')
      return true
    } catch (err) {
      logger.catch(err, 'UserStore.updateFreelancerProfile')
      toast.error('Update Failed', 'Could not save profile changes.')
      return false
    } finally {
      isUpdating.value = false
    }
  }

  async function updateClientProfile(payload: Partial<ClientProfile>): Promise<boolean> {
    isUpdating.value = true
    try {
      const res = await userService.updateClientProfile(payload)
      if (clientProfile.value) {
        Object.assign(clientProfile.value, res.data)
      }
      toast.success('Profile Updated')
      return true
    } catch (err) {
      logger.catch(err, 'UserStore.updateClientProfile')
      toast.error('Update Failed', 'Could not save profile changes.')
      return false
    } finally {
      isUpdating.value = false
    }
  }

  async function updateAvatar(file: File): Promise<string | null> {
    const formData = new FormData()
    formData.append('avatar', file)
    try {
      const res = await userService.updateAvatar(formData)
      if (auth.user) auth.user.avatar = res.data.avatarUrl
      toast.success('Avatar Updated')
      return res.data.avatarUrl
    } catch (err) {
      logger.catch(err, 'UserStore.updateAvatar')
      toast.error('Upload Failed')
      return null
    }
  }

  async function changePassword(currentPassword: string, newPassword: string): Promise<boolean> {
    isUpdating.value = true
    try {
      await userService.updatePassword(currentPassword, newPassword)
      toast.success('Password Changed')
      return true
    } catch (err) {
      logger.catch(err, 'UserStore.changePassword')
      toast.error('Failed', 'Could not change password. Check your current password.')
      return false
    } finally {
      isUpdating.value = false
    }
  }

  async function updateSettings(payload: Partial<User>): Promise<boolean> {
    isUpdating.value = true
    try {
      const res = await userService.updateAccountSettings(payload)
      if (auth.user) Object.assign(auth.user, res.data)
      toast.success('Settings Saved')
      return true
    } catch (err) {
      logger.catch(err, 'UserStore.updateSettings')
      toast.error('Failed', 'Could not save settings.')
      return false
    } finally {
      isUpdating.value = false
    }
  }

  async function fetchFreelancers(params?: Record<string, unknown>): Promise<void> {
    isLoading.value = true
    error.value = null
    try {
      const res = await userService.getFreelancers(params)
      freelancersList.value = res.data.data
    } catch (err) {
      logger.catch(err, 'UserStore.fetchFreelancers')
      error.value = 'Failed to load freelancers.'
    } finally {
      isLoading.value = false
    }
  }

  return {
    freelancerProfile,
    clientProfile,
    freelancersList,
    isLoading,
    isUpdating,
    error,
    profileCompleteness,
    fetchFreelancerProfile,
    fetchClientProfile,
    updateFreelancerProfile,
    updateClientProfile,
    updateAvatar,
    changePassword,
    updateSettings,
    fetchFreelancers,
  }
})
