<template>
  <div class="max-w-2xl mx-auto space-y-6">
    <AppBreadcrumb :items="[{ label: 'Contracts', route: '/freelancer/contracts' }, { label: contractTitle }, { label: 'Leave a Review' }]" />

    <div class="bg-white rounded-2xl border border-slate-200 p-8">
      <div class="text-center mb-8">
        <div class="w-16 h-16 bg-yellow-100 rounded-full flex items-center justify-center mx-auto mb-4">
          <svg class="w-8 h-8 text-yellow-500" fill="currentColor" viewBox="0 0 20 20">
            <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z"/>
          </svg>
        </div>
        <h1 class="text-2xl font-bold text-slate-900">Rate Your Client</h1>
        <p class="text-slate-500 mt-1">How was your experience working with <strong>{{ clientName }}</strong>?</p>
      </div>

      <div class="space-y-6">
        <!-- Overall Rating -->
        <div class="text-center">
          <p class="text-sm font-semibold text-slate-700 mb-3">Overall Rating</p>
          <div class="flex justify-center gap-2">
            <button
              v-for="star in 5"
              :key="star"
              class="transition-transform hover:scale-110"
              @click="form.rating = star"
              @mouseover="hoverRating = star"
              @mouseleave="hoverRating = 0"
            >
              <svg
                :class="['w-10 h-10 transition-colors', (hoverRating || form.rating) >= star ? 'text-yellow-400' : 'text-slate-200']"
                fill="currentColor"
                viewBox="0 0 20 20"
              >
                <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z"/>
              </svg>
            </button>
          </div>
          <p class="text-sm font-medium text-slate-600 mt-2">{{ ratingLabels[form.rating - 1] || 'Select a rating' }}</p>
        </div>

        <!-- Skill Ratings -->
        <div class="space-y-4 pt-4 border-t border-slate-100">
          <p class="text-sm font-semibold text-slate-700">Rate Specific Areas</p>
          <div v-for="skill in skillRatingItems" :key="skill.key" class="flex items-center justify-between">
            <span class="text-sm text-slate-600">{{ skill.label }}</span>
            <div class="flex gap-1">
              <button
                v-for="star in 5"
                :key="star"
                @click="skillRatings[skill.key] = star"
              >
                <svg :class="['w-6 h-6', skillRatings[skill.key] >= star ? 'text-yellow-400' : 'text-slate-200']" fill="currentColor" viewBox="0 0 20 20">
                  <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z"/>
                </svg>
              </button>
            </div>
          </div>
        </div>

        <!-- Public Review -->
        <div class="pt-4 border-t border-slate-100">
          <AppTextarea
            v-model="form.comment"
            label="Public Review"
            placeholder="Share your experience working with this client — this will be visible on their profile..."
            :rows="5"
            :maxlength="5000"
          />
          <p class="text-xs text-slate-400 mt-1 text-right">{{ form.comment.length }}/5000</p>
        </div>

        <!-- Would Work Again -->
        <div class="flex items-center gap-3 p-4 bg-slate-50 rounded-xl">
          <input id="workAgain" v-model="form.wouldWorkAgain" type="checkbox" class="w-4 h-4 accent-green-600" />
          <label for="workAgain" class="text-sm font-medium text-slate-700 cursor-pointer">
            I would work with this client again
          </label>
        </div>

        <!-- Private Note -->
        <div class="border-t border-slate-100 pt-4">
          <AppTextarea
            v-model="form.privateNote"
            label="Private Note to Downwork (optional)"
            placeholder="Anything you'd like to share privately with our trust & safety team..."
            :rows="2"
          />
          <p class="text-xs text-slate-400 mt-1">This will NOT be shown to the client.</p>
        </div>

        <!-- Actions -->
        <div class="flex gap-3 pt-2">
          <AppButton :loading="submitting" :disabled="!form.rating" class="flex-1" @click="submitReview">
            Submit Review
          </AppButton>
          <AppButton variant="outline" @click="router.back()">Cancel</AppButton>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, reactive } from 'vue'
import { useRouter } from 'vue-router'
import { useToastStore } from '@/stores/toast.store'
import AppBreadcrumb from '@/components/ui/AppBreadcrumb.vue'
import AppTextarea from '@/components/ui/AppTextarea.vue'
import AppButton from '@/components/ui/AppButton.vue'

const router = useRouter()
const toast = useToastStore()

const contractTitle = 'Vue.js Dashboard Development'
const clientName = 'David Kim'
const submitting = ref(false)
const hoverRating = ref(0)

const ratingLabels = ['Terrible', 'Bad', 'OK', 'Good', 'Excellent']

const form = reactive({
  rating: 0,
  comment: '',
  privateNote: '',
  wouldWorkAgain: false,
})

const skillRatingItems = [
  { key: 'communication', label: 'Communication' },
  { key: 'payment', label: 'Paid on time' },
  { key: 'cooperation', label: 'Cooperation' },
  { key: 'clarity', label: 'Project clarity' },
]

const skillRatings = reactive<Record<string, number>>({
  communication: 0,
  payment: 0,
  cooperation: 0,
  clarity: 0,
})

async function submitReview() {
  if (!form.rating) {
    toast.error('Rating required', 'Please select a star rating.')
    return
  }
  submitting.value = true
  await new Promise((r) => setTimeout(r, 1000))
  submitting.value = false
  toast.success('Review Submitted!', 'Thank you for your feedback.')
  router.push('/freelancer/contracts')
}
</script>
