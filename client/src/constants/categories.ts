import type { SelectOption } from '@/types'

// ============================================================
// JOB CATEGORY CONSTANTS
// JOB_CATEGORIES + CATEGORY_OPTIONS — filters, post job, browse.
// HOME_BROWSE_CATEGORIES — home page hire tiles; each maps to a /hire/:slug landing.
// ============================================================

export type HomeCategoryIconId =
  | 'ai'
  | 'development'
  | 'design'
  | 'sales'
  | 'writing'
  | 'admin'
  | 'finance'
  | 'legal'
  | 'hr'
  | 'engineering'

export interface CategoryMeta {
  label: string
  value: string
  emoji: string
  jobCount: string
}

export interface HomeBrowseCategory {
  label: string
  /** Router path: `/hire/:slug` or `/browse-freelancers?…` */
  to: string
  icon: HomeCategoryIconId
}

export const JOB_CATEGORIES: CategoryMeta[] = [
  { label: 'Web Development', value: 'web-development', emoji: '💻', jobCount: '12,450' },
  { label: 'Mobile Apps', value: 'mobile-apps', emoji: '📱', jobCount: '5,320' },
  { label: 'Design & Creative', value: 'design', emoji: '🎨', jobCount: '8,900' },
  { label: 'Writing & Content', value: 'writing', emoji: '✍️', jobCount: '7,200' },
  { label: 'Digital Marketing', value: 'marketing', emoji: '📈', jobCount: '4,100' },
  { label: 'Data Science & ML', value: 'data-science', emoji: '📊', jobCount: '3,400' },
  { label: 'Game Development', value: 'game-development', emoji: '🎮', jobCount: '1,500' },
  { label: 'Video & Animation', value: 'video', emoji: '🎬', jobCount: '2,800' },
  { label: 'Finance & Accounting', value: 'finance', emoji: '💰', jobCount: '1,900' },
]

/** Home grid: paths align with hire-talent.subnav / hire-talent.mega-menu. */
export const HOME_BROWSE_CATEGORIES: HomeBrowseCategory[] = [
  { label: 'AI Services', to: '/hire/machine-learning-engineers', icon: 'ai' },
  { label: 'Development & IT', to: '/hire/web-developers', icon: 'development' },
  { label: 'Design & Creative', to: '/hire/graphic-designers', icon: 'design' },
  { label: 'Sales & Marketing', to: '/hire/digital-marketers', icon: 'sales' },
  { label: 'Writing & Translation', to: '/hire/content-writers', icon: 'writing' },
  { label: 'Admin & Support', to: '/hire/virtual-assistants', icon: 'admin' },
  { label: 'Finance & Accounting', to: '/hire/finance-professionals', icon: 'finance' },
  { label: 'Legal', to: '/hire/legal-professionals', icon: 'legal' },
  { label: 'HR & Training', to: '/hire/hr-specialists', icon: 'hr' },
  { label: 'Engineering & Architecture', to: '/hire/software-developers', icon: 'engineering' },
]

/** Flat select options derived from JOB_CATEGORIES, ready for AppSelect. */
export const CATEGORY_OPTIONS: SelectOption[] = JOB_CATEGORIES.map(({ label, value }) => ({
  label,
  value,
}))
