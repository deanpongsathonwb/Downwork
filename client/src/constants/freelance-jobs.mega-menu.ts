/**
 * Find Work subnav mega-menus — column/section layout inspired by marketplace browse.
 * Links use /freelance-jobs/:slug landings (see mega-menu-landing-paths).
 */

import { freelanceJobsMegaMenuHrefFromFilters } from './mega-menu-landing-paths'

export type FreelanceJobsMegaMenuKey = 'dev' | 'ai' | 'design' | 'marketing' | 'admin' | 'more'

export interface FreelanceJobsMegaMenuLink {
  label: string
  href: string
}

export interface FreelanceJobsMegaMenuSection {
  heading: string
  links: FreelanceJobsMegaMenuLink[]
  /** Long stacks: on large screens, links flow in two side-by-side columns (fills col1 top→bottom, then col2). */
  linksGridColumns?: 2
}

/** Each inner array is one column (1–4 sections per column). */
export type FreelanceJobsMegaMenuColumns = FreelanceJobsMegaMenuSection[][]

const B = freelanceJobsMegaMenuHrefFromFilters

const F = (slug: string) => `/freelance-jobs/${slug}`

export const FREELANCE_JOBS_MEGA_MENU: Record<FreelanceJobsMegaMenuKey, FreelanceJobsMegaMenuColumns> = {
  /**
   * Development & IT — four columns (reference mega-menu):
   * 1 Data Science | 2 Development (wide) | 3 Emerging + Game + Mobile stacked | 4 Web + Other stacked
   */
  dev: [
    [
      {
        heading: 'Data Science & Analytics',
        links: [
          { label: 'Data Analyst Jobs', href: B('data-science', 'analyst') },
          { label: 'Data Science Jobs', href: F('machine-learning-jobs') },
          { label: 'Microsoft Power BI Jobs', href: B('data-science', 'power bi') },
          { label: 'Geographic Information System (GIS) Jobs', href: B('data-science', 'gis') },
          { label: 'Data Engineer Jobs', href: B('data-science', 'engineer') },
          { label: 'Tableau Software Jobs', href: B('data-science', 'tableau') },
          { label: 'R Jobs', href: B('data-science', 'r') },
          { label: 'Data Visualization Jobs', href: B('data-science', 'visualization') },
          { label: 'Google Analytics Jobs', href: B('marketing', 'google analytics') },
        ],
      },
    ],
    [
      {
        heading: 'Development',
        links: [
          { label: 'Amazon Backend Developer Jobs', href: B('web-development', 'amazon backend') },
          { label: 'Python Jobs', href: F('python-jobs') },
          { label: 'Java Development Jobs', href: B('web-development', 'java') },
          { label: 'DevOps Engineer Jobs', href: B('web-development', 'devops') },
          { label: 'SQL Jobs', href: B('web-development', 'sql') },
          { label: 'Django Jobs', href: B('web-development', 'django') },
          { label: 'PHP Developer Jobs', href: B('web-development', 'php') },
          { label: 'Golang Jobs', href: B('web-development', 'golang') },
          { label: 'Ruby on Rails Jobs', href: B('web-development', 'ruby on rails') },
          { label: 'Web Scraping Jobs', href: B('web-development', 'web scraping') },
          { label: 'C++ Developer Jobs', href: B('web-development', 'c++') },
          { label: 'C# Programming Jobs', href: B('web-development', 'c#') },
          { label: 'Amazon Web Services Jobs', href: B('web-development', 'aws') },
          { label: 'HTML Jobs', href: B('web-development', 'html') },
          { label: 'React.js Jobs', href: B('web-development', 'react') },
          { label: 'JavaScript Jobs', href: B('web-development', 'javascript') },
          { label: 'Remote UX Design Jobs', href: B('design', 'ux') },
          { label: 'Vue.js Jobs', href: B('web-development', 'vue') },
          { label: 'CSS Jobs', href: B('web-development', 'css') },
          { label: 'Application Programmer Jobs', href: B('web-development', 'application programmer') },
          { label: 'Node.js Jobs', href: B('web-development', 'node') },
          { label: 'Software Development Jobs', href: F('software-development-jobs') },
          { label: 'Salesforce App Developer Jobs', href: B('web-development', 'salesforce') },
          { label: 'ASP.NET Jobs', href: B('web-development', 'asp.net') },
        ],
      },
    ],
    [
      {
        heading: 'Emerging Tech',
        links: [
          { label: 'Machine Learning Jobs', href: F('machine-learning-jobs') },
          { label: 'Ethical Hacking Jobs', href: F('ethical-hacking-jobs') },
          { label: 'Blockchain Jobs', href: B('web-development', 'blockchain') },
          { label: 'Cryptocurrency Jobs', href: B('web-development', 'cryptocurrency') },
          { label: 'Artificial Intelligence Jobs', href: F('openai-jobs') },
          { label: 'Remote Solidity Jobs', href: B('web-development', 'solidity') },
          { label: 'AI Content Creation', href: B('data-science', 'ai content creation') },
          { label: 'ChatGPT', href: F('openai-jobs') },
          { label: 'GPT-3', href: F('openai-jobs') },
          { label: 'Midjourney AI', href: B('design', 'midjourney') },
          { label: 'OpenAI Codex', href: F('openai-jobs') },
          { label: 'StableDiffusion', href: B('design', 'stable diffusion') },
          { label: 'Google BERT', href: B('data-science', 'bert') },
        ],
      },
      {
        heading: 'Game Development',
        links: [
          { label: 'Mobile Game Development Jobs', href: B('game-development', 'mobile game') },
          { label: 'Game Development Jobs', href: B('game-development') },
          { label: 'Unity Programmer Jobs', href: B('game-development', 'unity') },
        ],
      },
      {
        heading: 'Mobile App Development',
        links: [
          { label: 'Flutter Jobs', href: B('mobile-apps', 'flutter') },
          { label: 'Android Developer Jobs', href: B('mobile-apps', 'android') },
          { label: 'Mobile App Developer Jobs', href: F('mobile-app-development-jobs') },
          { label: 'React Native Jobs', href: B('mobile-apps', 'react native') },
          { label: 'iOS Developer Jobs', href: B('mobile-apps', 'ios') },
        ],
      },
    ],
    [
      {
        heading: 'Web Development',
        links: [
          { label: 'Web Developer Jobs', href: F('website-development') },
          { label: 'WordPress Jobs', href: F('wordpress-jobs') },
          { label: 'Shopify Jobs', href: B('web-development', 'shopify') },
          { label: 'Remote Magento Jobs', href: B('web-development', 'magento') },
          { label: 'Shopify Theme Designer Jobs', href: B('design', 'shopify theme') },
          { label: 'UI Designer Jobs', href: B('design', 'ui designer') },
          { label: 'Figma Jobs', href: B('design', 'figma') },
          { label: 'Web Design Jobs', href: F('web-design-jobs') },
          { label: 'Webflow Jobs', href: B('web-development', 'webflow') },
          { label: 'WiX Jobs', href: B('web-development', 'wix') },
          { label: 'Elementor Jobs', href: B('web-development', 'elementor') },
          { label: 'Ecommerce Development Jobs', href: B('web-development', 'ecommerce') },
          { label: 'Frontend Developer Jobs', href: B('web-development', 'frontend') },
        ],
      },
      {
        heading: 'Other',
        links: [
          { label: 'Excel Jobs', href: B('web-development', 'excel') },
          { label: 'VBA Jobs', href: B('web-development', 'vba') },
          { label: 'DevOps Engineering Jobs', href: B('web-development', 'devops engineering') },
          { label: 'IT Outsourcing Jobs', href: B('web-development', 'it outsourcing') },
          { label: 'Bug Testing Jobs', href: B('web-development', 'bug testing') },
          { label: 'Remote QA Jobs', href: B('web-development', 'qa') },
        ],
      },
    ],
  ],

  ai: [
    [
      {
        heading: 'AI Writing Jobs',
        links: [
          { label: 'AI Content Editing Jobs', href: B('data-science', 'ai content editing') },
          { label: 'AI Writing Jobs', href: F('content-writing-jobs') },
          { label: 'AI Content Creation Jobs', href: B('data-science', 'ai content creation') },
        ],
      },
      {
        heading: 'AI Art Jobs',
        links: [
          { label: 'AI Art Jobs', href: B('design', 'ai art') },
          { label: 'StableDiffusion Jobs', href: B('design', 'stable diffusion') },
          { label: 'Midjourney AI Jobs', href: B('design', 'midjourney') },
        ],
      },
    ],
    [
      {
        heading: 'AI Development Jobs',
        links: [
          { label: 'AI Development Jobs', href: F('ai-app-development-jobs') },
          { label: 'Generative AI Jobs', href: B('data-science', 'generative') },
          { label: 'Prompt Engineering Jobs', href: F('openai-jobs') },
          { label: 'AI Chatbot Jobs', href: F('chatbot-development-jobs') },
          { label: 'Machine Learning Jobs', href: F('machine-learning-jobs') },
          { label: 'Large Language Model Jobs', href: B('data-science', 'llm') },
          { label: 'Azure OpenAI Jobs', href: B('data-science', 'azure openai') },
          { label: 'AI Text-to-Image Jobs', href: B('data-science', 'text to image') },
          { label: 'AI Text-to-Speech Jobs', href: B('data-science', 'text to speech') },
          { label: 'OpenAI Codex Jobs', href: F('openai-jobs') },
          { label: 'Natural Language Processing', href: B('data-science', 'natural language processing') },
          { label: 'Autoencoder Jobs', href: B('data-science', 'autoencoder') },
          { label: 'Variational Autoencoder Jobs', href: B('data-science', 'variational autoencoder') },
        ],
      },
      {
        heading: 'AI & Data Service Jobs',
        links: [
          { label: 'Data Science Jobs', href: F('machine-learning-jobs') },
          { label: 'Data Annotation Jobs', href: B('data-science', 'annotation') },
        ],
      },
    ],
    [
      {
        heading: 'AI Framework & Technology Jobs',
        links: [
          { label: 'ChatGPT Jobs', href: F('openai-jobs') },
          { label: 'Artificial Neural Network Jobs', href: B('data-science', 'artificial neural network') },
          { label: 'Model Tuning', href: B('data-science', 'model tuning') },
          { label: 'Generative Adversarial Network Jobs', href: B('data-science', 'generative adversarial network') },
          { label: 'Gradio Jobs', href: B('data-science', 'gradio') },
          { label: 'Hugging Face Jobs', href: B('data-science', 'hugging') },
          { label: 'Replit Jobs', href: B('web-development', 'replit') },
          { label: 'Streamlit Jobs', href: B('data-science', 'streamlit') },
          { label: 'BLOOM Jobs', href: B('data-science', 'bloom') },
          { label: 'GPT Neo Jobs', href: B('data-science', 'gpt neo') },
          { label: 'GPT-3 Jobs', href: F('openai-jobs') },
          { label: 'GPT-J Jobs', href: B('data-science', 'gpt-j') },
          { label: 'Deep Learning Jobs', href: B('data-science', 'deep learning') },
          { label: 'Tensorflow Jobs', href: B('data-science', 'tensorflow') },
          { label: 'Computer Vision Jobs', href: B('data-science', 'computer vision') },
          { label: 'Google BERT Jobs', href: B('data-science', 'bert') },
        ],
      },
    ],
    [
      {
        heading: 'AI Consulting & Research Jobs',
        links: [
          { label: 'AI Consulting Jobs', href: B('data-science', 'ai consulting') },
          { label: 'AI Research Jobs', href: B('data-science', 'ai research') },
          { label: 'AI Model Integration', href: B('data-science', 'ai model integration') },
        ],
      },
    ],
  ],

  design: [
    [
      {
        heading: 'Animation',
        links: [
          { label: 'Animation Jobs', href: F('animation-jobs') },
          { label: 'Blender3D Jobs', href: B('video', 'blender') },
          { label: 'Whiteboard Animation Video Jobs', href: B('video', 'whiteboard animation') },
          { label: 'Motion Graphics Jobs', href: F('video-editing-jobs') },
          { label: '2D Animation Jobs', href: B('video', '2d animation') },
          { label: '3D Animation Jobs', href: B('video', '3d animation') },
          { label: 'Explainer Video Jobs', href: B('video', 'explainer') },
        ],
      },
      {
        heading: 'Audio Production',
        links: [
          { label: 'Podcasting Jobs', href: B('video', 'podcast') },
          { label: 'Sound Design Jobs', href: B('video', 'sound design') },
          { label: 'Audio Editing Jobs', href: F('audio-editing-jobs') },
          { label: 'Music Production Jobs', href: F('music-production-jobs') },
          { label: 'Voice Over Jobs', href: F('voice-over-jobs') },
        ],
      },
      {
        heading: 'Fashion Design',
        links: [
          { label: 'Fashion Design Jobs', href: B('design', 'fashion') },
          { label: 'Sewing Jobs', href: B('design', 'sewing') },
          { label: 'Pattern Making Jobs', href: B('design', 'pattern making') },
        ],
      },
    ],
    [
      {
        heading: 'Graphic Design',
        links: [
          { label: 'Graphic Design Jobs', href: F('graphic-design-jobs') },
          { label: 'Adobe Photoshop Jobs', href: B('design', 'photoshop') },
          { label: 'Social Media Design Jobs', href: F('social-media-management-jobs') },
          { label: 'Adobe After Effects Jobs', href: B('design', 'after effects') },
          { label: 'Logo Design Jobs', href: F('logo-design-jobs') },
          { label: 'Canva Jobs', href: F('canva-jobs') },
          { label: 'Banner Design Jobs', href: B('design', 'banner') },
          { label: 'Flyer Design Jobs', href: B('design', 'flyer') },
          { label: 'Packaging Design Jobs', href: B('design', 'packaging') },
          { label: 'Print Design Jobs', href: B('design', 'print') },
          { label: 'Brochure Design Jobs', href: B('design', 'brochure') },
          { label: 'Brand Identity Design Jobs', href: B('design', 'brand identity') },
        ],
      },
      {
        heading: 'Illustration',
        links: [
          { label: 'Illustration Jobs', href: F('illustration-jobs') },
          { label: 'Digital Art Jobs', href: B('design', 'digital art') },
          { label: 'Adobe Illustrator Jobs', href: B('design', 'illustrator') },
          { label: 'Infographic Design Jobs', href: B('design', 'infographic') },
          { label: 'Storyboard Jobs', href: B('design', 'storyboard') },
          { label: "Children's Book Illustration Jobs", href: B('design', 'children book') },
          { label: 'Comic Art Jobs', href: B('design', 'comic') },
          { label: 'Vector Illustration Jobs', href: B('design', 'vector') },
          { label: 'Character Design Jobs', href: B('design', 'character') },
          { label: 'Concept Art Jobs', href: B('design', 'concept art') },
          { label: 'Book Cover Design Jobs', href: B('design', 'book cover') },
          { label: 'NFT Art Jobs', href: B('design', 'nft art') },
        ],
      },
    ],
    [
      {
        heading: 'Interior Design',
        links: [
          { label: 'Architecture Jobs', href: B('web-development', 'architecture') },
          { label: 'CAD Designer Jobs', href: B('web-development', 'cad') },
          { label: 'Interior Design Jobs', href: B('design', 'interior') },
          { label: 'Space Planning Jobs', href: B('design', 'space planning') },
        ],
      },
      {
        heading: 'Music Production',
        links: [
          { label: 'Music Producing Jobs', href: F('music-production-jobs') },
          { label: 'Musical Transcription Jobs', href: B('video', 'musical transcription') },
          { label: 'Audio Mixing Jobs', href: F('audio-editing-jobs') },
          { label: 'Beat Making Jobs', href: B('video', 'beat making') },
          { label: 'Jingle Production Jobs', href: B('video', 'jingle') },
        ],
      },
      {
        heading: 'Video Production',
        links: [
          { label: 'Video Editor Jobs', href: F('video-editing-jobs') },
          { label: 'Voiceover & Audiobook Narrator Jobs', href: F('voice-over-jobs') },
          { label: 'Videographer Jobs', href: B('video', 'videographer') },
          { label: 'Video Production Jobs', href: B('video', 'video production') },
          { label: 'YouTube Editing Jobs', href: B('video', 'youtube editing') },
          { label: 'Wedding Videography Jobs', href: B('video', 'wedding') },
        ],
      },
    ],
    [
      {
        heading: 'Other',
        links: [
          { label: 'Branding Jobs', href: B('design', 'branding') },
          { label: 'Manga Jobs', href: B('design', 'manga') },
          { label: 'Instructional Design Jobs', href: B('design', 'instructional') },
          { label: 'Presentation Design Jobs', href: B('design', 'presentation') },
          { label: 'Typography Jobs', href: B('design', 'typography') },
          { label: 'T-Shirt Design Jobs', href: B('design', 't-shirt') },
          { label: 'WordPress Design Jobs', href: B('design', 'wordpress design') },
          { label: 'UI Design Jobs', href: B('design', 'ui') },
          { label: 'UX Design Jobs', href: B('design', 'ux') },
          { label: 'Photo Editing Jobs', href: B('design', 'photo editing') },
        ],
      },
    ],
  ],

  marketing: [
    [
      {
        heading: 'Analytics',
        links: [
          { label: 'Google Tag Manager Jobs', href: B('marketing', 'google tag manager') },
          { label: 'Data Analyst Jobs', href: B('data-science', 'analyst') },
          { label: 'Google Analytics Jobs', href: B('marketing', 'google analytics') },
          { label: 'Marketing Strategy Jobs', href: B('marketing', 'strategy') },
          { label: 'Marketing Automation Experts', href: B('marketing', 'marketing automation') },
          { label: 'Web Analyst', href: B('marketing', 'web analyst') },
        ],
      },
      {
        heading: 'Content Marketing',
        links: [
          { label: 'Blog Writing Jobs', href: B('writing', 'blog') },
          { label: 'Content Creator Jobs', href: B('marketing', 'content creator') },
          { label: 'Content Marketing Jobs', href: B('marketing', 'content marketing') },
          { label: 'Content Strategist Jobs', href: B('marketing', 'content strategist') },
        ],
      },
    ],
    [
      {
        heading: 'Digital Marketing',
        links: [
          { label: 'Digital Marketing Jobs', href: F('digital-marketing-jobs') },
          { label: 'Affiliate Marketing Jobs', href: B('marketing', 'affiliate') },
          { label: 'Ad Posting Jobs', href: B('marketing', 'ad posting') },
          { label: 'Email Marketing Jobs', href: F('email-marketing-jobs') },
          { label: 'Online Advertising Job', href: F('google-ads-jobs') },
          { label: 'TikTok Jobs', href: B('marketing', 'tiktok') },
          { label: 'Google Analytics Jobs', href: B('marketing', 'google analytics') },
          { label: 'Internet Marketing Jobs', href: B('marketing', 'internet marketing') },
          { label: 'Classifieds Posting Jobs', href: B('marketing', 'classifieds') },
          { label: 'Spotify Jobs', href: B('marketing', 'spotify') },
          { label: 'Display Marketing Jobs', href: B('marketing', 'display marketing') },
          { label: 'MailChimp Jobs', href: B('marketing', 'mailchimp') },
        ],
      },
      {
        heading: 'SEO/SEM',
        links: [
          { label: 'Google Ads Jobs', href: F('google-ads-jobs') },
          { label: 'Pay Per Click Jobs', href: B('marketing', 'ppc') },
          { label: 'App Store Optimization (ASO) Jobs', href: B('marketing', 'aso') },
          { label: 'Search Engine Marketing (SEM) Jobs', href: B('marketing', 'sem') },
          { label: 'SEO Jobs', href: F('seo-jobs') },
          { label: 'Link Building Jobs', href: B('marketing', 'link building') },
        ],
      },
    ],
    [
      {
        heading: 'Social Media',
        links: [
          { label: 'LinkedIn Jobs', href: B('marketing', 'linkedin') },
          { label: 'Facebook Jobs', href: B('marketing', 'facebook') },
          { label: 'Social Media Manager Jobs', href: F('social-media-management-jobs') },
          { label: 'YouTube Editing Jobs', href: B('marketing', 'youtube editing') },
          { label: 'Social Media Marketing Jobs', href: F('social-media-management-jobs') },
          { label: 'Instagram Jobs', href: B('marketing', 'instagram') },
          { label: 'Facebook Advertising Jobs', href: B('marketing', 'facebook advertising') },
          { label: 'Social Media Influencer Jobs', href: B('marketing', 'influencer') },
          { label: 'Facebook Ads Manager Jobs', href: B('marketing', 'facebook ads manager') },
          { label: 'Facebook Marketing Jobs', href: B('marketing', 'facebook marketing') },
          { label: 'Pinterest Marketing Jobs', href: B('marketing', 'pinterest') },
          { label: 'YouTube Marketing Jobs', href: B('marketing', 'youtube') },
          { label: 'Instagram Marketing Jobs', href: B('marketing', 'instagram marketing') },
          { label: 'Reddit Marketing Jobs', href: B('marketing', 'reddit') },
        ],
      },
    ],
    [
      {
        heading: 'Other',
        links: [
          { label: 'Brand Consulting Jobs', href: B('marketing', 'brand consulting') },
          { label: 'Market Research Jobs', href: B('marketing', 'research') },
          { label: 'Marketing Strategy Jobs', href: B('marketing', 'strategy') },
          { label: 'Kartra Jobs', href: B('marketing', 'kartra') },
          { label: 'Marketing Automation Jobs', href: B('marketing', 'marketing automation') },
          { label: 'Marketing Jobs', href: F('digital-marketing-jobs') },
          { label: 'Online Sales Jobs', href: B('marketing', 'online sales') },
          { label: 'Event Planning Jobs', href: B('marketing', 'event planning') },
          { label: 'Cold Calling Jobs', href: F('cold-calling-jobs') },
          { label: 'Telemarketing Jobs', href: B('marketing', 'telemarketing') },
          { label: 'Lead Generation Jobs', href: F('lead-generation-jobs') },
          { label: 'Data Cleaning Jobs', href: B('marketing', 'data cleaning') },
          { label: 'Prospect List Jobs', href: B('marketing', 'prospect list') },
        ],
      },
    ],
  ],

  admin: [
    [
      {
        heading: 'Customer Service',
        links: [
          { label: 'Chat Support Jobs', href: F('chat-support-jobs') },
          { label: 'Customer Service Jobs', href: B('writing', 'customer') },
          { label: 'Email Support Jobs', href: B('writing', 'email support') },
          { label: 'Email Handling Jobs', href: B('writing', 'email handling') },
          { label: 'CustomerSupportJobs', href: B('writing', 'customer support') },
          { label: 'Call Center Jobs', href: B('writing', 'call center') },
        ],
      },
    ],
    [
      {
        heading: 'Data Entry',
        links: [
          { label: 'Data Entry Jobs', href: B('writing', 'data entry') },
          { label: 'Microsoft Excel Jobs', href: B('writing', 'excel') },
          { label: 'Remote Medical Billing & Coding Jobs', href: B('writing', 'medical billing') },
          { label: 'Data Mining Jobs', href: B('writing', 'data mining') },
          { label: 'Transcription Jobs', href: B('writing', 'transcription') },
          { label: 'Data Cleansing Jobs', href: B('writing', 'data cleansing') },
          { label: 'CRM Data Entry Jobs', href: B('writing', 'crm data entry') },
          { label: 'Copy Paste Jobs', href: B('writing', 'copy paste') },
          { label: 'Microsoft Word Jobs', href: B('writing', 'microsoft word') },
          { label: 'PDF Conversion Jobs', href: B('writing', 'pdf conversion') },
          { label: 'Spreadsheet Jobs', href: B('writing', 'spreadsheet') },
          { label: 'Form Filling Jobs', href: B('writing', 'form filling') },
          { label: 'Inventory Management Jobs', href: B('writing', 'inventory') },
          { label: 'Order Processing Jobs', href: B('writing', 'order processing') },
        ],
      },
    ],
    [
      {
        heading: 'Personal / Virtual Assistance',
        links: [
          { label: 'Virtual Assistant Jobs', href: F('virtual-assistant-jobs') },
          { label: 'Amazon FBA Jobs', href: B('writing', 'amazon fba') },
          { label: 'Administrative Support Jobs', href: B('writing', 'administrative') },
          { label: 'Google Slides Jobs', href: B('writing', 'google slides') },
          { label: 'Executive Assistant Jobs', href: B('writing', 'executive') },
          { label: 'Personal Assistant Jobs', href: B('writing', 'personal assistant') },
          { label: 'Calendar Management Jobs', href: B('writing', 'calendar') },
          { label: 'Travel Planning Jobs', href: B('writing', 'travel planning') },
          { label: 'Email Management Jobs', href: B('writing', 'email management') },
          { label: 'Shopify Virtual Assistant Jobs', href: B('writing', 'shopify va') },
          { label: 'Real Estate Virtual Assistant Jobs', href: B('writing', 'real estate va') },
          { label: 'Social Media Virtual Assistant Jobs', href: B('writing', 'social media va') },
          { label: 'Customer Onboarding Jobs', href: B('writing', 'customer onboarding') },
          { label: 'Online Business Manager Jobs', href: B('writing', 'online business manager') },
          { label: 'Project Coordinator Jobs', href: B('marketing', 'project') },
          { label: 'Data Entry Virtual Assistant Jobs', href: B('writing', 'data entry va') },
          { label: 'Research Assistant Jobs', href: B('writing', 'research assistant') },
        ],
      },
    ],
    [
      {
        heading: 'Web Research & Posting',
        links: [
          { label: 'Web Scraping Jobs', href: B('web-development', 'web scraping') },
          { label: 'Etsy Administration Jobs', href: B('writing', 'etsy') },
          { label: 'Amazon Product Listing Jobs', href: B('writing', 'amazon listing') },
          { label: 'Internet Researchers', href: B('writing', 'internet research') },
          { label: 'Web Researchers', href: B('writing', 'web research') },
          { label: 'eBay Listing/Writing Jobs', href: B('writing', 'ebay listing') },
          { label: 'Fact Checkers', href: B('writing', 'fact check') },
        ],
      },
      {
        heading: 'Other',
        links: [
          { label: 'Proofreading Jobs', href: B('writing', 'proofread') },
          { label: 'Remote Project Manager Jobs', href: B('writing', 'project manager') },
          { label: 'Editing Jobs', href: F('book-editing-jobs') },
          { label: 'Remote Management Jobs', href: B('writing', 'remote management') },
          { label: 'Task Coordination Jobs', href: B('writing', 'task coordination') },
          { label: 'Bookkeepers', href: B('finance', 'bookkeep') },
          { label: 'Presentation designers', href: B('design', 'presentation') },
          { label: 'Google Slides Specialists', href: B('writing', 'google slides specialist') },
          { label: 'Content Moderation Jobs', href: F('content-moderation-jobs') },
        ],
      },
    ],
  ],

  more: [
    [
      {
        heading: '',
        links: [
          { label: 'Writing & Translation', href: B('writing') },
          { label: 'Finance & Accounting', href: B('finance') },
          { label: 'Engineering & Architecture', href: B('web-development', 'engineering') },
          { label: 'Legal', href: B('writing', 'legal') },
          { label: 'HR & Training', href: B('marketing', 'hr') },
        ],
      },
    ],
    [
      {
        heading: 'Academic Writing',
        links: [
          { label: 'Essay Writing Job', href: B('writing', 'essay') },
          { label: 'Research Jobs', href: B('writing', 'research') },
          { label: 'Academic Writing Jobs', href: B('writing', 'academic') },
          { label: 'Literature Review Jobs', href: B('writing', 'literature review') },
          { label: 'Thesis Editing Jobs', href: B('writing', 'thesis') },
          { label: 'Citation Formatting Jobs', href: B('writing', 'citation') },
          { label: 'Dissertation Help Jobs', href: B('writing', 'dissertation') },
        ],
      },
      {
        heading: 'Content Writing',
        links: [
          { label: 'Resume Writing Jobs', href: B('writing', 'resume') },
          { label: 'SEO Writing Jobs', href: B('writing', 'seo writing') },
          { label: 'Blog Writing Jobs', href: B('writing', 'blog') },
          { label: 'Article Writing Jobs', href: B('writing', 'article') },
          { label: 'Web Content Jobs', href: B('writing', 'web content') },
          { label: 'Product Description Jobs', href: B('writing', 'product description') },
          { label: 'Landing Page Copy Jobs', href: B('writing', 'landing page') },
          { label: 'Newsletter Writing Jobs', href: B('writing', 'newsletter') },
          { label: 'Technical Blog Jobs', href: B('writing', 'technical blog') },
          { label: 'Ghostwriting Jobs', href: F('ghostwriting-jobs') },
          { label: 'Email Newsletter Jobs', href: B('writing', 'email newsletter') },
          { label: 'Case Study Writing Jobs', href: B('writing', 'case study') },
          { label: 'White Paper Jobs', href: B('writing', 'white paper') },
          { label: 'Press Release Jobs', href: B('writing', 'press release') },
          { label: 'Social Media Caption Jobs', href: B('writing', 'social caption') },
          { label: 'LinkedIn Profile Writing Jobs', href: B('writing', 'linkedin profile') },
          { label: 'Sales Page Copy Jobs', href: B('writing', 'sales page') },
          { label: 'UX Writing Jobs', href: B('writing', 'ux writing') },
          { label: 'Grant Writing Jobs', href: B('writing', 'grant') },
          { label: 'Script Writing Jobs', href: B('writing', 'script') },
          { label: 'Ebook Writing Jobs', href: B('writing', 'ebook') },
          { label: 'Content Writing Jobs', href: F('content-writing-jobs') },
        ],
      },
    ],
    [
      {
        heading: 'Creative Writing',
        links: [
          { label: 'Short Story Writing Jobs', href: B('writing', 'short story') },
          { label: 'Creative Writing Jobs', href: B('writing', 'creative') },
          { label: 'Poetry Writing Jobs', href: B('writing', 'poetry') },
          { label: 'Novel Writing Jobs', href: B('writing', 'novel') },
          { label: 'Screenwriting Jobs', href: B('writing', 'screenplay') },
          { label: 'Songwriting Jobs', href: B('writing', 'songwriting') },
          { label: 'Game Writing Jobs', href: B('writing', 'game writing') },
          { label: 'Dialogue Writing Jobs', href: B('writing', 'dialogue') },
        ],
      },
      {
        heading: 'Editing and Proofreading',
        links: [
          { label: 'Proofreading Jobs', href: B('writing', 'proofread') },
          { label: 'Grammar Jobs', href: B('writing', 'grammar') },
          { label: 'Copy Editing Jobs', href: B('writing', 'copy editing') },
          { label: 'Line Editing Jobs', href: B('writing', 'line editing') },
          { label: 'Developmental Editing Jobs', href: B('writing', 'developmental editing') },
          { label: 'Substantive Editing Jobs', href: B('writing', 'substantive editing') },
          { label: 'Academic Editing Jobs', href: B('writing', 'academic editing') },
          { label: 'Editorial Assessment Jobs', href: B('writing', 'editorial assessment') },
          { label: 'Manuscript Evaluation Jobs', href: B('writing', 'manuscript') },
          { label: 'Beta Reading Jobs', href: B('writing', 'beta reading') },
          { label: 'Stylistic Editing Jobs', href: B('writing', 'stylistic editing') },
          { label: 'Fact-Checking Editing Jobs', href: B('writing', 'fact checking editing') },
        ],
      },
      {
        heading: 'Technical Writing',
        links: [
          { label: 'Technical Writing Jobs', href: B('writing', 'technical') },
          { label: 'API Documentation Jobs', href: B('writing', 'api documentation') },
          { label: 'User Manual Jobs', href: B('writing', 'user manual') },
          { label: 'Process Documentation Jobs', href: B('writing', 'process documentation') },
          { label: 'SOP Writing Jobs', href: B('writing', 'sop') },
          { label: 'Release Notes Jobs', href: B('writing', 'release notes') },
        ],
      },
    ],
    [
      {
        heading: 'Translation',
        links: [
          { label: 'Translation Jobs', href: B('writing', 'translation') },
          { label: 'Spanish Translation Jobs', href: B('writing', 'spanish translation') },
          { label: 'French Translation Jobs', href: B('writing', 'french translation') },
          { label: 'German Translation Jobs', href: B('writing', 'german translation') },
          { label: 'Portuguese - Brazil Translation Jobs', href: B('writing', 'portuguese brazil translation') },
          { label: 'Mandarin Translation Jobs', href: B('writing', 'mandarin translation') },
          { label: 'Japanese Translation Jobs', href: B('writing', 'japanese translation') },
          { label: 'Korean Translation Jobs', href: B('writing', 'korean translation') },
          { label: 'Italian Translation Jobs', href: B('writing', 'italian translation') },
          { label: 'Localization Jobs', href: B('writing', 'localization') },
        ],
      },
      {
        heading: 'Browse all',
        links: [{ label: 'All categories on Downwork', href: '/browse-jobs' }],
      },
    ],
  ],
}
