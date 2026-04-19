import { Injectable, Logger } from '@nestjs/common';
import { Cron, CronExpression } from '@nestjs/schedule';
import { PrismaService } from '../../prisma/prisma.service';

@Injectable()
export class CleanupService {
  private readonly logger = new Logger(CleanupService.name);

  constructor(private prisma: PrismaService) {}

  @Cron(CronExpression.EVERY_DAY_AT_3AM)
  async cleanExpiredSessions() {
    const result = await this.prisma.session.deleteMany({
      where: { expiresAt: { lt: new Date() } },
    });
    if (result.count > 0) {
      this.logger.log(`Cleaned ${result.count} expired sessions`);
    }
  }

  @Cron(CronExpression.EVERY_WEEK)
  async cleanOldNotifications() {
    const thirtyDaysAgo = new Date(Date.now() - 30 * 24 * 60 * 60 * 1000);
    const result = await this.prisma.notification.deleteMany({
      where: { isRead: true, createdAt: { lt: thirtyDaysAgo } },
    });
    if (result.count > 0) {
      this.logger.log(`Cleaned ${result.count} old read notifications`);
    }
  }
}
