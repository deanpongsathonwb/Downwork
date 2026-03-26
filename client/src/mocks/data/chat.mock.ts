import type { Conversation, Message } from '@/types'

// ============================================================
// MOCK CHAT DATA
// ============================================================

export const MOCK_CONVERSATIONS: Conversation[] = [
  {
    id: 'conv-001',
    participants: [
      { id: 'user-freelancer-01', firstName: 'Alex', lastName: 'Nguyen' },
      { id: 'user-client-01', firstName: 'Sarah', lastName: 'Johnson' },
    ],
    lastMessage: {
      id: 'msg-003',
      conversationId: 'conv-001',
      senderId: 'user-client-01',
      content: 'Can you share the progress on the dashboard components?',
      type: 'text',
      isRead: false,
      createdAt: new Date(Date.now() - 4 * 60 * 60 * 1000).toISOString(),
    },
    unreadCount: 2,
    contractId: 'contract-001',
    updatedAt: new Date(Date.now() - 4 * 60 * 60 * 1000).toISOString(),
  },
  {
    id: 'conv-002',
    participants: [
      { id: 'user-freelancer-01', firstName: 'Alex', lastName: 'Nguyen' },
      { id: 'user-client-05', firstName: 'Anna', lastName: 'Williams' },
    ],
    lastMessage: {
      id: 'msg-010',
      conversationId: 'conv-002',
      senderId: 'user-freelancer-01',
      content: 'The API endpoints are all documented in the README. Let me know if you have any questions.',
      type: 'text',
      isRead: true,
      createdAt: new Date(Date.now() - 5 * 24 * 60 * 60 * 1000).toISOString(),
    },
    unreadCount: 0,
    contractId: 'contract-002',
    updatedAt: new Date(Date.now() - 5 * 24 * 60 * 60 * 1000).toISOString(),
  },
  {
    id: 'conv-003',
    participants: [
      { id: 'user-freelancer-01', firstName: 'Alex', lastName: 'Nguyen' },
      { id: 'user-client-07', firstName: 'Sophia', lastName: 'Lee' },
    ],
    lastMessage: {
      id: 'msg-015',
      conversationId: 'conv-003',
      senderId: 'user-client-07',
      content: 'We would love to have you on our DevOps project. Are you available to start next week?',
      type: 'text',
      isRead: false,
      createdAt: new Date(Date.now() - 2 * 60 * 60 * 1000).toISOString(),
    },
    unreadCount: 1,
    jobId: 'job-007',
    updatedAt: new Date(Date.now() - 2 * 60 * 60 * 1000).toISOString(),
  },
]

export const MOCK_MESSAGES: Record<string, Message[]> = {
  'conv-001': [
    {
      id: 'msg-001',
      conversationId: 'conv-001',
      senderId: 'user-client-01',
      sender: { firstName: 'Sarah', lastName: 'Johnson' },
      content: 'Hi Alex! I reviewed your proposal and I am very impressed with your portfolio.',
      type: 'text',
      isRead: true,
      createdAt: new Date(Date.now() - 15 * 24 * 60 * 60 * 1000).toISOString(),
    },
    {
      id: 'msg-002',
      conversationId: 'conv-001',
      senderId: 'user-freelancer-01',
      sender: { firstName: 'Alex', lastName: 'Nguyen' },
      content: 'Thank you Sarah! I have worked on several SaaS dashboards and I am excited about this project. When would you like to start?',
      type: 'text',
      isRead: true,
      createdAt: new Date(Date.now() - 15 * 24 * 60 * 60 * 1000 + 30 * 60 * 1000).toISOString(),
    },
    {
      id: 'msg-003',
      conversationId: 'conv-001',
      senderId: 'user-client-01',
      sender: { firstName: 'Sarah', lastName: 'Johnson' },
      content: 'Can you share the progress on the dashboard components?',
      type: 'text',
      isRead: false,
      createdAt: new Date(Date.now() - 4 * 60 * 60 * 1000).toISOString(),
    },
    {
      id: 'msg-004',
      conversationId: 'conv-001',
      senderId: 'user-freelancer-01',
      sender: { firstName: 'Alex', lastName: 'Nguyen' },
      content: '',
      type: 'file',
      attachments: [{
        id: 'att-001',
        name: 'dashboard-mockup-v2.fig',
        size: 4_200_000,
        type: 'application/octet-stream',
        mimeType: 'application/octet-stream',
        url: '#',
      }],
      isRead: true,
      createdAt: new Date(Date.now() - 3 * 60 * 60 * 1000).toISOString(),
    },
    {
      id: 'msg-005',
      conversationId: 'conv-001',
      senderId: 'user-client-01',
      sender: { firstName: 'Sarah', lastName: 'Johnson' },
      content: '',
      type: 'offer',
      offer: {
        jobTitle: 'SaaS Dashboard Development - Phase 2',
        description: 'Extend the dashboard with real-time analytics and export features.',
        amount: 2500,
        duration: '4 weeks',
        status: 'pending',
      },
      isRead: false,
      createdAt: new Date(Date.now() - 1 * 60 * 60 * 1000).toISOString(),
    },
  ],
  'conv-002': [
    {
      id: 'msg-008',
      conversationId: 'conv-002',
      senderId: 'user-client-05',
      sender: { firstName: 'Anna', lastName: 'Williams' },
      content: 'Alex, the project is now complete. Great work on the API endpoints!',
      type: 'text',
      isRead: true,
      createdAt: new Date(Date.now() - 5 * 24 * 60 * 60 * 1000 - 60 * 60 * 1000).toISOString(),
    },
    {
      id: 'msg-010',
      conversationId: 'conv-002',
      senderId: 'user-freelancer-01',
      sender: { firstName: 'Alex', lastName: 'Nguyen' },
      content: 'The API endpoints are all documented in the README. Let me know if you have any questions.',
      type: 'text',
      isRead: true,
      createdAt: new Date(Date.now() - 5 * 24 * 60 * 60 * 1000).toISOString(),
    },
  ],
  'conv-003': [
    {
      id: 'msg-015',
      conversationId: 'conv-003',
      senderId: 'user-client-07',
      sender: { firstName: 'Sophia', lastName: 'Lee' },
      content: 'We would love to have you on our DevOps project. Are you available to start next week?',
      type: 'text',
      isRead: false,
      createdAt: new Date(Date.now() - 2 * 60 * 60 * 1000).toISOString(),
    },
  ],
}
