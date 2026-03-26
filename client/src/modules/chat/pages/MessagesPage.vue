<template>
  <div class="flex h-[calc(100vh-8rem)] bg-white rounded-2xl border border-slate-200 overflow-hidden">
    <!-- CONVERSATION LIST -->
    <div
      :class="[
        'flex flex-col border-r border-slate-200 transition-all',
        chat.activeConversationId
          ? 'hidden md:flex w-72 lg:w-80 shrink-0'
          : 'flex flex-1 md:w-72 lg:w-80 md:flex-none',
      ]"
    >
      <div class="p-4 border-b border-slate-200">
        <h2 class="font-semibold text-slate-900 mb-3">Messages</h2>
        <div class="relative">
          <input
            v-model="searchQuery"
            type="text"
            placeholder="Search conversations..."
            class="w-full pl-9 pr-3 py-2 border border-slate-200 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-green-500 bg-slate-50"
          />
          <svg class="w-4 h-4 text-slate-400 absolute left-3 top-2.5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
          </svg>
        </div>
      </div>

      <div class="flex-1 overflow-y-auto">
        <!-- Loading skeletons -->
        <div v-if="chat.isLoading && !chat.conversations.length" class="p-3 space-y-2">
          <div v-for="i in 4" :key="i" class="h-16 bg-slate-100 rounded-xl animate-pulse" />
        </div>

        <button
          v-for="conv in filteredConversations"
          :key="conv.id"
          :class="[
            'w-full flex items-center gap-3 px-4 py-3 hover:bg-slate-50 transition-colors text-left border-b border-slate-50',
            chat.activeConversationId === conv.id ? 'bg-green-50' : '',
          ]"
          @click="openConversation(conv.id)"
        >
          <div class="relative shrink-0">
            <UserAvatar :name="getOtherParticipant(conv)?.firstName ?? 'User'" size="md" />
            <span class="absolute bottom-0 right-0 w-3 h-3 bg-green-400 rounded-full border-2 border-white" />
          </div>
          <div class="flex-1 min-w-0">
            <div class="flex justify-between items-baseline mb-0.5">
              <p class="font-medium text-sm text-slate-900 truncate">
                {{ getOtherParticipant(conv)?.firstName }} {{ getOtherParticipant(conv)?.lastName }}
              </p>
              <p class="text-xs text-slate-400 shrink-0 ml-2">{{ formatTime(conv.updatedAt) }}</p>
            </div>
            <p class="text-xs text-slate-500 truncate">{{ conv.lastMessage?.content || 'No messages yet' }}</p>
          </div>
          <div
            v-if="conv.unreadCount"
            class="w-5 h-5 bg-green-500 text-white text-xs rounded-full flex items-center justify-center font-semibold shrink-0"
          >
            {{ conv.unreadCount }}
          </div>
        </button>

        <div v-if="!chat.isLoading && !chat.conversations.length" class="p-6 text-center text-slate-400 text-sm">
          No conversations yet.
        </div>
      </div>
    </div>

    <!-- CHAT WINDOW -->
    <div :class="['flex-1 flex flex-col', !chat.activeConversationId ? 'hidden md:flex' : 'flex']">
      <template v-if="chat.activeConversationId">
        <!-- Chat Header -->
        <div class="h-16 flex items-center gap-3 px-4 border-b border-slate-200 shrink-0">
          <button class="md:hidden p-2 rounded-lg hover:bg-slate-100" @click="closeConversation">
            <svg class="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M15 19l-7-7 7-7" />
            </svg>
          </button>
          <UserAvatar :name="activeParticipantName" size="sm" />
          <div>
            <p class="font-semibold text-slate-900 text-sm">{{ activeParticipantName }}</p>
            <p class="text-xs text-green-500 flex items-center gap-1">
              <span class="w-1.5 h-1.5 bg-green-500 rounded-full" /> Online
            </p>
          </div>
          <div class="ml-auto flex items-center gap-2">
            <button
              class="p-2 rounded-lg text-slate-400 hover:text-slate-600 hover:bg-slate-100 transition-colors"
              title="Send an Offer"
              @click="showOffer = true"
            >
              <svg class="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
              </svg>
            </button>
          </div>
        </div>

        <!-- Messages -->
        <div ref="messagesContainer" class="flex-1 overflow-y-auto p-4 space-y-4">
          <div v-if="chat.isLoading" class="flex justify-center py-4">
            <div class="w-6 h-6 border-2 border-green-500 border-t-transparent rounded-full animate-spin" />
          </div>

          <div
            v-for="msg in chat.activeMessages"
            :key="msg.id"
            :class="['flex gap-3', msg.senderId === auth.user?.id ? 'flex-row-reverse' : 'flex-row']"
          >
            <UserAvatar :name="msg.sender?.firstName ?? 'U'" size="sm" class="shrink-0 mt-1" />
            <div
              :class="[
                'max-w-sm flex flex-col gap-1',
                msg.senderId === auth.user?.id ? 'items-end' : 'items-start',
              ]"
            >
              <!-- Offer message -->
              <div v-if="msg.type === 'offer' && msg.offer" class="bg-green-50 border border-green-200 rounded-2xl p-4 text-sm">
                <p class="font-semibold text-green-800 mb-1">📋 Job Offer</p>
                <p class="font-bold text-green-700 text-lg">${{ msg.offer.amount }}</p>
                <p class="text-green-600 text-xs mt-1">{{ msg.offer.description }}</p>
                <div v-if="msg.offer.status === 'pending'" class="flex gap-2 mt-3">
                  <button class="px-3 py-1.5 bg-green-600 text-white text-xs rounded-lg font-medium hover:bg-green-700">Accept</button>
                  <button class="px-3 py-1.5 border border-red-300 text-red-600 text-xs rounded-lg font-medium hover:bg-red-50">Decline</button>
                </div>
                <AppBadge v-else :variant="msg.offer.status === 'accepted' ? 'green' : 'red'" class="mt-2">
                  {{ msg.offer.status }}
                </AppBadge>
              </div>

              <!-- File attachment -->
              <div v-else-if="msg.type === 'file' && msg.attachments?.length" class="space-y-1">
                <a
                  v-for="att in msg.attachments"
                  :key="att.id"
                  :href="att.url"
                  target="_blank"
                  rel="noopener noreferrer"
                  class="flex items-center gap-3 px-4 py-3 bg-slate-100 border border-slate-200 rounded-2xl text-sm text-slate-700 hover:bg-slate-200 transition-colors"
                >
                  <svg class="w-5 h-5 text-slate-500 shrink-0" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M15.172 7l-6.586 6.586a2 2 0 102.828 2.828l6.414-6.586a4 4 0 00-5.656-5.656l-6.415 6.585a6 6 0 108.486 8.486L20.5 13" />
                  </svg>
                  <div class="min-w-0">
                    <p class="font-medium truncate">{{ att.name }}</p>
                    <p class="text-xs text-slate-400">{{ formatFileSize(att.size) }}</p>
                  </div>
                </a>
              </div>

              <!-- Regular text message -->
              <div
                v-else
                :class="[
                  'px-4 py-2.5 rounded-2xl text-sm leading-relaxed',
                  msg.senderId === auth.user?.id ? 'bg-green-600 text-white' : 'bg-slate-100 text-slate-900',
                ]"
              >
                {{ msg.content }}
              </div>

              <p class="text-xs text-slate-400">{{ formatTime(msg.createdAt) }}</p>
            </div>
          </div>
        </div>

        <!-- Input Area -->
        <div class="p-4 border-t border-slate-200 bg-white">
          <!-- Pending file preview -->
          <div v-if="pendingFile" class="mb-3 flex items-center gap-3 p-3 bg-slate-50 rounded-xl border border-slate-200">
            <svg class="w-5 h-5 text-green-600 shrink-0" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M15.172 7l-6.586 6.586a2 2 0 102.828 2.828l6.414-6.586a4 4 0 00-5.656-5.656l-6.415 6.585a6 6 0 108.486 8.486L20.5 13" />
            </svg>
            <div class="flex-1 min-w-0">
              <p class="text-sm font-medium text-slate-900 truncate">{{ pendingFile.name }}</p>
              <p class="text-xs text-slate-400">{{ formatFileSize(pendingFile.size) }}</p>
            </div>
            <button class="p-1 text-slate-400 hover:text-red-500 transition-colors" @click="clearPendingFile">
              <svg class="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M6 18L18 6M6 6l12 12" />
              </svg>
            </button>
          </div>

          <div class="flex items-end gap-3">
            <!-- File attach button -->
            <label
              class="p-2.5 text-slate-400 hover:text-green-600 cursor-pointer transition-colors shrink-0"
              title="Attach a file"
            >
              <svg class="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M15.172 7l-6.586 6.586a2 2 0 102.828 2.828l6.414-6.586a4 4 0 00-5.656-5.656l-6.415 6.585a6 6 0 108.486 8.486L20.5 13" />
              </svg>
              <input ref="fileInput" type="file" class="hidden" @change="handleFileSelect" />
            </label>

            <!-- Message input -->
            <div class="flex-1 border border-slate-200 rounded-2xl overflow-hidden focus-within:ring-2 focus-within:ring-green-500 focus-within:border-transparent">
              <textarea
                v-model="newMessage"
                placeholder="Type a message..."
                rows="1"
                class="w-full px-4 py-2.5 text-sm resize-none focus:outline-none"
                @keydown.enter.exact.prevent="handleSend"
              />
            </div>

            <!-- Send button -->
            <AppButton
              size="sm"
              class="shrink-0"
              :disabled="!newMessage.trim() && !pendingFile"
              :loading="chat.isSending || isUploading"
              @click="handleSend"
            >
              <svg class="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 19l9 2-9-18-9 18 9-2zm0 0v-8" />
              </svg>
            </AppButton>
          </div>
        </div>
      </template>

      <!-- Empty State -->
      <div v-else class="flex-1 flex items-center justify-center">
        <div class="text-center">
          <p class="text-5xl mb-4">💬</p>
          <h3 class="text-lg font-semibold text-slate-900 mb-2">Select a conversation</h3>
          <p class="text-sm text-slate-500">Choose from your conversations on the left.</p>
        </div>
      </div>
    </div>
  </div>

  <!-- Send Offer Modal -->
  <AppModal v-model="showOffer" title="Send an Offer" size="sm">
    <div class="space-y-4">
      <AppInput v-model="offerForm.jobTitle" label="Job Title" placeholder="e.g. Frontend Development" required />
      <AppInput v-model="offerForm.amount" type="number" label="Amount (USD)" placeholder="0" required />
      <AppSelect
        v-model="offerForm.type"
        label="Type"
        :options="[
          { label: 'Fixed Price', value: 'fixed' },
          { label: 'Hourly Rate', value: 'hourly' },
        ]"
      />
      <AppTextarea v-model="offerForm.description" label="Description" :rows="3" placeholder="Describe the work scope..." />
    </div>
    <template #footer>
      <AppButton variant="outline" @click="showOffer = false">Cancel</AppButton>
      <AppButton :loading="isSendingOffer" :disabled="!offerForm.jobTitle || !offerForm.amount" @click="sendOffer">
        Send Offer
      </AppButton>
    </template>
  </AppModal>
</template>

<script setup lang="ts">
import { ref, computed, reactive, onMounted, nextTick, watch } from 'vue'
import { useAuthStore } from '@/stores/auth.store'
import { useChatStore } from '@/stores/chat.store'
import { useFormatters } from '@/composables/useFormatters'
import { chatService } from '@/services/api/chat.service'
import type { Conversation } from '@/types'
import AppBadge from '@/components/ui/AppBadge.vue'
import AppButton from '@/components/ui/AppButton.vue'
import AppInput from '@/components/ui/AppInput.vue'
import AppTextarea from '@/components/ui/AppTextarea.vue'
import AppSelect from '@/components/ui/AppSelect.vue'
import AppModal from '@/components/ui/AppModal.vue'
import UserAvatar from '@/components/common/UserAvatar.vue'

const auth = useAuthStore()
const chat = useChatStore()
const { formatFileSize, formatTime } = useFormatters()

const messagesContainer = ref<HTMLElement | null>(null)
const fileInput = ref<HTMLInputElement | null>(null)
const newMessage = ref('')
const searchQuery = ref('')
const pendingFile = ref<File | null>(null)
const isUploading = ref(false)
const showOffer = ref(false)
const isSendingOffer = ref(false)

const offerForm = reactive({ jobTitle: '', amount: 0, type: 'fixed', description: '' })

// ── LIFECYCLE ────────────────────────────────────────────────

onMounted(() => {
  chat.fetchConversations()
})

// ── COMPUTED ─────────────────────────────────────────────────

const filteredConversations = computed<Conversation[]>(() => {
  if (!searchQuery.value.trim()) return chat.conversations
  const q = searchQuery.value.toLowerCase()
  return chat.conversations.filter((c) => {
    const other = getOtherParticipant(c)
    const name = `${other?.firstName ?? ''} ${other?.lastName ?? ''}`.toLowerCase()
    return name.includes(q) || c.lastMessage?.content?.toLowerCase().includes(q)
  })
})

const activeParticipantName = computed<string>(() => {
  if (!chat.activeConversation) return 'Unknown'
  const p = getOtherParticipant(chat.activeConversation)
  return p ? `${p.firstName} ${p.lastName}` : 'Unknown'
})

// ── HELPERS ──────────────────────────────────────────────────

function getOtherParticipant(conv: Conversation): Conversation['participants'][0] | undefined {
  return conv.participants.find((p) => p.id !== auth.user?.id) ?? conv.participants[0]
}

function scrollToBottom(): void {
  if (messagesContainer.value) {
    messagesContainer.value.scrollTop = messagesContainer.value.scrollHeight
  }
}

// ── CONVERSATION ACTIONS ──────────────────────────────────────

async function openConversation(id: string): Promise<void> {
  await chat.openConversation(id)
  await nextTick()
  scrollToBottom()
}

function closeConversation(): void {
  chat.activeConversationId = null
}

// ── MESSAGE ACTIONS ───────────────────────────────────────────

async function handleSend(): Promise<void> {
  if (pendingFile.value) {
    await uploadFile()
  } else if (newMessage.value.trim()) {
    await sendTextMessage()
  }
}

async function sendTextMessage(): Promise<void> {
  const content = newMessage.value.trim()
  if (!content) return
  newMessage.value = ''
  await chat.sendMessage(content)
  await nextTick()
  scrollToBottom()
}

// ── FILE UPLOAD ───────────────────────────────────────────────

function handleFileSelect(event: Event): void {
  const file = (event.target as HTMLInputElement).files?.[0]
  if (file) pendingFile.value = file
}

function clearPendingFile(): void {
  pendingFile.value = null
  if (fileInput.value) fileInput.value.value = ''
}

async function uploadFile(): Promise<void> {
  if (!pendingFile.value || !chat.activeConversationId) return
  isUploading.value = true
  try {
    const formData = new FormData()
    formData.append('file', pendingFile.value)
    if (newMessage.value.trim()) {
      formData.append('content', newMessage.value.trim())
    }
    const res = await chatService.uploadFile(chat.activeConversationId, formData)
    // Inject correct sender info since mock doesn't know the current user
    const uploadedMsg = {
      ...res.data,
      senderId: auth.user?.id ?? res.data.senderId,
      sender: {
        id: auth.user?.id ?? '',
        firstName: auth.user?.firstName ?? '',
        lastName: auth.user?.lastName ?? '',
        email: auth.user?.email ?? '',
        role: auth.role,
        isEmailVerified: true,
        is2FAEnabled: false,
        createdAt: '',
        updatedAt: '',
      },
      attachments: res.data.attachments?.map((att) => ({
        ...att,
        name: pendingFile.value?.name ?? att.name,
        size: pendingFile.value?.size ?? att.size,
        mimeType: pendingFile.value?.type ?? att.mimeType,
      })),
    }
    chat.receiveMessage(uploadedMsg)
    clearPendingFile()
    newMessage.value = ''
    await nextTick()
    scrollToBottom()
  } finally {
    isUploading.value = false
  }
}

// ── OFFER ─────────────────────────────────────────────────────

async function sendOffer(): Promise<void> {
  if (!chat.activeConversationId) return
  isSendingOffer.value = true
  try {
    await chat.sendOffer({
      jobTitle: offerForm.jobTitle,
      amount: offerForm.amount,
      type: offerForm.type,
      description: offerForm.description,
    })
    offerForm.jobTitle = ''
    offerForm.amount = 0
    offerForm.description = ''
    showOffer.value = false
    await nextTick()
    scrollToBottom()
  } finally {
    isSendingOffer.value = false
  }
}

// ── WATCHERS ─────────────────────────────────────────────────

watch(
  () => chat.activeMessages.length,
  () => nextTick(() => scrollToBottom()),
)
</script>
