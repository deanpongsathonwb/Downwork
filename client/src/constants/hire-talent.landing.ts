/**
 * Client-facing hire pages: /category/:slug — talent discovery + educational layout.
 * Short hub slugs (ai, dev, …) map to a default role landing; other slugs are role pages.
 */

export interface HireTalentFaq {
  question: string
  answer: string
}

export interface HireTalentComparisonRow {
  developerType: string
  whatTheyDo: string
  keySkills: string
  commonTools: string
}

export interface HireTalentLandingEntry {
  slug: string
  /** Plural headline noun, e.g. "Web Developers" → "Hire the best Web Developers" */
  headlineRole: string
  talentFilters: { category?: string; search?: string }
  whoTheyAre: string
  whatTheyDo: string
  howToHireSteps: readonly string[]
  faqs: readonly HireTalentFaq[]
  comparisonRows?: readonly HireTalentComparisonRow[]
  /** Footer / cross-links to other hire pages */
  relatedHire: readonly { label: string; slug: string }[]
}

function entry(
  slug: string,
  headlineRole: string,
  talentFilters: { category?: string; search?: string },
  whoTheyAre: string,
  whatTheyDo: string,
  relatedHire: readonly { label: string; slug: string }[],
  faqs?: readonly HireTalentFaq[],
  comparisonRows?: readonly HireTalentComparisonRow[],
): HireTalentLandingEntry {
  const defaultSteps = [
    'Post a job with goals, timeline, and budget so pros can respond with tailored proposals.',
    'Review profiles, portfolios, and proposals—then shortlist candidates who match your stack and culture.',
    'Interview finalists (video or chat), validate scope, and align on milestones before you hire.',
    'Collaborate in Downwork, share files, track deliverables, and pay securely as work is approved.',
  ] as const

  const defaultFaqs: HireTalentFaq[] = [
    {
      question: `How much does it cost to hire ${headlineRole.toLowerCase()}?`,
      answer:
        'Rates vary by experience, region, and project complexity. Most freelancers list an hourly rate and can also quote fixed-price milestones. You only pay for work you approve.',
    },
    {
      question: 'How quickly can I get started?',
      answer:
        'Many clients receive qualified proposals within 24–48 hours. For urgent work, mention your timeline in the job post and invite freelancers directly from search.',
    },
    {
      question: 'What should I include in my job post?',
      answer:
        'Include outcomes, constraints, tech stack or tools, success criteria, and examples of what “done” looks like. Clear scope leads to better proposals and fewer revisions.',
    },
    {
      question: 'Can I hire for a short trial or a longer engagement?',
      answer:
        'Yes. You can start with a small milestone or hourly contract, then extend if the fit is strong. Many teams use Downwork for both one-off launches and ongoing retainers.',
    },
  ]

  return {
    slug,
    headlineRole,
    talentFilters,
    whoTheyAre,
    whatTheyDo,
    howToHireSteps: defaultSteps,
    faqs: faqs ?? defaultFaqs,
    comparisonRows,
    relatedHire,
  }
}

const RAW: HireTalentLandingEntry[] = [
  entry(
    'cold-callers',
    'Cold Callers',
    { category: 'marketing', search: 'sales' },
    'Cold callers help you start conversations with qualified prospects—so your sales team spends time on deals, not dialing.',
    'They research lists, craft outreach scripts, handle objections, book meetings, and log outcomes in your CRM.',
    [
      { label: 'Lead generation specialists', slug: 'lead-generation-specialists' },
      { label: 'Digital marketers', slug: 'digital-marketers' },
      { label: 'Virtual assistants', slug: 'virtual-assistants' },
    ],
  ),
  entry(
    'content-moderators',
    'Content Moderators',
    { category: 'marketing', search: 'community' },
    'Content moderators keep communities safe, on-brand, and compliant—protecting users and your reputation at scale.',
    'They review posts, enforce guidelines, escalate edge cases, document trends, and support policy updates.',
    [
      { label: 'Social media managers', slug: 'social-media-managers' },
      { label: 'Virtual assistants', slug: 'virtual-assistants' },
      { label: 'Customer support talent', slug: 'personal-assistants' },
    ],
  ),
  entry(
    'lead-generation-specialists',
    'Lead Generation Specialists',
    { category: 'marketing', search: 'lead' },
    'Lead generation specialists build repeatable pipelines—turning your ideal customer profile into qualified opportunities.',
    'They run outbound sequences, enrich data, validate fit, and hand off warm leads with context your closers can use.',
    [
      { label: 'Cold callers', slug: 'cold-callers' },
      { label: 'Digital marketers', slug: 'digital-marketers' },
      { label: 'SEO experts', slug: 'seo-experts' },
    ],
  ),
  entry(
    'personal-assistants',
    'Personal Assistants',
    { category: 'writing', search: 'assistant' },
    'Personal assistants help leaders stay organized—managing calendars, travel, inbox triage, and day-to-day coordination.',
    'They prioritize tasks, coordinate stakeholders, prep briefs, and keep projects moving without adding headcount.',
    [
      { label: 'Virtual assistants', slug: 'virtual-assistants' },
      { label: 'Content moderators', slug: 'content-moderators' },
      { label: 'Lead generation specialists', slug: 'lead-generation-specialists' },
    ],
  ),
  entry(
    'virtual-assistants',
    'Virtual Assistants',
    { category: 'writing', search: 'virtual' },
    'Virtual assistants provide flexible operational support across admin, research, inbox management, and lightweight execution.',
    'They adapt to your tools and workflows—helping you reclaim time while keeping quality consistent.',
    [
      { label: 'Personal assistants', slug: 'personal-assistants' },
      { label: 'Data entry & admin', slug: 'lead-generation-specialists' },
      { label: 'Customer support', slug: 'content-moderators' },
    ],
  ),
  entry(
    'automation-engineers',
    'Automation Engineers',
    { category: 'web-development', search: 'automation' },
    'Automation engineers design reliable workflows that connect your apps, reduce manual work, and improve data quality.',
    'They map processes, implement integrations, handle errors and monitoring, and document how systems behave over time.',
    [
      { label: 'Python developers', slug: 'python-developers' },
      { label: 'Software developers', slug: 'software-developers' },
      { label: 'Machine learning engineers', slug: 'machine-learning-engineers' },
    ],
  ),
  entry(
    'chatbot-developers',
    'Chatbot Developers',
    { category: 'data-science', search: 'nlp' },
    'Chatbot developers build conversational experiences that resolve common questions, route users, and integrate with your stack.',
    'They design prompts/flows, connect APIs and knowledge bases, evaluate quality, and iterate based on real conversations.',
    [
      { label: 'Machine learning engineers', slug: 'machine-learning-engineers' },
      { label: 'Web developers', slug: 'web-developers' },
      { label: 'Automation engineers', slug: 'automation-engineers' },
    ],
  ),
  entry(
    'computer-vision-engineers',
    'Computer Vision Engineers',
    { category: 'data-science', search: 'vision' },
    'Computer vision engineers build systems that interpret images and video—classification, detection, tracking, and quality control.',
    'They prepare datasets, train and evaluate models, optimize for deployment, and partner with product teams on edge cases.',
    [
      { label: 'Machine learning engineers', slug: 'machine-learning-engineers' },
      { label: 'Python developers', slug: 'python-developers' },
      { label: 'Software developers', slug: 'software-developers' },
    ],
  ),
  entry(
    'ethical-hackers',
    'Ethical Hackers',
    { category: 'web-development', search: 'security' },
    'Ethical hackers help you find vulnerabilities before attackers do—strengthening your security posture with evidence-backed findings.',
    'They scope tests, run controlled assessments, document risks with severity, and recommend practical remediation paths.',
    [
      { label: 'Software developers', slug: 'software-developers' },
      { label: 'Web developers', slug: 'web-developers' },
      { label: 'Automation engineers', slug: 'automation-engineers' },
    ],
  ),
  entry(
    'machine-learning-engineers',
    'Machine Learning Engineers',
    { category: 'data-science', search: 'machine learning' },
    'Machine learning engineers turn data into working models—shipping features that are measurable, maintainable, and scalable.',
    'They build training pipelines, evaluate performance, monitor drift, and collaborate on safe rollout and governance.',
    [
      { label: 'Computer vision engineers', slug: 'computer-vision-engineers' },
      { label: 'Python developers', slug: 'python-developers' },
      { label: 'Chatbot developers', slug: 'chatbot-developers' },
    ],
  ),
  entry(
    'graphic-designers',
    'Graphic Designers',
    { category: 'design', search: 'graphic' },
    'Graphic designers translate brand strategy into visuals—ads, decks, social assets, packaging, and campaign-ready artwork.',
    'They iterate quickly, maintain consistency, and deliver production files that developers and marketers can use immediately.',
    [
      { label: 'Logo designers', slug: 'logo-designers' },
      { label: 'Web designers', slug: 'web-designers' },
      { label: 'Illustrators', slug: 'illustrators' },
    ],
  ),
  entry(
    'illustrators',
    'Illustrators',
    { category: 'design', search: 'illustration' },
    'Illustrators create distinctive visuals for brands, products, editorial, and campaigns—often with a strong narrative style.',
    'They develop concepts, refine sketches, deliver vector or raster finals, and collaborate with designers and marketers.',
    [
      { label: 'Graphic designers', slug: 'graphic-designers' },
      { label: 'UX designers', slug: 'ux-designers' },
      { label: 'Animators', slug: 'animators' },
    ],
  ),
  entry(
    'logo-designers',
    'Logo Designers',
    { category: 'design', search: 'logo' },
    'Logo designers craft memorable marks and identity systems that scale across digital, print, and merchandise.',
    'They explore directions, refine typography and symbols, and deliver brand guidelines your team can apply consistently.',
    [
      { label: 'Graphic designers', slug: 'graphic-designers' },
      { label: 'Web designers', slug: 'web-designers' },
      { label: 'Brand strategists', slug: 'digital-marketers' },
    ],
  ),
  entry(
    'ux-designers',
    'UX Designers',
    { category: 'design', search: 'ux' },
    'UX designers focus on clarity and usability—structuring flows, validating assumptions, and improving conversion through research.',
    'They run interviews/tests, map journeys, prototype interactions, and partner with engineering for faithful implementation.',
    [
      { label: 'Web designers', slug: 'web-designers' },
      { label: 'Web developers', slug: 'web-developers' },
      { label: 'Product copy', slug: 'copywriters' },
    ],
  ),
  entry(
    'web-designers',
    'Web Designers',
    { category: 'design', search: 'web' },
    'Web designers shape the look and feel of websites—balancing aesthetics, accessibility, and responsive layouts.',
    'They produce UI kits, responsive mocks, and handoff specs that help developers ship polished experiences faster.',
    [
      { label: 'UX designers', slug: 'ux-designers' },
      { label: 'Web developers', slug: 'web-developers' },
      { label: 'Graphic designers', slug: 'graphic-designers' },
    ],
  ),
  entry(
    'mobile-app-developers',
    'Mobile App Developers',
    { category: 'mobile-apps' },
    'Mobile app developers build and maintain iOS/Android experiences—performance, releases, and integrations included.',
    'They implement features, handle app store requirements, debug device-specific issues, and collaborate on APIs and analytics.',
    [
      { label: 'Software developers', slug: 'software-developers' },
      { label: 'Web developers', slug: 'web-developers' },
      { label: 'Python developers', slug: 'python-developers' },
    ],
  ),
  entry(
    'python-developers',
    'Python Developers',
    { category: 'web-development', search: 'python' },
    'Python developers build backends, data tooling, automation, and ML-adjacent services with a pragmatic engineering mindset.',
    'They design APIs, write tests, optimize performance, and document systems so your team can operate them confidently.',
    [
      { label: 'Software developers', slug: 'software-developers' },
      { label: 'Machine learning engineers', slug: 'machine-learning-engineers' },
      { label: 'Web developers', slug: 'web-developers' },
    ],
  ),
  entry(
    'software-developers',
    'Software Developers',
    { category: 'web-development', search: 'software' },
    'Software developers ship reliable systems—features, refactors, integrations, and production support across your stack.',
    'They break work into milestones, communicate tradeoffs, and keep quality high with reviews, tests, and observability.',
    [
      { label: 'Web developers', slug: 'web-developers' },
      { label: 'Python developers', slug: 'python-developers' },
      { label: 'Mobile app developers', slug: 'mobile-app-developers' },
    ],
  ),
  (() => {
    const web = entry(
      'web-developers',
      'Web Developers',
      { category: 'web-development', search: 'web' },
      'Web developers build the experiences users touch in the browser—and often partner closely on APIs, performance, and accessibility.',
      'Depending on scope, they may own front-end UI, back-end services, or full-stack delivery across staging and production environments.',
      [
        { label: 'WordPress developers', slug: 'wordpress-developers' },
        { label: 'Software developers', slug: 'software-developers' },
        { label: 'UX designers', slug: 'ux-designers' },
      ],
      [
        {
          question: 'How much does it cost to hire web developers?',
          answer:
            'Hourly rates vary by seniority and region. Fixed-price milestones work well for defined deliverables (landing pages, dashboards, migrations). Start with a small milestone to validate fit.',
        },
        {
          question: 'Front-end vs back-end vs full-stack—what should I choose?',
          answer:
            'Choose front-end for UI-heavy work, back-end for APIs/data/security-heavy work, and full-stack when you want one owner across both layers—especially for early-stage products.',
        },
        {
          question: 'What skills should I look for?',
          answer:
            'Match skills to your stack (e.g., React/Next, Node/Nest, databases, cloud). Prioritize communication, code quality practices, and experience shipping similar products.',
        },
        {
          question: 'How do I evaluate quality before hiring?',
          answer:
            'Review portfolios, GitHub samples (if available), past client feedback, and ask for a short technical plan or take-home scoped to your domain—not generic puzzles.',
        },
      ],
      [
        {
          developerType: 'Front-end',
          whatTheyDo: 'Build UI components, responsive layouts, accessibility improvements, and client-side performance.',
          keySkills: 'HTML/CSS, JavaScript/TypeScript, component frameworks, state management, accessibility',
          commonTools: 'React/Next/Vue, Vite/Webpack, Storybook, Figma handoff, Lighthouse',
        },
        {
          developerType: 'Back-end',
          whatTheyDo: 'Design APIs, model data, implement auth, integrations, background jobs, and operational reliability.',
          keySkills: 'API design, SQL/NoSQL, auth, caching, queues, observability, security basics',
          commonTools: 'Node/Nest, Postgres, Redis, Docker, cloud consoles, OpenAPI',
        },
        {
          developerType: 'Full-stack',
          whatTheyDo: 'Deliver features across UI and services—ideal for MVPs, small teams, and fast iteration cycles.',
          keySkills: 'End-to-end ownership, pragmatic architecture, testing, deployment, troubleshooting',
          commonTools: 'Monorepos, CI/CD, hosting platforms, shared component libraries, feature flags',
        },
      ],
    )
    return web
  })(),
  entry(
    'wordpress-developers',
    'WordPress Developers',
    { category: 'web-development', search: 'wordpress' },
    'WordPress developers build, customize, and maintain sites—themes, plugins, WooCommerce, migrations, and performance tuning.',
    'They implement SEO-friendly structure, harden security, automate updates where appropriate, and support ongoing content needs.',
    [
      { label: 'Web developers', slug: 'web-developers' },
      { label: 'Web designers', slug: 'web-designers' },
      { label: 'SEO experts', slug: 'seo-experts' },
    ],
  ),
  entry(
    'digital-marketers',
    'Digital Marketers',
    { category: 'marketing', search: 'digital' },
    'Digital marketers connect acquisition, conversion, and measurement—turning channels into repeatable growth loops.',
    'They run experiments, optimize funnels, align creative with targeting, and report what actually moved the needle.',
    [
      { label: 'SEO experts', slug: 'seo-experts' },
      { label: 'Google Ads experts', slug: 'google-ads-experts' },
      { label: 'Social media managers', slug: 'social-media-managers' },
    ],
  ),
  entry(
    'email-marketers',
    'Email Marketers',
    { category: 'marketing', search: 'email' },
    'Email marketers grow retention and revenue with segmentation, lifecycle campaigns, and deliverability-aware execution.',
    'They audit lists, build automations, write briefs with creative, and iterate using opens, clicks, and revenue signals.',
    [
      { label: 'Email copywriters', slug: 'email-copywriters' },
      { label: 'Digital marketers', slug: 'digital-marketers' },
      { label: 'CRM automation', slug: 'lead-generation-specialists' },
    ],
  ),
  entry(
    'google-ads-experts',
    'Google Ads Experts',
    { category: 'marketing', search: 'google ads' },
    'Google Ads experts structure accounts, improve Quality Score, and scale spend with disciplined testing and reporting.',
    'They build audiences, write ad variants, manage budgets, and connect conversions to real business outcomes.',
    [
      { label: 'Digital marketers', slug: 'digital-marketers' },
      { label: 'SEO experts', slug: 'seo-experts' },
      { label: 'Landing page builds', slug: 'web-developers' },
    ],
  ),
  entry(
    'seo-experts',
    'SEO Experts',
    { category: 'marketing', search: 'seo' },
    'SEO experts improve discoverability through technical fixes, content strategy, and authority-building—without risky shortcuts.',
    'They audit sites, prioritize fixes, align content with intent, and measure impact with clean tracking and dashboards.',
    [
      { label: 'Content writers', slug: 'content-writers' },
      { label: 'Digital marketers', slug: 'digital-marketers' },
      { label: 'Web developers', slug: 'web-developers' },
    ],
  ),
  entry(
    'social-media-managers',
    'Social Media Managers',
    { category: 'marketing', search: 'social' },
    'Social media managers grow communities, plan calendars, coordinate creative, and keep brand voice consistent everywhere.',
    'They publish, engage, report on performance, and adapt quickly to platform changes and campaign needs.',
    [
      { label: 'Content writers', slug: 'content-writers' },
      { label: 'Video editors', slug: 'video-editors' },
      { label: 'Graphic designers', slug: 'graphic-designers' },
    ],
  ),
  entry(
    'animators',
    'Animators',
    { category: 'video', search: 'animation' },
    'Animators bring stories to life—motion graphics, character animation, explainers, and social-first short-form content.',
    'They storyboard, animate, revise to feedback, and deliver formats optimized for each channel.',
    [
      { label: 'Video editors', slug: 'video-editors' },
      { label: 'Illustrators', slug: 'illustrators' },
      { label: 'Voice actors', slug: 'voice-actors' },
    ],
  ),
  entry(
    'audio-editors',
    'Audio Editors',
    { category: 'video', search: 'audio' },
    'Audio editors clean dialogue, balance levels, remove noise, and prepare masters for podcasts, ads, and video.',
    'They tighten pacing, apply EQ/dynamics, ensure loudness standards, and deliver stems when teams need flexibility.',
    [
      { label: 'Music producers', slug: 'music-producers' },
      { label: 'Voice actors', slug: 'voice-actors' },
      { label: 'Video editors', slug: 'video-editors' },
    ],
  ),
  entry(
    'music-producers',
    'Music Producers',
    { category: 'video', search: 'music' },
    'Music producers shape sound—from arrangement and recording guidance to mixing decisions that match your brand.',
    'They collaborate with artists and editors, manage sessions, and deliver polished tracks for campaigns and content.',
    [
      { label: 'Audio editors', slug: 'audio-editors' },
      { label: 'Voice actors', slug: 'voice-actors' },
      { label: 'Video editors', slug: 'video-editors' },
    ],
  ),
  entry(
    'video-editors',
    'Video Editors',
    { category: 'video', search: 'video' },
    'Video editors turn raw footage into compelling stories—pacing, structure, color, captions, and platform-native formats.',
    'They align to brand guidelines, collaborate on revisions, and deliver files ready for publishing and ads.',
    [
      { label: 'Animators', slug: 'animators' },
      { label: 'Voice actors', slug: 'voice-actors' },
      { label: 'Social media managers', slug: 'social-media-managers' },
    ],
  ),
  entry(
    'voice-actors',
    'Voice Actors',
    { category: 'video', search: 'voice' },
    'Voice actors deliver professional narration for explainers, ads, games, IVR, audiobooks, and localized content.',
    'They interpret direction, provide multiple takes, and deliver broadcast-ready audio with consistent tone and pacing.',
    [
      { label: 'Video editors', slug: 'video-editors' },
      { label: 'Audio editors', slug: 'audio-editors' },
      { label: 'Copywriters', slug: 'copywriters' },
    ],
  ),
  entry(
    'book-editors',
    'Book Editors',
    { category: 'writing', search: 'editor' },
    'Book editors strengthen manuscripts—structure, clarity, consistency, and reader experience from draft to publish-ready.',
    'They provide developmental feedback, line edits, proofreading passes, and guidance aligned with genre expectations.',
    [
      { label: 'Ghostwriters', slug: 'ghostwriters' },
      { label: 'Copywriters', slug: 'copywriters' },
      { label: 'Content writers', slug: 'content-writers' },
    ],
  ),
  entry(
    'content-writers',
    'Content Writers',
    { category: 'writing', search: 'content' },
    'Content writers produce blogs, guides, and web copy that informs readers and supports growth goals.',
    'They research topics, match tone to brand, optimize for readability, and collaborate with SEO and design stakeholders.',
    [
      { label: 'Copywriters', slug: 'copywriters' },
      { label: 'SEO experts', slug: 'seo-experts' },
      { label: 'Social media managers', slug: 'social-media-managers' },
    ],
  ),
  entry(
    'copywriters',
    'Copywriters',
    { category: 'writing', search: 'copy' },
    'Copywriters write persuasive messaging—landing pages, ads, scripts, and campaigns engineered to convert.',
    'They translate positioning into crisp headlines, proofs, CTAs, and iterative tests that improve performance.',
    [
      { label: 'Email copywriters', slug: 'email-copywriters' },
      { label: 'Content writers', slug: 'content-writers' },
      { label: 'Digital marketers', slug: 'digital-marketers' },
    ],
  ),
  entry(
    'email-copywriters',
    'Email Copywriters',
    { category: 'writing', search: 'email' },
    'Email copywriters specialize in subject lines, body copy, and sequences that drive opens, clicks, and revenue.',
    'They align messaging to segments, maintain brand voice, and iterate using performance data from campaigns.',
    [
      { label: 'Email marketers', slug: 'email-marketers' },
      { label: 'Copywriters', slug: 'copywriters' },
      { label: 'Digital marketers', slug: 'digital-marketers' },
    ],
  ),
  entry(
    'ghostwriters',
    'Ghostwriters',
    { category: 'writing', search: 'ghost' },
    'Ghostwriters help leaders and experts publish books, speeches, and long-form content in their authentic voice.',
    'They interview, outline, draft, revise collaboratively, and handle confidentiality with professional standards.',
    [
      { label: 'Book editors', slug: 'book-editors' },
      { label: 'Content writers', slug: 'content-writers' },
      { label: 'Copywriters', slug: 'copywriters' },
    ],
  ),
  entry(
    'finance-professionals',
    'Finance & Accounting Professionals',
    { category: 'finance' },
    'Finance and accounting professionals keep your books accurate, your reporting clear, and your decisions grounded in solid numbers.',
    'They reconcile accounts, prepare statements, support payroll inputs, model cash flow, and organize documentation for audits or tax readiness.',
    [
      { label: 'Legal professionals', slug: 'legal-professionals' },
      { label: 'Virtual assistants', slug: 'virtual-assistants' },
      { label: 'Content writers', slug: 'content-writers' },
    ],
  ),
  entry(
    'legal-professionals',
    'Legal Professionals',
    { category: 'writing', search: 'legal' },
    'Legal professionals help with contracts, research, and compliance-minded documentation so you can move faster with less avoidable risk.',
    'They draft and review agreements, summarize requirements, build templates, and coordinate with licensed counsel when issues are out of scope.',
    [
      { label: 'Finance professionals', slug: 'finance-professionals' },
      { label: 'Content writers', slug: 'content-writers' },
      { label: 'Virtual assistants', slug: 'virtual-assistants' },
    ],
  ),
  entry(
    'hr-specialists',
    'HR & Training Specialists',
    { category: 'marketing', search: 'recruiter' },
    'HR and training specialists help you recruit, onboard, and upskill teams as your company grows.',
    'They source candidates, structure hiring processes, build onboarding and training materials, and support day-to-day people operations.',
    [
      { label: 'Digital marketers', slug: 'digital-marketers' },
      { label: 'Content writers', slug: 'content-writers' },
      { label: 'Virtual assistants', slug: 'virtual-assistants' },
    ],
  ),
]

export const HIRE_TALENT_LANDINGS: HireTalentLandingEntry[] = RAW

export const HIRE_TALENT_BY_SLUG: Record<string, HireTalentLandingEntry> = Object.fromEntries(
  RAW.map((e) => [e.slug, e]),
)

/** Top-nav hub URLs (`/category/ai`, …) → default talent landing slug. */
export const HIRE_CATEGORY_HUB_TO_SLUG: Readonly<Record<string, string>> = {
  dev: 'web-developers',
  ai: 'machine-learning-engineers',
  design: 'graphic-designers',
  marketing: 'digital-marketers',
  admin: 'virtual-assistants',
}

export function resolveHireCategorySlug(urlSlug: string): string {
  return HIRE_CATEGORY_HUB_TO_SLUG[urlSlug] ?? urlSlug
}

export function getHireTalentLanding(slug: string): HireTalentLandingEntry | undefined {
  return HIRE_TALENT_BY_SLUG[slug]
}

/**
 * Tab title segment for hire landings, Upwork-style:
 * `Best Freelance {headlineRole} for Hire (Apr 2026)`.
 * The app router appends ` - {brand}` in `afterEach`.
 */
export function getHireTalentTitleMetaSegment(entry: HireTalentLandingEntry, at: Date = new Date()): string {
  const monthShort = at.toLocaleString('en-US', { month: 'short' })
  const year = at.getFullYear()
  return `Best Freelance ${entry.headlineRole} for Hire (${monthShort} ${year})`
}

export function hireTalentPath(slug: string): string {
  return `/hire/${slug}`
}
