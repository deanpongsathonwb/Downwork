/**
 * Landing pages under /freelance-jobs/:slug — mirrors Find Work mega menu.
 * jobFilters use the same `category` + `search` shape as /api mock + browse-jobs.
 */

import type { FreelanceJobsMegaMenuKey } from './freelance-jobs.mega-menu'

export interface FreelanceJobLandingEntry {
  slug: string
  /** Label shown in nav / breadcrumbs */
  navLabel: string
  /** Short noun for hero: "Find the Best {heroSkill} Jobs" */
  heroSkill: string
  jobFilters: { category?: string; search?: string }
  relatedSlugs: string[]
  similarSkills: { label: string; slug: string }[]
}

const ADMIN: string[] = [
  'chat-support-jobs',
  'cold-calling-jobs',
  'content-moderation-jobs',
  'lead-generation-jobs',
  'virtual-assistant-jobs',
]

const DESIGN: string[] = [
  'canva-jobs',
  'graphic-design-jobs',
  'illustration-jobs',
  'logo-design-jobs',
  'web-design-jobs',
]

const MKT: string[] = [
  'digital-marketing-jobs',
  'email-marketing-jobs',
  'google-ads-jobs',
  'seo-jobs',
  'social-media-management-jobs',
]

const WRITING: string[] = [
  'book-editing-jobs',
  'content-writing-jobs',
  'copywriting-jobs',
  'email-copywriting-jobs',
  'ghostwriting-jobs',
]

const AI: string[] = [
  'ai-app-development-jobs',
  'chatbot-development-jobs',
  'ethical-hacking-jobs',
  'machine-learning-jobs',
  'openai-jobs',
]

const DEV: string[] = [
  'mobile-app-development-jobs',
  'python-jobs',
  'software-development-jobs',
  'website-development',
  'wordpress-jobs',
]

const MEDIA: string[] = [
  'animation-jobs',
  'audio-editing-jobs',
  'music-production-jobs',
  'video-editing-jobs',
  'voice-over-jobs',
]

function peers(exclude: string, group: string[]): string[] {
  return group.filter((s) => s !== exclude)
}

function sim(items: { label: string; slug: string }[]): { label: string; slug: string }[] {
  return items
}

const RAW: FreelanceJobLandingEntry[] = [
  {
    slug: 'chat-support-jobs',
    navLabel: 'Chat support jobs',
    heroSkill: 'Chat Support Specialist',
    jobFilters: { category: 'marketing', search: 'social' },
    relatedSlugs: peers('chat-support-jobs', ADMIN),
    similarSkills: sim([
      { label: 'Virtual assistant jobs', slug: 'virtual-assistant-jobs' },
      { label: 'Content writing jobs', slug: 'content-writing-jobs' },
      { label: 'Customer success roles', slug: 'digital-marketing-jobs' },
      { label: 'Social media management jobs', slug: 'social-media-management-jobs' },
      { label: 'Email marketing jobs', slug: 'email-marketing-jobs' },
      { label: 'Data entry & admin', slug: 'lead-generation-jobs' },
    ]),
  },
  {
    slug: 'cold-calling-jobs',
    navLabel: 'Cold calling jobs',
    heroSkill: 'Cold Calling Specialist',
    jobFilters: { category: 'marketing' },
    relatedSlugs: peers('cold-calling-jobs', ADMIN),
    similarSkills: sim([
      { label: 'Lead generation jobs', slug: 'lead-generation-jobs' },
      { label: 'Sales & outreach', slug: 'digital-marketing-jobs' },
      { label: 'Virtual assistant jobs', slug: 'virtual-assistant-jobs' },
      { label: 'SEO jobs', slug: 'seo-jobs' },
      { label: 'Google Ads jobs', slug: 'google-ads-jobs' },
      { label: 'Content moderation jobs', slug: 'content-moderation-jobs' },
    ]),
  },
  {
    slug: 'content-moderation-jobs',
    navLabel: 'Content moderation jobs',
    heroSkill: 'Content Moderator',
    jobFilters: { category: 'marketing' },
    relatedSlugs: peers('content-moderation-jobs', ADMIN),
    similarSkills: sim([
      { label: 'Chat support jobs', slug: 'chat-support-jobs' },
      { label: 'Community management', slug: 'social-media-management-jobs' },
      { label: 'Virtual assistant jobs', slug: 'virtual-assistant-jobs' },
      { label: 'Copywriting jobs', slug: 'copywriting-jobs' },
      { label: 'Data & research', slug: 'lead-generation-jobs' },
      { label: 'Technical writing', slug: 'content-writing-jobs' },
    ]),
  },
  {
    slug: 'lead-generation-jobs',
    navLabel: 'Lead generation jobs',
    heroSkill: 'Lead Generation Specialist',
    jobFilters: { category: 'marketing' },
    relatedSlugs: peers('lead-generation-jobs', ADMIN),
    similarSkills: sim([
      { label: 'Cold calling jobs', slug: 'cold-calling-jobs' },
      { label: 'Digital marketing jobs', slug: 'digital-marketing-jobs' },
      { label: 'SEO jobs', slug: 'seo-jobs' },
      { label: 'Google Ads jobs', slug: 'google-ads-jobs' },
      { label: 'Email marketing jobs', slug: 'email-marketing-jobs' },
      { label: 'Social media management jobs', slug: 'social-media-management-jobs' },
    ]),
  },
  {
    slug: 'virtual-assistant-jobs',
    navLabel: 'Virtual assistant jobs',
    heroSkill: 'Virtual Assistant',
    jobFilters: { category: 'writing' },
    relatedSlugs: peers('virtual-assistant-jobs', ADMIN),
    similarSkills: sim([
      { label: 'Chat support jobs', slug: 'chat-support-jobs' },
      { label: 'Content writing jobs', slug: 'content-writing-jobs' },
      { label: 'Data entry & admin', slug: 'lead-generation-jobs' },
      { label: 'Email copywriting jobs', slug: 'email-copywriting-jobs' },
      { label: 'Project coordination', slug: 'digital-marketing-jobs' },
      { label: 'Book editing jobs', slug: 'book-editing-jobs' },
    ]),
  },
  {
    slug: 'canva-jobs',
    navLabel: 'Canva jobs',
    heroSkill: 'Canva Designer',
    jobFilters: { category: 'design', search: 'figma' },
    relatedSlugs: peers('canva-jobs', DESIGN),
    similarSkills: sim([
      { label: 'Graphic design jobs', slug: 'graphic-design-jobs' },
      { label: 'Web design jobs', slug: 'web-design-jobs' },
      { label: 'Logo design jobs', slug: 'logo-design-jobs' },
      { label: 'Social media creatives', slug: 'social-media-management-jobs' },
      { label: 'Illustration jobs', slug: 'illustration-jobs' },
      { label: 'Marketing design', slug: 'digital-marketing-jobs' },
    ]),
  },
  {
    slug: 'graphic-design-jobs',
    navLabel: 'Graphic design jobs',
    heroSkill: 'Graphic Designer',
    jobFilters: { category: 'design' },
    relatedSlugs: peers('graphic-design-jobs', DESIGN),
    similarSkills: sim([
      { label: 'Logo design jobs', slug: 'logo-design-jobs' },
      { label: 'Web design jobs', slug: 'web-design-jobs' },
      { label: 'Illustration jobs', slug: 'illustration-jobs' },
      { label: 'Canva jobs', slug: 'canva-jobs' },
      { label: 'Brand & UI kits', slug: 'website-development' },
      { label: 'Video editing jobs', slug: 'video-editing-jobs' },
    ]),
  },
  {
    slug: 'illustration-jobs',
    navLabel: 'Illustration jobs',
    heroSkill: 'Illustrator',
    jobFilters: { category: 'design', search: 'illustration' },
    relatedSlugs: peers('illustration-jobs', DESIGN),
    similarSkills: sim([
      { label: 'Graphic design jobs', slug: 'graphic-design-jobs' },
      { label: 'Logo design jobs', slug: 'logo-design-jobs' },
      { label: 'Animation jobs', slug: 'animation-jobs' },
      { label: 'Children’s book art', slug: 'book-editing-jobs' },
      { label: 'Web design jobs', slug: 'web-design-jobs' },
      { label: 'Game art', slug: 'animation-jobs' },
    ]),
  },
  {
    slug: 'logo-design-jobs',
    navLabel: 'Logo design jobs',
    heroSkill: 'Logo Designer',
    jobFilters: { category: 'design', search: 'logo' },
    relatedSlugs: peers('logo-design-jobs', DESIGN),
    similarSkills: sim([
      { label: 'Brand identity design', slug: 'graphic-design-jobs' },
      { label: 'Web design jobs', slug: 'web-design-jobs' },
      { label: 'Illustration jobs', slug: 'illustration-jobs' },
      { label: 'Canva jobs', slug: 'canva-jobs' },
      { label: 'Marketing collateral', slug: 'digital-marketing-jobs' },
      { label: 'UI/UX design', slug: 'website-development' },
    ]),
  },
  {
    slug: 'web-design-jobs',
    navLabel: 'Web design jobs',
    heroSkill: 'Web Designer',
    jobFilters: { category: 'design', search: 'ui' },
    relatedSlugs: peers('web-design-jobs', DESIGN),
    similarSkills: sim([
      { label: 'Website development jobs', slug: 'website-development' },
      { label: 'Graphic design jobs', slug: 'graphic-design-jobs' },
      { label: 'WordPress jobs', slug: 'wordpress-jobs' },
      { label: 'UX research & prototypes', slug: 'graphic-design-jobs' },
      { label: 'Front-end polish', slug: 'software-development-jobs' },
      { label: 'Landing pages', slug: 'digital-marketing-jobs' },
    ]),
  },
  {
    slug: 'digital-marketing-jobs',
    navLabel: 'Digital marketing jobs',
    heroSkill: 'Digital Marketer',
    jobFilters: { category: 'marketing' },
    relatedSlugs: peers('digital-marketing-jobs', MKT),
    similarSkills: sim([
      { label: 'SEO jobs', slug: 'seo-jobs' },
      { label: 'Google Ads jobs', slug: 'google-ads-jobs' },
      { label: 'Social media management jobs', slug: 'social-media-management-jobs' },
      { label: 'Email marketing jobs', slug: 'email-marketing-jobs' },
      { label: 'Content writing jobs', slug: 'content-writing-jobs' },
      { label: 'Analytics & CRO', slug: 'machine-learning-jobs' },
    ]),
  },
  {
    slug: 'email-marketing-jobs',
    navLabel: 'Email marketing jobs',
    heroSkill: 'Email Marketer',
    jobFilters: { category: 'marketing', search: 'email' },
    relatedSlugs: peers('email-marketing-jobs', MKT),
    similarSkills: sim([
      { label: 'Copywriting jobs', slug: 'copywriting-jobs' },
      { label: 'Email copywriting jobs', slug: 'email-copywriting-jobs' },
      { label: 'Digital marketing jobs', slug: 'digital-marketing-jobs' },
      { label: 'CRM automation', slug: 'digital-marketing-jobs' },
      { label: 'Lead generation jobs', slug: 'lead-generation-jobs' },
      { label: 'Content strategy', slug: 'content-writing-jobs' },
    ]),
  },
  {
    slug: 'google-ads-jobs',
    navLabel: 'Google Ads jobs',
    heroSkill: 'Google Ads Specialist',
    jobFilters: { category: 'marketing', search: 'google' },
    relatedSlugs: peers('google-ads-jobs', MKT),
    similarSkills: sim([
      { label: 'SEO jobs', slug: 'seo-jobs' },
      { label: 'Digital marketing jobs', slug: 'digital-marketing-jobs' },
      { label: 'PPC & paid social', slug: 'social-media-management-jobs' },
      { label: 'Landing page builds', slug: 'website-development' },
      { label: 'Analytics setup', slug: 'data-science' },
      { label: 'Conversion copy', slug: 'copywriting-jobs' },
    ]),
  },
  {
    slug: 'seo-jobs',
    navLabel: 'SEO jobs',
    heroSkill: 'SEO Specialist',
    jobFilters: { category: 'marketing', search: 'seo' },
    relatedSlugs: peers('seo-jobs', MKT),
    similarSkills: sim([
      { label: 'Content writing jobs', slug: 'content-writing-jobs' },
      { label: 'Technical SEO & dev', slug: 'website-development' },
      { label: 'Digital marketing jobs', slug: 'digital-marketing-jobs' },
      { label: 'Google Ads jobs', slug: 'google-ads-jobs' },
      { label: 'Analytics', slug: 'machine-learning-jobs' },
      { label: 'Link building outreach', slug: 'lead-generation-jobs' },
    ]),
  },
  {
    slug: 'social-media-management-jobs',
    navLabel: 'Social media management jobs',
    heroSkill: 'Social Media Manager',
    jobFilters: { category: 'marketing', search: 'social' },
    relatedSlugs: peers('social-media-management-jobs', MKT),
    similarSkills: sim([
      { label: 'Digital marketing jobs', slug: 'digital-marketing-jobs' },
      { label: 'Content writing jobs', slug: 'content-writing-jobs' },
      { label: 'Video editing jobs', slug: 'video-editing-jobs' },
      { label: 'Graphic design jobs', slug: 'graphic-design-jobs' },
      { label: 'Community management', slug: 'chat-support-jobs' },
      { label: 'Paid ads', slug: 'google-ads-jobs' },
    ]),
  },
  {
    slug: 'book-editing-jobs',
    navLabel: 'Book editing jobs',
    heroSkill: 'Book Editor',
    jobFilters: { category: 'writing' },
    relatedSlugs: peers('book-editing-jobs', WRITING),
    similarSkills: sim([
      { label: 'Ghostwriting jobs', slug: 'ghostwriting-jobs' },
      { label: 'Copywriting jobs', slug: 'copywriting-jobs' },
      { label: 'Content writing jobs', slug: 'content-writing-jobs' },
      { label: 'Proofreading', slug: 'content-writing-jobs' },
      { label: 'Publishing support', slug: 'virtual-assistant-jobs' },
      { label: 'Illustration for books', slug: 'illustration-jobs' },
    ]),
  },
  {
    slug: 'content-writing-jobs',
    navLabel: 'Content writing jobs',
    heroSkill: 'Content Writer',
    jobFilters: { category: 'writing' },
    relatedSlugs: peers('content-writing-jobs', WRITING),
    similarSkills: sim([
      { label: 'Copywriting jobs', slug: 'copywriting-jobs' },
      { label: 'SEO jobs', slug: 'seo-jobs' },
      { label: 'Blog & long-form', slug: 'ghostwriting-jobs' },
      { label: 'Technical writing', slug: 'software-development-jobs' },
      { label: 'Email copywriting jobs', slug: 'email-copywriting-jobs' },
      { label: 'Social captions', slug: 'social-media-management-jobs' },
    ]),
  },
  {
    slug: 'copywriting-jobs',
    navLabel: 'Copywriting jobs',
    heroSkill: 'Copywriter',
    jobFilters: { category: 'writing', search: 'copy' },
    relatedSlugs: peers('copywriting-jobs', WRITING),
    similarSkills: sim([
      { label: 'Email copywriting jobs', slug: 'email-copywriting-jobs' },
      { label: 'Content writing jobs', slug: 'content-writing-jobs' },
      { label: 'Landing page copy', slug: 'digital-marketing-jobs' },
      { label: 'Brand messaging', slug: 'graphic-design-jobs' },
      { label: 'Ad scripts', slug: 'google-ads-jobs' },
      { label: 'Ghostwriting jobs', slug: 'ghostwriting-jobs' },
    ]),
  },
  {
    slug: 'email-copywriting-jobs',
    navLabel: 'Email copywriting jobs',
    heroSkill: 'Email Copywriter',
    jobFilters: { category: 'writing', search: 'email' },
    relatedSlugs: peers('email-copywriting-jobs', WRITING),
    similarSkills: sim([
      { label: 'Email marketing jobs', slug: 'email-marketing-jobs' },
      { label: 'Copywriting jobs', slug: 'copywriting-jobs' },
      { label: 'Newsletter growth', slug: 'digital-marketing-jobs' },
      { label: 'Lifecycle campaigns', slug: 'digital-marketing-jobs' },
      { label: 'Content writing jobs', slug: 'content-writing-jobs' },
      { label: 'CRM sequences', slug: 'lead-generation-jobs' },
    ]),
  },
  {
    slug: 'ghostwriting-jobs',
    navLabel: 'Ghostwriting jobs',
    heroSkill: 'Ghostwriter',
    jobFilters: { category: 'writing', search: 'ghost' },
    relatedSlugs: peers('ghostwriting-jobs', WRITING),
    similarSkills: sim([
      { label: 'Book editing jobs', slug: 'book-editing-jobs' },
      { label: 'Content writing jobs', slug: 'content-writing-jobs' },
      { label: 'Copywriting jobs', slug: 'copywriting-jobs' },
      { label: 'eBooks & guides', slug: 'content-writing-jobs' },
      { label: 'Speechwriting', slug: 'copywriting-jobs' },
      { label: 'Publishing consulting', slug: 'book-editing-jobs' },
    ]),
  },
  {
    slug: 'ai-app-development-jobs',
    navLabel: 'AI app development jobs',
    heroSkill: 'AI App Developer',
    jobFilters: { category: 'data-science', search: 'machine' },
    relatedSlugs: peers('ai-app-development-jobs', AI),
    similarSkills: sim([
      { label: 'OpenAI jobs', slug: 'openai-jobs' },
      { label: 'Machine learning jobs', slug: 'machine-learning-jobs' },
      { label: 'Chatbot development jobs', slug: 'chatbot-development-jobs' },
      { label: 'Python jobs', slug: 'python-jobs' },
      { label: 'Software development jobs', slug: 'software-development-jobs' },
      { label: 'LLM integrations', slug: 'website-development' },
    ]),
  },
  {
    slug: 'chatbot-development-jobs',
    navLabel: 'Chatbot development jobs',
    heroSkill: 'Chatbot Developer',
    jobFilters: { category: 'data-science', search: 'nlp' },
    relatedSlugs: peers('chatbot-development-jobs', AI),
    similarSkills: sim([
      { label: 'OpenAI jobs', slug: 'openai-jobs' },
      { label: 'AI app development jobs', slug: 'ai-app-development-jobs' },
      { label: 'Python jobs', slug: 'python-jobs' },
      { label: 'Customer support automation', slug: 'chat-support-jobs' },
      { label: 'Machine learning jobs', slug: 'machine-learning-jobs' },
      { label: 'API engineering', slug: 'software-development-jobs' },
    ]),
  },
  {
    slug: 'ethical-hacking-jobs',
    navLabel: 'Ethical hacking jobs',
    heroSkill: 'Ethical Hacker',
    jobFilters: { category: 'web-development', search: 'security' },
    relatedSlugs: peers('ethical-hacking-jobs', AI),
    similarSkills: sim([
      { label: 'Security audits', slug: 'software-development-jobs' },
      { label: 'Compliance & HIPAA', slug: 'website-development' },
      { label: 'DevSecOps', slug: 'software-development-jobs' },
      { label: 'Network testing', slug: 'software-development-jobs' },
      { label: 'Python automation', slug: 'python-jobs' },
      { label: 'Cloud hardening', slug: 'website-development' },
    ]),
  },
  {
    slug: 'machine-learning-jobs',
    navLabel: 'Machine learning jobs',
    heroSkill: 'Machine Learning Engineer',
    jobFilters: { category: 'data-science', search: 'machine' },
    relatedSlugs: peers('machine-learning-jobs', AI),
    similarSkills: sim([
      { label: 'Python jobs', slug: 'python-jobs' },
      { label: 'OpenAI jobs', slug: 'openai-jobs' },
      { label: 'MLOps & pipelines', slug: 'software-development-jobs' },
      { label: 'Data science roles', slug: 'openai-jobs' },
      { label: 'AI app development jobs', slug: 'ai-app-development-jobs' },
      { label: 'Analytics engineering', slug: 'website-development' },
    ]),
  },
  {
    slug: 'openai-jobs',
    navLabel: 'OpenAI jobs',
    heroSkill: 'OpenAI Developer',
    jobFilters: { category: 'data-science', search: 'python' },
    relatedSlugs: peers('openai-jobs', AI),
    similarSkills: sim([
      { label: 'Chatbot development jobs', slug: 'chatbot-development-jobs' },
      { label: 'Machine learning jobs', slug: 'machine-learning-jobs' },
      { label: 'AI app development jobs', slug: 'ai-app-development-jobs' },
      { label: 'Prompt engineering', slug: 'content-writing-jobs' },
      { label: 'API integrations', slug: 'software-development-jobs' },
      { label: 'Python jobs', slug: 'python-jobs' },
    ]),
  },
  {
    slug: 'mobile-app-development-jobs',
    navLabel: 'Mobile app development jobs',
    heroSkill: 'Mobile App Developer',
    jobFilters: { category: 'mobile-apps' },
    relatedSlugs: peers('mobile-app-development-jobs', DEV),
    similarSkills: sim([
      { label: 'iOS & Swift roles', slug: 'software-development-jobs' },
      { label: 'React Native & Flutter', slug: 'software-development-jobs' },
      { label: 'Website development', slug: 'website-development' },
      { label: 'API backends', slug: 'python-jobs' },
      { label: 'UI for mobile', slug: 'web-design-jobs' },
      { label: 'Game development', slug: 'animation-jobs' },
    ]),
  },
  {
    slug: 'python-jobs',
    navLabel: 'Python jobs',
    heroSkill: 'Python Developer',
    jobFilters: { category: 'web-development', search: 'python' },
    relatedSlugs: peers('python-jobs', DEV),
    similarSkills: sim([
      { label: 'Software development jobs', slug: 'software-development-jobs' },
      { label: 'Machine learning jobs', slug: 'machine-learning-jobs' },
      { label: 'Django & backend APIs', slug: 'website-development' },
      { label: 'Data pipelines', slug: 'machine-learning-jobs' },
      { label: 'Automation scripts', slug: 'software-development-jobs' },
      { label: 'OpenAI jobs', slug: 'openai-jobs' },
    ]),
  },
  {
    slug: 'software-development-jobs',
    navLabel: 'Software development jobs',
    heroSkill: 'Software Developer',
    jobFilters: { category: 'web-development' },
    relatedSlugs: peers('software-development-jobs', DEV),
    similarSkills: sim([
      { label: 'Website development', slug: 'website-development' },
      { label: 'Python jobs', slug: 'python-jobs' },
      { label: 'Mobile app development jobs', slug: 'mobile-app-development-jobs' },
      { label: 'WordPress jobs', slug: 'wordpress-jobs' },
      { label: 'DevOps & cloud', slug: 'ethical-hacking-jobs' },
      { label: 'Full-stack contracts', slug: 'website-development' },
    ]),
  },
  {
    slug: 'website-development',
    navLabel: 'Web development jobs',
    heroSkill: 'Web Developer',
    jobFilters: { category: 'web-development' },
    relatedSlugs: peers('website-development', DEV),
    similarSkills: sim([
      { label: 'WordPress jobs', slug: 'wordpress-jobs' },
      { label: 'Python jobs', slug: 'python-jobs' },
      { label: 'JavaScript & front-end', slug: 'software-development-jobs' },
      { label: 'Web design jobs', slug: 'web-design-jobs' },
      { label: 'E-commerce builds', slug: 'wordpress-jobs' },
      { label: 'API & backend', slug: 'python-jobs' },
    ]),
  },
  {
    slug: 'wordpress-jobs',
    navLabel: 'WordPress jobs',
    heroSkill: 'WordPress Developer',
    jobFilters: { category: 'web-development', search: 'wordpress' },
    relatedSlugs: peers('wordpress-jobs', DEV),
    similarSkills: sim([
      { label: 'Website development', slug: 'website-development' },
      { label: 'Web design jobs', slug: 'web-design-jobs' },
      { label: 'PHP & plugins', slug: 'software-development-jobs' },
      { label: 'WooCommerce stores', slug: 'website-development' },
      { label: 'SEO for WordPress', slug: 'seo-jobs' },
      { label: 'Hosting & maintenance', slug: 'software-development-jobs' },
    ]),
  },
  {
    slug: 'animation-jobs',
    navLabel: 'Animation jobs',
    heroSkill: 'Animator',
    jobFilters: { category: 'design', search: 'animation' },
    relatedSlugs: peers('animation-jobs', MEDIA),
    similarSkills: sim([
      { label: 'Video editing jobs', slug: 'video-editing-jobs' },
      { label: 'Motion graphics', slug: 'video-editing-jobs' },
      { label: '3D & game assets', slug: 'animation-jobs' },
      { label: 'Illustration jobs', slug: 'illustration-jobs' },
      { label: 'Voice over jobs', slug: 'voice-over-jobs' },
      { label: 'Music production jobs', slug: 'music-production-jobs' },
    ]),
  },
  {
    slug: 'audio-editing-jobs',
    navLabel: 'Audio editing jobs',
    heroSkill: 'Audio Editor',
    jobFilters: { category: 'design', search: 'audio' },
    relatedSlugs: peers('audio-editing-jobs', MEDIA),
    similarSkills: sim([
      { label: 'Music production jobs', slug: 'music-production-jobs' },
      { label: 'Podcast production', slug: 'video-editing-jobs' },
      { label: 'Voice over jobs', slug: 'voice-over-jobs' },
      { label: 'Video editing jobs', slug: 'video-editing-jobs' },
      { label: 'Sound design for apps', slug: 'mobile-app-development-jobs' },
      { label: 'Mixing & mastering', slug: 'music-production-jobs' },
    ]),
  },
  {
    slug: 'music-production-jobs',
    navLabel: 'Music production jobs',
    heroSkill: 'Music Producer',
    jobFilters: { category: 'design', search: 'audio' },
    relatedSlugs: peers('music-production-jobs', MEDIA),
    similarSkills: sim([
      { label: 'Audio editing jobs', slug: 'audio-editing-jobs' },
      { label: 'Voice over jobs', slug: 'voice-over-jobs' },
      { label: 'Jingles & branding audio', slug: 'graphic-design-jobs' },
      { label: 'Game audio', slug: 'game-development' },
      { label: 'Video scores', slug: 'video-editing-jobs' },
      { label: 'Livestream audio', slug: 'video-editing-jobs' },
    ]),
  },
  {
    slug: 'video-editing-jobs',
    navLabel: 'Video editing jobs',
    heroSkill: 'Video Editor',
    jobFilters: { category: 'design', search: 'video' },
    relatedSlugs: peers('video-editing-jobs', MEDIA),
    similarSkills: sim([
      { label: 'Animation jobs', slug: 'animation-jobs' },
      { label: 'Motion graphics', slug: 'animation-jobs' },
      { label: 'Social video ads', slug: 'social-media-management-jobs' },
      { label: 'YouTube editing', slug: 'content-writing-jobs' },
      { label: 'Color grading', slug: 'graphic-design-jobs' },
      { label: 'Voice over jobs', slug: 'voice-over-jobs' },
    ]),
  },
  {
    slug: 'voice-over-jobs',
    navLabel: 'Voice over jobs',
    heroSkill: 'Voice Actor',
    jobFilters: { category: 'design', search: 'audio' },
    relatedSlugs: peers('voice-over-jobs', MEDIA),
    similarSkills: sim([
      { label: 'Video editing jobs', slug: 'video-editing-jobs' },
      { label: 'Audio editing jobs', slug: 'audio-editing-jobs' },
      { label: 'Podcast hosting', slug: 'audio-editing-jobs' },
      { label: 'Explainer scripts', slug: 'copywriting-jobs' },
      { label: 'Localization', slug: 'content-writing-jobs' },
      { label: 'Character voices', slug: 'animation-jobs' },
    ]),
  },
]

export const FREELANCE_JOB_LANDINGS: FreelanceJobLandingEntry[] = RAW

export const FREELANCE_JOB_LANDING_BY_SLUG: Record<string, FreelanceJobLandingEntry> =
  Object.fromEntries(FREELANCE_JOB_LANDINGS.map((e) => [e.slug, e]))

export function getFreelanceJobLanding(slug: string): FreelanceJobLandingEntry | undefined {
  return FREELANCE_JOB_LANDING_BY_SLUG[slug]
}

export function isFreelanceJobLandingSlug(slug: string): boolean {
  return slug in FREELANCE_JOB_LANDING_BY_SLUG
}

export function browseJobsQuery(entry: FreelanceJobLandingEntry): Record<string, string> {
  const q: Record<string, string> = {}
  if (entry.jobFilters.category) q.category = entry.jobFilters.category
  if (entry.jobFilters.search) q.search = entry.jobFilters.search
  return q
}

export interface FreelanceJobsDirectoryItem {
  label: string
  slug: string
  /** When set, link target instead of `/freelance-jobs/:slug` (e.g. browse search). */
  to?: string
}

export interface FreelanceJobsDirectoryLetterGroup {
  letter: string
  items: FreelanceJobsDirectoryItem[]
}

export {
  getFreelanceJobsExploreDirectory,
  getFreelanceJobsDirectoryByLetter,
} from './freelance-jobs.explore-directory'

/** “Type of work” filter on `/freelance-jobs` index (radio list + navigation). */
export interface FreelanceJobsTypeOfWorkOption {
  id: string
  label: string
  /** Target route when this option is chosen (`/freelance-jobs` = show full directory). */
  to: string
}

export const FREELANCE_JOBS_TYPE_OF_WORK: FreelanceJobsTypeOfWorkOption[] = [
  { id: 'any', label: 'Any type of work', to: '/freelance-jobs' },
  { id: 'dev', label: 'Development & IT', to: '/freelance-jobs/website-development' },
  { id: 'design', label: 'Design & Creative', to: '/freelance-jobs/graphic-design-jobs' },
  { id: 'finance', label: 'Finance & Accounting', to: '/browse-jobs?category=finance' },
  { id: 'admin', label: 'Admin & Customer Support', to: '/freelance-jobs/virtual-assistant-jobs' },
  { id: 'engineering', label: 'Engineering & Architecture', to: '/freelance-jobs/software-development-jobs' },
  { id: 'legal', label: 'Legal', to: '/browse-jobs?search=Legal' },
  { id: 'sales', label: 'Sales & Marketing', to: '/freelance-jobs/digital-marketing-jobs' },
  { id: 'writing', label: 'Writing & Translation', to: '/freelance-jobs/content-writing-jobs' },
]

/** Secondary row under the main header on freelance-jobs landing pages (Upwork-style). */
export interface FreelanceJobsSubnavItem {
  label: string
  to: string
  activeSlugs: readonly string[]
  megaMenuKey: FreelanceJobsMegaMenuKey
}

export const FREELANCE_JOBS_SUBNAV_ITEMS: FreelanceJobsSubnavItem[] = [
  {
    label: 'Development & IT',
    to: '/freelance-jobs/website-development',
    activeSlugs: DEV,
    megaMenuKey: 'dev',
  },
  {
    label: 'AI Services',
    to: '/freelance-jobs/machine-learning-jobs',
    activeSlugs: AI,
    megaMenuKey: 'ai',
  },
  {
    label: 'Design & Creative',
    to: '/freelance-jobs/graphic-design-jobs',
    activeSlugs: DESIGN,
    megaMenuKey: 'design',
  },
  {
    label: 'Sales & Marketing',
    to: '/freelance-jobs/digital-marketing-jobs',
    activeSlugs: MKT,
    megaMenuKey: 'marketing',
  },
  {
    label: 'Admin & Customer Support',
    to: '/freelance-jobs/virtual-assistant-jobs',
    activeSlugs: ADMIN,
    megaMenuKey: 'admin',
  },
  {
    label: 'More',
    to: '/browse-jobs',
    activeSlugs: [...WRITING, ...MEDIA],
    megaMenuKey: 'more',
  },
]
