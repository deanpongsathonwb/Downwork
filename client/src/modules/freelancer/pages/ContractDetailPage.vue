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
      <button class="px-4 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700" @click="retry">Try Again</button>
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
        <p class="text-sm text-slate-500 mt-0.5">Contract with <strong>{{ contract.client?.firstName }} {{ contract.client?.lastName }}</strong></p>
      </div>
      <AppBadge :variant="contract.status === 'active' ? 'green' : contract.status === 'completed' ? 'blue' : 'yellow'" dot>
        {{ contract.status }}
      </AppBadge>
    </div>

    <div class="grid grid-cols-1 lg:grid-cols-3 gap-6">
      <div class="lg:col-span-2 space-y-5">
        <!-- Milestones -->
        <div class="bg-white rounded-2xl border border-slate-200 p-6">
          <h2 class="font-semibold text-slate-900 mb-4">Milestones</h2>
          <div class="space-y-3">
            <div v-for="milestone in contract.milestones" :key="milestone.id" class="border border-slate-200 rounded-xl overflow-hidden">
              <div class="flex items-center gap-4 p-4">
                <div :class="['w-10 h-10 rounded-xl flex items-center justify-center shrink-0', milestoneIconBg(milestone.status)]">
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

              <!-- Milestone Actions (Freelancer) -->
              <div v-if="milestone.status === 'in_progress'" class="px-4 pb-4">
                <AppButton size="sm" class="w-full" @click="openSubmitWork(milestone)">
                  <svg class="w-4 h-4 mr-1.5" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M4 16v1a3 3 0 003 3h10a3 3 0 003-3v-1m-4-8l-4-4m0 0L8 8m4-4v12"/></svg>
                  Submit Work for Review
                </AppButton>
              </div>

              <!-- Submitted State -->
              <div v-else-if="milestone.status === 'submitted'" class="px-4 pb-4 bg-blue-50 border-t border-blue-100">
                <div class="flex items-center gap-2 text-sm text-blue-700 font-medium py-2">
                  <svg class="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z"/></svg>
                  Waiting for client approval...
                </div>
              </div>

              <!-- Rejected State -->
              <div v-else-if="milestone.status === 'rejected'" class="px-4 pb-4 bg-red-50 border-t border-red-100">
                <p class="text-xs text-red-600 py-2 font-medium">Client requested revisions. Please review their feedback and resubmit.</p>
                <AppButton size="sm" variant="outline" @click="openSubmitWork(milestone)">Resubmit</AppButton>
              </div>
            </div>
          </div>
        </div>

        <!-- Contract Messages Quick Access -->
        <div class="bg-white rounded-2xl border border-slate-200 p-6">
          <div class="flex justify-between items-center mb-4">
            <h2 class="font-semibold text-slate-900">Messages</h2>
            <RouterLink to="/freelancer/messages" class="text-xs text-green-600 font-medium hover:text-green-700">Open full chat →</RouterLink>
          </div>
          <div class="space-y-3">
            <div class="flex items-start gap-3">
              <UserAvatar :name="`${contract.client?.firstName} ${contract.client?.lastName}`" size="sm" />
              <div class="flex-1 bg-slate-100 rounded-2xl rounded-tl-sm p-3 text-sm text-slate-700 max-w-xs">
                Hi, can we discuss the project timeline for milestone 2?
              </div>
            </div>
          </div>
          <RouterLink to="/freelancer/messages" class="block mt-3 w-full py-2 border border-slate-200 rounded-xl text-sm text-center text-slate-600 hover:bg-slate-50 transition-colors">
            Open Messages
          </RouterLink>
        </div>
      </div>

      <!-- Sidebar -->
      <div class="space-y-5">
        <!-- Contract Summary -->
        <div class="bg-white rounded-2xl border border-slate-200 p-5">
          <h3 class="font-semibold text-slate-900 mb-4">Contract Summary</h3>
          <dl class="space-y-3">
            <div class="flex justify-between">
              <dt class="text-sm text-slate-500">Total Value</dt>
              <dd class="text-sm font-bold text-slate-900">${{ (contract.totalAmount ?? 0).toLocaleString() }}</dd>
            </div>
            <div class="flex justify-between">
              <dt class="text-sm text-slate-500">Paid Out</dt>
              <dd class="text-sm font-semibold text-green-700">${{ (contract.paidAmount ?? 0).toLocaleString() }}</dd>
            </div>
            <div class="flex justify-between">
              <dt class="text-sm text-slate-500">In Escrow</dt>
              <dd class="text-sm font-semibold text-blue-700">${{ ((contract.totalAmount ?? 0) - (contract.paidAmount ?? 0)).toLocaleString() }}</dd>
            </div>
            <div class="flex justify-between">
              <dt class="text-sm text-slate-500">Start Date</dt>
              <dd class="text-sm font-semibold text-slate-900">{{ formatDate(contract.startDate) }}</dd>
            </div>
          </dl>

          <div class="mt-4">
            <div class="flex justify-between text-xs text-slate-500 mb-1">
              <span>Payment Progress</span>
              <span>{{ (contract.totalAmount ?? 0) > 0 ? Math.round(((contract.paidAmount ?? 0) / (contract.totalAmount ?? 1)) * 100) : 0 }}%</span>
            </div>
            <AppProgressBar :value="(contract.totalAmount ?? 0) > 0 ? ((contract.paidAmount ?? 0) / (contract.totalAmount ?? 1)) * 100 : 0" color="green" size="sm" />
          </div>
        </div>

        <!-- Client Card -->
        <div class="bg-white rounded-2xl border border-slate-200 p-5">
          <h3 class="font-semibold text-slate-900 mb-3">Client</h3>
          <div class="flex items-center gap-3 mb-3">
            <UserAvatar :name="`${contract.client?.firstName} ${contract.client?.lastName}`" size="md" />
            <div>
              <p class="font-medium text-slate-900 text-sm">{{ contract.client?.firstName }} {{ contract.client?.lastName }}</p>
              <div class="flex items-center gap-1 text-xs text-green-600 font-medium mt-0.5">
                <svg class="w-3 h-3" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 12l2 2 4-4m5.618-4.016A11.955 11.955 0 0112 2.944a11.955 11.955 0 01-8.618 3.04A12.02 12.02 0 003 9c0 5.591 3.824 10.29 9 11.622 5.176-1.332 9-6.03 9-11.622 0-1.042-.133-2.052-.382-3.016z"/></svg>
                Payment Verified
              </div>
            </div>
          </div>
          <RouterLink to="/freelancer/messages">
            <AppButton variant="outline" size="sm" class="w-full">Message Client</AppButton>
          </RouterLink>
        </div>

        <!-- Contract Actions -->
        <div class="bg-white rounded-2xl border border-slate-200 p-5 space-y-2">
          <h3 class="font-semibold text-slate-900 mb-3">Actions</h3>
          <RouterLink v-if="contract.status === 'completed'" :to="`/freelancer/contracts/${contract.id}/review`">
            <AppButton class="w-full" size="sm">Leave a Review</AppButton>
          </RouterLink>
          <AppButton variant="outline" size="sm" class="w-full" @click="showDisputeModal = true">
            <svg class="w-4 h-4 mr-1.5 text-red-500" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z"/></svg>
            File a Dispute
          </AppButton>
          <AppButton variant="ghost" size="sm" class="w-full text-red-500 hover:bg-red-50" @click="showTerminateModal = true">
            Request Termination
          </AppButton>
        </div>
      </div>
    </div>
    </template>
  </div>

  <!-- Submit Work Modal -->
  <AppModal v-model="showSubmitModal" title="Submit Work" size="md">
    <div class="space-y-4">
      <div v-if="selectedMilestone" class="p-3 bg-blue-50 rounded-xl border border-blue-200">
        <p class="text-sm font-semibold text-blue-800">{{ selectedMilestone.title }}</p>
        <p class="text-sm font-bold text-blue-700 mt-0.5">${{ selectedMilestone.amount.toLocaleString() }}</p>
      </div>
      <AppTextarea v-model="submitForm.description" label="Describe your deliverables" placeholder="Explain what you've completed, any important notes, and how to review the work..." :rows="4" required />
      <AppFileUpload label="Attach Deliverables" hint="Upload your completed work files · Max 10 files, 50MB each" :multiple="true" @change="submitForm.files = $event" />
      <AppInput v-model="submitForm.liveUrl" label="Live URL (optional)" placeholder="https://your-demo.com" />
    </div>
    <template #footer>
      <AppButton variant="outline" @click="showSubmitModal = false">Cancel</AppButton>
      <AppButton :loading="submittingWork" @click="submitWork">Submit for Review</AppButton>
    </template>
  </AppModal>

  <!-- Dispute Modal -->
  <AppModal v-model="showDisputeModal" title="File a Dispute" size="md">
    <div class="space-y-4">
      <div class="p-3 bg-red-50 rounded-xl border border-red-200 text-sm text-red-700">
        Filing a dispute will pause this contract and notify our mediation team. Please only use this for genuine issues that couldn't be resolved through communication.
      </div>
      <AppSelect v-model="disputeForm.reason" label="Reason for Dispute *" :options="disputeReasons" />
      <AppTextarea v-model="disputeForm.description" label="Describe the Issue *" placeholder="Provide details about the dispute including timeline, what was agreed, and what went wrong..." :rows="5" />
      <AppFileUpload label="Evidence (optional)" hint="Screenshots, messages, or documents supporting your claim" :multiple="true" @change="disputeForm.files = $event" />
    </div>
    <template #footer>
      <AppButton variant="outline" @click="showDisputeModal = false">Cancel</AppButton>
      <AppButton variant="danger" :loading="filingDispute" @click="fileDispute">File Dispute</AppButton>
    </template>
  </AppModal>

  <!-- Terminate Modal -->
  <AppConfirmModal
    v-model="showTerminateModal"
    title="Request Contract Termination"
    message="Are you sure you want to request termination? This will notify the client and our team. Any unpaid milestones will be reviewed for partial payment eligibility."
    confirm-label="Request Termination"
    confirm-variant="danger"
    :loading="terminating"
    @confirm="terminateContract"
  />
</template>

<script setup lang="ts">
import { ref, reactive, computed, onMounted } from 'vue'
import { RouterLink, useRouter, useRoute } from 'vue-router'
import { useContractStore } from '@/stores/contract.store'
import { useToastStore } from '@/stores/toast.store'
import { useFormatters } from '@/composables/useFormatters'
import type { Contract, Milestone } from '@/types'
import AppBadge from '@/components/ui/AppBadge.vue'
import AppButton from '@/components/ui/AppButton.vue'
import AppModal from '@/components/ui/AppModal.vue'
import AppConfirmModal from '@/components/ui/AppConfirmModal.vue'
import AppTextarea from '@/components/ui/AppTextarea.vue'
import AppInput from '@/components/ui/AppInput.vue'
import AppSelect from '@/components/ui/AppSelect.vue'
import AppProgressBar from '@/components/ui/AppProgressBar.vue'
import AppFileUpload from '@/components/ui/AppFileUpload.vue'
import UserAvatar from '@/components/common/UserAvatar.vue'

const router = useRouter()
const route = useRoute()
const contractStore = useContractStore()
const toast = useToastStore()
const { formatDate } = useFormatters()

const showSubmitModal = ref(false)
const showDisputeModal = ref(false)
const showTerminateModal = ref(false)
const submittingWork = ref(false)
const filingDispute = ref(false)
const terminating = ref(false)
const selectedMilestone = ref<Milestone | null>(null)

const submitForm = reactive({ description: '', files: [] as File[], liveUrl: '' })
const disputeForm = reactive({ reason: '', description: '', files: [] as File[] })

const disputeReasons = [
  { label: 'Client not responding', value: 'no_response' },
  { label: 'Scope changed without agreement', value: 'scope_change' },
  { label: 'Payment not released after approval', value: 'payment_withheld' },
  { label: 'Unreasonable revision requests', value: 'revisions' },
  { label: 'Contract terms violated', value: 'terms_violated' },
  { label: 'Other', value: 'other' },
]

const emptyContract: Contract = {
  id: '', jobId: '', clientId: '', freelancerId: '', proposalId: '',
  title: '', description: '', status: 'active', type: 'fixed',
  startDate: '', totalAmount: 0, paidAmount: 0, currency: 'USD',
  milestones: [], createdAt: '', updatedAt: '',
}

const contract = computed<Contract>(() => contractStore.selectedContract ?? emptyContract)

function retry() {
  const id = route.params.id as string
  if (id) contractStore.fetchContract(id)
}

onMounted(() => {
  retry()
})

function openSubmitWork(milestone: Milestone) {
  selectedMilestone.value = milestone
  showSubmitModal.value = true
}

async function submitWork() {
  if (!submitForm.description.trim()) {
    toast.error('Description required', 'Please describe your deliverables.')
    return
  }
  submittingWork.value = true
  const success = await contractStore.submitMilestone(contract.value.id, selectedMilestone.value!.id, submitForm.description)
  submittingWork.value = false
  if (success) {
    showSubmitModal.value = false
    Object.assign(submitForm, { description: '', files: [], liveUrl: '' })
  }
}

async function fileDispute() {
  if (!disputeForm.reason || !disputeForm.description.trim()) {
    toast.error('Please fill all required fields.')
    return
  }
  filingDispute.value = true
  const success = await contractStore.openDispute(contract.value.id, disputeForm.reason, disputeForm.description)
  filingDispute.value = false
  if (success) showDisputeModal.value = false
}

async function terminateContract() {
  terminating.value = true
  const success = await contractStore.endContract(contract.value.id)
  terminating.value = false
  if (success) showTerminateModal.value = false
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
