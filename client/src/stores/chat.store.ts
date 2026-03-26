import { defineStore } from 'pinia'
import { ref, computed } from 'vue'
import type { Conversation, Message } from '@/types'
import { chatService } from '@/services/api/chat.service'
import { useToastStore } from './toast.store'
import { logger } from '@/utils/logger'

// ============================================================
// CHAT STORE
// ============================================================

export const useChatStore = defineStore('chat', () => {
  const toast = useToastStore()
  const conversations = ref<Conversation[]>([])
  const activeConversationId = ref<string | null>(null)
  const messages = ref<Record<string, Message[]>>({})
  const isLoading = ref(false)
  const isSending = ref(false)
  const error = ref<string | null>(null)
  const hasMore = ref<Record<string, boolean>>({})
  const currentPage = ref<Record<string, number>>({})

  const activeConversation = computed(() =>
    conversations.value.find((c) => c.id === activeConversationId.value) ?? null,
  )

  const activeMessages = computed(() =>
    activeConversationId.value ? (messages.value[activeConversationId.value] ?? []) : [],
  )

  const totalUnread = computed(() =>
    conversations.value.reduce((sum, c) => sum + (c.unreadCount ?? 0), 0),
  )

  async function fetchConversations(): Promise<void> {
    isLoading.value = true
    try {
      const res = await chatService.getConversations()
      conversations.value = res.data
    } catch (err) {
      logger.catch(err, 'ChatStore.fetchConversations')
      toast.error('Failed to load conversations', 'Please refresh the page.')
    } finally {
      isLoading.value = false
    }
  }

  async function openConversation(id: string): Promise<void> {
    activeConversationId.value = id
    if (!messages.value[id]) {
      await loadMessages(id)
    }
    await chatService.markAsRead(id)
    const conv = conversations.value.find((c) => c.id === id)
    if (conv) conv.unreadCount = 0
  }

  async function loadMessages(conversationId: string, append = false): Promise<void> {
    const page = append ? (currentPage.value[conversationId] ?? 1) + 1 : 1
    isLoading.value = true
    try {
      const res = await chatService.getMessages(conversationId, page)
      const loaded = res.data
      if (append) {
        messages.value[conversationId] = [...loaded, ...(messages.value[conversationId] ?? [])]
      } else {
        messages.value[conversationId] = loaded
      }
      currentPage.value[conversationId] = page
      hasMore.value[conversationId] = loaded.length >= 20
    } catch (err) {
      logger.catch(err, 'ChatStore.loadMessages')
      toast.error('Failed to load messages', 'Please try again.')
    } finally {
      isLoading.value = false
    }
  }

  async function sendMessage(content: string, type = 'text'): Promise<void> {
    if (!activeConversationId.value) return
    isSending.value = true
    try {
      const res = await chatService.sendMessage(activeConversationId.value, content, type)
      addMessageToConversation(activeConversationId.value, res.data)
    } catch (err) {
      logger.catch(err, 'ChatStore.sendMessage')
      toast.error('Send Failed', 'Message could not be sent.')
    } finally {
      isSending.value = false
    }
  }

  async function sendOffer(offer: Record<string, unknown>): Promise<void> {
    if (!activeConversationId.value) return
    try {
      const res = await chatService.sendOffer(activeConversationId.value, offer)
      addMessageToConversation(activeConversationId.value, res.data)
    } catch (err) {
      logger.catch(err, 'ChatStore.sendOffer')
      toast.error('Failed', 'Could not send offer.')
    }
  }

  async function uploadFile(file: File): Promise<void> {
    if (!activeConversationId.value) return
    const formData = new FormData()
    formData.append('file', file)
    isSending.value = true
    try {
      const res = await chatService.uploadFile(activeConversationId.value, formData)
      addMessageToConversation(activeConversationId.value, res.data)
    } catch (err) {
      logger.catch(err, 'ChatStore.uploadFile')
      toast.error('Upload Failed', 'Could not upload file.')
    } finally {
      isSending.value = false
    }
  }

  function addMessageToConversation(conversationId: string, message: Message): void {
    if (!messages.value[conversationId]) messages.value[conversationId] = []
    messages.value[conversationId].push(message)
    const conv = conversations.value.find((c) => c.id === conversationId)
    if (conv) conv.lastMessage = message
  }

  function receiveMessage(message: Message): void {
    addMessageToConversation(message.conversationId, message)
    if (activeConversationId.value !== message.conversationId) {
      const conv = conversations.value.find((c) => c.id === message.conversationId)
      if (conv) conv.unreadCount = (conv.unreadCount ?? 0) + 1
    }
  }

  async function startConversation(recipientId: string, jobId?: string): Promise<string | null> {
    try {
      const res = await chatService.startConversation(recipientId, jobId)
      const existing = conversations.value.find((c) => c.id === res.data.id)
      if (!existing) conversations.value.unshift(res.data)
      return res.data.id
    } catch (err) {
      logger.catch(err, 'ChatStore.startConversation')
      return null
    }
  }

  return {
    conversations,
    activeConversationId,
    messages,
    isLoading,
    isSending,
    error,
    hasMore,
    activeConversation,
    activeMessages,
    totalUnread,
    fetchConversations,
    openConversation,
    loadMessages,
    sendMessage,
    sendOffer,
    uploadFile,
    receiveMessage,
    startConversation,
  }
})
