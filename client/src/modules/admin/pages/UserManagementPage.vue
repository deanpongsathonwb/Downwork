<template>
  <div class="space-y-6">
    <div class="flex justify-between items-center">
      <h1 class="text-2xl font-bold text-white">User Management</h1>
      <span class="px-3 py-1.5 bg-slate-800 text-slate-300 text-sm rounded-lg">{{ adminStore.users.length.toLocaleString() }} total users</span>
    </div>

    <!-- Loading State -->
    <div v-if="adminStore.isLoading" class="space-y-4">
      <div class="animate-pulse bg-slate-900 rounded-2xl border border-slate-800 p-4 h-14"></div>
      <div class="animate-pulse bg-slate-900 rounded-2xl border border-slate-800 overflow-hidden">
        <div class="h-12 bg-slate-800"></div>
        <div v-for="i in 6" :key="i" class="h-16 border-b border-slate-800 px-5 py-3">
          <div class="flex items-center gap-3">
            <div class="w-8 h-8 bg-slate-700 rounded-full"></div>
            <div class="flex-1 space-y-2">
              <div class="bg-slate-700 rounded h-4 w-32"></div>
              <div class="bg-slate-700 rounded h-3 w-48"></div>
            </div>
          </div>
        </div>
      </div>
    </div>

    <!-- Error State -->
    <div v-else-if="adminStore.error" class="text-center py-16">
      <div class="text-red-400 mb-4">
        <svg class="w-12 h-12 mx-auto" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-2.5L13.732 4c-.77-.833-1.964-.833-2.732 0L4.082 16.5c-.77.833.192 2.5 1.732 2.5z"/></svg>
      </div>
      <p class="text-slate-400 mb-4">{{ adminStore.error }}</p>
      <button class="px-4 py-2 bg-red-600 text-white rounded-lg hover:bg-red-700" @click="retry">Try Again</button>
    </div>

    <!-- Empty State -->
    <div v-else-if="!adminStore.users.length" class="text-center py-16">
      <div class="text-slate-600 mb-4">
        <svg class="w-16 h-16 mx-auto" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="1.5" d="M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857M7 20H2v-2a3 3 0 015.356-1.857M7 20v-2c0-.656.126-1.283.356-1.857m0 0a5.002 5.002 0 019.288 0M15 7a3 3 0 11-6 0 3 3 0 016 0z"/></svg>
      </div>
      <h3 class="text-lg font-medium text-white mb-1">No users found</h3>
      <p class="text-slate-500">Users will appear here once they register on the platform.</p>
    </div>

    <!-- Content -->
    <template v-else>
      <!-- Filters -->
      <div class="bg-slate-900 rounded-2xl border border-slate-800 p-4 flex flex-wrap gap-4">
        <div class="flex-1 min-w-48">
          <input v-model="search" type="text" placeholder="Search by name or email..." class="w-full px-4 py-2.5 bg-slate-800 border border-slate-700 rounded-xl text-sm text-white placeholder-slate-500 focus:outline-none focus:ring-2 focus:ring-red-500" />
        </div>
        <select v-model="roleFilter" class="px-4 py-2.5 bg-slate-800 border border-slate-700 rounded-xl text-sm text-white focus:outline-none">
          <option value="">All Roles</option>
          <option value="freelancer">Freelancer</option>
          <option value="client">Client</option>
          <option value="admin">Admin</option>
        </select>
        <select v-model="statusFilter" class="px-4 py-2.5 bg-slate-800 border border-slate-700 rounded-xl text-sm text-white focus:outline-none">
          <option value="">All Status</option>
          <option value="active">Active</option>
          <option value="banned">Banned</option>
          <option value="suspended">Suspended</option>
        </select>
      </div>

      <!-- Users Table -->
      <div class="bg-slate-900 rounded-2xl border border-slate-800 overflow-hidden">
        <div class="overflow-x-auto">
          <table class="w-full text-sm">
            <thead class="bg-slate-800 border-b border-slate-700">
              <tr>
                <th v-for="col in columns" :key="col" class="py-3 px-5 text-left text-xs font-semibold text-slate-400 uppercase tracking-wide">{{ col }}</th>
              </tr>
            </thead>
            <tbody>
              <tr v-for="user in filteredUsers" :key="user.id" class="border-b border-slate-800 hover:bg-slate-800/50 transition-colors">
                <td class="py-3.5 px-5">
                  <div class="flex items-center gap-3">
                    <UserAvatar :name="`${user.firstName} ${user.lastName}`" size="sm" />
                    <div>
                      <p class="font-medium text-white">{{ user.firstName }} {{ user.lastName }}</p>
                      <p class="text-xs text-slate-400">{{ user.email }}</p>
                    </div>
                  </div>
                </td>
                <td class="py-3.5 px-5">
                  <AppBadge :variant="user.role === 'freelancer' ? 'blue' : user.role === 'client' ? 'green' : 'red'" class="capitalize">
                    {{ user.role }}
                  </AppBadge>
                </td>
                <td class="py-3.5 px-5">
                  <AppBadge :variant="user.isBanned ? 'red' : user.isSuspended ? 'yellow' : 'green'" dot>
                    {{ user.isBanned ? 'banned' : user.isSuspended ? 'suspended' : 'active' }}
                  </AppBadge>
                </td>
                <td class="py-3.5 px-5 text-slate-400">{{ user.createdAt ? formatDate(user.createdAt) : '—' }}</td>
                <td class="py-3.5 px-5">
                  <div class="flex items-center gap-2">
                    <button class="text-xs text-blue-400 hover:text-blue-300 font-medium">View</button>
                    <button
                      v-if="!user.isBanned"
                      class="text-xs text-red-400 hover:text-red-300 font-medium"
                      @click="banUser(user.id)"
                    >
                      Ban
                    </button>
                    <button
                      v-else
                      class="text-xs text-green-400 hover:text-green-300 font-medium"
                      @click="unbanUser(user.id)"
                    >
                      Unban
                    </button>
                    <button class="text-xs text-yellow-400 hover:text-yellow-300 font-medium" @click="suspend(user.id)">Suspend</button>
                  </div>
                </td>
              </tr>
            </tbody>
          </table>
        </div>
      </div>
    </template>
  </div>
</template>

<script setup lang="ts">
import { ref, computed, onMounted } from 'vue'
import { useAdminStore } from '@/stores/admin.store'
import { useFormatters } from '@/composables/useFormatters'
import AppBadge from '@/components/ui/AppBadge.vue'
import UserAvatar from '@/components/common/UserAvatar.vue'

const adminStore = useAdminStore()
const { formatDate } = useFormatters()
const search = ref('')
const roleFilter = ref('')
const statusFilter = ref('')

const columns = ['User', 'Role', 'Status', 'Joined', 'Actions']

const filteredUsers = computed(() =>
  adminStore.users.filter((u) => {
    if (search.value && !`${u.firstName} ${u.lastName} ${u.email}`.toLowerCase().includes(search.value.toLowerCase())) return false
    if (roleFilter.value && u.role !== roleFilter.value) return false
    if (statusFilter.value === 'banned' && !u.isBanned) return false
    if (statusFilter.value === 'suspended' && !u.isSuspended) return false
    if (statusFilter.value === 'active' && (u.isBanned || u.isSuspended)) return false
    return true
  }),
)

async function banUser(id: string): Promise<void> {
  await adminStore.banUser(id, 'Banned by admin')
}

async function unbanUser(id: string): Promise<void> {
  await adminStore.unbanUser(id)
}

async function suspend(id: string): Promise<void> {
  await adminStore.suspendUser(id, 30, 'Suspended by admin')
}

function retry() {
  adminStore.fetchUsers()
}

onMounted(() => {
  retry()
})
</script>
