/**
 * Hire-talent landings: top tabs match Find Work; mega content is hire-specific (see hire-talent.mega-menu.ts).
 */

import type { FreelanceJobsSubnavItem } from './freelance-jobs.landing'

export { HIRE_TALENT_MEGA_MENU } from './hire-talent.mega-menu'

const HIRE_DEV: readonly string[] = [
  'web-developers',
  'wordpress-developers',
  'python-developers',
  'software-developers',
  'mobile-app-developers',
  'automation-engineers',
  'ethical-hackers',
]

const HIRE_AI: readonly string[] = ['machine-learning-engineers', 'computer-vision-engineers', 'chatbot-developers']

const HIRE_DESIGN: readonly string[] = [
  'graphic-designers',
  'illustrators',
  'logo-designers',
  'ux-designers',
  'web-designers',
]

const HIRE_MKT: readonly string[] = [
  'digital-marketers',
  'email-marketers',
  'google-ads-experts',
  'seo-experts',
  'social-media-managers',
  'cold-callers',
  'lead-generation-specialists',
]

const HIRE_ADMIN: readonly string[] = ['virtual-assistants', 'personal-assistants', 'content-moderators']

const HIRE_MORE: readonly string[] = [
  'animators',
  'audio-editors',
  'music-producers',
  'video-editors',
  'voice-actors',
  'book-editors',
  'content-writers',
  'copywriters',
  'email-copywriters',
  'ghostwriters',
  'finance-professionals',
  'legal-professionals',
  'hr-specialists',
]

/** Compact "More" menu on /search/talent (no mega panel). */
export const HIRE_TALENT_SIMPLE_MORE_LINKS: readonly { label: string; to: string; dividerBefore?: boolean }[] = [
  { label: 'Writing & Translation', to: '/hire/content-writers' },
  { label: 'Finance & Accounting', to: '/hire/finance-professionals' },
  { label: 'HR & Training', to: '/hire/hr-specialists' },
  { label: 'Legal', to: '/hire/legal-professionals' },
  { label: 'Engineering & Architecture', to: '/hire/software-developers' },
  { label: 'See all specializations', to: '/search/talent', dividerBefore: true },
]

export const HIRE_TALENT_SUBNAV_ITEMS: FreelanceJobsSubnavItem[] = [
  {
    label: 'Development & IT',
    to: '/hire/web-developers',
    activeSlugs: HIRE_DEV,
    megaMenuKey: 'dev',
  },
  {
    label: 'AI Services',
    to: '/hire/machine-learning-engineers',
    activeSlugs: HIRE_AI,
    megaMenuKey: 'ai',
  },
  {
    label: 'Design & Creative',
    to: '/hire/graphic-designers',
    activeSlugs: HIRE_DESIGN,
    megaMenuKey: 'design',
  },
  {
    label: 'Sales & Marketing',
    to: '/hire/digital-marketers',
    activeSlugs: HIRE_MKT,
    megaMenuKey: 'marketing',
  },
  {
    label: 'Admin & Customer Support',
    to: '/hire/virtual-assistants',
    activeSlugs: HIRE_ADMIN,
    megaMenuKey: 'admin',
  },
  {
    label: 'More',
    to: '/search/talent',
    activeSlugs: HIRE_MORE,
    megaMenuKey: 'more',
  },
]
