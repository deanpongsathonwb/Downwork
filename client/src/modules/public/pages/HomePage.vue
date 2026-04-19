<template>
  <div>
    <HomeHeroSection :stats="HOME_STATS" :popular-tags="POPULAR_TAGS" />
    <HomeCategoriesSection :categories="HOME_BROWSE_CATEGORIES" />
    <HomeHowItWorksSection />
    <HomeTestimonialsSection />
    <HomeCTASection />
  </div>
</template>

<script setup lang="ts">
import { HOME_BROWSE_CATEGORIES } from '@/constants/categories'
import HomeHeroSection from '../components/HomeHeroSection.vue'
import HomeCategoriesSection from '../components/HomeCategoriesSection.vue'
import HomeHowItWorksSection from '../components/HomeHowItWorksSection.vue'
import HomeTestimonialsSection from '../components/HomeTestimonialsSection.vue'
import HomeCTASection from '../components/HomeCTASection.vue'

const HOME_STATS = [
  { value: '2M+',   label: 'Registered Users'     },
  { value: '500K+', label: 'Jobs Posted'           },
  { value: '$50M+', label: 'Paid to Freelancers'   },
  { value: '180+',  label: 'Countries'             },
] as const

/** Labels shown in Hero; `slug` is a `/hire/:slug` landing (see hire-talent.landing). */
const POPULAR_TAGS = [
  { label: 'Vue.js Developer', slug: 'web-developers' },
  { label: 'UI Designer', slug: 'ux-designers' },
  { label: 'React', slug: 'web-developers' },
  { label: 'Python', slug: 'python-developers' },
  { label: 'Mobile App', slug: 'mobile-app-developers' },
  { label: 'Logo Design', slug: 'logo-designers' },
] as const

</script>
