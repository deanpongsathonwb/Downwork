<template>
  <div>
    <section class="bg-gradient-to-br from-slate-900 to-green-950 text-white py-20 px-4">
      <div class="max-w-3xl mx-auto text-center">
        <h1 class="text-5xl font-black mb-4">Cookie Policy</h1>
        <p class="text-xl text-slate-300">Last updated: February 22, 2026</p>
      </div>
    </section>

    <section class="max-w-4xl mx-auto px-4 py-16">
      <!-- Table of contents -->
      <nav class="bg-slate-50 border border-slate-200 rounded-2xl p-6 mb-12">
        <h2 class="text-sm font-semibold text-slate-500 uppercase tracking-wider mb-3">Table of Contents</h2>
        <ol class="space-y-1">
          <li v-for="(section, i) in sections" :key="section.id">
            <a :href="`#${section.id}`" class="text-green-700 hover:text-green-900 text-sm font-medium transition-colors">
              {{ i + 1 }}. {{ section.title }}
            </a>
          </li>
        </ol>
      </nav>

      <!-- Intro -->
      <div class="mb-12 bg-green-50 border border-green-200 rounded-2xl p-6">
        <p class="text-slate-700 leading-relaxed">
          This Cookie Policy explains how Downwork, Inc. ("Downwork", "we", "us", "our") uses cookies and similar technologies when you visit our website at <strong>Downwork.com</strong>. It explains what these technologies are and why we use them, as well as your rights to control our use of them.
        </p>
      </div>

      <div class="space-y-14">
        <!-- 1 -->
        <div id="what-are-cookies">
          <h2 class="text-2xl font-bold text-slate-900 mb-5 flex items-center gap-3">
            <span class="w-8 h-8 rounded-full bg-green-100 text-green-700 text-sm font-bold flex items-center justify-center shrink-0">1</span>
            What Are Cookies?
          </h2>
          <p class="text-slate-600 leading-relaxed">
            Cookies are small text files that are placed on your device (computer, tablet, or smartphone) when you visit a website. They are widely used to make websites work more efficiently and to provide information to website owners. Cookies allow a website to recognise your device and remember information about your visit, such as your preferred settings or login status.
          </p>
          <p class="text-slate-600 leading-relaxed mt-4">
            Similar technologies — such as web beacons, pixel tags, local storage, and session storage — serve analogous functions and are also covered by this policy.
          </p>
        </div>

        <!-- 2 -->
        <div id="types-of-cookies">
          <h2 class="text-2xl font-bold text-slate-900 mb-5 flex items-center gap-3">
            <span class="w-8 h-8 rounded-full bg-green-100 text-green-700 text-sm font-bold flex items-center justify-center shrink-0">2</span>
            Types of Cookies We Use
          </h2>
          <div class="space-y-5">
            <div v-for="type in cookieTypes" :key="type.name" class="bg-white border border-slate-200 rounded-2xl p-6">
              <div class="flex items-center justify-between mb-3">
                <h3 class="font-bold text-slate-800 text-lg">{{ type.name }}</h3>
                <span :class="['text-xs font-semibold px-3 py-1 rounded-full', type.required ? 'bg-green-100 text-green-700' : 'bg-slate-100 text-slate-600']">
                  {{ type.required ? 'Always Active' : 'Optional' }}
                </span>
              </div>
              <p class="text-slate-600 text-sm leading-relaxed mb-4">{{ type.description }}</p>
              <div class="space-y-2">
                <div v-for="cookie in type.cookies" :key="cookie.name" class="flex gap-4 text-xs bg-slate-50 rounded-lg p-3">
                  <span class="font-mono font-semibold text-slate-700 shrink-0 min-w-[140px]">{{ cookie.name }}</span>
                  <span class="text-slate-500">{{ cookie.purpose }}</span>
                  <span class="text-slate-400 shrink-0 ml-auto">{{ cookie.duration }}</span>
                </div>
              </div>
            </div>
          </div>
        </div>

        <!-- 3 -->
        <div id="third-party">
          <h2 class="text-2xl font-bold text-slate-900 mb-5 flex items-center gap-3">
            <span class="w-8 h-8 rounded-full bg-green-100 text-green-700 text-sm font-bold flex items-center justify-center shrink-0">3</span>
            Third-Party Cookies
          </h2>
          <p class="text-slate-600 leading-relaxed mb-5">
            Some cookies on our platform are placed by third-party services. We carefully select these partners and require them to comply with applicable data protection laws. The main third parties setting cookies on our platform are:
          </p>
          <div class="space-y-3">
            <div v-for="partner in thirdParties" :key="partner.name" class="flex gap-4 items-start bg-slate-50 border border-slate-200 rounded-xl p-4">
              <div class="w-2 h-2 rounded-full bg-green-400 shrink-0 mt-2"></div>
              <div>
                <p class="font-semibold text-slate-800 text-sm">{{ partner.name }}</p>
                <p class="text-slate-500 text-sm mt-0.5">{{ partner.purpose }}</p>
                <a :href="partner.policy" target="_blank" rel="noopener noreferrer" class="text-green-600 hover:text-green-800 text-xs mt-1 inline-block transition-colors">
                  View Privacy Policy →
                </a>
              </div>
            </div>
          </div>
        </div>

        <!-- 4 -->
        <div id="managing-cookies">
          <h2 class="text-2xl font-bold text-slate-900 mb-5 flex items-center gap-3">
            <span class="w-8 h-8 rounded-full bg-green-100 text-green-700 text-sm font-bold flex items-center justify-center shrink-0">4</span>
            Managing & Controlling Cookies
          </h2>
          <div class="space-y-5 text-slate-600 leading-relaxed">
            <div class="bg-white border border-slate-200 rounded-2xl p-5">
              <h3 class="font-semibold text-slate-800 mb-2">Cookie Preference Center</h3>
              <p class="text-sm mb-3">You can update your cookie preferences at any time using our Cookie Preference Center. Strictly necessary cookies cannot be disabled as they are required for the platform to function.</p>
              <button
                class="px-5 py-2 bg-green-600 text-white text-sm font-medium rounded-lg hover:bg-green-700 transition-colors"
                @click="openPreferences"
              >
                Manage Cookie Preferences
              </button>
            </div>
            <div class="bg-white border border-slate-200 rounded-2xl p-5">
              <h3 class="font-semibold text-slate-800 mb-2">Browser Settings</h3>
              <p class="text-sm">Most browsers allow you to refuse or delete cookies through their settings. Note that disabling cookies may affect the functionality of our platform. Here are links to cookie management instructions for popular browsers:</p>
              <div class="flex flex-wrap gap-2 mt-3">
                <a
v-for="browser in browsers" :key="browser.name" :href="browser.url" target="_blank" rel="noopener noreferrer"
                  class="text-xs px-3 py-1.5 bg-slate-100 text-slate-600 hover:bg-slate-200 rounded-lg transition-colors font-medium">
                  {{ browser.name }}
                </a>
              </div>
            </div>
            <div class="bg-white border border-slate-200 rounded-2xl p-5">
              <h3 class="font-semibold text-slate-800 mb-2">Opt-Out of Analytics & Advertising</h3>
              <p class="text-sm">You can opt out of Google Analytics tracking by installing the <a href="https://tools.google.com/dlpage/gaoptout" target="_blank" rel="noopener noreferrer" class="text-green-600 hover:underline">Google Analytics Opt-out Browser Add-on</a>. For interest-based advertising, visit <a href="https://optout.aboutads.info" target="_blank" rel="noopener noreferrer" class="text-green-600 hover:underline">optout.aboutads.info</a> or <a href="https://www.youronlinechoices.com" target="_blank" rel="noopener noreferrer" class="text-green-600 hover:underline">youronlinechoices.com</a>.</p>
            </div>
          </div>
        </div>

        <!-- 5 -->
        <div id="do-not-track">
          <h2 class="text-2xl font-bold text-slate-900 mb-5 flex items-center gap-3">
            <span class="w-8 h-8 rounded-full bg-green-100 text-green-700 text-sm font-bold flex items-center justify-center shrink-0">5</span>
            Do Not Track
          </h2>
          <p class="text-slate-600 leading-relaxed">
            Some browsers have a "Do Not Track" feature that signals to websites that you do not want to be tracked. Because there is no consistent industry standard for responding to Do Not Track signals, our website does not currently alter its data collection practices when it receives such a signal. We will revisit this as industry standards develop.
          </p>
        </div>

        <!-- 6 -->
        <div id="cookie-changes">
          <h2 class="text-2xl font-bold text-slate-900 mb-5 flex items-center gap-3">
            <span class="w-8 h-8 rounded-full bg-green-100 text-green-700 text-sm font-bold flex items-center justify-center shrink-0">6</span>
            Changes to This Cookie Policy
          </h2>
          <p class="text-slate-600 leading-relaxed">
            We may update this Cookie Policy from time to time to reflect changes in technology, regulation, or our business practices. When we make significant changes, we will update the "Last updated" date at the top of this page and, where appropriate, notify you via email or a banner on our website. We encourage you to review this policy periodically.
          </p>
        </div>

        <!-- 7 -->
        <div id="cookie-contact">
          <h2 class="text-2xl font-bold text-slate-900 mb-5 flex items-center gap-3">
            <span class="w-8 h-8 rounded-full bg-green-100 text-green-700 text-sm font-bold flex items-center justify-center shrink-0">7</span>
            Contact Us
          </h2>
          <div class="bg-slate-50 border border-slate-200 rounded-2xl p-6 space-y-2 text-slate-600">
            <p><strong class="text-slate-800">Downwork, Inc.</strong></p>
            <p>Privacy Team · privacy@Downwork.com</p>
            <p>123 Market Street, Suite 400, San Francisco, CA 94105</p>
            <RouterLink to="/contact" class="inline-block mt-3 px-5 py-2 bg-green-600 text-white text-sm font-medium rounded-lg hover:bg-green-700 transition-colors">
              Contact Us
            </RouterLink>
          </div>
        </div>
      </div>
    </section>
  </div>
</template>

<script setup lang="ts">
import { RouterLink } from 'vue-router'

const sections = [
  { id: 'what-are-cookies', title: 'What Are Cookies?' },
  { id: 'types-of-cookies', title: 'Types of Cookies We Use' },
  { id: 'third-party', title: 'Third-Party Cookies' },
  { id: 'managing-cookies', title: 'Managing & Controlling Cookies' },
  { id: 'do-not-track', title: 'Do Not Track' },
  { id: 'cookie-changes', title: 'Changes to This Cookie Policy' },
  { id: 'cookie-contact', title: 'Contact Us' },
]

const cookieTypes = [
  {
    name: 'Strictly Necessary',
    required: true,
    description: 'These cookies are essential for you to use the platform and cannot be switched off. They are usually only set in response to actions you take, such as logging in or filling out a form.',
    cookies: [
      { name: 'fh_session', purpose: 'Maintains your authenticated session', duration: 'Session' },
      { name: 'fh_csrf_token', purpose: 'Protects against cross-site request forgery attacks', duration: 'Session' },
      { name: 'fh_remember_me', purpose: 'Keeps you logged in between visits if selected', duration: '30 days' },
    ],
  },
  {
    name: 'Functional',
    required: false,
    description: 'These cookies enable enhanced functionality and personalisation, such as remembering your preferences and settings.',
    cookies: [
      { name: 'fh_lang', purpose: 'Stores your preferred language setting', duration: '1 year' },
      { name: 'fh_theme', purpose: 'Stores your UI theme preference', duration: '1 year' },
      { name: 'fh_currency', purpose: 'Stores your preferred currency for displaying prices', duration: '1 year' },
    ],
  },
  {
    name: 'Analytics',
    required: false,
    description: 'These cookies allow us to count visits and traffic sources so we can measure and improve platform performance. All data is aggregated and anonymised.',
    cookies: [
      { name: '_ga', purpose: 'Google Analytics — distinguishes unique users', duration: '2 years' },
      { name: '_ga_*', purpose: 'Google Analytics — stores session state', duration: '2 years' },
      { name: 'fh_ab_variant', purpose: 'A/B testing — records which variant you are shown', duration: '90 days' },
    ],
  },
  {
    name: 'Marketing',
    required: false,
    description: 'These cookies may be set by our advertising partners to build a profile of your interests and show you relevant ads on other sites. They do not store personal data directly, but identify your browser.',
    cookies: [
      { name: '_fbp', purpose: 'Facebook Pixel — tracks conversions from Facebook ads', duration: '90 days' },
      { name: 'li_fat_id', purpose: 'LinkedIn Insight — measures ad campaign effectiveness', duration: '30 days' },
      { name: 'fh_referral', purpose: 'Records the referral source for attribution', duration: '30 days' },
    ],
  },
]

const thirdParties = [
  {
    name: 'Google Analytics',
    purpose: 'Website analytics and performance measurement.',
    policy: 'https://policies.google.com/privacy',
  },
  {
    name: 'Stripe',
    purpose: 'Secure payment processing and fraud prevention.',
    policy: 'https://stripe.com/privacy',
  },
  {
    name: 'Meta (Facebook)',
    purpose: 'Advertising and conversion tracking.',
    policy: 'https://www.facebook.com/privacy/policy/',
  },
  {
    name: 'LinkedIn',
    purpose: 'Professional advertising and campaign measurement.',
    policy: 'https://www.linkedin.com/legal/privacy-policy',
  },
  {
    name: 'Intercom',
    purpose: 'Customer support and in-app messaging.',
    policy: 'https://www.intercom.com/legal/privacy',
  },
]

const browsers = [
  { name: 'Google Chrome', url: 'https://support.google.com/chrome/answer/95647' },
  { name: 'Mozilla Firefox', url: 'https://support.mozilla.org/en-US/kb/enhanced-tracking-protection-firefox-desktop' },
  { name: 'Safari', url: 'https://support.apple.com/guide/safari/manage-cookies-sfri11471/mac' },
  { name: 'Microsoft Edge', url: 'https://support.microsoft.com/en-us/windows/manage-cookies-in-microsoft-edge' },
  { name: 'Opera', url: 'https://help.opera.com/en/latest/web-preferences/' },
]

function openPreferences() {
  alert('Cookie preference center coming soon.')
}
</script>
