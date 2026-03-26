<template>
  <div>
    <section class="bg-gradient-to-br from-slate-900 to-green-950 text-white py-20 px-4">
      <div class="max-w-3xl mx-auto text-center">
        <h1 class="text-5xl font-black mb-4">Terms of Service</h1>
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
      <div class="mb-12 bg-amber-50 border border-amber-200 rounded-2xl p-6">
        <p class="text-slate-700 leading-relaxed">
          Please read these Terms of Service ("Terms") carefully before using the Downwork platform. By accessing or using Downwork, you agree to be bound by these Terms. If you disagree with any part, you may not use our services.
        </p>
      </div>

      <div class="space-y-14">
        <!-- 1 -->
        <div id="acceptance">
          <h2 class="text-2xl font-bold text-slate-900 mb-5 flex items-center gap-3">
            <span class="w-8 h-8 rounded-full bg-green-100 text-green-700 text-sm font-bold flex items-center justify-center shrink-0">1</span>
            Acceptance of Terms
          </h2>
          <p class="text-slate-600 leading-relaxed">
            By creating an account or using the Downwork platform, you confirm that you are at least 18 years old, have the legal capacity to enter into a binding agreement, and agree to these Terms and our Privacy Policy. If you are using Downwork on behalf of a company, you represent that you have the authority to bind that company.
          </p>
        </div>

        <!-- 2 -->
        <div id="platform-use">
          <h2 class="text-2xl font-bold text-slate-900 mb-5 flex items-center gap-3">
            <span class="w-8 h-8 rounded-full bg-green-100 text-green-700 text-sm font-bold flex items-center justify-center shrink-0">2</span>
            Platform Description
          </h2>
          <p class="text-slate-600 leading-relaxed">
            Downwork is an online marketplace that connects clients who need work done ("Clients") with independent contractors who offer services ("Freelancers"). Downwork is not a party to any agreement between Clients and Freelancers. Downwork does not employ Freelancers and is not responsible for the quality, timing, or outcome of work performed.
          </p>
        </div>

        <!-- 3 -->
        <div id="accounts">
          <h2 class="text-2xl font-bold text-slate-900 mb-5 flex items-center gap-3">
            <span class="w-8 h-8 rounded-full bg-green-100 text-green-700 text-sm font-bold flex items-center justify-center shrink-0">3</span>
            User Accounts
          </h2>
          <div class="space-y-4 text-slate-600 leading-relaxed">
            <p>You are responsible for maintaining the confidentiality of your account credentials and for all activities that occur under your account. You agree to notify us immediately of any unauthorised use of your account.</p>
            <p>Each person may maintain only one active account per role. Creating multiple accounts to evade restrictions or fees is prohibited and may result in permanent termination.</p>
            <p>You must provide accurate, current, and complete information when creating your account and keep it updated. Impersonation of any person or entity is strictly prohibited.</p>
          </div>
        </div>

        <!-- 4 -->
        <div id="freelancer-terms">
          <h2 class="text-2xl font-bold text-slate-900 mb-5 flex items-center gap-3">
            <span class="w-8 h-8 rounded-full bg-green-100 text-green-700 text-sm font-bold flex items-center justify-center shrink-0">4</span>
            Freelancer Terms
          </h2>
          <div class="space-y-3 text-slate-600 leading-relaxed">
            <p>As a Freelancer, you represent that you have the skills, experience, and rights necessary to complete the work you agree to perform.</p>
            <p>You agree to deliver work that meets the quality standards described in the applicable contract and to communicate proactively with your Client.</p>
            <p>You are solely responsible for determining your tax obligations and reporting and paying all applicable taxes on your earnings from the platform.</p>
            <p>You understand that you are an independent contractor, not an employee of Downwork or any Client, and are not entitled to employment benefits.</p>
          </div>
        </div>

        <!-- 5 -->
        <div id="client-terms">
          <h2 class="text-2xl font-bold text-slate-900 mb-5 flex items-center gap-3">
            <span class="w-8 h-8 rounded-full bg-green-100 text-green-700 text-sm font-bold flex items-center justify-center shrink-0">5</span>
            Client Terms
          </h2>
          <div class="space-y-3 text-slate-600 leading-relaxed">
            <p>As a Client, you agree to provide clear, accurate job descriptions and to treat Freelancers professionally and respectfully.</p>
            <p>You agree to fund the escrow account with the agreed contract amount before work begins. Funds will not be released to the Freelancer until you approve a milestone or the dispute resolution process determines payment is warranted.</p>
            <p>You may not circumvent Downwork's payment system by attempting to pay Freelancers directly outside the platform for work arranged through Downwork.</p>
          </div>
        </div>

        <!-- 6 -->
        <div id="fees">
          <h2 class="text-2xl font-bold text-slate-900 mb-5 flex items-center gap-3">
            <span class="w-8 h-8 rounded-full bg-green-100 text-green-700 text-sm font-bold flex items-center justify-center shrink-0">6</span>
            Fees & Payments
          </h2>
          <div class="bg-slate-50 border border-slate-200 rounded-2xl overflow-hidden mb-4">
            <table class="w-full text-sm">
              <thead>
                <tr class="bg-slate-100 text-slate-700">
                  <th class="text-left px-5 py-3 font-semibold">Lifetime Earnings with Client</th>
                  <th class="text-left px-5 py-3 font-semibold">Service Fee</th>
                </tr>
              </thead>
              <tbody class="divide-y divide-slate-200 text-slate-600">
                <tr v-for="row in feeTable" :key="row.tier" class="hover:bg-slate-50">
                  <td class="px-5 py-3">{{ row.tier }}</td>
                  <td class="px-5 py-3 font-medium text-green-700">{{ row.fee }}</td>
                </tr>
              </tbody>
            </table>
          </div>
          <p class="text-slate-600 leading-relaxed text-sm">
            Service fees are deducted automatically before funds are released to your account. Clients do not pay a fee to post jobs or hire Freelancers. All payment disputes must be raised within 30 days of the transaction.
          </p>
        </div>

        <!-- 7 -->
        <div id="prohibited">
          <h2 class="text-2xl font-bold text-slate-900 mb-5 flex items-center gap-3">
            <span class="w-8 h-8 rounded-full bg-green-100 text-green-700 text-sm font-bold flex items-center justify-center shrink-0">7</span>
            Prohibited Activities
          </h2>
          <div class="grid md:grid-cols-2 gap-3">
            <div v-for="item in prohibited" :key="item" class="flex gap-3 items-start">
              <svg class="w-5 h-5 text-red-400 shrink-0 mt-0.5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M6 18L18 6M6 6l12 12" />
              </svg>
              <span class="text-slate-600 text-sm leading-relaxed">{{ item }}</span>
            </div>
          </div>
        </div>

        <!-- 8 -->
        <div id="intellectual-property">
          <h2 class="text-2xl font-bold text-slate-900 mb-5 flex items-center gap-3">
            <span class="w-8 h-8 rounded-full bg-green-100 text-green-700 text-sm font-bold flex items-center justify-center shrink-0">8</span>
            Intellectual Property
          </h2>
          <div class="space-y-4 text-slate-600 leading-relaxed">
            <p><strong class="text-slate-800">Downwork IP.</strong> All content, features, and functionality of the Downwork platform, including but not limited to logos, designs, and code, are owned by Downwork, Inc. and protected by applicable intellectual property laws.</p>
            <p><strong class="text-slate-800">Work Product.</strong> Unless otherwise agreed in a contract between Client and Freelancer, upon full payment of the contract amount, the Client is granted ownership of the deliverables. The Freelancer retains the right to display the work in their portfolio unless prohibited by a confidentiality agreement.</p>
            <p><strong class="text-slate-800">Your Content.</strong> By posting content on Downwork (such as job descriptions or portfolio items), you grant us a non-exclusive, worldwide, royalty-free licence to display and promote that content in connection with operating the platform.</p>
          </div>
        </div>

        <!-- 9 -->
        <div id="disputes">
          <h2 class="text-2xl font-bold text-slate-900 mb-5 flex items-center gap-3">
            <span class="w-8 h-8 rounded-full bg-green-100 text-green-700 text-sm font-bold flex items-center justify-center shrink-0">9</span>
            Dispute Resolution
          </h2>
          <div class="space-y-4 text-slate-600 leading-relaxed">
            <p>We encourage users to resolve disputes directly. If that fails, Downwork offers a mediation service. Either party may open a dispute within 30 days of a milestone deadline.</p>
            <p>Our dispute resolution team reviews evidence submitted by both parties and issues a binding determination within 5 business days. Escrow funds are held until the dispute is resolved.</p>
            <p>For legal disputes that cannot be resolved through our internal process, you agree that such disputes will be resolved through binding arbitration under the rules of the American Arbitration Association, except for small claims court matters.</p>
          </div>
        </div>

        <!-- 10 -->
        <div id="limitation">
          <h2 class="text-2xl font-bold text-slate-900 mb-5 flex items-center gap-3">
            <span class="w-8 h-8 rounded-full bg-green-100 text-green-700 text-sm font-bold flex items-center justify-center shrink-0">10</span>
            Limitation of Liability
          </h2>
          <div class="bg-amber-50 border border-amber-200 rounded-2xl p-5 text-sm text-slate-700 leading-relaxed space-y-3">
            <p>THE PLATFORM IS PROVIDED "AS IS" AND "AS AVAILABLE" WITHOUT WARRANTIES OF ANY KIND. TO THE FULLEST EXTENT PERMITTED BY LAW, Downwork DISCLAIMS ALL WARRANTIES, EXPRESS OR IMPLIED.</p>
            <p>IN NO EVENT SHALL Downwork BE LIABLE FOR ANY INDIRECT, INCIDENTAL, SPECIAL, CONSEQUENTIAL, OR PUNITIVE DAMAGES, OR ANY LOSS OF PROFITS OR REVENUES, EVEN IF ADVISED OF THE POSSIBILITY OF SUCH DAMAGES. OUR TOTAL LIABILITY TO YOU FOR ANY CLAIM ARISING FROM THESE TERMS SHALL NOT EXCEED THE GREATER OF $100 OR THE FEES PAID BY YOU TO Downwork IN THE 12 MONTHS PRECEDING THE CLAIM.</p>
          </div>
        </div>

        <!-- 11 -->
        <div id="termination">
          <h2 class="text-2xl font-bold text-slate-900 mb-5 flex items-center gap-3">
            <span class="w-8 h-8 rounded-full bg-green-100 text-green-700 text-sm font-bold flex items-center justify-center shrink-0">11</span>
            Termination
          </h2>
          <p class="text-slate-600 leading-relaxed">
            You may delete your account at any time from your settings page. Downwork reserves the right to suspend or terminate your account at any time, with or without notice, for violation of these Terms, fraudulent activity, or for any reason at our sole discretion. Upon termination, outstanding obligations (such as completing in-progress contracts) remain in effect. Any balance owed to you will be paid out minus applicable fees.
          </p>
        </div>

        <!-- 12 -->
        <div id="governing-law">
          <h2 class="text-2xl font-bold text-slate-900 mb-5 flex items-center gap-3">
            <span class="w-8 h-8 rounded-full bg-green-100 text-green-700 text-sm font-bold flex items-center justify-center shrink-0">12</span>
            Governing Law
          </h2>
          <p class="text-slate-600 leading-relaxed">
            These Terms are governed by the laws of the State of California, United States, without regard to its conflict of law provisions. You consent to the personal jurisdiction of the state and federal courts located in San Francisco County, California for any litigation that is not subject to arbitration under these Terms.
          </p>
        </div>

        <!-- 13 -->
        <div id="contact-tos">
          <h2 class="text-2xl font-bold text-slate-900 mb-5 flex items-center gap-3">
            <span class="w-8 h-8 rounded-full bg-green-100 text-green-700 text-sm font-bold flex items-center justify-center shrink-0">13</span>
            Contact Us
          </h2>
          <div class="bg-slate-50 border border-slate-200 rounded-2xl p-6 space-y-2 text-slate-600">
            <p><strong class="text-slate-800">Downwork, Inc.</strong></p>
            <p>Legal Team · legal@Downwork.com</p>
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
  { id: 'acceptance', title: 'Acceptance of Terms' },
  { id: 'platform-use', title: 'Platform Description' },
  { id: 'accounts', title: 'User Accounts' },
  { id: 'freelancer-terms', title: 'Freelancer Terms' },
  { id: 'client-terms', title: 'Client Terms' },
  { id: 'fees', title: 'Fees & Payments' },
  { id: 'prohibited', title: 'Prohibited Activities' },
  { id: 'intellectual-property', title: 'Intellectual Property' },
  { id: 'disputes', title: 'Dispute Resolution' },
  { id: 'limitation', title: 'Limitation of Liability' },
  { id: 'termination', title: 'Termination' },
  { id: 'governing-law', title: 'Governing Law' },
  { id: 'contact-tos', title: 'Contact Us' },
]

const feeTable = [
  { tier: 'First $500 billed', fee: '20%' },
  { tier: '$500.01 – $10,000', fee: '10%' },
  { tier: 'Above $10,000', fee: '5%' },
]

const prohibited = [
  'Circumventing the Downwork payment system by paying or receiving payment outside the platform.',
  'Creating fake reviews, testimonials, or feedback.',
  'Posting false, misleading, or fraudulent job listings.',
  'Harassing, threatening, or discriminating against other users.',
  'Uploading malware, viruses, or any harmful code.',
  'Scraping or copying platform data without written permission.',
  'Using the platform for illegal activities or services.',
  'Creating multiple accounts to evade bans or restrictions.',
  'Misrepresenting your identity, qualifications, or experience.',
  'Sharing account credentials with third parties.',
]
</script>
