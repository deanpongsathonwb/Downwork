import type {
  User,
  FreelancerProfile,
  Skill,
  PortfolioItem,
  WorkHistoryItem,
  EducationItem,
  Certification,
  Language,
} from '@/types'

function num(v: unknown, fallback = 0): number {
  const n = Number(v)
  return Number.isFinite(n) ? n : fallback
}

function normalizeSkills(skills: unknown): Skill[] {
  if (!Array.isArray(skills)) return []
  return skills.map((s, i) => {
    if (typeof s === 'string') return { id: `skill-${i}`, name: s, category: 'general' }
    const o = s as Record<string, unknown>
    return {
      id: String(o.id ?? `skill-${i}`),
      name: String(o.name ?? ''),
      category: String(o.category ?? 'general'),
      level: o.level as Skill['level'] | undefined,
    }
  })
}

function normalizePortfolio(items: unknown): PortfolioItem[] {
  if (!Array.isArray(items)) return []
  return items.map((item, i) => {
    if (typeof item !== 'object' || !item) {
      return { id: `p-${i}`, title: '', description: '', technologies: [], createdAt: '' }
    }
    const o = item as Record<string, unknown>
    return {
      id: String(o.id ?? `p-${i}`),
      title: String(o.title ?? ''),
      description: String(o.description ?? ''),
      imageUrl: o.imageUrl as string | undefined,
      projectUrl: o.projectUrl as string | undefined,
      technologies: Array.isArray(o.technologies) ? o.technologies.map(String) : [],
      createdAt: String(o.createdAt ?? ''),
    }
  })
}

function normalizeWorkHistory(experience: unknown): WorkHistoryItem[] {
  if (!Array.isArray(experience)) return []
  return experience.map((item, i) => {
    const o = (typeof item === 'object' && item ? item : {}) as Record<string, unknown>
    const role = String(o.role ?? o.jobTitle ?? 'Role')
    const company = String(o.company ?? o.clientName ?? 'Client')
    return {
      id: String(o.id ?? `wh-${i}`),
      jobTitle: role,
      clientName: company,
      feedback: String(o.description ?? o.feedback ?? ''),
      rating: num(o.rating, 5),
      earnings: num(o.earnings, 0),
      startDate: String(o.from ?? o.startDate ?? ''),
      endDate: String(o.to ?? o.endDate ?? ''),
    }
  })
}

function normalizeEducation(edu: unknown): EducationItem[] {
  if (!Array.isArray(edu)) return []
  return edu.map((item, i) => {
    const o = (typeof item === 'object' && item ? item : {}) as Record<string, unknown>
    return {
      id: String(o.id ?? `edu-${i}`),
      school: String(o.school ?? ''),
      degree: String(o.degree ?? ''),
      fieldOfStudy: String(o.fieldOfStudy ?? o.field ?? ''),
      startYear: num(o.startYear ?? o.from, 0),
      endYear: o.endYear !== undefined && o.endYear !== null ? num(o.endYear) : undefined,
      description: o.description as string | undefined,
    }
  })
}

function normalizeCertifications(items: unknown): Certification[] {
  if (!Array.isArray(items)) return []
  return items.map((item, i) => {
    const o = (typeof item === 'object' && item ? item : {}) as Record<string, unknown>
    return {
      id: String(o.id ?? `cert-${i}`),
      name: String(o.name ?? ''),
      issuer: String(o.issuer ?? ''),
      issueDate: String(o.issueDate ?? ''),
      expiryDate: o.expiryDate as string | undefined,
      credentialUrl: o.credentialUrl as string | undefined,
    }
  })
}

function normalizeLanguages(items: unknown): Language[] {
  if (!Array.isArray(items)) return []
  return items.map((item, i) => {
    if (typeof item === 'string') return { name: item, proficiency: 'fluent' }
    const o = (typeof item === 'object' && item ? item : {}) as Record<string, unknown>
    const name = String(o.name ?? o.language ?? `Language ${i}`)
    const p = String(o.proficiency ?? 'conversational') as Language['proficiency']
    const proficiency = ['basic', 'conversational', 'fluent', 'native'].includes(p)
      ? (p as Language['proficiency'])
      : 'conversational'
    return { name, proficiency }
  })
}

/**
 * Maps GET /users/:id/freelancer-profile (merged Prisma payload) to UI FreelancerProfile shape.
 */
export function normalizeFreelancerApiToProfile(raw: Record<string, unknown>): User & FreelancerProfile {
  const fp = (raw.freelancerProfile as Record<string, unknown> | null) ?? {}
  const reviewCount = num(raw.reviewCount ?? raw.totalReviews ?? fp.reviewCount)
  const completedJobs = num(raw.completedJobs ?? raw.totalJobsDone ?? fp.completedJobs)
  const rating = num(raw.rating ?? fp.rating)
  const successRate = num(raw.successRate ?? fp.successRate)
  const hourlyRate = num(raw.hourlyRate ?? fp.hourlyRate)
  const totalEarnings = num(raw.totalEarnings ?? fp.totalEarnings)

  const skills = normalizeSkills(raw.skills ?? fp.skills)
  const portfolioRaw = raw.portfolio ?? raw.portfolioItems ?? fp.portfolioItems
  const experience = raw.experience ?? fp.experience
  const education = raw.education ?? fp.education
  const certifications = normalizeCertifications(raw.certifications ?? fp.certifications)
  const languages = normalizeLanguages(raw.languages ?? fp.languages)

  const userId = String(raw.userId ?? fp.userId ?? raw.id ?? '')
  const isEmailVerified = Boolean(raw.isEmailVerified)

  return {
    id: String(raw.id ?? ''),
    email: String(raw.email ?? ''),
    role: (raw.role as User['role']) ?? 'freelancer',
    firstName: String(raw.firstName ?? ''),
    lastName: String(raw.lastName ?? ''),
    phone: raw.phone as string | undefined,
    timezone: raw.timezone as string | undefined,
    avatar: raw.avatar as string | undefined,
    isEmailVerified,
    is2FAEnabled: Boolean(raw.is2FAEnabled ?? raw.twoFactorEnabled),
    createdAt: String(raw.createdAt ?? ''),
    updatedAt: String(raw.updatedAt ?? ''),
    location: (raw.location as string | undefined) ?? '',

    userId,
    title: String(raw.title ?? fp.title ?? ''),
    bio: String(raw.bio ?? fp.bio ?? ''),
    hourlyRate,
    skills,
    portfolio: normalizePortfolio(portfolioRaw),
    certifications,
    workHistory: normalizeWorkHistory(experience),
    educationHistory: normalizeEducation(education),
    languages,
    employmentHistory: [],
    totalEarnings,
    totalJobsDone: completedJobs,
    successRate,
    jobSuccessScore: successRate,
    rating,
    totalReviews: reviewCount,
    availability: (raw.availability ?? fp.availability ?? 'available') as FreelancerProfile['availability'],
    responseTime: (raw.responseTime ?? fp.responseTime) as string | undefined,
    responseRate: num(raw.responseRate ?? fp.responseRate, 0) || undefined,
    verificationStatus: isEmailVerified ? 'verified' : 'unverified',
    badge: raw.badge as FreelancerProfile['badge'],
    connectsBalance: num(raw.connectsBalance ?? fp.connectsBalance, 0),
    profileCompleteness: num(raw.profileCompleteness ?? fp.profileCompleteness, 0),
    isIdentityVerified: Boolean(raw.isIdentityVerified),
  }
}
