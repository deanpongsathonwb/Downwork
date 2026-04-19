import { Processor, WorkerHost } from '@nestjs/bullmq';
import { Logger } from '@nestjs/common';
import { Job } from 'bullmq';
import { PrismaService } from '../../../prisma/prisma.service';
import type { NotificationJobData } from '../queue.service';

@Processor('notifications')
export class NotificationProcessor extends WorkerHost {
  private readonly logger = new Logger(NotificationProcessor.name);

  constructor(private prisma: PrismaService) {
    super();
  }

  async process(job: Job<NotificationJobData>): Promise<void> {
    const { userId, type, title, message, link } = job.data;
    this.logger.log(`Processing notification job ${job.id}: ${userId} — ${title}`);

    await this.prisma.notification.create({
      data: { userId, type: type as any, title, message, link },
    });

    this.logger.log(`Notification job ${job.id} completed`);
  }
}
