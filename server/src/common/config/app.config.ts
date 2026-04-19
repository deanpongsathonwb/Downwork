import { registerAs } from '@nestjs/config';

export const appConfig = registerAs('app', () => ({
  port: parseInt(process.env.PORT ?? '3000', 10),
  nodeEnv: process.env.NODE_ENV ?? 'development',
  corsOrigin: (process.env.CORS_ORIGIN ?? 'http://localhost:1997').split(','),
  uploadDir: process.env.UPLOAD_DIR ?? './uploads',
  maxFileSize: parseInt(process.env.MAX_FILE_SIZE ?? '52428800', 10),
  frontendUrl: process.env.FRONTEND_URL ?? 'http://localhost:1997',
}));

export const jwtConfig = registerAs('jwt', () => {
  const accessSecret = process.env.JWT_ACCESS_SECRET;
  const refreshSecret = process.env.JWT_REFRESH_SECRET;

  if (!accessSecret || !refreshSecret) {
    throw new Error(
      'FATAL: JWT_ACCESS_SECRET and JWT_REFRESH_SECRET must be set. ' +
      'Generate with: openssl rand -hex 32',
    );
  }

  return {
    accessSecret,
    refreshSecret,
    accessExpiresIn: parseInt(process.env.JWT_ACCESS_EXPIRES_IN ?? '3600', 10),
    refreshExpiresIn: parseInt(process.env.JWT_REFRESH_EXPIRES_IN ?? '604800', 10),
  };
});

export const emailConfig = registerAs('email', () => ({
  provider: process.env.EMAIL_PROVIDER ?? 'console',
  from: process.env.EMAIL_FROM ?? 'noreply@downwork.online',
  smtpHost: process.env.SMTP_HOST,
  smtpPort: parseInt(process.env.SMTP_PORT ?? '587', 10),
  smtpUser: process.env.SMTP_USER,
  smtpPass: process.env.SMTP_PASS,
  sendgridApiKey: process.env.SENDGRID_API_KEY,
  resendApiKey: process.env.RESEND_API_KEY,
}));

export const redisConfig = registerAs('redis', () => ({
  url: process.env.REDIS_URL ?? '',
}));

export const storageConfig = registerAs('storage', () => ({
  provider: process.env.STORAGE_PROVIDER ?? 'local',
  s3Bucket: process.env.S3_BUCKET,
  s3Region: process.env.S3_REGION ?? 'us-east-1',
  s3AccessKey: process.env.S3_ACCESS_KEY,
  s3SecretKey: process.env.S3_SECRET_KEY,
  s3Endpoint: process.env.S3_ENDPOINT,
  cdnUrl: process.env.CDN_URL,
}));
