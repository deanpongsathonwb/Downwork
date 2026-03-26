<template>
  <header 
    class="sticky top-0 z-50 bg-white"
    :class="{ 'border-b border-slate-100': !isHomePage }"
  >
    <div class="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
      <div class="flex items-center h-16">
        <!-- Logo -->
        <AppLogo size="md" />

        <!-- Desktop Nav Links -->
        <nav class="hidden md:flex flex-1 items-center gap-1 ml-10" aria-label="Main navigation">
          <RouterLink
            v-for="link in NAV_LINKS"
            :key="link.to"
            :to="link.to"
            class="px-3 py-2 text-sm font-medium text-slate-600 rounded-lg hover:text-slate-900 hover:bg-slate-100 transition-colors"
            active-class="text-green-600 bg-green-50"
          >
            {{ link.label }}
          </RouterLink>
        </nav>

        <!-- Auth Actions -->
        <div class="flex items-center gap-3">
          <template v-if="!auth.isAuthenticated">
            <RouterLink
              to="/auth/login"
              class="text-sm font-medium text-slate-600 hover:text-slate-900 transition-colors"
            >
              Log in
            </RouterLink>
            <RouterLink
              to="/auth/register"
              class="px-4 py-2 bg-green-600 text-white text-sm font-medium rounded-lg hover:bg-green-700 transition-colors"
            >
              Sign up
            </RouterLink>
          </template>
          <template v-else>
            <RouterLink
              :to="dashboardRoute"
              class="px-4 py-2 bg-green-600 text-white text-sm font-medium rounded-lg hover:bg-green-700 transition-colors"
            >
              Dashboard
            </RouterLink>
          </template>

          <!-- Mobile menu toggle -->
          <button
            class="md:hidden p-2 rounded-lg text-slate-500 hover:bg-slate-100"
            :aria-expanded="mobileMenuOpen"
            aria-controls="mobile-menu"
            aria-label="Toggle navigation menu"
            @click="mobileMenuOpen = !mobileMenuOpen"
          >
            <svg class="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor" aria-hidden="true">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M4 6h16M4 12h16M4 18h16" />
            </svg>
          </button>
        </div>
      </div>

      <!-- Mobile Menu -->
      <transition name="slide-down">
        <nav
          v-if="mobileMenuOpen"
          id="mobile-menu"
          class="md:hidden pb-4 border-t border-slate-100 pt-3"
          aria-label="Mobile navigation"
        >
          <RouterLink
            v-for="link in NAV_LINKS"
            :key="link.to"
            :to="link.to"
            class="block px-3 py-2 text-sm font-medium text-slate-600 rounded-lg hover:bg-slate-100"
            @click="mobileMenuOpen = false"
          >
            {{ link.label }}
          </RouterLink>
        </nav>
      </transition>
    </div>
  </header>
</template>

<script setup lang="ts">
import { ref, computed, watch } from 'vue'
import { RouterLink, useRoute } from 'vue-router'
import { useAuthStore } from '@/stores/auth.store'
import AppLogo from '@/components/common/AppLogo.vue'

const route = useRoute()
const auth = useAuthStore()
const mobileMenuOpen = ref(false)

watch(() => route.path, () => { mobileMenuOpen.value = false })

const isHomePage = computed(() => route.path === '/')

const dashboardRoute = computed(() => {
  const map: Record<string, string> = {
    freelancer: '/freelancer/dashboard',
    client: '/client/dashboard',
    admin: '/admin/dashboard',
  }
  return map[auth.role] ?? '/'
})

const NAV_LINKS = [
  { label: 'Browse Jobs',       to: '/browse-jobs'        },
  { label: 'Find Freelancers',  to: '/browse-freelancers' },
  { label: 'Pricing',           to: '/pricing'            },
  { label: 'About',             to: '/about'              },
  { label: 'Help',              to: '/help'               },
] as const
</script>

<style scoped>
.slide-down-enter-active,
.slide-down-leave-active {
  transition: all 0.2s ease;
}
.slide-down-enter-from,
.slide-down-leave-to {
  opacity: 0;
  transform: translateY(-8px);
}
</style>
