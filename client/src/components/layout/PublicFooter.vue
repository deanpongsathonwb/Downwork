<template>
  <footer class="bg-slate-900 text-slate-400">
    <div class="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
      <div class="grid grid-cols-2 md:grid-cols-4 gap-8">
        <!-- Brand -->
        <div class="col-span-2 md:col-span-1">
          <AppLogo size="md" variant="dark" class="mb-4" />
          <p class="text-sm leading-relaxed">The professional marketplace for top freelancers and quality clients.</p>
        </div>

        <!-- Link sections -->
        <div v-for="section in FOOTER_LINKS" :key="section.title">
          <h3 class="text-white font-semibold mb-3 text-sm">{{ section.title }}</h3>
          <ul class="space-y-2">
            <li v-for="link in section.links" :key="link.label">
              <RouterLink :to="link.to" class="text-sm hover:text-white transition-colors">
                {{ link.label }}
              </RouterLink>
            </li>
          </ul>
        </div>
      </div>

      <div class="border-t border-slate-800 mt-10 pt-6 flex flex-col sm:flex-row justify-between gap-4">
        <p class="text-xs">&copy; {{ year }} Downwork, Inc. All rights reserved.</p>
        <nav class="flex gap-4 text-xs" aria-label="Legal links">
          <RouterLink to="/privacy-policy" class="hover:text-white transition-colors">Privacy Policy</RouterLink>
          <RouterLink to="/terms-of-service" class="hover:text-white transition-colors">Terms of Service</RouterLink>
          <RouterLink to="/cookie-policy" class="hover:text-white transition-colors">Cookie Policy</RouterLink>
        </nav>
      </div>
    </div>
  </footer>
</template>

<script setup lang="ts">
import { computed } from 'vue'
import { RouterLink } from 'vue-router'
import AppLogo from '@/components/common/AppLogo.vue'

const year = computed(() => new Date().getFullYear())

const FOOTER_LINKS = [
  {
    title: 'For Clients',
    links: [
      { label: 'Post a Job',         to: '/auth/register'       },
      { label: 'Browse Freelancers', to: '/browse-freelancers'  },
      { label: 'How it Works',       to: '/about'               },
    ],
  },
  {
    title: 'For Freelancers',
    links: [
      { label: 'Browse Jobs',   to: '/browse-jobs'   },
      { label: 'Create Profile', to: '/auth/register' },
      { label: 'Pricing',       to: '/pricing'        },
    ],
  },
  {
    title: 'Company',
    links: [
      { label: 'About Us', to: '/about'   },
      { label: 'Contact',  to: '/contact' },
      { label: 'FAQ',      to: '/help'    },
    ],
  },
] as const
</script>
