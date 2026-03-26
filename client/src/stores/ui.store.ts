import { defineStore } from 'pinia'
import { ref } from 'vue'
import type { BreadcrumbItem } from '@/types'

export const useUIStore = defineStore('ui', () => {
  const sidebarCollapsed = ref(false)
  const mobileSidebarOpen = ref(false)
  const breadcrumbs = ref<BreadcrumbItem[]>([])
  const theme = ref<'light' | 'dark'>('light')

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

  function setTheme(newTheme: 'light' | 'dark'): void {
    theme.value = newTheme
    localStorage.setItem('downwork_theme', newTheme)
  }

  function initTheme(): void {
    const saved = localStorage.getItem('downwork_theme') as 'light' | 'dark' | null
    if (saved) theme.value = saved
  }

  return {
    sidebarCollapsed,
    mobileSidebarOpen,
    breadcrumbs,
    theme,
    toggleSidebar,
    toggleMobileSidebar,
    closeMobileSidebar,
    setBreadcrumbs,
    setTheme,
    initTheme,
  }
})
