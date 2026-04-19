import { Injectable, Logger, OnModuleDestroy } from '@nestjs/common';
import Redis from 'ioredis';

export interface CacheService {
  get<T = unknown>(key: string): Promise<T | null>;
  set(key: string, value: unknown, ttlSeconds?: number): Promise<void>;
  del(key: string): Promise<void>;
  delByPattern(pattern: string): Promise<void>;
  isAvailable(): boolean;
}

/**
 * NoOp implementation — ใช้เมื่อไม่ได้ตั้งค่า Redis
 * ทุก get() return null, set()/del() ไม่ทำอะไร
 * แอปทำงานปกติเหมือนไม่มี cache
 */
@Injectable()
export class NoOpCacheService implements CacheService, OnModuleDestroy {
  async get<T>(): Promise<T | null> {
    return null;
  }
  async set(): Promise<void> {}
  async del(): Promise<void> {}
  async delByPattern(): Promise<void> {}
  isAvailable(): boolean {
    return false;
  }
  async onModuleDestroy(): Promise<void> {}
}

/**
 * Redis implementation — ใช้เมื่อตั้งค่า REDIS_URL
 * รองรับ get/set/del/pattern-delete พร้อม TTL
 */
@Injectable()
export class RedisCacheService implements CacheService, OnModuleDestroy {
  private readonly logger = new Logger(RedisCacheService.name);
  private client: Redis;
  private connected = false;

  constructor(redisUrl: string) {
    this.client = new Redis(redisUrl, {
      maxRetriesPerRequest: 3,
      retryStrategy: (times) => {
        if (times > 5) return null;
        return Math.min(times * 200, 2000);
      },
      lazyConnect: true,
    });

    this.client.on('connect', () => {
      this.connected = true;
      this.logger.log('Connected to Redis');
    });
    this.client.on('error', (err) => {
      this.connected = false;
      this.logger.error(`Redis error: ${err.message}`);
    });
    this.client.on('close', () => {
      this.connected = false;
    });

    this.client.connect().catch((err) => {
      this.logger.warn(`Failed to connect to Redis: ${err.message} — cache disabled`);
    });
  }

  isAvailable(): boolean {
    return this.connected;
  }

  async get<T = unknown>(key: string): Promise<T | null> {
    if (!this.connected) return null;
    try {
      const data = await this.client.get(key);
      return data ? (JSON.parse(data) as T) : null;
    } catch {
      return null;
    }
  }

  async set(key: string, value: unknown, ttlSeconds = 300): Promise<void> {
    if (!this.connected) return;
    try {
      const serialized = JSON.stringify(value);
      if (ttlSeconds > 0) {
        await this.client.setex(key, ttlSeconds, serialized);
      } else {
        await this.client.set(key, serialized);
      }
    } catch {
      // cache failure ไม่ควรทำให้แอป crash
    }
  }

  async del(key: string): Promise<void> {
    if (!this.connected) return;
    try {
      await this.client.del(key);
    } catch {
      // silent
    }
  }

  async delByPattern(pattern: string): Promise<void> {
    if (!this.connected) return;
    try {
      let cursor = '0';
      do {
        const [nextCursor, keys] = await this.client.scan(cursor, 'MATCH', pattern, 'COUNT', 100);
        cursor = nextCursor;
        if (keys.length > 0) {
          await this.client.del(...keys);
        }
      } while (cursor !== '0');
    } catch {
      // silent
    }
  }

  async onModuleDestroy(): Promise<void> {
    try {
      await this.client.quit();
    } catch {
      // ignore
    }
  }
}
