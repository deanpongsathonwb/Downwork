// ── UI / Shared ───────────────────────────────────────────────

export interface SelectOption {
  label: string
  value: string | number
  disabled?: boolean
}

export interface TabItem {
  label: string
  value: string
  icon?: string
  badge?: string | number
}

export interface BreadcrumbItem {
  label: string
  to?: string
  /** Vue Router route name (string) or route object */
  route?: string | { name?: string; path?: string; params?: Record<string, string> }
}

export interface SidebarItem {
  id: string
  label: string
  to?: string
  route?: string
  icon?: string
  badge?: string | number
  /** Allowed user roles for this item */
  roles?: string[]
  children?: SidebarItem[]
}

export interface PaginationMeta {
  page: number
  limit: number
  total: number
  totalPages: number
  hasNextPage?: boolean
  hasPrevPage?: boolean
}

export interface ApiResponse<T = unknown> {
  data: T
  message?: string
  success: boolean
  meta?: PaginationMeta
}

export interface ApiError {
  message: string
  statusCode: number
  errors?: Record<string, string[]>
}

export interface PaginatedResponse<T> {
  data: T[]
  meta: PaginationMeta
}

export interface Toast {
  id: string
  type: 'success' | 'error' | 'info' | 'warning'
  title: string
  message?: string
  duration?: number
  persistent?: boolean
}

/** Alias kept for backward-compat */
export type ToastPayload = Toast
