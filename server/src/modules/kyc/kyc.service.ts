import { Injectable, NotFoundException } from '@nestjs/common';
import { PrismaService } from '../../prisma/prisma.service';

@Injectable()
export class KycService {
  constructor(private prisma: PrismaService) {}

  async getStatus(userId: string) {
    const doc = await this.prisma.kYCDocument.findFirst({
      where: { userId },
      orderBy: { submittedAt: 'desc' },
    });
    return {
      status: doc?.status ?? 'not_started',
      document: doc ?? undefined,
    };
  }

  async submit(userId: string, documentType: string, documentUrl: string, selfieUrl?: string) {
    return this.prisma.kYCDocument.create({
      data: { userId, documentType, documentUrl, selfieUrl },
    });
  }

  async getDocument(id: string) {
    const doc = await this.prisma.kYCDocument.findUnique({ where: { id } });
    if (!doc) throw new NotFoundException('Document not found');
    return doc;
  }
}
