import { Processor, WorkerHost } from '@nestjs/bullmq';
import { Inject, Logger } from '@nestjs/common';
import { Job } from 'bullmq';
import { EMAIL_SERVICE, type EmailService } from '../../email/email.interface';
import type { EmailJobData } from '../queue.service';

@Processor('email')
export class EmailProcessor extends WorkerHost {
  private readonly logger = new Logger(EmailProcessor.name);

  constructor(@Inject(EMAIL_SERVICE) private emailService: EmailService) {
    super();
  }

  async process(job: Job<EmailJobData>): Promise<void> {
    const { to, subject, html, text } = job.data;
    this.logger.log(`Processing email job ${job.id}: ${to} — ${subject}`);

    await this.emailService.send({ to, subject, html, text });
    this.logger.log(`Email job ${job.id} completed`);
  }
}
