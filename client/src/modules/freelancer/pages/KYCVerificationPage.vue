<template>
  <div class="space-y-6 max-w-2xl">
    <div>
      <h1 class="text-2xl font-bold text-slate-900">Identity Verification</h1>
      <p class="text-slate-500 mt-1">Verified freelancers get more visibility and build trust with clients.</p>
    </div>

    <!-- Loading State -->
    <div v-if="isLoadingStatus" class="space-y-6">
      <div class="animate-pulse bg-slate-50 rounded-2xl p-5 h-20"></div>
      <div class="animate-pulse bg-white rounded-2xl border border-slate-200 p-6 h-32"></div>
      <div class="animate-pulse bg-white rounded-2xl border border-slate-200 p-6 h-64"></div>
    </div>

    <!-- Content -->
    <template v-else>
    <!-- Status Banner -->
    <div :class="['rounded-2xl p-5 flex items-start gap-4', statusConfig.bg]">
      <div :class="['w-10 h-10 rounded-xl flex items-center justify-center shrink-0', statusConfig.iconBg]">
        <svg :class="['w-5 h-5', statusConfig.iconColor]" fill="none" viewBox="0 0 24 24" stroke="currentColor">
          <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" :d="statusConfig.icon" />
        </svg>
      </div>
      <div>
        <p :class="['font-semibold', statusConfig.textColor]">{{ statusConfig.title }}</p>
        <p class="text-sm text-slate-600 mt-0.5">{{ statusConfig.message }}</p>
      </div>
    </div>

    <!-- Benefits -->
    <div class="bg-white rounded-2xl border border-slate-200 p-6">
      <h2 class="font-semibold text-slate-900 mb-4">Benefits of Verification</h2>
      <div class="grid grid-cols-2 gap-3">
        <div v-for="benefit in benefits" :key="benefit" class="flex items-center gap-2 text-sm text-slate-700">
          <svg class="w-4 h-4 text-green-500 shrink-0" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
          </svg>
          {{ benefit }}
        </div>
      </div>
    </div>

    <!-- Verification Steps -->
    <div class="bg-white rounded-2xl border border-slate-200 p-6 space-y-5">
      <h2 class="font-semibold text-slate-900">Verification Steps</h2>

      <!-- Step 1: Government ID -->
      <div class="border border-slate-200 rounded-xl p-5">
        <div class="flex items-center justify-between mb-4">
          <div class="flex items-center gap-3">
            <div :class="['w-8 h-8 rounded-full flex items-center justify-center text-sm font-bold', steps.id ? 'bg-green-100 text-green-700' : 'bg-slate-100 text-slate-600']">
              <svg v-if="steps.id" class="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2.5" d="M5 13l4 4L19 7"/></svg>
              <span v-else>1</span>
            </div>
            <div>
              <p class="font-medium text-slate-900 text-sm">Government-Issued ID</p>
              <p class="text-xs text-slate-500">Passport, driver's license, or national ID</p>
            </div>
          </div>
          <AppBadge v-if="steps.id" variant="green">Completed</AppBadge>
        </div>
        <div v-if="!steps.id">
          <div class="grid grid-cols-2 gap-3 mb-3">
            <AppSelect v-model="idType" label="ID Type" :options="idTypes" />
            <AppSelect v-model="idCountry" label="Issuing Country" :options="countries" />
          </div>
          <AppFileUpload
            label="Upload ID (front)"
            hint="Accepted: JPG, PNG, PDF · Max 10MB"
            accept=".jpg,.jpeg,.png,.pdf"
            @change="idFile = $event[0]"
          />
          <div class="mt-3">
            <AppFileUpload
              label="Upload ID (back, if applicable)"
              hint="Accepted: JPG, PNG, PDF · Max 10MB"
              accept=".jpg,.jpeg,.png,.pdf"
              @change="idFileBack = $event[0]"
            />
          </div>
          <AppButton class="mt-3 w-full" :disabled="!idFile" @click="steps.id = true">Upload ID</AppButton>
        </div>
      </div>

      <!-- Step 2: Selfie -->
      <div class="border border-slate-200 rounded-xl p-5">
        <div class="flex items-center justify-between mb-4">
          <div class="flex items-center gap-3">
            <div :class="['w-8 h-8 rounded-full flex items-center justify-center text-sm font-bold', steps.selfie ? 'bg-green-100 text-green-700' : 'bg-slate-100 text-slate-600']">
              <svg v-if="steps.selfie" class="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2.5" d="M5 13l4 4L19 7"/></svg>
              <span v-else>2</span>
            </div>
            <div>
              <p class="font-medium text-slate-900 text-sm">Selfie with ID</p>
              <p class="text-xs text-slate-500">Take a photo holding your ID next to your face</p>
            </div>
          </div>
          <AppBadge v-if="steps.selfie" variant="green">Completed</AppBadge>
        </div>
        <div v-if="!steps.selfie">
          <AppFileUpload
            label="Upload Selfie with ID"
            hint="Clear photo showing your face and ID document · Max 10MB"
            accept=".jpg,.jpeg,.png"
            @change="selfieFile = $event[0]"
          />
          <AppButton class="mt-3 w-full" :disabled="!selfieFile" @click="steps.selfie = true">Upload Selfie</AppButton>
        </div>
      </div>

      <!-- Step 3: Submit -->
      <div class="border border-slate-200 rounded-xl p-5">
        <div class="flex items-center gap-3 mb-4">
          <div :class="['w-8 h-8 rounded-full flex items-center justify-center text-sm font-bold', submitted ? 'bg-green-100 text-green-700' : 'bg-slate-100 text-slate-600']">
            <svg v-if="submitted" class="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2.5" d="M5 13l4 4L19 7"/></svg>
            <span v-else>3</span>
          </div>
          <div>
            <p class="font-medium text-slate-900 text-sm">Submit for Review</p>
            <p class="text-xs text-slate-500">Our team will review within 1–3 business days</p>
          </div>
        </div>
        <AppButton v-if="!submitted" class="w-full" :disabled="!steps.id || !steps.selfie" :loading="submitting" @click="submitVerification">
          Submit for Verification
        </AppButton>
        <div v-else class="flex items-center gap-2 text-sm text-green-700 font-medium">
          <svg class="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z"/></svg>
          Submitted — under review
        </div>
      </div>
    </div>

    <div class="bg-slate-50 rounded-2xl p-5 text-sm text-slate-500">
      <p class="font-medium text-slate-700 mb-1">Privacy & Security</p>
      Your documents are encrypted and securely stored. They are used solely for identity verification and are never shared with clients. Documents are deleted after verification is complete.
    </div>
    </template>
  </div>
</template>

<script setup lang="ts">
import { ref, reactive, computed, onMounted } from 'vue'
import { useToastStore } from '@/stores/toast.store'
import { kycService } from '@/services/api/kyc.service'
import type { KYCStatus } from '@/types'
import AppBadge from '@/components/ui/AppBadge.vue'
import AppButton from '@/components/ui/AppButton.vue'
import AppSelect from '@/components/ui/AppSelect.vue'
import AppFileUpload from '@/components/ui/AppFileUpload.vue'

const toast = useToastStore()
const isLoadingStatus = ref(true)

onMounted(async () => {
  try {
    const res = await kycService.getStatus()
    verificationStatus.value = res.data.status
    if (res.data.status === 'pending') submitted.value = true
  } catch {
    // Status check failed, stay at default unverified
  } finally {
    isLoadingStatus.value = false
  }
})

const verificationStatus = ref<KYCStatus>('not_started')
const submitting = ref(false)
const submitted = ref(false)

const idType = ref('')
const idCountry = ref('')
const idFile = ref<File | null>(null)
const idFileBack = ref<File | null>(null)
const selfieFile = ref<File | null>(null)

const steps = reactive({ id: false, selfie: false })

const benefits = [
  'Verified badge on your profile',
  '40% more profile views',
  'Higher trust with clients',
  'Access to premium jobs',
  'Faster payment processing',
  'Priority dispute resolution',
]

const idTypes = [
  { label: 'Passport', value: 'passport' },
  { label: "Driver's License", value: 'drivers_license' },
  { label: 'National ID Card', value: 'national_id' },
]

const countries = [
  { label: 'United States', value: 'US' },
  { label: 'United Kingdom', value: 'UK' },
  { label: 'Thailand', value: 'TH' },
  { label: 'Canada', value: 'CA' },
  { label: 'Australia', value: 'AU' },
  { label: 'Other', value: 'other' },
]

const statusConfig = computed(() => {
  if (submitted.value || verificationStatus.value === 'pending') {
    return {
      bg: 'bg-yellow-50 border border-yellow-200',
      iconBg: 'bg-yellow-100',
      iconColor: 'text-yellow-600',
      textColor: 'text-yellow-800',
      icon: 'M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z',
      title: 'Verification In Progress',
      message: 'We\'re reviewing your documents. This typically takes 1–3 business days.',
    }
  }
  if (verificationStatus.value === 'approved') {
    return {
      bg: 'bg-green-50 border border-green-200',
      iconBg: 'bg-green-100',
      iconColor: 'text-green-600',
      textColor: 'text-green-800',
      icon: 'M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z',
      title: 'Identity Verified',
      message: 'Your identity has been verified. The verified badge is now visible on your profile.',
    }
  }
  return {
    bg: 'bg-slate-50 border border-slate-200',
    iconBg: 'bg-slate-100',
    iconColor: 'text-slate-500',
    textColor: 'text-slate-700',
    icon: 'M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z',
    title: 'Not Verified',
    message: 'Complete the steps below to verify your identity and unlock all platform features.',
  }
})

async function submitVerification() {
  submitting.value = true
  try {
    const formData = new FormData()
    formData.append('idType', idType.value)
    formData.append('idCountry', idCountry.value)
    if (idFile.value) formData.append('idFront', idFile.value)
    if (idFileBack.value) formData.append('idBack', idFileBack.value)
    if (selfieFile.value) formData.append('selfie', selfieFile.value)
    await kycService.submit(formData)
    submitted.value = true
    verificationStatus.value = 'pending'
    toast.success('Submitted!', 'Your documents have been submitted for review.')
  } catch {
    toast.error('Submission Failed', 'Could not submit your documents. Please try again.')
  } finally {
    submitting.value = false
  }
}
</script>
