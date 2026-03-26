<template>
  <div class="max-w-3xl mx-auto px-4 py-16">
    <div class="text-center mb-12">
      <h1 class="text-4xl font-bold text-slate-900 mb-3">Help & FAQ</h1>
      <p class="text-slate-500">Find answers to the most common questions.</p>
    </div>
    <div class="space-y-3">
      <div
        v-for="faq in faqs"
        :key="faq.q"
        class="bg-white rounded-2xl border border-slate-200 overflow-hidden"
      >
        <button
          class="w-full flex items-center justify-between p-5 text-left"
          @click="faq.open = !faq.open"
        >
          <span class="font-medium text-slate-900">{{ faq.q }}</span>
          <svg :class="['w-5 h-5 text-slate-400 transition-transform shrink-0 ml-4', faq.open ? 'rotate-180' : '']" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M19 9l-7 7-7-7" />
          </svg>
        </button>
        <div v-if="faq.open" class="px-5 pb-5 text-sm text-slate-600 leading-relaxed border-t border-slate-100 pt-4">
          {{ faq.a }}
        </div>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { reactive } from 'vue'

const faqs = reactive([
  { q: 'How does Downwork work?', a: 'Clients post jobs, freelancers submit proposals, and once hired, work proceeds through our secure platform with milestone-based payments.', open: false },
  { q: 'How do I get paid?', a: 'Funds are held in escrow by Downwork. Once a milestone is approved, the money is released to your Downwork account for withdrawal.', open: false },
  { q: 'What fees does Downwork charge?', a: 'We charge a sliding service fee: 20% on the first $500, 10% up to $10,000, and 5% thereafter. There are no fees for clients posting jobs.', open: false },
  { q: 'Is my payment secure?', a: 'Yes. All client payments are held in escrow before work begins. Funds are only released when you approve the work or a dispute is resolved in your favor.', open: false },
  { q: 'How do I withdraw my earnings?', a: 'You can withdraw your available earnings via bank transfer, PayPal, or crypto. Minimum withdrawal is $50.', open: false },
  { q: 'What if I have a dispute with a client?', a: 'We have a dedicated dispute resolution team. Both parties can submit evidence, and our team will make a fair determination within 5 business days.', open: false },
])
</script>
