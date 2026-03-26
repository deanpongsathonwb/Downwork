import { computed } from 'vue'
import { useAuthStore } from '@/stores/auth.store'
import { useChatStore } from '@/stores/chat.store'
import { useNotificationStore } from '@/stores/notification.store'
import type { SidebarItem, UserRole } from '@/types'

// ============================================================
// ROLE-BASED SIDEBAR COMPOSABLE
// ============================================================

const freelancerNav: SidebarItem[] = [
  { id: 'fl-dashboard', label: 'Dashboard', icon: 'grid', route: '/freelancer/dashboard', roles: ['freelancer'] },
  { id: 'fl-find-jobs', label: 'Find Work', icon: 'search', route: '/browse-jobs', roles: ['freelancer'] },
  { id: 'fl-proposals', label: 'My Proposals', icon: 'file-text', route: '/freelancer/proposals', roles: ['freelancer'] },
  { id: 'fl-saved', label: 'Saved Jobs', icon: 'bookmark', route: '/freelancer/saved-jobs', roles: ['freelancer'] },
  { id: 'fl-contracts', label: 'Contracts', icon: 'briefcase', route: '/freelancer/contracts', roles: ['freelancer'] },
  { id: 'fl-earnings', label: 'Earnings', icon: 'dollar-sign', route: '/freelancer/earnings', roles: ['freelancer'] },
  { id: 'fl-messages', label: 'Messages', icon: 'message-circle', route: '/freelancer/messages', roles: ['freelancer'] },
  { id: 'fl-notifications', label: 'Notifications', icon: 'bell', route: '/freelancer/notifications', roles: ['freelancer'] },
  { id: 'fl-profile', label: 'Edit Profile', icon: 'user', route: '/freelancer/profile', roles: ['freelancer'] },
  { id: 'fl-verification', label: 'Verification', icon: 'shield', route: '/freelancer/verification', roles: ['freelancer'] },
  { id: 'fl-settings', label: 'Settings', icon: 'settings', route: '/freelancer/settings', roles: ['freelancer'] },
]

const clientNav: SidebarItem[] = [
  { id: 'cl-dashboard', label: 'Dashboard', icon: 'grid', route: '/client/dashboard', roles: ['client'] },
  { id: 'cl-new-job', label: 'Post a Job', icon: 'plus-circle', route: '/client/jobs/new', roles: ['client'] },
  { id: 'cl-jobs', label: 'My Jobs', icon: 'briefcase', route: '/client/jobs', roles: ['client'] },
  { id: 'cl-find-talent', label: 'Find Talent', icon: 'search', route: '/browse-freelancers', roles: ['client'] },
  { id: 'cl-contracts', label: 'Contracts', icon: 'file-check', route: '/client/contracts', roles: ['client'] },
  { id: 'cl-payments', label: 'Payments', icon: 'credit-card', route: '/client/payments', roles: ['client'] },
  { id: 'cl-messages', label: 'Messages', icon: 'message-circle', route: '/client/messages', roles: ['client'] },
  { id: 'cl-notifications', label: 'Notifications', icon: 'bell', route: '/client/notifications', roles: ['client'] },
  { id: 'cl-settings', label: 'Settings', icon: 'settings', route: '/client/settings', roles: ['client'] },
]

const adminNav: SidebarItem[] = [
  { id: 'ad-dashboard', label: 'Dashboard', icon: 'grid', route: '/admin/dashboard', roles: ['admin'] },
  { id: 'ad-users', label: 'Users', icon: 'users', route: '/admin/users', roles: ['admin'] },
  { id: 'ad-jobs', label: 'Job Moderation', icon: 'shield', route: '/admin/jobs', roles: ['admin'] },
  { id: 'ad-disputes', label: 'Disputes', icon: 'alert-triangle', route: '/admin/disputes', roles: ['admin'] },
  { id: 'ad-analytics', label: 'Analytics', icon: 'bar-chart-2', route: '/admin/analytics', roles: ['admin'] },
  { id: 'ad-reports', label: 'Reports', icon: 'file-bar-chart', route: '/admin/reports', roles: ['admin'] },
  { id: 'ad-settings', label: 'Settings', icon: 'sliders', route: '/admin/settings', roles: ['admin'] },
]

const navMap: Record<UserRole, SidebarItem[]> = {
  guest: [],
  freelancer: freelancerNav,
  client: clientNav,
  admin: adminNav,
}

export function useSidebar() {
  const auth = useAuthStore()
  const chat = useChatStore()
  const notifications = useNotificationStore()

  const sidebarItems = computed<SidebarItem[]>(() => {
    const items = navMap[auth.role] ?? []
    return items.map((item) => {
      const enriched = { ...item }
      if (item.id.endsWith('-messages')) {
        enriched.badge = chat.totalUnread > 0 ? chat.totalUnread : undefined
      }
      if (item.id.endsWith('-notifications')) {
        enriched.badge = notifications.unreadCount > 0 ? notifications.unreadCount : undefined
      }
      return enriched
    })
  })

  return { sidebarItems }
}
