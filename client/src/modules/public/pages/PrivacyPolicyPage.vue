<template>
  <div>
    <section class="bg-gradient-to-br from-slate-900 to-green-950 text-white py-20 px-4">
      <div class="max-w-3xl mx-auto text-center">
        <h1 class="text-5xl font-black mb-4">Privacy Policy</h1>
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
          Downwork, Inc. ("Downwork", "we", "us", or "our") is committed to protecting your personal information. This Privacy Policy explains what data we collect, how we use it, and the choices you have. By using our platform, you agree to the practices described in this policy.
        </p>
      </div>

      <div class="space-y-14">
        <!-- 1 -->
        <div id="information-we-collect">
          <h2 class="text-2xl font-bold text-slate-900 mb-5 flex items-center gap-3">
            <span class="w-8 h-8 rounded-full bg-green-100 text-green-700 text-sm font-bold flex items-center justify-center shrink-0">1</span>
            Information We Collect
          </h2>
          <div class="space-y-4 text-slate-600 leading-relaxed">
            <p><strong class="text-slate-800">Account Information.</strong> When you register, we collect your name, email address, password (hashed), country, and role (client or freelancer).</p>
            <p><strong class="text-slate-800">Profile Information.</strong> Freelancers may provide a bio, skills, portfolio items, hourly rate, and profile photo. Clients may provide a company name and description.</p>
            <p><strong class="text-slate-800">Transaction Data.</strong> We collect information about jobs posted, proposals submitted, contracts created, milestones, and payment amounts processed through the platform.</p>
            <p><strong class="text-slate-800">Communications.</strong> Messages sent through our internal messaging system are stored to facilitate work relationships and resolve disputes.</p>
            <p><strong class="text-slate-800">Device & Usage Data.</strong> We automatically collect IP address, browser type, operating system, referring URLs, pages visited, and time spent on our platform via cookies and similar technologies.</p>
            <p><strong class="text-slate-800">Payment Information.</strong> We use PCI-DSS-compliant third-party payment processors. We store only the last four digits of card numbers and transaction references — full card data is never stored on our servers.</p>
          </div>
        </div>

        <!-- 2 -->
        <div id="how-we-use-data">
          <h2 class="text-2xl font-bold text-slate-900 mb-5 flex items-center gap-3">
            <span class="w-8 h-8 rounded-full bg-green-100 text-green-700 text-sm font-bold flex items-center justify-center shrink-0">2</span>
            How We Use Your Information
          </h2>
          <ul class="space-y-3 text-slate-600 leading-relaxed">
            <li v-for="use in usageItems" :key="use" class="flex gap-3">
              <svg class="w-5 h-5 text-green-500 shrink-0 mt-0.5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M5 13l4 4L19 7" />
              </svg>
              <span>{{ use }}</span>
            </li>
          </ul>
        </div>

        <!-- 3 -->
        <div id="sharing-data">
          <h2 class="text-2xl font-bold text-slate-900 mb-5 flex items-center gap-3">
            <span class="w-8 h-8 rounded-full bg-green-100 text-green-700 text-sm font-bold flex items-center justify-center shrink-0">3</span>
            How We Share Your Information
          </h2>
          <div class="space-y-4 text-slate-600 leading-relaxed">
            <p><strong class="text-slate-800">With Other Users.</strong> Your public profile (name, photo, skills, reviews) is visible to other users. Client and freelancer names appear on contracts and job posts.</p>
            <p><strong class="text-slate-800">With Service Providers.</strong> We share data with trusted third parties who assist us in operating our platform (payment processors, cloud hosting, email services, analytics). They are contractually bound to keep your data confidential.</p>
            <p><strong class="text-slate-800">For Legal Reasons.</strong> We may disclose your information when required by law, to enforce our Terms of Service, or to protect the rights, property, or safety of Downwork, our users, or the public.</p>
            <p><strong class="text-slate-800">Business Transfers.</strong> If Downwork is acquired or merges with another company, your information may be transferred as part of that transaction.</p>
            <p>We do <strong class="text-slate-800">not</strong> sell your personal information to third parties for their own marketing purposes.</p>
          </div>
        </div>

        <!-- 4 -->
        <div id="data-retention">
          <h2 class="text-2xl font-bold text-slate-900 mb-5 flex items-center gap-3">
            <span class="w-8 h-8 rounded-full bg-green-100 text-green-700 text-sm font-bold flex items-center justify-center shrink-0">4</span>
            Data Retention
          </h2>
          <p class="text-slate-600 leading-relaxed">
            We retain your account and profile data for as long as your account is active. Transaction and contract records are retained for a minimum of 7 years to comply with financial and tax regulations. You may request deletion of your account at any time; however, certain data may be retained as required by law or for legitimate business purposes such as fraud prevention.
          </p>
        </div>

        <!-- 5 -->
        <div id="your-rights">
          <h2
            id="your-privacy-choices"
            class="text-2xl font-bold text-slate-900 mb-5 flex scroll-mt-24 items-center gap-3"
          >
            <span class="w-8 h-8 rounded-full bg-green-100 text-green-700 text-sm font-bold flex items-center justify-center shrink-0">5</span>
            Your Rights & Choices
          </h2>
          <div id="ca-notice" class="mb-6 scroll-mt-24 rounded-xl border border-slate-200 bg-slate-50 p-5">
            <h3 class="font-semibold text-slate-900">California Notice at Collection</h3>
            <p class="mt-2 text-sm leading-relaxed text-slate-600">
              If you are a California resident, we may collect the categories of personal information described in
              this policy. You have the right to know, delete, and opt out of certain sharing. Use the contact
              details in this policy to submit requests.
            </p>
          </div>
          <div class="grid md:grid-cols-2 gap-4">
            <div v-for="right in rights" :key="right.title" class="bg-white border border-slate-200 rounded-xl p-5">
              <h3 class="font-semibold text-slate-800 mb-1">{{ right.title }}</h3>
              <p class="text-sm text-slate-500 leading-relaxed">{{ right.desc }}</p>
            </div>
          </div>
        </div>

        <!-- 6 -->
        <div id="data-security">
          <h2 class="text-2xl font-bold text-slate-900 mb-5 flex items-center gap-3">
            <span class="w-8 h-8 rounded-full bg-green-100 text-green-700 text-sm font-bold flex items-center justify-center shrink-0">6</span>
            Data Security
          </h2>
          <p class="text-slate-600 leading-relaxed">
            We implement industry-standard security measures including TLS encryption in transit, AES-256 encryption at rest, bcrypt password hashing, and regular security audits. We also offer two-factor authentication (2FA) for all accounts. Despite our best efforts, no method of transmission over the Internet is 100% secure, and we cannot guarantee absolute security.
          </p>
        </div>

        <!-- 7 -->
        <div id="international-transfers">
          <h2 class="text-2xl font-bold text-slate-900 mb-5 flex items-center gap-3">
            <span class="w-8 h-8 rounded-full bg-green-100 text-green-700 text-sm font-bold flex items-center justify-center shrink-0">7</span>
            International Data Transfers
          </h2>
          <p class="text-slate-600 leading-relaxed">
            Downwork operates globally. Your data may be transferred to and processed in countries other than your own. We use Standard Contractual Clauses (SCCs) approved by the European Commission to ensure adequate protection of personal data transferred outside the EEA, UK, or Switzerland.
          </p>
        </div>

        <!-- 8 -->
        <div id="children">
          <h2 class="text-2xl font-bold text-slate-900 mb-5 flex items-center gap-3">
            <span class="w-8 h-8 rounded-full bg-green-100 text-green-700 text-sm font-bold flex items-center justify-center shrink-0">8</span>
            Children's Privacy
          </h2>
          <p class="text-slate-600 leading-relaxed">
            Our platform is not directed to individuals under 18 years of age. We do not knowingly collect personal information from minors. If we become aware that a child has provided us with personal data, we will take steps to delete it promptly.
          </p>
        </div>

        <!-- 9 -->
        <div id="changes">
          <h2 class="text-2xl font-bold text-slate-900 mb-5 flex items-center gap-3">
            <span class="w-8 h-8 rounded-full bg-green-100 text-green-700 text-sm font-bold flex items-center justify-center shrink-0">9</span>
            Changes to This Policy
          </h2>
          <p class="text-slate-600 leading-relaxed">
            We may update this Privacy Policy from time to time. We will notify you of significant changes by email or by posting a prominent notice on our website. The "Last updated" date at the top of this page reflects the most recent revision. Your continued use of the platform after changes take effect constitutes your acceptance.
          </p>
        </div>

        <!-- 10 -->
        <div id="contact">
          <h2 class="text-2xl font-bold text-slate-900 mb-5 flex items-center gap-3">
            <span class="w-8 h-8 rounded-full bg-green-100 text-green-700 text-sm font-bold flex items-center justify-center shrink-0">10</span>
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
  { id: 'information-we-collect', title: 'Information We Collect' },
  { id: 'how-we-use-data', title: 'How We Use Your Information' },
  { id: 'sharing-data', title: 'How We Share Your Information' },
  { id: 'data-retention', title: 'Data Retention' },
  { id: 'your-rights', title: 'Your Rights & Choices' },
  { id: 'data-security', title: 'Data Security' },
  { id: 'international-transfers', title: 'International Data Transfers' },
  { id: 'children', title: "Children's Privacy" },
  { id: 'changes', title: 'Changes to This Policy' },
  { id: 'contact', title: 'Contact Us' },
]

const usageItems = [
  'Provide, operate, and improve the Downwork platform and services.',
  'Process transactions and send related information, including payment confirmations and invoices.',
  'Send administrative communications, such as account updates, security alerts, and policy changes.',
  'Send marketing and promotional communications (you may opt out at any time).',
  'Personalise your experience and deliver content relevant to your role and interests.',
  'Monitor and analyse usage patterns to improve our platform.',
  'Detect, investigate, and prevent fraudulent transactions and other illegal activities.',
  'Resolve disputes and enforce our agreements.',
  'Comply with legal obligations.',
]

const rights = [
  { title: 'Access', desc: 'Request a copy of the personal data we hold about you.' },
  { title: 'Correction', desc: 'Request correction of inaccurate or incomplete personal data.' },
  { title: 'Deletion', desc: 'Request erasure of your personal data, subject to legal retention obligations.' },
  { title: 'Portability', desc: 'Receive your data in a structured, machine-readable format.' },
  { title: 'Objection', desc: 'Object to processing based on legitimate interests or for direct marketing.' },
  { title: 'Restriction', desc: 'Request that we restrict processing of your data in certain circumstances.' },
]
</script>
