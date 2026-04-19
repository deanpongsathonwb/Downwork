import { Injectable, NotFoundException } from '@nestjs/common';
import { PrismaService } from '../../prisma/prisma.service';
import { StartConversationDto, SendMessageDto } from './dto/chat.dto';

@Injectable()
export class ChatService {
  constructor(private prisma: PrismaService) {}

  async getConversations(userId: string) {
    const conversations = await this.prisma.conversation.findMany({
      where: { OR: [{ user1Id: userId }, { user2Id: userId }] },
      include: {
        user1: { select: { id: true, firstName: true, lastName: true, avatar: true } },
        user2: { select: { id: true, firstName: true, lastName: true, avatar: true } },
        messages: { take: 1, orderBy: { createdAt: 'desc' } },
      },
      orderBy: { updatedAt: 'desc' },
    });

    return conversations.map((c) => {
      const other = c.user1Id === userId ? c.user2 : c.user1;
      const unreadCount = 0; // simplified
      return {
        ...c,
        participant: other,
        unreadCount,
        lastMessage: c.messages[0] ?? null,
      };
    });
  }

  async getConversation(id: string) {
    const conv = await this.prisma.conversation.findUnique({
      where: { id },
      include: {
        user1: { select: { id: true, firstName: true, lastName: true, avatar: true } },
        user2: { select: { id: true, firstName: true, lastName: true, avatar: true } },
      },
    });
    if (!conv) throw new NotFoundException('Conversation not found');
    return conv;
  }

  async getMessages(conversationId: string, page: number = 1) {
    const limit = 50;
    return this.prisma.message.findMany({
      where: { conversationId },
      include: { sender: { select: { id: true, firstName: true, lastName: true, avatar: true } } },
      orderBy: { createdAt: 'desc' },
      skip: (page - 1) * limit,
      take: limit,
    });
  }

  async sendMessage(conversationId: string, senderId: string, dto: SendMessageDto) {
    const message = await this.prisma.message.create({
      data: {
        conversationId,
        senderId,
        content: dto.content,
        type: (dto.type as any) ?? 'text',
      },
      include: { sender: { select: { id: true, firstName: true, lastName: true, avatar: true } } },
    });

    await this.prisma.conversation.update({
      where: { id: conversationId },
      data: { lastMessage: dto.content, lastMessageAt: new Date() },
    });

    return message;
  }

  async uploadFile(conversationId: string, senderId: string, fileUrl: string, fileName: string) {
    return this.prisma.message.create({
      data: {
        conversationId,
        senderId,
        content: fileName,
        type: 'file',
        fileUrl,
        fileName,
      },
    });
  }

  async sendOffer(conversationId: string, senderId: string, offer: Record<string, unknown>) {
    return this.prisma.message.create({
      data: {
        conversationId,
        senderId,
        content: 'Sent an offer',
        type: 'offer',
        offerData: offer as any,
      },
    });
  }

  async markAsRead(conversationId: string, userId: string) {
    await this.prisma.message.updateMany({
      where: { conversationId, senderId: { not: userId }, isRead: false },
      data: { isRead: true },
    });
  }

  async startConversation(userId: string, dto: StartConversationDto) {
    const [u1, u2] = [userId, dto.recipientId].sort();
    const existing = await this.prisma.conversation.findUnique({
      where: { user1Id_user2Id: { user1Id: u1, user2Id: u2 } },
    });
    if (existing) return existing;

    return this.prisma.conversation.create({
      data: { user1Id: u1, user2Id: u2, jobId: dto.jobId },
    });
  }
}
