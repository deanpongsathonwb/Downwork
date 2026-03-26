import { Injectable, NotFoundException } from '@nestjs/common';
import { PrismaService } from '../../prisma/prisma.service';

@Injectable()
export class ReviewsService {
  constructor(private prisma: PrismaService) {}

  async getForUser(userId: string) {
    return this.prisma.review.findMany({
      where: { targetId: userId },
      include: {
        author: { select: { id: true, firstName: true, lastName: true, avatar: true } },
        contract: { select: { id: true, title: true } },
      },
      orderBy: { createdAt: 'desc' },
    });
  }

  async getById(id: string) {
    const review = await this.prisma.review.findUnique({
      where: { id },
      include: {
        author: { select: { id: true, firstName: true, lastName: true, avatar: true } },
        contract: { select: { id: true, title: true } },
      },
    });
    if (!review) throw new NotFoundException('Review not found');
    return review;
  }

  async report(id: string, reporterId: string, reason: string) {
    const review = await this.prisma.review.findUnique({ where: { id } });
    if (!review) throw new NotFoundException('Review not found');

    await this.prisma.report.create({
      data: {
        reporterId,
        reportedId: review.authorId,
        type: 'review',
        reason,
      },
    });
  }
}
