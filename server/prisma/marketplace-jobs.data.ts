/**
 * Upwork-style marketplace job templates for PostgreSQL seeding.
 * Categories align with client JOB_CATEGORIES / freelance-jobs filters.
 */

type Budget =
  | { budgetType: 'fixed'; budgetFixed: number; budgetMin?: never; budgetMax?: never }
  | { budgetType: 'hourly'; budgetMin: number; budgetMax: number; budgetFixed?: never };

export type MarketplaceJobTemplate = {
  title: string;
  description: string;
  category: string;
  subcategory?: string;
  skills: string[];
  duration: string;
  experienceLevel: 'entry' | 'intermediate' | 'expert';
  proposalCount: number;
  viewCount: number;
} & Budget;

/** One skill set per job: rotate rows, optional max count. */
function skillsFromRows(pool: string[][], idx: number, max?: number): string[] {
  const row = [...pool[idx % pool.length]];
  if (max != null && row.length > max) return row.slice(0, max);
  return row;
}

function desc(intro: string, bullets: string[]): string {
  return `${intro}\n\nWhat we need:\n${bullets.map((b) => `• ${b}`).join('\n')}\n\nPlease include relevant portfolio links and your availability for a quick intro call.`;
}

const EXP = ['entry', 'intermediate', 'expert'] as const;
const DUR = [
  'Less than 1 month',
  '1 to 3 months',
  '3 to 6 months',
  'More than 6 months',
  'Ongoing / long-term',
];

function exp(i: number): (typeof EXP)[number] {
  return EXP[i % EXP.length];
}
function dur(i: number): string {
  return DUR[i % DUR.length];
}

function hourly(i: number): Budget {
  const pairs = [
    { min: 25, max: 45 },
    { min: 35, max: 60 },
    { min: 50, max: 85 },
    { min: 65, max: 120 },
    { min: 80, max: 150 },
  ];
  const p = pairs[i % pairs.length];
  return { budgetType: 'hourly', budgetMin: p.min, budgetMax: p.max };
}

function fixedPrice(i: number): Budget {
  const amounts = [800, 1200, 2500, 4500, 7500, 12000, 18000, 25000, 3500, 6000, 9000, 15000];
  return { budgetType: 'fixed', budgetFixed: amounts[i % amounts.length] };
}

export function buildMarketplaceJobTemplates(): MarketplaceJobTemplate[] {
  const t: MarketplaceJobTemplate[] = [];
  let i = 0;

  const webTitles = [
    'Senior Full-Stack Engineer for B2B SaaS Platform',
    'React + TypeScript Developer — Real-Time Analytics Dashboard',
    'Next.js 14 E-Commerce Store with Stripe & Inventory Sync',
    'Node.js API Developer for Mobile App Backend',
    'Vue 3 + Pinia Frontend for Healthcare Portal',
    'WordPress + WooCommerce Custom Theme & Checkout Flow',
    'Laravel PHP Developer — Multi-Tenant SaaS MVP',
    'Django REST API + PostgreSQL for FinTech Dashboard',
    'GraphQL API Integration & Performance Tuning',
    'AWS Serverless (Lambda + API Gateway) Microservices',
    'CI/CD Pipeline Setup — GitHub Actions + Docker + K8s',
    'Legacy jQuery to React Migration (Phased Rollout)',
    'Shopify Plus Custom App & Script Editor Expert',
    'WebSocket Engineer for Live Collaboration Features',
    'Accessibility (WCAG 2.1 AA) Audit & Remediation',
    'Senior Angular Developer for Enterprise Admin Console',
    'Ruby on Rails Developer — Subscription Billing & Webhooks',
    'Rust Developer for High-Performance Data Ingestion Service',
    'Elixir/Phoenix Real-Time Notification Service',
    'Headless CMS (Strapi) + Gatsby Marketing Site',
    'Python FastAPI Backend for ML Model Serving',
    'Spring Boot Java Developer — Banking Integration APIs',
    'NestJS + Prisma PostgreSQL — Multi-Module Monorepo',
    'Remix Full-Stack App with OAuth & Row-Level Security',
    'SvelteKit SSR Performance & SEO Optimization',
  ];

  const webSkills = [
    ['React', 'TypeScript', 'Node.js', 'PostgreSQL'],
    ['Next.js', 'Tailwind CSS', 'Stripe', 'Vercel'],
    ['Vue.js', 'Pinia', 'REST API', 'Jest'],
    ['WordPress', 'PHP', 'WooCommerce', 'MySQL'],
    ['Django', 'Python', 'PostgreSQL', 'Celery'],
    ['AWS', 'Docker', 'Terraform', 'GitHub Actions'],
    ['GraphQL', 'Apollo', 'Node.js', 'Redis'],
    ['Laravel', 'PHP', 'MySQL', 'Redis'],
    ['Angular', 'RxJS', 'NgRx', 'Jasmine'],
    ['Ruby on Rails', 'Sidekiq', 'PostgreSQL', 'RSpec'],
    ['Rust', 'Tokio', 'PostgreSQL'],
    ['Svelte', 'SvelteKit', 'TypeScript'],
    ['NestJS', 'Prisma', 'PostgreSQL', 'Jest'],
    ['Java', 'Spring Boot', 'Maven', 'JUnit'],
    ['Remix', 'React', 'PostgreSQL', 'Prisma'],
  ];

  webTitles.forEach((title, idx) => {
    const budget = idx % 3 === 0 ? fixedPrice(i) : hourly(i);
    t.push({
      title,
      description: desc(
        `We are a growing company looking for an experienced developer. ${title.split('—')[0].trim()}.`,
        [
          'Clean, documented code and regular commits',
          'Overlap at least 4 hours with US Eastern time',
          'Experience shipping production features end-to-end',
        ],
      ),
      category: 'web-development',
      subcategory: idx % 5 === 0 ? 'fullstack' : idx % 5 === 1 ? 'frontend' : 'backend',
      skills: skillsFromRows(webSkills, idx, 4 + (idx % 3)),
      duration: dur(i),
      experienceLevel: exp(i),
      proposalCount: 3 + (idx % 40),
      viewCount: 40 + idx * 7,
      ...budget,
    });
    i++;
  });

  const mobileTitles = [
    'React Native Developer — Social Fitness App',
    'Flutter Engineer for Banking-Style UI Kit',
    'SwiftUI iOS Engineer — HealthKit & Widgets',
    'Kotlin Android — Material 3 + Jetpack Compose',
    'React Native + Expo E2E with Detox',
    'Mobile CI/CD — Fastlane + TestFlight + Play Console',
    'Offline-First Mobile App with SQLite Sync',
    'In-App Purchases & Subscription Flow (iOS + Android)',
    'BLE Integration for Wearable Companion App',
    'React Native Performance — Hermes & Startup Time',
    'Flutter Web + Mobile Shared Codebase',
    'Swift + Objective-C Legacy Module Bridge',
    'Android Automotive / Tablet Kiosk App',
    'Capacitor Hybrid App from Existing Web App',
    'Mobile Security Review & Penetration Test Fixes',
  ];

  const mobileSkills = [
    ['React Native', 'TypeScript', 'Firebase', 'Redux'],
    ['Flutter', 'Dart', 'Bloc', 'REST API'],
    ['Swift', 'SwiftUI', 'Xcode', 'HealthKit'],
    ['Kotlin', 'Jetpack Compose', 'Coroutines', 'Room'],
    ['Expo', 'React Native', 'EAS', 'Jest'],
  ];

  mobileTitles.forEach((title, idx) => {
    const budget = idx % 2 === 0 ? hourly(i) : fixedPrice(i);
    t.push({
      title,
      description: desc(
        'Product-led mobile team hiring for our next release cycle. Strong UI polish and app store experience required.',
        ['Ship features behind feature flags', 'Write unit tests for critical paths', 'Collaborate with design on motion specs'],
      ),
      category: 'mobile-apps',
      subcategory: idx % 2 === 0 ? 'react-native' : 'flutter',
      skills: skillsFromRows(mobileSkills, idx, 4),
      duration: dur(i),
      experienceLevel: exp(i),
      proposalCount: 2 + (idx % 35),
      viewCount: 55 + idx * 11,
      ...budget,
    });
    i++;
  });

  const designTitles = [
    'UI/UX Designer — SaaS Onboarding & Empty States',
    'Figma Design System for Multi-Brand Product',
    'Logo + Brand Guidelines for AI Startup',
    'Pitch Deck & Investor One-Pager (Figma + PDF)',
    'Mobile App UI — Dark Mode + Accessibility',
    'Marketing Landing Page Design (Webflow-Ready)',
    'Illustration Pack for EdTech Children’s App',
    'Dashboard Data Visualization UX Patterns',
    'E-commerce UX Audit & Checkout Redesign',
    'Icon Set & Spot Illustrations (SVG)',
    'Presentation Template Design — Keynote + Google Slides',
    'Packaging Design Concepts for D2C Brand',
    '3D Product Renders for Shopify Store',
    'Email Template Design — Responsive HTML',
    'Wireframes → Hi-Fi for B2B Admin Tool',
  ];

  const designSkills = [
    ['Figma', 'UI Design', 'Prototyping', 'Design Systems'],
    ['Adobe Illustrator', 'Branding', 'Logo Design', 'Typography'],
    ['UX Research', 'User Flows', 'Figma', 'Miro'],
    ['Webflow', 'HTML', 'CSS', 'Responsive Design'],
    ['Blender', '3D Modeling', 'Rendering'],
  ];

  designTitles.forEach((title, idx) => {
    t.push({
      title,
      description: desc(
        'We value craft and clarity. Looking for a designer who can own flows from sketch to handoff.',
        ['Figma files with components & variants', 'Written rationale for key decisions', '2 rounds of revision included'],
      ),
      category: 'design',
      subcategory: idx % 3 === 0 ? 'ui-ux' : 'branding',
      skills: skillsFromRows(designSkills, idx, 4),
      duration: dur(i),
      experienceLevel: exp(i),
      proposalCount: 5 + (idx % 45),
      viewCount: 90 + idx * 9,
      ...fixedPrice(i),
    });
    i++;
  });

  const mktTitles = [
    'SEO Specialist — Technical + Content Strategy',
    'Google Ads & Meta Ads Manager (B2B Lead Gen)',
    'Email Marketing — Klaviyo Flows & Segmentation',
    'Social Media Manager — LinkedIn + X + Threads',
    'Marketing Automation (HubSpot) Setup & Cleanup',
    'Amazon PPC & Listing Optimization',
    'Content Writer — Long-Form SaaS Blog Posts',
    'Growth Analyst — GA4 + Looker Studio Dashboards',
    'Influencer Outreach & Campaign Coordination',
    'PR Outreach — Tech & Business Publications',
    'Conversion Rate Optimization — A/B Test Plan',
    'Community Manager — Discord + Telegram',
    'Podcast Show Notes & Distribution Checklist',
    'Affiliate Program Launch & Partner Outreach',
    'Brand Voice Guide & Messaging Matrix',
  ];

  const mktSkills = [
    ['SEO', 'Ahrefs', 'Google Search Console', 'Content Strategy'],
    ['Google Ads', 'Meta Ads', 'Copywriting', 'Analytics'],
    ['Klaviyo', 'Email Marketing', 'Copywriting', 'Segmentation'],
    ['Social Media', 'Hootsuite', 'Canva', 'Analytics'],
    ['HubSpot', 'Marketing Automation', 'CRM'],
  ];

  mktTitles.forEach((title, idx) => {
    const budget = idx % 4 === 0 ? fixedPrice(i) : hourly(i);
    t.push({
      title,
      description: desc(
        'Marketing team scaling paid and organic channels. Need someone who reports with numbers, not vanity metrics.',
        ['Weekly async updates + Loom walkthroughs', 'Clear KPI definitions week one', 'Experience in our industry a plus'],
      ),
      category: 'marketing',
      skills: skillsFromRows(mktSkills, idx, 4),
      duration: dur(i),
      experienceLevel: exp(i),
      proposalCount: 4 + (idx % 38),
      viewCount: 70 + idx * 8,
      ...budget,
    });
    i++;
  });

  const writeTitles = [
    'Technical Writer — API Reference & Developer Docs',
    'Ghostwriter — Business Leadership eBook (50k words)',
    'Copywriter — SaaS Homepage + Pricing Page',
    'Grant Writer — Nonprofit Education Program',
    'Scriptwriter — YouTube Explainer Series (Tech)',
    'Resume & LinkedIn Profile for Executives',
    'Legal Blog Writer (Attorney Review Provided)',
    'Email Sequence for Cold Outreach (B2B)',
    'Product Description Writer — 500 SKUs',
    'Press Release — Funding Announcement',
    'UX Microcopy & Empty State Messaging',
    'Academic Editing — STEM Journal Submissions',
    'Subtitle & Transcript QA for Video Course',
    'RFP Response Writer — IT Services',
    'Newsletter Editor — Weekly Curated Digest',
  ];

  const writeSkills = [
    ['Technical Writing', 'Markdown', 'API', 'Documentation'],
    ['Copywriting', 'SEO', 'Content Strategy'],
    ['Editing', 'Proofreading', 'AP Style'],
    ['Ghostwriting', 'Publishing', 'Research'],
  ];

  writeTitles.forEach((title, idx) => {
    t.push({
      title,
      description: desc(
        'Quality writing is core to our brand. Native-level English and deadline discipline required.',
        ['2 sample pieces or portfolio links', 'Track changes / version history', 'Open to 1 discovery call'],
      ),
      category: 'writing',
      skills: skillsFromRows(writeSkills, idx, 3 + (idx % 2)),
      duration: dur(i),
      experienceLevel: exp(i),
      proposalCount: 6 + (idx % 30),
      viewCount: 50 + idx * 6,
      ...fixedPrice(i),
    });
    i++;
  });

  const dsTitles = [
    'Machine Learning Engineer — Tabular Data Pipeline',
    'NLP Specialist — Chatbot Intent Classification',
    'Computer Vision — Document OCR & Field Extraction',
    'MLOps — MLflow + Kubernetes Model Deployment',
    'Data Scientist — Churn Prediction & Feature Store',
    'OpenAI API Integration — RAG over Internal Wiki',
    'PyTorch Fine-Tuning for Domain-Specific LLM',
    'Time-Series Forecasting for Retail Demand',
    'Data Engineer — dbt + Snowflake + Airflow',
    'Ethical Hacking / Pen Test Report Remediation Support',
    'Spark / Databricks ETL for Ad-Tech Logs',
    'BI Developer — Power BI + DAX Measures',
    'Synthetic Data Generation for QA Environments',
    'Recommender System Prototype (Collaborative Filtering)',
    'A/B Test Analysis — Bayesian + Frequentist Summary',
  ];

  const dsSkills = [
    ['Python', 'PyTorch', 'scikit-learn', 'Pandas'],
    ['TensorFlow', 'Keras', 'GCP', 'Vertex AI'],
    ['OpenAI', 'LangChain', 'Vector DB', 'Python'],
    ['SQL', 'dbt', 'Snowflake', 'Airflow'],
    ['AWS', 'SageMaker', 'MLOps', 'Docker'],
  ];

  dsTitles.forEach((title, idx) => {
    const budget = idx % 2 === 0 ? hourly(i) : fixedPrice(i);
    t.push({
      title,
      description: desc(
        'Data/ML team building production-grade pipelines. Security and reproducibility matter.',
        ['Document assumptions and data lineage', 'Notebook → production handoff plan', 'NDA available before data access'],
      ),
      category: 'data-science',
      subcategory: idx % 4 === 0 ? 'ml' : 'analytics',
      skills: skillsFromRows(dsSkills, idx, 4),
      duration: dur(i),
      experienceLevel: exp(i),
      proposalCount: 2 + (idx % 25),
      viewCount: 60 + idx * 10,
      ...budget,
    });
    i++;
  });

  const gameTitles = [
    'Unity Gameplay Programmer — Mobile Puzzle Game',
    'Unreal Engine 5 Blueprint + C++ Gameplay',
    '2D Pixel Art Animator for Roguelike',
    'Game Economy Balancing & LiveOps Spreadsheet',
    'Multiplayer Netcode Consultant (Unity NGO / FishNet)',
    'Shader Artist — Stylized Toon Water',
    'Level Designer — Mobile Runner (Unity)',
    'Audio Integration — FMOD + Unity',
    'UI Implementation — uGUI / UIToolkit',
    'QA Test Plan for Steam Early Access Build',
  ];

  const gameSkillRows = [
    ['Unity', 'C#', 'Gameplay', 'Mobile'],
    ['Unreal Engine', 'Blueprints', 'C++', 'PC'],
    ['Blender', 'Animation', '2D Art', 'Spine'],
    ['Game Design', 'Balance', 'Excel', 'Analytics'],
  ];

  gameTitles.forEach((title, idx) => {
    t.push({
      title,
      description: desc(
        'Indie studio with shipped titles. Remote-friendly; async standups twice weekly.',
        ['Portfolio with playable builds preferred', 'Estimate milestones with buffer', 'Git LFS familiarity'],
      ),
      category: 'game-development',
      skills: skillsFromRows(gameSkillRows, idx, 4),
      duration: dur(i),
      experienceLevel: exp(i),
      proposalCount: 3 + (idx % 20),
      viewCount: 45 + idx * 12,
      ...fixedPrice(i),
    });
    i++;
  });

  const videoTitles = [
    'Video Editor — YouTube Long-Form (Premiere Pro)',
    'Motion Graphics — After Effects Product Explainer',
    'Colorist — DaVinci Resolve for Web Series',
    'Short-Form Editor — TikTok / Reels (CapCut OK)',
    'Podcast Audio Edit & Mastering (Audition)',
    'Subtitles SRT + Burn-In for 20 Episodes',
    'Drone Footage Edit — Real Estate Showcase',
    'Documentary Story Producer (Remote)',
    'Livestream Director — OBS + vMix',
    'Sound Design — UI & Transition SFX Pack',
  ];

  const videoSkillRows = [
    ['Premiere Pro', 'After Effects', 'Video Editing'],
    ['DaVinci Resolve', 'Color Grading', 'Video'],
    ['Audition', 'Audio Editing', 'Podcast'],
    ['Motion Graphics', 'After Effects', 'Animation'],
  ];

  videoTitles.forEach((title, idx) => {
    t.push({
      title,
      description: desc(
        'Creative team producing weekly content. Need fast turnaround and organized project files.',
        ['Source files delivered with project archive', 'Revision policy: 2 rounds', 'Music licensing awareness'],
      ),
      category: 'video',
      subcategory: 'editing',
      skills: skillsFromRows(videoSkillRows, idx, 3),
      duration: dur(i),
      experienceLevel: exp(i),
      proposalCount: 8 + (idx % 28),
      viewCount: 100 + idx * 7,
      ...hourly(i),
    });
    i++;
  });

  const financeTitles = [
    'Bookkeeper — QuickBooks Online Cleanup (12 Mo)',
    'Fractional CFO — SaaS Metrics & Board Deck',
    'Tax Consultant — Multi-State Sales Tax Nexus',
    'Financial Model — 5-Year SaaS Forecast',
    'Accounts Payable Automation (Bill.com)',
    'Xero Migration from Spreadsheet Chaos',
    'Payroll Specialist — Gusto + Multi-State',
    'Invoice Factoring Analysis & Lender Comparison',
    'Expense Policy & T&E Audit',
    'Due Diligence Support — Data Room Index',
  ];

  const financeSkillRows = [
    ['QuickBooks', 'Bookkeeping', 'Excel', 'GAAP'],
    ['Financial Modeling', 'Excel', 'SaaS Metrics'],
    ['Xero', 'Accounting', 'Payroll'],
  ];

  financeTitles.forEach((title, idx) => {
    t.push({
      title,
      description: desc(
        'Finance ops for SMB. US entity; CPA review available for tax-related deliverables.',
        ['Signed NDA before sensitive files', 'Weekly reconciliation cadence', 'Excel + cloud accounting tools'],
      ),
      category: 'finance',
      skills: skillsFromRows(financeSkillRows, idx, 3),
      duration: dur(i),
      experienceLevel: exp(i),
      proposalCount: 4 + (idx % 18),
      viewCount: 35 + idx * 5,
      ...hourly(i),
    });
    i++;
  });

  return t;
}
