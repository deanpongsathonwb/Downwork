import { Module, Global, Logger } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { CacheService, NoOpCacheService, RedisCacheService } from './cache.service';

export const CACHE_SERVICE = 'CACHE_SERVICE';

@Global()
@Module({
  providers: [
    {
      provide: CACHE_SERVICE,
      useFactory: (config: ConfigService) => {
        const redisUrl = config.get<string>('redis.url');
        const logger = new Logger('CacheModule');

        if (!redisUrl) {
          logger.log('Redis not configured — using NoOp cache (in-memory noop)');
          return new NoOpCacheService();
        }

        logger.log('Redis configured — using Redis cache');
        return new RedisCacheService(redisUrl);
      },
      inject: [ConfigService],
    },
  ],
  exports: [CACHE_SERVICE],
})
export class CacheModule {}
