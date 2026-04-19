/**
 * Mega-menu links used to point at /browse-freelancers and /browse-jobs with filters.
 * They now resolve to stable /hire/:slug and /freelance-jobs/:slug landings.
 */

export interface MegaMenuLandingPair {
  hireSlug: string
  jobSlug: string
}

const Q = (search?: string): string => (search ?? '').toLowerCase()

export function resolveMegaMenuLandingPair(category: string, search?: string): MegaMenuLandingPair {
  const q = Q(search)

  if (category === 'mobile-apps') {
    return { hireSlug: 'mobile-app-developers', jobSlug: 'mobile-app-development-jobs' }
  }

  if (category === 'game-development') {
    return { hireSlug: 'software-developers', jobSlug: 'animation-jobs' }
  }

  if (category === 'data-science') {
    return { hireSlug: 'machine-learning-engineers', jobSlug: 'machine-learning-jobs' }
  }

  if (category === 'finance') {
    return { hireSlug: 'finance-professionals', jobSlug: 'lead-generation-jobs' }
  }

  if (category === 'writing') {
    if (/legal|paralegal|contract/.test(q)) {
      return { hireSlug: 'legal-professionals', jobSlug: 'content-writing-jobs' }
    }
    if (
      /virtual|assistant|administrative|data entry|typing|transcription|zendesk|zoom|call center|spreadsheet|google sheets|\bexcel\b|office|appointment|recruit|etsy|ebay|amazon listing|amazon va|real estate va|stenographer|medical transcription|closed caption|microsoft word|internet research|web research|fact check|product upload|zoho|document conversion|data mining|data collection|pdf|adobe pdf/.test(
        q,
      )
    ) {
      return { hireSlug: 'virtual-assistants', jobSlug: 'virtual-assistant-jobs' }
    }
    if (/web scrap/.test(q)) {
      return { hireSlug: 'software-developers', jobSlug: 'software-development-jobs' }
    }
    if (/proofread|copy edit/.test(q)) {
      return { hireSlug: 'book-editors', jobSlug: 'book-editing-jobs' }
    }
    if (/ghost|fiction|short story|kindle|screenplay|script|speech|book writer/.test(q)) {
      return { hireSlug: 'ghostwriters', jobSlug: 'ghostwriting-jobs' }
    }
    if (
      /headline|ebook|press release|product description|online writer|seo writing|sales copy/.test(q)
    ) {
      return { hireSlug: 'copywriters', jobSlug: 'copywriting-jobs' }
    }
    return { hireSlug: 'content-writers', jobSlug: 'content-writing-jobs' }
  }

  if (category === 'design') {
    if (/ux|ui\b|interior|architecture|landscape|floor plan|furniture|cad|space planning/.test(q)) {
      return { hireSlug: 'ux-designers', jobSlug: 'web-design-jobs' }
    }
    if (
      /illustrat|character|comic|manga|infographic|children|drawer|drawing|vector|concept art|storyboard|nft/.test(
        q,
      )
    ) {
      return { hireSlug: 'illustrators', jobSlug: 'illustration-jobs' }
    }
    return { hireSlug: 'graphic-designers', jobSlug: 'graphic-design-jobs' }
  }

  if (category === 'video') {
    if (/actor|film director/.test(q)) {
      return { hireSlug: 'voice-actors', jobSlug: 'voice-over-jobs' }
    }
    if (/voice|narrat|audiobook/.test(q)) {
      return { hireSlug: 'voice-actors', jobSlug: 'voice-over-jobs' }
    }
    if (/sound engineer|sound design|podcast|music|beat|jingle|musical transcription/.test(q)) {
      return { hireSlug: 'music-producers', jobSlug: 'music-production-jobs' }
    }
    if (/audio edit/.test(q)) {
      return { hireSlug: 'audio-editors', jobSlug: 'audio-editing-jobs' }
    }
    if (/animat|blender|vfx|3d animation|2d animation|whiteboard|explainer/.test(q)) {
      return { hireSlug: 'animators', jobSlug: 'animation-jobs' }
    }
    return { hireSlug: 'video-editors', jobSlug: 'video-editing-jobs' }
  }

  if (category === 'marketing') {
    if (q === 'social') {
      return { hireSlug: 'virtual-assistants', jobSlug: 'chat-support-jobs' }
    }
    if (/seo|keyword|link build|on-page|sem\b|aso\b/.test(q)) {
      return { hireSlug: 'seo-experts', jobSlug: 'seo-jobs' }
    }
    if (
      /ppc|google ads|pay per click|amazon ppc|display marketing|facebook advertising|facebook ads/.test(q)
    ) {
      return { hireSlug: 'google-ads-experts', jobSlug: 'google-ads-jobs' }
    }
    if (/email|mailchimp|klaviyo|sendgrid/.test(q)) {
      return { hireSlug: 'email-marketers', jobSlug: 'email-marketing-jobs' }
    }
    if (
      /social|instagram|facebook|linkedin|twitter|tiktok|youtube|pinterest|snapchat|influencer|community|content creator|content strategist|spotify/.test(
        q,
      )
    ) {
      return { hireSlug: 'social-media-managers', jobSlug: 'social-media-management-jobs' }
    }
    if (/cold|telemarket|sales representative|sales manager/.test(q)) {
      return { hireSlug: 'cold-callers', jobSlug: 'cold-calling-jobs' }
    }
    if (/content moderation|moderator/.test(q)) {
      return { hireSlug: 'content-moderators', jobSlug: 'content-moderation-jobs' }
    }
    if (/lead|outbound/.test(q)) {
      return { hireSlug: 'lead-generation-specialists', jobSlug: 'lead-generation-jobs' }
    }
    if (/recruiter|\bhr\b/.test(q)) {
      return { hireSlug: 'hr-specialists', jobSlug: 'digital-marketing-jobs' }
    }
    return { hireSlug: 'digital-marketers', jobSlug: 'digital-marketing-jobs' }
  }

  if (category === 'web-development') {
    if (/python|django/.test(q)) {
      return { hireSlug: 'python-developers', jobSlug: 'python-jobs' }
    }
    if (/ethical|security|hack|penetration/.test(q)) {
      return { hireSlug: 'ethical-hackers', jobSlug: 'ethical-hacking-jobs' }
    }
    if (/chatbot|nlp|llm|bert|tensorflow|streamlit|gradio|azure openai|openai|gpt/.test(q)) {
      return { hireSlug: 'chatbot-developers', jobSlug: 'chatbot-development-jobs' }
    }
    if (
      /java(?!script)/.test(q) ||
      /\.net|dotnet|c#|golang|ruby|\bc\+\+/i.test(q) ||
      /devops|aws|cloud|network|database admin|system admin|blockchain|solidity|crypto|salesforce|\bqa\b|scraping|vba|replit|architecture/.test(q)
    ) {
      return { hireSlug: 'software-developers', jobSlug: 'software-development-jobs' }
    }
    if (/wordpress|woo|shopify|squarespace|webflow|wix|laravel|php|react|vue|angular|node|frontend|backend|css|javascript|html|rails|git|\bsql\b|next\.js|ecommerce|api|microsoft access|elementor/.test(q)) {
      return { hireSlug: 'web-developers', jobSlug: 'website-development' }
    }
    return { hireSlug: 'web-developers', jobSlug: 'website-development' }
  }

  return { hireSlug: 'web-developers', jobSlug: 'website-development' }
}

export function hireMegaMenuHrefFromFilters(category: string, search?: string): string {
  const { hireSlug } = resolveMegaMenuLandingPair(category, search)
  return `/hire/${hireSlug}`
}

export function freelanceJobsMegaMenuHrefFromFilters(category: string, search?: string): string {
  const { jobSlug } = resolveMegaMenuLandingPair(category, search)
  return `/freelance-jobs/${jobSlug}`
}
