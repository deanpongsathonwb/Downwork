<template>
  <div class="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 py-16">
    <div class="text-center mb-14">
      <h1 class="text-4xl font-black text-slate-900 mb-4">Simple, Transparent Pricing</h1>
      <p class="text-xl text-slate-500">No hidden fees. Pay only when you earn.</p>
    </div>
    <div class="grid md:grid-cols-3 gap-6">
      <div 
        v-for="plan in plans" 
        :key="plan.name" 
        :class="[
          'rounded-2xl border-2 p-6 cursor-pointer transition-all duration-300',
          activePlan === plan.name 
            ? 'border-green-500 bg-green-50 shadow-xl scale-[1.02]' 
            : 'border-slate-200 bg-white hover:border-green-500 hover:bg-green-50 hover:shadow-xl hover:scale-[1.02]'
        ]"
        @click="activePlan = activePlan === plan.name ? null : plan.name"
      >
        <div v-if="activePlan === plan.name" class="mb-3">
          <span class="px-3 py-1 bg-green-500 text-white text-xs font-semibold rounded-full">
            {{ plan.featured ? 'Most Popular' : 'Selected' }}
          </span>
        </div>
        <h2 class="text-xl font-bold text-slate-900 mb-1">{{ plan.name }}</h2>
        <div class="mb-4">
          <span class="text-4xl font-black text-slate-900">{{ plan.price }}</span>
          <span class="text-slate-500 text-sm">{{ plan.period }}</span>
        </div>
        <p class="text-sm text-slate-600 mb-6">{{ plan.description }}</p>
        <ul class="space-y-2.5 mb-8">
          <li v-for="feature in plan.features" :key="feature" class="flex items-start gap-2 text-sm text-slate-700">
            <svg class="w-4 h-4 text-green-500 shrink-0 mt-0.5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2.5" d="M5 13l4 4L19 7" />
            </svg>
            {{ feature }}
          </li>
        </ul>
        <RouterLink
          to="/auth/register"
          :class="[
            'block text-center py-3 rounded-xl font-semibold text-sm transition-colors',
            activePlan === plan.name 
              ? 'bg-green-600 text-white hover:bg-green-700' 
              : 'bg-slate-900 text-white hover:bg-slate-800'
          ]"
          @click.stop
        >
          Get Started
        </RouterLink>
      </div>
    </div>
    <div class="mt-12 bg-white rounded-2xl border border-slate-200 p-8">
      <h2 class="text-2xl font-bold text-slate-900 mb-4 text-center">Freelancer Service Fees</h2>
      <p class="text-slate-500 text-center mb-6">Our fees decrease as you build your relationship with a client.</p>
      <div class="overflow-x-auto">
        <table class="w-full text-sm">
          <thead>
            <tr class="border-b border-slate-200">
              <th class="py-3 text-left text-slate-600 font-semibold">Lifetime Billings with Client</th>
              <th class="py-3 text-right text-slate-600 font-semibold">Service Fee</th>
            </tr>
          </thead>
          <tbody>
            <tr v-for="tier in feeTiers" :key="tier.range" class="border-b border-slate-100">
              <td class="py-3 text-slate-700">{{ tier.range }}</td>
              <td class="py-3 text-right font-semibold text-green-700">{{ tier.fee }}</td>
            </tr>
          </tbody>
        </table>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref } from 'vue'
import { RouterLink } from 'vue-router'

const activePlan = ref<string | null>(null)

const plans = [
  { name: 'Basic', price: 'Free', period: '', featured: false, description: 'Perfect for getting started on Downwork.', features: ['10 proposals/month', 'Basic profile visibility', 'Standard support', 'Access to all job categories'] },
  { name: 'Professional', price: '$29', period: '/month', featured: true, description: 'For active freelancers who want to grow faster.', features: ['Unlimited proposals', 'Featured profile badge', 'Priority support', 'Profile boost in search', 'Advanced analytics', 'Early access to new jobs'] },
  { name: 'Business', price: '$79', period: '/month', featured: false, description: 'For agencies and power freelancers.', features: ['Everything in Professional', 'Team seats (up to 5)', 'Custom profile URL', 'API access', 'Dedicated account manager', 'White-label reports'] },
]

const feeTiers = [
  { range: 'First $500', fee: '20%' },
  { range: '$500.01 – $10,000', fee: '10%' },
  { range: 'Over $10,000', fee: '5%' },
]
</script>
