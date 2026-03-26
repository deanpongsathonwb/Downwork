import { BaseService } from '@/services/http/base.service'
import type { Conversation, Message } from '@/types'

class ChatService extends BaseService {
  constructor() {
    super('/conversations')
  }

  getConversations() {
    return this.get<Conversation[]>('')
  }

  getConversation(id: string) {
    return this.get<Conversation>(`/${id}`)
  }

  getMessages(conversationId: string, page = 1) {
    return this.get<Message[]>(`/${conversationId}/messages`, { params: { page } })
  }

  sendMessage(conversationId: string, content: string, type = 'text') {
    return this.post<Message>(`/${conversationId}/messages`, { content, type })
  }

  uploadFile(conversationId: string, formData: FormData) {
    return this.upload<Message>(`/${conversationId}/messages/file`, formData)
  }

  sendOffer(conversationId: string, offer: Record<string, unknown>) {
    return this.post<Message>(`/${conversationId}/offer`, offer)
  }

  markAsRead(conversationId: string) {
    return this.patch<void>(`/${conversationId}/read`)
  }

  startConversation(recipientId: string, jobId?: string) {
    return this.post<Conversation>('', { recipientId, jobId })
  }
}

export const chatService = new ChatService()
