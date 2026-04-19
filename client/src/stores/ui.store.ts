import { defineStore } from 'pinia'
import { ref, computed, watch } from 'vue'
import type { BreadcrumbItem } from '@/types'

export type ThemePreference = 'auto' | 'light' | 'dark'

const THEME_PREF_KEY = 'downwork_theme_pref'
const LEGACY_THEME_KEY = 'downwork_theme'

function readSystemPrefersDark(): boolean {
  return window.matchMedia('(prefers-color-scheme: dark)').matches
}

function applyDarkClass(isDark: boolean): void {
  document.documentElement.classList.toggle('dark', isDark)
}

export const useUIStore = defineStore('ui', () => {
  const sidebarCollapsed = ref(false)
  const mobileSidebarOpen = ref(false)
  const breadcrumbs = ref<BreadcrumbItem[]>([])
  const themePreference = ref<ThemePreference>('light')
  const systemPrefersDark = ref(false)

  const theme = computed<'light' | 'dark'>(() => {
    if (themePreference.value === 'dark') return 'dark'
    if (themePreference.value === 'light') return 'light'
    return systemPrefersDark.value ? 'dark' : 'light'
  })

  watch(
    theme,
    (t) => {
      applyDarkClass(t === 'dark')
    },
    { flush: 'post' },
  )

  function toggleSidebar(): void {
    sidebarCollapsed.value = !sidebarCollapsed.value
  }

  function toggleMobileSidebar(): void {
    mobileSidebarOpen.value = !mobileSidebarOpen.value
  }

  function closeMobileSidebar(): void {
    mobileSidebarOpen.value = false
  }

  function setBreadcrumbs(items: BreadcrumbItem[]): void {
    breadcrumbs.value = items
  }

  /** @deprecated Use setThemePreference */
  function setTheme(newTheme: 'light' | 'dark'): void {
    setThemePreference(newTheme)
  }

  function setThemePreference(pref: ThemePreference): void {
    themePreference.value = pref
    localStorage.setItem(THEME_PREF_KEY, pref)
  }

  function initTheme(): void {
    const stored = localStorage.getItem(THEME_PREF_KEY) as ThemePreference | null
    if (stored === 'auto' || stored === 'light' || stored === 'dark') {
      themePreference.value = stored
    } else {
      const legacy = localStorage.getItem(LEGACY_THEME_KEY) as 'light' | 'dark' | null
      if (legacy === 'light' || legacy === 'dark') {
        themePreference.value = legacy
        localStorage.setItem(THEME_PREF_KEY, legacy)
      }
    }

    systemPrefersDark.value = readSystemPrefersDark()
    window.matchMedia('(prefers-color-scheme: dark)').addEventListener('change', (e) => {
      systemPrefersDark.value = e.matches
    })

    applyDarkClass(theme.value === 'dark')
  }

  return {
    sidebarCollapsed,
    mobileSidebarOpen,
    breadcrumbs,
    theme,
    themePreference,
    toggleSidebar,
    toggleMobileSidebar,
    closeMobileSidebar,
    setBreadcrumbs,
    setTheme,
    setThemePreference,
    initTheme,
  }
})
