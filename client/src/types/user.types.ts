import type { Job } from './job.types'

// ── User & Profile ───────────────────────────────────────────

export type UserRole = 'guest' | 'freelancer' | 'client' | 'admin'
export type VerificationStatus = 'unverified' | 'pending' | 'verified'
export type FreelancerBadge = 'top_rated' | 'rising_talent' | 'top_rated_plus' | 'expert_vetted'
export type WithdrawalMethod = 'bank_transfer' | 'paypal' | 'payoneer' | 'wise' | 'crypto'

export interface User {
  id: string
  email: string
  username?: string
  role: UserRole
  firstName: string
  lastName: string
  phone?: string
  timezone?: string
  avatar?: string
  isEmailVerified: boolean
  is2FAEnabled: boolean
  // Client-specific profile fields (flattened for convenience)
  companyName?: string
  paymentVerified?: boolean
  memberSince?: string
  totalHires?: number
  totalSpent?: number
  rating?: number
  totalReviews?: number
  createdAt: string
  updatedAt: string
}

export interface FreelancerProfile {
  userId: string
  title: string
  bio: string
  hourlyRate: number
  skills: Skill[]
  portfolio: PortfolioItem[]
  certifications: Certification[]
  workHistory: WorkHistoryItem[]
  educationHistory: EducationItem[]
  employmentHistory: EmploymentItem[]
  totalEarnings: number
  totalJobsDone: number
  successRate: number
  jobSuccessScore: number
  rating: number
  totalReviews: number
  availability: 'available' | 'busy' | 'unavailable'
  responseTime?: string
  responseRate?: number
  location: string
  languages: Language[]
  verificationStatus: VerificationStatus
  badge?: FreelancerBadge
  connectsBalance?: number
  profileCompleteness?: number
  isIdentityVerified?: boolean
}

export interface ClientProfile {
  userId: string
  companyName?: string
  industry?: string
  companySize?: string
  website?: string
  description?: string
  location: string
  totalSpent: number
  totalHires: number
  paymentVerified: boolean
  rating: number
  totalReviews: number
  memberSince: string
}

export interface Skill {
  id: string
  name: string
  category: string
  level?: 'beginner' | 'intermediate' | 'expert'
}

export interface PortfolioItem {
  id: string
  title: string
  description: string
  imageUrl?: string
  projectUrl?: string
  technologies: string[]
  createdAt: string
}

export interface Certification {
  id: string
  name: string
  issuer: string
  issueDate: string
  expiryDate?: string
  credentialUrl?: string
}

export interface WorkHistoryItem {
  id: string
  jobTitle: string
  clientName: string
  feedback: string
  rating: number
  earnings: number
  startDate: string
  endDate: string
}

export interface EducationItem {
  id: string
  school: string
  degree: string
  fieldOfStudy: string
  startYear: number
  endYear?: number
  description?: string
}

export interface EmploymentItem {
  id: string
  company: string
  title: string
  startDate: string
  endDate?: string
  isCurrent: boolean
  description?: string
}

export interface Language {
  name: string
  proficiency: 'basic' | 'conversational' | 'fluent' | 'native'
}

export interface SavedJob {
  id: string
  jobId: string
  job: Partial<Job>
  savedAt: string
}

export interface ConnectsTransaction {
  id: string
  type: 'debit' | 'credit'
  amount: number
  description: string
  date: string
}

export interface PaymentMethod {
  id: string
  type: WithdrawalMethod
  label: string
  details: string
  isDefault: boolean
  addedAt: string
}

export interface UserManagementEntry {
  id: string
  email: string
  firstName: string
  lastName: string
  role: UserRole
  status?: 'active' | 'suspended' | 'deactivated'
  isEmailVerified: boolean
  isBanned?: boolean
  isSuspended?: boolean
  totalEarnings?: number
  totalSpent?: number
  joinedAt?: string
  createdAt?: string
  lastActive?: string
}

export interface Invitation {
  id: string
  jobId: string
  job?: Partial<Job>
  freelancerId: string
  freelancer?: Partial<User>
  clientId: string
  message?: string
  status: 'pending' | 'accepted' | 'declined' | 'expired'
  createdAt: string
}
