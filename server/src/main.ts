import './load-env';
import './instrument';
import { NestFactory } from '@nestjs/core';
import { ValidationPipe, Logger } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { DocumentBuilder, SwaggerModule } from '@nestjs/swagger';
import { NestExpressApplication } from '@nestjs/platform-express';
import helmet from 'helmet';
import compression from 'compression';
import { join } from 'path';
import { existsSync, mkdirSync } from 'fs';
import { AppModule } from './app.module';
import { freeDevListenPort } from './common/utils/free-dev-port';

function listenPortFromEnv(): number {
  const n = Number.parseInt(process.env.PORT ?? '3000', 10);
  return Number.isFinite(n) && n > 0 ? n : 3000;
}

async function bootstrap() {
  const logger = new Logger('Bootstrap');
  const nodeEnvEarly = process.env.NODE_ENV ?? 'development';
  const preflightPort = listenPortFromEnv();

  // Run before NestFactory.create so port checks appear first (not buried after module init).
  if (nodeEnvEarly !== 'production') {
    await freeDevListenPort(preflightPort, logger);
  }

  const app = await NestFactory.create<NestExpressApplication>(AppModule, {
    logger: ['error', 'warn', 'log', 'debug', 'verbose'],
  });

  const config = app.get(ConfigService);
  const nodeEnv = config.get<string>('app.nodeEnv', 'development');
  const port = config.get<number>('app.port', 3000);

  app.setGlobalPrefix('api/v1');

  // Security
  app.use(
    helmet({
      crossOriginResourcePolicy: { policy: 'cross-origin' },
      contentSecurityPolicy: nodeEnv === 'production' ? undefined : false,
    }),
  );

  // Compression
  app.use(compression());

  // CORS
  const allowedOrigins = config.get<string[]>('app.corsOrigin', ['http://localhost:1997']);
  app.enableCors({
    origin: allowedOrigins,
    credentials: true,
    methods: ['GET', 'POST', 'PUT', 'PATCH', 'DELETE', 'OPTIONS'],
    allowedHeaders: ['Content-Type', 'Authorization', 'X-Request-Id'],
  });

  // Validation
  app.useGlobalPipes(
    new ValidationPipe({
      whitelist: true,
      forbidNonWhitelisted: true,
      transform: true,
      transformOptions: { enableImplicitConversion: true },
    }),
  );

  // Static file serving for uploads (local dev only)
  const storageProvider = config.get<string>('storage.provider', 'local');
  if (storageProvider === 'local') {
    const uploadsDir = join(process.cwd(), config.get<string>('app.uploadDir', './uploads'));
    if (!existsSync(uploadsDir)) mkdirSync(uploadsDir, { recursive: true });
    app.useStaticAssets(uploadsDir, { prefix: '/uploads' });
  }

  // Swagger (dev only)
  if (nodeEnv !== 'production') {
    const swaggerConfig = new DocumentBuilder()
      .setTitle('Downwork API')
      .setDescription('Freelance marketplace API')
      .setVersion('1.0')
      .addBearerAuth()
      .build();
    const document = SwaggerModule.createDocument(app, swaggerConfig);
    SwaggerModule.setup('api/docs', app, document);
  }

  // Graceful shutdown (Ctrl+C sends SIGINT; Nest closes the HTTP server)
  app.enableShutdownHooks();

  // Port may be taken during NestFactory.create (e.g. Prisma connect) or by a second
  // `start:dev` that reached listen() first. Re-run dev preflight so one instance wins.
  if (nodeEnv !== 'production') {
    await freeDevListenPort(port, logger, { quietIfIdle: true });
  }

  try {
    await app.listen(port);
  } catch (err: unknown) {
    const code = err && typeof err === 'object' && 'code' in err ? (err as NodeJS.ErrnoException).code : undefined;
    if (code === 'EADDRINUSE') {
      logger.error(
        `Port ${port} is already in use. Stop the other process (e.g. another \`npm run start:dev\`) or set PORT in .env.`,
      );
    }
    throw err;
  }
  logger.log(`Server running on http://localhost:${port} [${nodeEnv}]`);
  if (nodeEnv !== 'production') {
    logger.log(`Swagger docs at http://localhost:${port}/api/docs`);
  }
}
bootstrap();
