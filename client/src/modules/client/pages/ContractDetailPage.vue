<template>
  <div class="space-y-6 max-w-4xl">
    <!-- Loading State -->
    <div v-if="contractStore.isLoadingDetail" class="space-y-6">
      <div class="animate-pulse flex items-center gap-4">
        <div class="w-10 h-10 bg-slate-200 rounded-xl"></div>
        <div class="flex-1">
          <div class="bg-slate-200 rounded h-6 w-64 mb-2"></div>
          <div class="bg-slate-200 rounded h-4 w-40"></div>
        </div>
      </div>
      <div class="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <div class="lg:col-span-2 space-y-5">
          <div class="animate-pulse bg-white rounded-2xl border border-slate-200 p-6 h-64"></div>
        </div>
        <div class="animate-pulse bg-white rounded-2xl border border-slate-200 p-5 h-48"></div>
      </div>
    </div>

    <!-- Error State -->
    <div v-else-if="contractStore.error" class="text-center py-16">
      <div class="text-red-400 mb-4">
        <svg class="w-12 h-12 mx-auto" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-2.5L13.732 4c-.77-.833-1.964-.833-2.732 0L4.082 16.5c-.77.833.192 2.5 1.732 2.5z"/></svg>
      </div>
      <p class="text-gray-600 mb-4">{{ contractStore.error }}</p>
      <button class="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700" @click="retry">Try Again</button>
    </div>

    <!-- Content -->
    <template v-else>
    <div class="flex items-center gap-4">
      <button class="p-2 rounded-xl hover:bg-slate-100 transition-colors" @click="router.back()">
        <svg class="w-5 h-5 text-slate-600" fill="none" viewBox="0 0 24 24" stroke="currentColor">
          <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M15 19l-7-7 7-7" />
        </svg>
      </button>
      <div class="flex-1">
        <h1 class="text-2xl font-bold text-slate-900">{{ contract.title }}</h1>
        <p class="text-sm text-slate-500 mt-0.5">Contract with <strong>{{ contract.freelancer?.firstName }} {{ contract.freelancer?.lastName }}</strong></p>
      </div>
      <AppBadge :variant="contract.status === 'active' ? 'green' : contract.status === 'completed' ? 'blue' : 'yellow'" dot>
        {{ contract.status }}
      </AppBadge>
    </div>

    <div class="grid grid-cols-1 lg:grid-cols-3 gap-6">
      <div class="lg:col-span-2 space-y-5">
        <!-- Milestones -->
        <div class="bg-white rounded-2xl border border-slate-200 p-6">
          <div class="flex justify-between items-center mb-4">
            <h2 class="font-semibold text-slate-900">Milestones</h2>
            <p class="text-sm text-slate-500">{{ (contract.paidAmount ?? 0).toLocaleString() }} / ${{ (contract.totalAmount ?? 0).toLocaleString() }} paid</p>
          </div>
          <div class="space-y-3">
            <div v-for="milestone in contract.milestones" :key="milestone.id" class="border border-slate-200 rounded-xl overflow-hidden">
              <div class="flex items-start gap-4 p-4">
                <div :class="['w-10 h-10 rounded-xl flex items-center justify-center shrink-0 mt-0.5', milestoneIconBg(milestone.status)]">
                  <svg :class="['w-5 h-5', milestoneIconColor(milestone.status)]" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" :d="milestoneIconPath(milestone.status)" />
                  </svg>
                </div>
                <div class="flex-1 min-w-0">
                  <p class="font-medium text-slate-900 text-sm">{{ milestone.title }}</p>
                  <p class="text-xs text-slate-500 mt-0.5">{{ milestone.description }}</p>
                  <p class="text-xs text-slate-400 mt-0.5">Due: {{ milestone.dueDate || 'No deadline' }}</p>
                </div>
                <div class="text-right shrink-0">
                  <p class="font-semibold text-slate-900 text-sm">${{ milestone.amount.toLocaleString() }}</p>
                  <AppBadge :variant="milestoneVariant(milestone.status)" class="mt-1 capitalize">{{ milestone.status.replace('_', ' ') }}</AppBadge>
                </div>
              </div>

              <!-- Submitted — Awaiting Client Review -->
              <div v-if="milestone.status === 'submitted'" class="px-4 pb-4 border-t border-blue-100 bg-blue-50">
                <p class="text-xs font-semibold text-blue-700 py-2 mb-2">
                  <svg class="w-3.5 h-3.5 inline mr-1" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2"/></svg>
                  Freelancer submitted work — please review
                </p>
                <div class="flex gap-2">
                  <AppButton size="sm" :loading="approvingId === milestone.id" @click="approveMilestone(milestone)">
                    <svg class="w-4 h-4 mr-1" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M5 13l4 4L19 7"/></svg>
                    Approve & Release ${{ milestone.amount.toLocaleString() }}
                  </AppButton>
                  <AppButton variant="outline" size="sm" @click="openRevision(milestone)">Request Revision</AppButton>
                </div>
              </div>

              <!-- Approved -->
              <div v-else-if="milestone.status === 'approved'" class="px-4 pb-4 border-t border-green-100 bg-green-50">
                <p class="text-xs text-green-700 font-medium py-2">✓ Approved & payment released on {{ milestone.completedAt ? formatDate(milestone.completedAt) : 'N/A' }}</p>
              </div>
            </div>

            <!-- Add Milestone -->
            <button class="w-full py-3 border-2 border-dashed border-slate-300 rounded-xl text-sm text-slate-500 hover:border-blue-400 hover:text-blue-600 transition-colors font-medium" @click="showAddMilestoneModal = true">
              + Add Milestone
            </button>
          </div>
        </div>

        <!-- Messages Quick Access -->
        <div class="bg-white rounded-2xl border border-slate-200 p-6">
          <div class="flex justify-between items-center mb-3">
            <h2 class="font-semibold text-slate-900">Messages</h2>
            <RouterLink to="/client/messages" class="text-xs text-green-600 font-medium hover:text-green-700">Open full chat →</RouterLink>
          </div>
          <RouterLink to="/client/messages" class="block w-full py-2 border border-slate-200 rounded-xl text-sm text-center text-slate-600 hover:bg-slate-50 transition-colors">
            Chat with Freelancer
          </RouterLink>
        </div>
      </div>

      <!-- Sidebar -->
      <div class="space-y-5">
        <!-- Summary -->
        <div class="bg-white rounded-2xl border border-slate-200 p-5">
          <h3 class="font-semibold text-slate-900 mb-4">Contract Summary</h3>
          <dl class="space-y-3">
            <div class="flex justify-between">
              <dt class="text-sm text-slate-500">Total Value</dt>
              <dd class="text-sm font-bold text-slate-900">${{ (contract.totalAmount ?? 0).toLocaleString() }}</dd>
            </div>
            <div class="flex justify-between">
              <dt class="text-sm text-slate-500">Released</dt>
              <dd class="text-sm font-semibold text-green-700">${{ (contract.paidAmount ?? 0).toLocaleString() }}</dd>
            </div>
            <div class="flex justify-between">
              <dt class="text-sm text-slate-500">In Escrow</dt>
              <dd class="text-sm font-semibold text-blue-600">${{ ((contract.totalAmount ?? 0) - (contract.paidAmount ?? 0)).toLocaleString() }}</dd>
            </div>
            <div class="flex justify-between">
              <dt class="text-sm text-slate-500">Start Date</dt>
              <dd class="text-sm font-semibold text-slate-900">{{ formatDate(contract.startDate) }}</dd>
            </div>
          </dl>
          <div class="mt-4">
            <div class="flex justify-between text-xs text-slate-500 mb-1">
              <span>Progress</span>
              <span>{{ (contract.totalAmount ?? 0) > 0 ? Math.round(((contract.paidAmount ?? 0) / (contract.totalAmount ?? 1)) * 100) : 0 }}%</span>
            </div>
            <AppProgressBar :value="(contract.totalAmount ?? 0) > 0 ? ((contract.paidAmount ?? 0) / (contract.totalAmount ?? 1)) * 100 : 0" color="blue" size="sm" />
          </div>
        </div>

        <!-- Freelancer Card -->
        <div class="bg-white rounded-2xl border border-slate-200 p-5">
          <h3 class="font-semibold text-slate-900 mb-3">Freelancer</h3>
          <div class="flex items-center gap-3 mb-3">
            <UserAvatar :name="`${contract.freelancer?.firstName} ${contract.freelancer?.lastName}`" size="md" />
            <div>
              <p class="font-medium text-slate-900 text-sm">{{ contract.freelancer?.firstName }} {{ contract.freelancer?.lastName }}</p>
            </div>
          </div>
          <RouterLink :to="`/freelancers/${contract.freelancerId}`">
            <AppButton variant="outline" size="sm" class="w-full mb-2">View Profile</AppButton>
          </RouterLink>
          <RouterLink to="/client/messages">
            <AppButton variant="ghost" size="sm" class="w-full">Message</AppButton>
          </RouterLink>
        </div>

        <!-- Actions -->
        <div class="bg-white rounded-2xl border border-slate-200 p-5 space-y-2">
          <h3 class="font-semibold text-slate-900 mb-3">Actions</h3>
          <RouterLink v-if="contract.status === 'completed'" :to="`/client/contracts/${contract.id}/review`">
            <AppButton class="w-full" size="sm">Leave a Review</AppButton>
          </RouterLink>
          <AppButton variant="outline" size="sm" class="w-full" @click="downloadInvoice">
            <svg class="w-4 h-4 mr-1.5" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M4 16v1a3 3 0 003 3h10a3 3 0 003-3v-1m-4-4l-4 4m0 0l-4-4m4 4V4"/></svg>
            Download Invoice
          </AppButton>
          <AppButton variant="outline" size="sm" class="w-full text-red-500 hover:bg-red-50 border-red-200" @click="showDisputeModal = true">
            File a Dispute
          </AppButton>
        </div>
      </div>
    </div>
    </template>
  </div>

  <!-- Revision Modal -->
  <AppModal v-model="showRevisionModal" title="Request Revision" size="sm">
    <div class="space-y-3">
      <p class="text-sm text-slate-600">Describe what needs to be changed or improved:</p>
      <AppTextarea v-model="revisionNote" placeholder="Please revise X because..." :rows="4" required />
    </div>
    <template #footer>
      <AppButton variant="outline" @click="showRevisionModal = false">Cancel</AppButton>
      <AppButton :loading="requestingRevision" @click="submitRevision">Send Revision Request</AppButton>
    </template>
  </AppModal>

  <!-- Add Milestone Modal -->
  <AppModal v-model="showAddMilestoneModal" title="Add Milestone" size="sm">
    <div class="space-y-3">
      <AppInput v-model="newMilestone.title" label="Milestone Title" required />
      <AppTextarea v-model="newMilestone.description" label="Description" :rows="2" />
      <div class="grid grid-cols-2 gap-3">
        <AppInput v-model="newMilestone.amount" type="number" label="Amount (USD)" />
        <AppDatePicker v-model="newMilestone.dueDate" label="Due Date" />
      </div>
    </div>
    <template #footer>
      <AppButton variant="outline" @click="showAddMilestoneModal = false">Cancel</AppButton>
      <AppButton @click="addMilestone">Add Milestone</AppButton>
    </template>
  </AppModal>

  <!-- Dispute Modal -->
  <AppModal v-model="showDisputeModal" title="File a Dispute" size="md">
    <div class="space-y-4">
      <div class="p-3 bg-amber-50 rounded-xl border border-amber-200 text-sm text-amber-800">
        A dispute will pause the contract and notify our mediation team. Please try to resolve the issue through messages first.
      </div>
      <AppSelect v-model="disputeForm.reason" label="Reason *" :options="disputeReasons" />
      <AppTextarea v-model="disputeForm.description" label="Description *" :rows="4" />
      <AppFileUpload label="Evidence (optional)" :multiple="true" @change="disputeForm.files = $event" />
    </div>
    <template #footer>
      <AppButton variant="outline" @click="showDisputeModal = false">Cancel</AppButton>
      <AppButton variant="danger" :loading="filingDispute" @click="fileDispute">File Dispute</AppButton>
    </template>
  </AppModal>
</template>

<script setup lang="ts">
import { ref, reactive, computed, onMounted } from 'vue'
import { RouterLink, useRouter, useRoute } from 'vue-router'
import { useToastStore } from '@/stores/toast.store'
import { useContractStore } from '@/stores/contract.store'
import { useFormatters } from '@/composables/useFormatters'
import type { Milestone } from '@/types'
import AppBadge from '@/components/ui/AppBadge.vue'
import AppButton from '@/components/ui/AppButton.vue'
import AppModal from '@/components/ui/AppModal.vue'
import AppInput from '@/components/ui/AppInput.vue'
import AppTextarea from '@/components/ui/AppTextarea.vue'
import AppSelect from '@/components/ui/AppSelect.vue'
import AppDatePicker from '@/components/ui/AppDatePicker.vue'
import AppProgressBar from '@/components/ui/AppProgressBar.vue'
import AppFileUpload from '@/components/ui/AppFileUpload.vue'
import UserAvatar from '@/components/common/UserAvatar.vue'

const router = useRouter()
const route = useRoute()
const toast = useToastStore()
const contractStore = useContractStore()
const { formatDate } = useFormatters()

const approvingId = ref<string | null>(null)
const showRevisionModal = ref(false)
const showDisputeModal = ref(false)
const showAddMilestoneModal = ref(false)
const requestingRevision = ref(false)
const filingDispute = ref(false)
const revisionNote = ref('')
const selectedMilestone = ref<Milestone | null>(null)

const disputeForm = reactive({ reason: '', description: '', files: [] as File[] })
const newMilestone = reactive({ title: '', description: '', amount: 0, dueDate: '' })

const disputeReasons = [
  { label: 'Work quality does not meet requirements', value: 'quality' },
  { label: 'Missed deadlines', value: 'deadline' },
  { label: 'Freelancer not communicating', value: 'no_response' },
  { label: 'Work not delivered', value: 'not_delivered' },
  { label: 'Other', value: 'other' },
]

function retry() {
  const id = route.params.id as string
  if (id) contractStore.fetchContract(id)
}

onMounted(() => {
  retry()
})

const contract = computed(() => contractStore.selectedContract ?? {
  id: '', title: '', status: '', freelancer: null, freelancerId: '',
  totalAmount: 0, paidAmount: 0, startDate: '', milestones: [],
} as any)

async function approveMilestone(milestone: Milestone) {
  approvingId.value = milestone.id
  await contractStore.approveMilestone(contract.value.id, milestone.id)
  approvingId.value = null
}

function openRevision(milestone: Milestone) {
  selectedMilestone.value = milestone
  showRevisionModal.value = true
}

async function submitRevision() {
  if (!selectedMilestone.value) return
  requestingRevision.value = true
  await contractStore.requestRevision(contract.value.id, selectedMilestone.value.id, revisionNote.value)
  requestingRevision.value = false
  showRevisionModal.value = false
  revisionNote.value = ''
}

async function addMilestone() {
  if (!newMilestone.title) return
  const ok = await contractStore.addMilestone(contract.value.id, {
    title: newMilestone.title,
    description: newMilestone.description,
    amount: newMilestone.amount,
    dueDate: newMilestone.dueDate || undefined,
  })
  if (ok) {
    Object.assign(newMilestone, { title: '', description: '', amount: 0, dueDate: '' })
    showAddMilestoneModal.value = false
  }
}

async function fileDispute() {
  filingDispute.value = true
  await contractStore.openDispute(contract.value.id, disputeForm.reason, disputeForm.description)
  filingDispute.value = false
  showDisputeModal.value = false
}

function downloadInvoice() {
  toast.info('Download Started', 'Invoice PDF will download shortly.')
}

function milestoneVariant(status: string): 'green' | 'blue' | 'yellow' | 'slate' | 'red' {
  const m: Record<string, 'green' | 'blue' | 'yellow' | 'slate' | 'red'> = { approved: 'green', submitted: 'blue', in_progress: 'yellow', pending: 'slate', rejected: 'red' }
  return m[status] ?? 'slate'
}
function milestoneIconBg(status: string): string {
  return { approved: 'bg-green-100', submitted: 'bg-blue-100', in_progress: 'bg-yellow-100', pending: 'bg-slate-100', rejected: 'bg-red-100' }[status] ?? 'bg-slate-100'
}
function milestoneIconColor(status: string): string {
  return { approved: 'text-green-600', submitted: 'text-blue-600', in_progress: 'text-yellow-600', pending: 'text-slate-400', rejected: 'text-red-600' }[status] ?? 'text-slate-400'
}
function milestoneIconPath(status: string): string {
  if (status === 'approved') return 'M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z'
  if (status === 'rejected') return 'M10 14l2-2m0 0l2-2m-2 2l-2-2m2 2l2 2m7-2a9 9 0 11-18 0 9 9 0 0118 0z'
  if (status === 'submitted') return 'M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2'
  return 'M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z'
}
</script>
