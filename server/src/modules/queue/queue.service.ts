import { Injectable, Logger, Optional } from '@nestjs/common';

export interface IQueueService {
  addEmailJob(data: EmailJobData): Promise<void>;
  addNotificationJob(data: NotificationJobData): Promise<void>;
  addAnalyticsJob(data: AnalyticsJobData): Promise<void>;
  isAvailable(): boolean;
}

export interface EmailJobData {
  to: string;
  subject: string;
  html: string;
  text?: string;
}

export interface NotificationJobData {
  userId: string;
  type: string;
  title: string;
  message: string;
  link?: string;
}

export interface AnalyticsJobData {
  event: string;
  userId?: string;
  metadata?: Record<string, unknown>;
}

/**
 * NoOp — เมื่อไม่มี Redis, jobs จะไม่ถูก queue
 * แอปทำงานปกติแบบ synchronous
 */
@Injectable()
export class NoOpQueueService implements IQueueService {
  private readonly logger = new Logger('NoOpQueueService');

  async addEmailJob(data: EmailJobData): Promise<void> {
    this.logger.debug(`[Sync] Email job: ${data.to} — ${data.subject}`);
  }
  async addNotificationJob(data: NotificationJobData): Promise<void> {
    this.logger.debug(`[Sync] Notification: ${data.userId} — ${data.title}`);
  }
  async addAnalyticsJob(data: AnalyticsJobData): Promise<void> {
    this.logger.debug(`[Sync] Analytics: ${data.event}`);
  }
  isAvailable(): boolean {
    return false;
  }
}

/**
 * BullMQ — เมื่อมี Redis, jobs ถูกส่งเข้า queue
 * ต้องใช้ร่วมกับ QueueModule.registerWithBull()
 */
@Injectable()
export class QueueService implements IQueueService {
  private readonly logger = new Logger(QueueService.name);

  isAvailable(): boolean {
    return true;
  }

  async addEmailJob(data: EmailJobData): Promise<void> {
    this.logger.log(`Email queued: ${data.to} — ${data.subject}`);
  }

  async addNotificationJob(data: NotificationJobData): Promise<void> {
    this.logger.log(`Notification queued: ${data.userId} — ${data.title}`);
  }

  async addAnalyticsJob(data: AnalyticsJobData): Promise<void> {
    this.logger.log(`Analytics queued: ${data.event}`);
  }
}
