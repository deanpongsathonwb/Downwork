<template>
  <div>
    <HomeHeroSection :stats="HOME_STATS" :popular-tags="POPULAR_TAGS" />
    <HomeCategoriesSection :categories="JOB_CATEGORIES" />
    <HomeFeaturedJobsSection :jobs="featuredJobs" :is-loading="jobStore.isLoading" />
    <HomeHowItWorksSection :steps="HOW_IT_WORKS_STEPS" />
    <HomeCTASection />
  </div>
</template>

<script setup lang="ts">
import { computed, onMounted } from 'vue'
import { useJobStore } from '@/stores/job.store'
import { JOB_CATEGORIES } from '@/constants/categories'
import HomeHeroSection from '../components/HomeHeroSection.vue'
import HomeCategoriesSection from '../components/HomeCategoriesSection.vue'
import HomeFeaturedJobsSection from '../components/HomeFeaturedJobsSection.vue'
import HomeHowItWorksSection from '../components/HomeHowItWorksSection.vue'
import HomeCTASection from '../components/HomeCTASection.vue'

const jobStore = useJobStore()

const featuredJobs = computed(() => jobStore.jobs.slice(0, 6))

onMounted(() => {
  jobStore.fetchJobs()
})

const HOME_STATS = [
  { value: '2M+',   label: 'Registered Users'     },
  { value: '500K+', label: 'Jobs Posted'           },
  { value: '$50M+', label: 'Paid to Freelancers'   },
  { value: '180+',  label: 'Countries'             },
] as const

const POPULAR_TAGS = [
  'Vue.js Developer',
  'UI Designer',
  'React',
  'Python',
  'Mobile App',
  'Logo Design',
] as const

const HOW_IT_WORKS_STEPS = [
  {
    title: 'Post Your Job',
    description: 'Describe what you need, set your budget, and publish your job in minutes.',
  },
  {
    title: 'Review Proposals',
    description: 'Receive proposals from qualified freelancers and compare their experience.',
  },
  {
    title: 'Hire & Pay Safely',
    description: 'Work with your chosen freelancer with secure escrow-backed payments.',
  },
] as const
</script>
