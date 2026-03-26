import type { User } from './user.types'

// ── Chat & Messaging ─────────────────────────────────────────

export type MessageType = 'text' | 'image' | 'file' | 'system' | 'offer'

export interface Attachment {
  id?: string
  name: string
  size: number
  type: string
  mimeType?: string
  url: string
}

export interface MessageOffer {
  jobTitle: string
  description?: string
  amount: number
  duration: string
  status: 'pending' | 'accepted' | 'declined'
}

export interface Message {
  id: string
  conversationId: string
  senderId: string
  /** Populated sender user (optional) */
  sender?: Partial<User>
  content: string
  type: MessageType
  attachments?: Attachment[]
  /** Offer payload (when type === 'offer') */
  offer?: MessageOffer
  isRead?: boolean
  readAt?: string
  createdAt: string
}

export interface Conversation {
  id: string
  /** Populated participant user objects (or string IDs if not populated) */
  participants: Partial<User>[]
  jobId?: string
  contractId?: string
  lastMessage?: Message
  unreadCount: number
  createdAt?: string
  updatedAt: string
}
