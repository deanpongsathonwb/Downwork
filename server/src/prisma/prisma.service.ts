import { Injectable, Logger, OnModuleInit, OnModuleDestroy } from '@nestjs/common';
import { PrismaClient } from '@prisma/client';

function prismaConnectDevHint(rawMessage: string): string {
  const m = rawMessage.toLowerCase();
  if (
    m.includes('authentication failed') ||
    m.includes('p1000') ||
    m.includes('credentials') && m.includes('not valid')
  ) {
    return (
      'Prisma rejected DATABASE_URL credentials (wrong user/password for PostgreSQL). ' +
      'Put the password you chose when installing Postgres in server/.env (postgresql://postgres:PASSWORD@host:PORT/db). ' +
      'Port must match postgresql.conf. Special characters in the password must be URL-encoded.'
    );
  }
  if (
    m.includes("can't reach database server") ||
    m.includes('p1001') ||
    m.includes('econnrefused')
  ) {
    return (
      'Prisma cannot reach PostgreSQL on the host/port in DATABASE_URL. ' +
      'Start the Windows service (postgresql-x64-*), confirm `port` in data/postgresql.conf, then run npm run setup in server/.'
    );
  }
  return (
    'Prisma could not open a database connection. Fix DATABASE_URL and ensure PostgreSQL is running; then npm run setup in server/.'
  );
}

@Injectable()
export class PrismaService extends PrismaClient implements OnModuleInit, OnModuleDestroy {
  private readonly logger = new Logger(PrismaService.name);

  async onModuleInit() {
    const databaseUrl = process.env.DATABASE_URL ?? '';
    const hasPostgresProtocol =
      databaseUrl.startsWith('postgresql://') || databaseUrl.startsWith('postgres://');

    if (!hasPostgresProtocol) {
      throw new Error(
        'DATABASE_URL must start with postgresql:// or postgres://. This stack uses PostgreSQL only; SQLite (file:…) is not supported. Copy server/.env.example and point DATABASE_URL at a local or hosted Postgres, then run migrations.',
      );
    }

    try {
      await this.$connect();
    } catch (error) {
      if (process.env.NODE_ENV === 'production') {
        throw error;
      }
      const message = error instanceof Error ? error.message : String(error);
      this.logger.warn(prismaConnectDevHint(message));
      this.logger.debug(message);
    }
  }

  async onModuleDestroy() {
    await this.$disconnect();
  }
}
