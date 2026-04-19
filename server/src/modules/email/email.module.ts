import { Module, Global } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { EMAIL_SERVICE } from './email.interface';
import { ConsoleEmailService, SmtpEmailService } from './email.service';
import { EmailTemplates } from './email.templates';

@Global()
@Module({
  providers: [
    {
      provide: EMAIL_SERVICE,
      useFactory: (config: ConfigService) => {
        const provider = config.get<string>('email.provider', 'console');
        if (provider === 'smtp') {
          return new SmtpEmailService(config);
        }
        return new ConsoleEmailService();
      },
      inject: [ConfigService],
    },
    {
      provide: EmailTemplates,
      useFactory: (config: ConfigService) => {
        return new EmailTemplates(config.get<string>('app.frontendUrl', 'http://localhost:1997'));
      },
      inject: [ConfigService],
    },
  ],
  exports: [EMAIL_SERVICE, EmailTemplates],
})
export class EmailModule {}
