<template>
  <div class="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 py-10">
    <!-- Profile Header -->
    <div class="bg-white rounded-2xl border border-slate-200 p-6 mb-6">
      <div class="flex flex-col sm:flex-row gap-6">
        <div class="relative shrink-0">
          <UserAvatar :name="`${profile.firstName} ${profile.lastName}`" size="xl" />
          <span v-if="profile.availability === 'available'" class="absolute bottom-1 right-1 w-4 h-4 bg-green-400 rounded-full border-2 border-white" />
        </div>
        <div class="flex-1">
          <div class="flex flex-col sm:flex-row sm:items-start justify-between gap-4">
            <div>
              <div class="flex flex-wrap items-center gap-2 mb-1">
                <h1 class="text-2xl font-bold text-slate-900">{{ profile.firstName }} {{ profile.lastName }}</h1>
                <!-- Verified badge -->
                <span v-if="profile.verificationStatus === 'verified'" class="flex items-center gap-1 text-sm text-blue-600 font-medium bg-blue-50 px-2 py-0.5 rounded-lg">
                  <svg class="w-3.5 h-3.5" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 12l2 2 4-4m5.618-4.016A11.955 11.955 0 0112 2.944a11.955 11.955 0 01-8.618 3.04A12.02 12.02 0 003 9c0 5.591 3.824 10.29 9 11.622 5.176-1.332 9-6.03 9-11.622 0-1.042-.133-2.052-.382-3.016z"/></svg>
                  ID Verified
                </span>
                <!-- Badge -->
                <span v-if="profile.badge === 'top_rated'" class="flex items-center gap-1 text-xs font-bold text-yellow-700 bg-yellow-100 px-2 py-1 rounded-lg">
                  ⭐ Top Rated
                </span>
                <span v-else-if="profile.badge === 'top_rated_plus'" class="flex items-center gap-1 text-xs font-bold text-orange-700 bg-orange-100 px-2 py-1 rounded-lg">
                  🏅 Top Rated Plus
                </span>
                <span v-else-if="profile.badge === 'rising_talent'" class="flex items-center gap-1 text-xs font-bold text-purple-700 bg-purple-100 px-2 py-1 rounded-lg">
                  🚀 Rising Talent
                </span>
              </div>
              <p class="text-slate-600 mt-0.5">{{ profile.title }}</p>
              <div class="flex items-center gap-3 mt-2 flex-wrap">
                <div class="flex items-center gap-1">
                  <StarRating :model-value="profile.rating" size="sm" show-value />
                  <span class="text-sm text-slate-500">({{ profile.totalReviews }} reviews)</span>
                </div>
                <AppBadge :variant="profile.availability === 'available' ? 'green' : 'slate'" dot>
                  {{ profile.availability === 'available' ? 'Available Now' : profile.availability === 'busy' ? 'Not Available' : 'Limited Availability' }}
                </AppBadge>
              </div>
              <div class="flex items-center gap-4 mt-3 text-sm text-slate-500 flex-wrap">
                <span class="flex items-center gap-1">
                  <svg class="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z"/><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M15 11a3 3 0 11-6 0 3 3 0 016 0z"/></svg>
                  {{ profile.location }}
                </span>
                <span class="flex items-center gap-1">
                  <svg class="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z"/></svg>
                  Responds in ~{{ profile.responseTime || '2 hours' }}
                </span>
                <span class="text-green-600 font-semibold">${{ profile.hourlyRate }}/hr</span>
              </div>
            </div>
            <div class="flex gap-2 shrink-0">
              <AppButton variant="outline" size="sm" @click="toggleSave">
                <svg :class="['w-4 h-4 mr-1', isSaved ? 'text-red-500 fill-red-500' : 'text-slate-400']" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M4.318 6.318a4.5 4.5 0 000 6.364L12 20.364l7.682-7.682a4.5 4.5 0 00-6.364-6.364L12 7.636l-1.318-1.318a4.5 4.5 0 00-6.364 0z" />
                </svg>
                {{ isSaved ? 'Saved' : 'Save' }}
              </AppButton>
              <AppButton variant="outline" size="sm" @click="startChat">Message</AppButton>
              <AppButton @click="hireNow">Hire Now</AppButton>
            </div>
          </div>
        </div>
      </div>
    </div>

    <div class="grid grid-cols-1 lg:grid-cols-3 gap-6">
      <!-- Main Content -->
      <div class="lg:col-span-2 space-y-6">
        <!-- About -->
        <div class="bg-white rounded-2xl border border-slate-200 p-6">
          <h2 class="font-semibold text-slate-900 mb-3">About</h2>
          <p class="text-slate-600 leading-relaxed">{{ profile.bio }}</p>
        </div>

        <!-- Skills -->
        <div class="bg-white rounded-2xl border border-slate-200 p-6">
          <h2 class="font-semibold text-slate-900 mb-4">Skills</h2>
          <div class="flex flex-wrap gap-2">
            <span v-for="skill in profile.skills" :key="skill.id" class="px-3 py-1.5 bg-slate-100 text-slate-700 text-sm rounded-lg font-medium hover:bg-slate-200 transition-colors cursor-default">
              {{ skill.name }}
            </span>
          </div>
        </div>

        <!-- Portfolio -->
        <div class="bg-white rounded-2xl border border-slate-200 p-6">
          <h2 class="font-semibold text-slate-900 mb-4">Portfolio</h2>
          <div class="grid grid-cols-2 gap-4">
            <div v-for="item in profile.portfolio" :key="item.id" class="rounded-xl overflow-hidden border border-slate-200 hover:shadow-md transition-shadow cursor-pointer group">
              <div class="h-40 bg-gradient-to-br from-slate-100 to-slate-200 flex items-center justify-center relative">
                <span class="text-4xl">🎨</span>
                <div class="absolute inset-0 bg-black/40 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center">
                  <span class="text-white text-sm font-medium">View Project</span>
                </div>
              </div>
              <div class="p-3">
                <p class="font-medium text-sm text-slate-900">{{ item.title }}</p>
                <p class="text-xs text-slate-500 mt-0.5 line-clamp-2">{{ item.description }}</p>
                <div class="flex flex-wrap gap-1 mt-2">
                  <span v-for="tech in item.technologies.slice(0, 3)" :key="tech" class="text-xs px-1.5 py-0.5 bg-blue-50 text-blue-700 rounded-md font-medium">{{ tech }}</span>
                </div>
              </div>
            </div>
          </div>
          <p v-if="!profile.portfolio.length" class="text-sm text-slate-400 text-center py-4">No portfolio items yet.</p>
        </div>

        <!-- Work History -->
        <div class="bg-white rounded-2xl border border-slate-200 p-6">
          <h2 class="font-semibold text-slate-900 mb-4">Work History & Reviews</h2>
          <div class="space-y-5">
            <div v-for="job in profile.workHistory" :key="job.id" class="border-b border-slate-100 pb-5 last:border-0 last:pb-0">
              <div class="flex justify-between mb-1.5">
                <p class="font-medium text-slate-900 text-sm">{{ job.jobTitle }}</p>
                <StarRating :model-value="job.rating" size="sm" show-value />
              </div>
              <p class="text-xs text-slate-500 mb-2">{{ job.clientName }} · ${{ job.earnings.toLocaleString() }} earned · {{ job.startDate }} – {{ job.endDate }}</p>
              <p class="text-sm text-slate-600 leading-relaxed italic">"{{ job.feedback }}"</p>
            </div>
            <p v-if="!profile.workHistory.length" class="text-sm text-slate-400 text-center py-2">No work history yet.</p>
          </div>
        </div>

        <!-- Employment History -->
        <div v-if="profile.employmentHistory?.length" class="bg-white rounded-2xl border border-slate-200 p-6">
          <h2 class="font-semibold text-slate-900 mb-4">Employment History</h2>
          <div class="space-y-4">
            <div v-for="emp in profile.employmentHistory" :key="emp.id" class="flex gap-4">
              <div class="w-10 h-10 bg-slate-100 rounded-xl flex items-center justify-center shrink-0">
                <svg class="w-5 h-5 text-slate-500" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M21 13.255A23.931 23.931 0 0112 15c-3.183 0-6.22-.62-9-1.745M16 6V4a2 2 0 00-2-2h-4a2 2 0 00-2 2v2m4 6h.01M5 20h14a2 2 0 002-2V8a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z"/></svg>
              </div>
              <div class="flex-1">
                <p class="font-medium text-slate-900 text-sm">{{ emp.title }}</p>
                <p class="text-sm text-slate-600">{{ emp.company }}</p>
                <p class="text-xs text-slate-400 mt-0.5">{{ emp.startDate }} – {{ emp.isCurrent ? 'Present' : emp.endDate }}</p>
                <p v-if="emp.description" class="text-sm text-slate-600 mt-1">{{ emp.description }}</p>
              </div>
            </div>
          </div>
        </div>

        <!-- Education -->
        <div v-if="profile.educationHistory?.length" class="bg-white rounded-2xl border border-slate-200 p-6">
          <h2 class="font-semibold text-slate-900 mb-4">Education</h2>
          <div class="space-y-4">
            <div v-for="edu in profile.educationHistory" :key="edu.id" class="flex gap-4">
              <div class="w-10 h-10 bg-blue-50 rounded-xl flex items-center justify-center shrink-0">
                <svg class="w-5 h-5 text-blue-600" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path d="M12 14l9-5-9-5-9 5 9 5z"/><path d="M12 14l6.16-3.422a12.083 12.083 0 01.665 6.479A11.952 11.952 0 0012 20.055a11.952 11.952 0 00-6.824-2.998 12.078 12.078 0 01.665-6.479L12 14z"/><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 14l9-5-9-5-9 5 9 5zm0 0l6.16-3.422a12.083 12.083 0 01.665 6.479A11.952 11.952 0 0012 20.055a11.952 11.952 0 00-6.824-2.998 12.078 12.078 0 01.665-6.479L12 14zm-4 6v-7.5l4-2.222"/></svg>
              </div>
              <div>
                <p class="font-medium text-slate-900 text-sm">{{ edu.degree }}, {{ edu.fieldOfStudy }}</p>
                <p class="text-sm text-slate-600">{{ edu.school }}</p>
                <p class="text-xs text-slate-400 mt-0.5">{{ edu.startYear }} – {{ edu.endYear ?? 'Present' }}</p>
              </div>
            </div>
          </div>
        </div>

        <!-- Certifications -->
        <div v-if="profile.certifications?.length" class="bg-white rounded-2xl border border-slate-200 p-6">
          <h2 class="font-semibold text-slate-900 mb-4">Certifications</h2>
          <div class="space-y-3">
            <div v-for="cert in profile.certifications" :key="cert.id" class="flex items-start gap-3">
              <div class="w-9 h-9 bg-blue-100 rounded-lg flex items-center justify-center shrink-0">
                <svg class="w-4 h-4 text-blue-600" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 12l2 2 4-4M7.835 4.697a3.42 3.42 0 001.946-.806 3.42 3.42 0 014.438 0 3.42 3.42 0 001.946.806 3.42 3.42 0 013.138 3.138 3.42 3.42 0 00.806 1.946 3.42 3.42 0 010 4.438 3.42 3.42 0 00-.806 1.946 3.42 3.42 0 01-3.138 3.138 3.42 3.42 0 00-1.946.806 3.42 3.42 0 01-4.438 0 3.42 3.42 0 00-1.946-.806 3.42 3.42 0 01-3.138-3.138 3.42 3.42 0 00-.806-1.946 3.42 3.42 0 010-4.438 3.42 3.42 0 00.806-1.946 3.42 3.42 0 013.138-3.138z" />
                </svg>
              </div>
              <div>
                <p class="text-sm font-medium text-slate-900">{{ cert.name }}</p>
                <p class="text-xs text-slate-500">{{ cert.issuer }} · {{ cert.issueDate }}</p>
              </div>
            </div>
          </div>
        </div>
      </div>

      <!-- Right Sidebar -->
      <div class="space-y-5">
        <!-- Stats -->
        <div class="bg-white rounded-2xl border border-slate-200 p-5">
          <h3 class="font-semibold text-slate-900 mb-4">Stats</h3>
          <!-- JSS Score -->
          <div class="mb-4 p-3 bg-green-50 rounded-xl">
            <div class="flex justify-between items-center mb-1">
              <span class="text-sm font-medium text-green-800">Job Success Score</span>
              <span class="text-lg font-black text-green-700">{{ profile.jobSuccessScore ?? profile.successRate }}%</span>
            </div>
            <AppProgressBar :value="profile.jobSuccessScore ?? profile.successRate" color="green" size="xs" />
          </div>
          <dl class="space-y-3">
            <div class="flex justify-between">
              <dt class="text-sm text-slate-500">Hourly Rate</dt>
              <dd class="text-sm font-bold text-green-700">${{ profile.hourlyRate }}/hr</dd>
            </div>
            <div class="flex justify-between">
              <dt class="text-sm text-slate-500">Total Jobs Done</dt>
              <dd class="text-sm font-semibold text-slate-900">{{ profile.totalJobsDone }}</dd>
            </div>
            <div class="flex justify-between">
              <dt class="text-sm text-slate-500">Total Earned</dt>
              <dd class="text-sm font-semibold text-slate-900">${{ (profile.totalEarnings / 1000).toFixed(0) }}K+</dd>
            </div>
            <div class="flex justify-between">
              <dt class="text-sm text-slate-500">Response Rate</dt>
              <dd class="text-sm font-semibold text-slate-900">{{ profile.responseRate ?? 95 }}%</dd>
            </div>
          </dl>
        </div>

        <!-- Languages -->
        <div v-if="profile.languages?.length" class="bg-white rounded-2xl border border-slate-200 p-5">
          <h3 class="font-semibold text-slate-900 mb-3">Languages</h3>
          <div class="space-y-2">
            <div v-for="lang in profile.languages" :key="lang.name" class="flex justify-between items-center">
              <span class="text-sm text-slate-700 font-medium">{{ lang.name }}</span>
              <span class="text-xs text-slate-500 capitalize bg-slate-100 px-2 py-0.5 rounded-md">{{ lang.proficiency }}</span>
            </div>
          </div>
        </div>

        <!-- Member Since -->
        <div class="bg-white rounded-2xl border border-slate-200 p-5">
          <h3 class="font-semibold text-slate-900 mb-3">Member Since</h3>
          <p class="text-sm text-slate-600">January 2021</p>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, reactive, onMounted } from 'vue'
import { useRouter, useRoute } from 'vue-router'
import type { User, FreelancerProfile } from '@/types'
import AppBadge from '@/components/ui/AppBadge.vue'
import AppButton from '@/components/ui/AppButton.vue'
import AppProgressBar from '@/components/ui/AppProgressBar.vue'
import StarRating from '@/components/ui/StarRating.vue'
import UserAvatar from '@/components/common/UserAvatar.vue'

const router = useRouter()
const route = useRoute()
const isSaved = ref(false)

// In production this would be: await userService.getFreelancerProfile(route.params.id)
// For now the mock data represents the profile for any :id
onMounted(() => {
  const _id = route.params.id as string | undefined
  // TODO: fetch profile by _id from userService when backend is ready
  void _id
})

const profile = reactive<User & FreelancerProfile>({
  id: '1', userId: '1', email: 'alex@demo.com', role: 'freelancer', firstName: 'Alex', lastName: 'Johnson',
  avatar: undefined, isEmailVerified: true, is2FAEnabled: false, createdAt: '', updatedAt: '',
  title: 'Senior Vue.js & React Developer',
  bio: 'Full-stack developer with 7+ years of experience building scalable, high-performance web applications. I specialize in Vue.js, React, TypeScript, and Node.js. I pride myself on clean code, great communication, and delivering results on time and within budget.',
  hourlyRate: 85,
  skills: [
    { id: '1', name: 'Vue.js', category: 'frontend' },
    { id: '2', name: 'React', category: 'frontend' },
    { id: '3', name: 'TypeScript', category: 'frontend' },
    { id: '4', name: 'Node.js', category: 'backend' },
    { id: '5', name: 'PostgreSQL', category: 'database' },
    { id: '6', name: 'Docker', category: 'devops' },
    { id: '7', name: 'GraphQL', category: 'backend' },
    { id: '8', name: 'Tailwind CSS', category: 'frontend' },
  ],
  portfolio: [
    { id: '1', title: 'E-Commerce Platform', description: 'Full-stack marketplace with Vue.js & Node.js — 50k+ daily users', imageUrl: undefined, technologies: ['Vue.js', 'Node.js', 'PostgreSQL'], createdAt: '' },
    { id: '2', title: 'SaaS Analytics Dashboard', description: 'Real-time data visualization with D3.js and WebSockets', imageUrl: undefined, technologies: ['React', 'D3.js', 'TypeScript'], createdAt: '' },
    { id: '3', title: 'Fintech Mobile App', description: 'Cross-platform React Native app for personal finance management', imageUrl: undefined, technologies: ['React Native', 'Firebase'], createdAt: '' },
    { id: '4', title: 'CMS & Blog Platform', description: 'Custom headless CMS with Nuxt.js and Strapi backend', imageUrl: undefined, technologies: ['Nuxt.js', 'Strapi', 'PostgreSQL'], createdAt: '' },
  ],
  certifications: [
    { id: '1', name: 'AWS Solutions Architect', issuer: 'Amazon Web Services', issueDate: '2023-06-01', expiryDate: '2026-06-01' },
    { id: '2', name: 'Vue.js Certified Developer', issuer: 'Vue School', issueDate: '2022-01-01' },
  ],
  workHistory: [
    { id: '1', jobTitle: 'E-commerce Frontend Development', clientName: 'TechCorp Inc.', feedback: 'Alex is an exceptional developer — fast, clean code, and excellent communication throughout the project. Would hire again without hesitation.', rating: 5, earnings: 8500, startDate: '2024-01', endDate: '2024-03' },
    { id: '2', jobTitle: 'Vue.js Admin Dashboard', clientName: 'StartupXYZ', feedback: 'Delivered beyond expectations. Very professional and the code quality was outstanding.', rating: 5, earnings: 4200, startDate: '2023-10', endDate: '2023-12' },
    { id: '3', jobTitle: 'Node.js API Development', clientName: 'Digital Agency Co.', feedback: 'Great work! Very responsive and the API was well-documented and tested.', rating: 4, earnings: 2800, startDate: '2023-06', endDate: '2023-08' },
  ],
  employmentHistory: [
    { id: 'e1', company: 'TechVenture Inc.', title: 'Senior Frontend Developer', startDate: '2020-03', endDate: '2022-09', isCurrent: false, description: 'Led frontend development for a B2B SaaS platform with 10k+ users.' },
    { id: 'e2', company: 'Creative Agency', title: 'Frontend Developer', startDate: '2017-06', endDate: '2020-02', isCurrent: false },
  ],
  educationHistory: [
    { id: 'edu1', school: 'State University of New York', degree: 'Bachelor of Science', fieldOfStudy: 'Computer Science', startYear: 2013, endYear: 2017 },
  ],
  languages: [
    { name: 'English', proficiency: 'native' },
    { name: 'Spanish', proficiency: 'conversational' },
  ],
  totalEarnings: 125000, totalJobsDone: 89, successRate: 98, jobSuccessScore: 98,
  rating: 4.9, totalReviews: 67, availability: 'available', location: 'New York, USA',
  verificationStatus: 'verified', badge: 'top_rated', responseTime: '2 hours', responseRate: 98,
  connectsBalance: 60, profileCompleteness: 92, isIdentityVerified: true,
})

function toggleSave() { isSaved.value = !isSaved.value }
function startChat() { router.push('/client/messages') }
function hireNow() { router.push('/client/jobs/new') }
</script>
