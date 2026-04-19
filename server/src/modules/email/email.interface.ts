export interface EmailOptions {
  to: string;
  subject: string;
  html: string;
  text?: string;
}

export interface EmailService {
  send(options: EmailOptions): Promise<void>;
}

export const EMAIL_SERVICE = 'EMAIL_SERVICE';
