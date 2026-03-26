import type { SelectOption } from '@/types'

// ============================================================
// JOB CATEGORY CONSTANTS
// Single source of truth — used by BrowseJobsPage, BrowseFreelancersPage,
// PostJobPage, and HomePage category grid.
// ============================================================

export interface CategoryMeta {
  label: string
  value: string
  emoji: string
  jobCount: string
}

export const JOB_CATEGORIES: CategoryMeta[] = [
  { label: 'Web Development',      value: 'web-development', emoji: '💻', jobCount: '12,450' },
  { label: 'Mobile Apps',          value: 'mobile-apps',     emoji: '📱', jobCount: '5,320'  },
  { label: 'Design & Creative',    value: 'design',          emoji: '🎨', jobCount: '8,900'  },
  { label: 'Writing & Content',    value: 'writing',         emoji: '✍️',  jobCount: '7,200'  },
  { label: 'Digital Marketing',    value: 'marketing',       emoji: '📈', jobCount: '4,100'  },
  { label: 'Data Science & ML',    value: 'data-science',    emoji: '📊', jobCount: '3,400'  },
  { label: 'Game Development',     value: 'game-development', emoji: '🎮', jobCount: '1,500'  },
  { label: 'Video & Animation',    value: 'video',           emoji: '🎬', jobCount: '2,800'  },
  { label: 'Finance & Accounting', value: 'finance',         emoji: '💰', jobCount: '1,900'  },
]

/** Flat select options derived from JOB_CATEGORIES, ready for AppSelect. */
export const CATEGORY_OPTIONS: SelectOption[] = JOB_CATEGORIES.map(({ label, value }) => ({
  label,
  value,
}))
