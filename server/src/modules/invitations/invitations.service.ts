import { Injectable, NotFoundException } from '@nestjs/common';
import { PrismaService } from '../../prisma/prisma.service';

@Injectable()
export class InvitationsService {
  constructor(private prisma: PrismaService) {}

  async send(senderId: string, jobId: string, receiverId: string, message?: string) {
    return this.prisma.invitation.create({
      data: { jobId, senderId, receiverId, message },
    });
  }

  async getReceived(userId: string) {
    return this.prisma.invitation.findMany({
      where: { receiverId: userId },
      include: {
        job: { select: { id: true, title: true, category: true, budgetType: true, budgetFixed: true } },
        sender: { select: { id: true, firstName: true, lastName: true, avatar: true } },
      },
      orderBy: { createdAt: 'desc' },
    });
  }

  async getSentForJob(jobId: string) {
    return this.prisma.invitation.findMany({
      where: { jobId },
      include: {
        receiver: { select: { id: true, firstName: true, lastName: true, avatar: true } },
      },
      orderBy: { createdAt: 'desc' },
    });
  }

  async accept(id: string) {
    const invitation = await this.prisma.invitation.findUnique({ where: { id } });
    if (!invitation) throw new NotFoundException();
    return this.prisma.invitation.update({ where: { id }, data: { status: 'accepted' } });
  }

  async decline(id: string) {
    const invitation = await this.prisma.invitation.findUnique({ where: { id } });
    if (!invitation) throw new NotFoundException();
    return this.prisma.invitation.update({ where: { id }, data: { status: 'declined' } });
  }
}
