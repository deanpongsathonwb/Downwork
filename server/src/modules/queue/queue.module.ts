import { Module, Global, Logger, DynamicModule } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { NoOpQueueService } from './queue.service';

export const QUEUE_SERVICE = 'QUEUE_SERVICE';

/**
 * QueueModule — Background job queue
 *
 * .register()          → ใช้ NoOp (ไม่ต้องมี Redis) — DEFAULT
 * .registerWithBull()  → ใช้ BullMQ จริง (ต้องมี REDIS_URL)
 *
 * เปลี่ยนจาก register() เป็น registerWithBull() ใน AppModule เมื่อพร้อมใช้งาน
 */
@Global()
@Module({})
export class QueueModule {
  private static readonly logger = new Logger('QueueModule');

  /**
   * Default mode — ไม่ต้องมี Redis
   * ทุก job จะถูก skip แบบ silent (log debug)
   */
  static register(): DynamicModule {
    QueueModule.logger.log('Queue module in NoOp mode (set REDIS_URL to enable)');
    return {
      module: QueueModule,
      providers: [
        {
          provide: QUEUE_SERVICE,
          useClass: NoOpQueueService,
        },
      ],
      exports: [QUEUE_SERVICE],
    };
  }

  /**
   * BullMQ mode — ต้องมี REDIS_URL
   * เปิดใช้ background processing จริง
   *
   * วิธีเปิด: เปลี่ยน QueueModule.register() → QueueModule.registerWithBull()
   * ใน app.module.ts
   */
  static registerWithBull(): DynamicModule {
    // Lazy require so BullMQ is not loaded when using register() (NoOp mode).
    /* eslint-disable @typescript-eslint/no-require-imports -- sync dynamic load for optional Redis path */
    const { BullModule } = require('@nestjs/bullmq');
    const { EmailProcessor } = require('./processors/email.processor');
    const { NotificationProcessor } = require('./processors/notification.processor');
    const { QueueService } = require('./queue.service');
    /* eslint-enable @typescript-eslint/no-require-imports */

    QueueModule.logger.log('Queue module in BullMQ mode');

    return {
      module: QueueModule,
      imports: [
        BullModule.forRootAsync({
          useFactory: (config: ConfigService) => ({
            connection: {
              url: config.get<string>('redis.url'),
              maxRetriesPerRequest: null,
            },
          }),
          inject: [ConfigService],
        }),
        BullModule.registerQueue(
          { name: 'email' },
          { name: 'notifications' },
          { name: 'analytics' },
        ),
      ],
      providers: [
        {
          provide: QUEUE_SERVICE,
          useClass: QueueService,
        },
        EmailProcessor,
        NotificationProcessor,
      ],
      exports: [QUEUE_SERVICE],
    };
  }
}
