<template>
  <div class="min-h-screen bg-white text-neutral-900">
    <header class="sticky top-0 z-50 shrink-0 bg-white">
      <div class="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <div class="flex h-16 items-center justify-between">
          <div class="flex shrink-0 items-center">
            <AppLogo size="md" />
          </div>
          <AuthAccountDropdown />
        </div>
      </div>
    </header>

    <div class="mx-auto max-w-2xl px-6 py-8 sm:py-10 md:py-12">
      <h1 class="text-2xl font-semibold tracking-tight text-black sm:text-3xl">
        Welcome to Downwork!
      </h1>
      <p class="mt-3 text-sm text-neutral-600 sm:text-base leading-relaxed">
        Tell us about your business and you’ll be on your way to connect with talent.
      </p>

      <form class="mt-10 space-y-8" @submit.prevent="onContinue">
        <AppInput
          v-model="companyName"
          label="Company Name"
          placeholder="Your company or team name"
          autocomplete="organization"
        />

        <AppInput
          v-model="website"
          label="Website"
          placeholder="https:// or www."
          autocomplete="url"
        />

        <fieldset class="space-y-3">
          <legend class="text-sm font-medium text-slate-700">
            How many people are in your company?
          </legend>
          <div class="flex flex-nowrap gap-2">
            <button
              v-for="opt in companySizeOptions"
              :key="opt.value"
              type="button"
              :class="[
                'shrink-0 rounded-full border px-4 py-2 text-sm font-medium transition-colors',
                selectedSize === opt.value
                  ? 'border-green-600 bg-green-50 text-green-800'
                  : 'border-slate-300 bg-white text-slate-700 hover:border-slate-400 hover:bg-slate-50',
              ]"
              @click="selectedSize = opt.value"
            >
              {{ opt.label }}
            </button>
          </div>
        </fieldset>

        <div class="flex justify-end pt-2">
          <AppButton type="submit" size="lg" :loading="saving" :disabled="!canSubmit">
            Continue
          </AppButton>
        </div>
      </form>
    </div>
  </div>
</template>

<script setup lang="ts">
import { computed, onMounted, ref, watch } from 'vue'
import { useRouter } from 'vue-router'
import { useAuthStore } from '@/stores/auth.store'
import { useToastStore } from '@/stores/toast.store'
import { userService } from '@/services/api/user.service'
import AppInput from '@/components/ui/AppInput.vue'
import AppButton from '@/components/ui/AppButton.vue'
import AppLogo from '@/components/common/AppLogo.vue'
import AuthAccountDropdown from '@/modules/auth/components/AuthAccountDropdown.vue'

const router = useRouter()
const auth = useAuthStore()
const toast = useToastStore()

const companySizeOptions = [
  { label: 'Just me', value: 'just_me' },
  { label: '2 - 9', value: '2-9' },
  { label: '10 - 99', value: '10-99' },
  { label: '100 - 499', value: '100-499' },
  { label: '500 - 4,999', value: '500-4999' },
  { label: '5,000+', value: '5000+' },
] as const

const companyName = ref('')
const website = ref('')
const selectedSize = ref<string>('')
const saving = ref(false)

const canSubmit = computed(() => !!selectedSize.value.trim())

function prefillFromUser() {
  const u = auth.user
  if (!u) return
  const full = `${u.firstName ?? ''} ${u.lastName ?? ''}`.trim()
  if (full) companyName.value = full
}

onMounted(() => {
  prefillFromUser()
})

watch(
  () => auth.user,
  () => {
    if (auth.isClient && !companyName.value.trim()) prefillFromUser()
  },
  { immediate: false },
)

async function onContinue() {
  if (!canSubmit.value || saving.value) return
  saving.value = true
  try {
    const name = companyName.value.trim()
    const site = website.value.trim()
    await userService.updateClientProfile({
      companyName: name || undefined,
      website: site || undefined,
      companySize: selectedSize.value,
    })
    if (name) auth.updateUser({ companyName: name })
    await router.replace({ name: 'client-job-post-instant-welcome' })
  } catch {
    toast.error('Could not save', 'Please try again in a moment.')
  } finally {
    saving.value = false
  }
}
</script>
