<template>
  <div class="max-w-2xl mx-auto px-4 py-16">
    <div class="text-center mb-10">
      <h1 class="text-4xl font-bold text-slate-900 mb-3">Contact Us</h1>
      <p class="text-slate-500">We'd love to hear from you. We'll respond within 24 hours.</p>
    </div>
    <div class="bg-white rounded-2xl border border-slate-200 p-8">
      <form class="space-y-5" @submit.prevent="handleSubmit">
        <div class="grid grid-cols-2 gap-4">
          <div>
            <AppInput v-model="form.firstName" label="First Name" required placeholder="John" />
            <p v-if="errors.firstName" class="text-red-500 text-xs mt-1">{{ errors.firstName }}</p>
          </div>
          <div>
            <AppInput v-model="form.lastName" label="Last Name" required placeholder="Doe" />
            <p v-if="errors.lastName" class="text-red-500 text-xs mt-1">{{ errors.lastName }}</p>
          </div>
        </div>
        <div>
          <AppInput v-model="form.email" label="Email" type="email" required placeholder="you@example.com" />
          <p v-if="errors.email" class="text-red-500 text-xs mt-1">{{ errors.email }}</p>
        </div>
        <AppSelect v-model="form.topic" label="Topic" :options="topics" placeholder="Select a topic" required />
        <div>
          <AppTextarea v-model="form.message" label="Message" required :rows="5" placeholder="Describe your question or issue..." />
          <p v-if="errors.message" class="text-red-500 text-xs mt-1">{{ errors.message }}</p>
        </div>
        <AppButton type="submit" class="w-full" size="lg" :loading="submitting">Send Message</AppButton>
      </form>
      <div v-if="sent" class="mt-6 p-4 bg-green-50 rounded-xl text-center text-sm text-green-700 font-medium">
        ✅ Thank you! We'll get back to you within 24 hours.
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, reactive } from 'vue'
import AppInput from '@/components/ui/AppInput.vue'
import AppSelect from '@/components/ui/AppSelect.vue'
import AppTextarea from '@/components/ui/AppTextarea.vue'
import AppButton from '@/components/ui/AppButton.vue'

const submitting = ref(false)
const sent = ref(false)
const form = reactive({ firstName: '', lastName: '', email: '', topic: '', message: '' })
const errors = reactive<Record<string, string>>({})

const topics = [
  { label: 'Account Issue', value: 'account' },
  { label: 'Payment / Billing', value: 'payment' },
  { label: 'Dispute', value: 'dispute' },
  { label: 'Technical Problem', value: 'technical' },
  { label: 'General Inquiry', value: 'general' },
]

function validate(): boolean {
  Object.keys(errors).forEach(k => delete errors[k])
  if (!form.firstName.trim()) errors.firstName = 'First name is required.'
  if (!form.lastName.trim()) errors.lastName = 'Last name is required.'
  if (!form.email.trim()) {
    errors.email = 'Email is required.'
  } else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(form.email)) {
    errors.email = 'Please enter a valid email address.'
  }
  if (!form.message.trim() || form.message.trim().length < 20) {
    errors.message = 'Message is required and must be at least 20 characters.'
  }
  return Object.keys(errors).length === 0
}

async function handleSubmit(): Promise<void> {
  if (!validate()) return
  submitting.value = true
  await new Promise((r) => setTimeout(r, 1000))
  submitting.value = false
  sent.value = true
}
</script>
