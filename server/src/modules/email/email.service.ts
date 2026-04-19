import { Injectable, Logger } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import type { EmailOptions, EmailService } from './email.interface';

@Injectable()
export class ConsoleEmailService implements EmailService {
  private readonly logger = new Logger('EmailService');

  async send(options: EmailOptions): Promise<void> {
    this.logger.log(`[DEV] Email to ${options.to}: ${options.subject}`);
    this.logger.debug(`[DEV] Body: ${options.html.substring(0, 200)}...`);
  }
}

@Injectable()
export class SmtpEmailService implements EmailService {
  private readonly logger = new Logger('SmtpEmailService');

  constructor(private config: ConfigService) {}

  async send(options: EmailOptions): Promise<void> {
    // @ts-expect-error nodemailer is an optional dependency
    const nodemailer = await import('nodemailer');
    const transporter = nodemailer.createTransport({
      host: this.config.get('email.smtpHost'),
      port: this.config.get('email.smtpPort'),
      auth: {
        user: this.config.get('email.smtpUser'),
        pass: this.config.get('email.smtpPass'),
      },
    });

    await transporter.sendMail({
      from: this.config.get('email.from'),
      to: options.to,
      subject: options.subject,
      html: options.html,
      text: options.text,
    });

    this.logger.log(`Email sent to ${options.to}: ${options.subject}`);
  }
}
