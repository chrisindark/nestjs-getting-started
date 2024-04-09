import { Injectable, Logger, OnApplicationShutdown } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import Redis from 'ioredis';

// import { SentryService } from 'src/interceptors/sentry/sentry.service';

@Injectable()
export class RedisService implements OnApplicationShutdown {
  redis: Redis;
  secondRedis: Redis;
  thirdRedis: Redis;
  private readonly logger = new Logger(RedisService.name);

  constructor(
    // private readonly sentryService: SentryService,
    private readonly configService: ConfigService,
  ) {
    this.connect();
  }

  connect = () => {
    try {
      this.redis = new Redis(
        this.configService.get('REDIS_HOST'),
        this.configService.get('REDIS_PORT'),
        {
          retryStrategy() {
            return null;
          },
        },
      );

      this.secondRedis = new Redis(
        this.configService.get('REDIS_HOST'),
        this.configService.get('REDIS_PORT'),
        {
          retryStrategy() {
            return null;
          },
        },
      );

      this.thirdRedis = new Redis(
        this.configService.get('REDIS_HOST'),
        this.configService.get('REDIS_PORT'),
        {
          retryStrategy() {
            return null;
          },
        },
      );
    } catch (e) {
      this.logger.error(e.message, e.stack, `connect`);

      throw new Error(e.message);
    }
  };

  get = async (redisClient: Redis, key: string) => {
    let response = null;
    try {
      const fn = async () => await redisClient.get(key);
      response = await this.retry(fn, 0);
    } catch (e) {
      this.logger.error(e.message, e.stack, 'get');
    }

    return response;
  };

  set = async (
    redisClient: Redis,
    key: string,
    value: string,
    ttl: number | null = null,
  ) => {
    let response = null;
    try {
      const fn = async () =>
        ttl !== null
          ? await redisClient.setex(key, ttl, value)
          : await redisClient.set(key, value);
      response = await this.retry(fn, 0);
    } catch (e) {
      this.logger.error(e.message, e.stack, 'set');
    }

    return response;
  };

  hgetall = async (redisClient: Redis, key: string) => {
    let response = null;
    try {
      const fn = async () => await redisClient.hgetall(key);
      response = await this.retry(fn, 0);
    } catch (e) {
      this.logger.error(e.message, e.stack, 'hgetall');
    }

    return response;
  };

  hset = async (
    redisClient: Redis,
    key: string,
    value: any,
    ttl: number | null = null,
  ) => {
    let response = null;
    try {
      const fn = async () => {
        response = await redisClient.hset(key, value);
        if (ttl !== null) {
          await redisClient.expire(key, ttl);
        }
      };

      response = await this.retry(fn, 0);
    } catch (e) {
      this.logger.error(e.message, e.stack, 'hset');
    }

    return response;
  };

  hmset = async (
    redisClient: Redis,
    key: string,
    value: any,
    ttl: number | null = null,
  ) => {
    let response = null;
    try {
      const fn = async () => {
        response = await redisClient.hmset(key, value);
        if (ttl !== null) {
          await redisClient.expire(key, ttl);
        }
      };

      response = await this.retry(fn, 0);
    } catch (e) {
      this.logger.error(e.message, e.stack, 'hmset');
    }

    return response;
  };

  getFirst = async (key: string) => {
    const response = await this.get(this.redis, key);
    return response;
  };

  setFirst = async (key: string, value: string, ttl: number | null = null) => {
    const response = await this.set(this.redis, key, value, ttl);
    return response;
  };

  setThird = async (key: string, value: string, ttl: number | null = null) => {
    const response = await this.set(this.thirdRedis, key, value, ttl);
    return response;
  };

  delete = async (redisClient: Redis, key: string) => {
    let response = null;
    try {
      const fn = async () => await redisClient.del(key);
      response = await this.retry(fn, 0);
    } catch (e) {
      this.logger.error(e.message, e.stack, 'delete');
    }

    return response;
  };

  mset = async (redisClient: Redis, keyValues: Record<string, any>) => {
    let response = null;
    try {
      const fn = async () => await redisClient.mset(keyValues);
      response = await this.retry(fn, 0);
    } catch (e) {
      this.logger.error(e.message, e.stack, 'mset');
    }

    return response;
  };

  mget = async (redisClient: Redis, keys: string[]) => {
    let response = null;
    try {
      const fn = async () => await redisClient.mget(...keys);
      response = await this.retry(fn, 0);
    } catch (e) {
      this.logger.error(e.message, e.stack, 'mget');
    }

    return response;
  };

  deleteFirst = async (key: string) => {
    const response = await this.delete(this.redis, key);
    return response;
  };

  msetFirst = async (keyValues: Record<string, any>) => {
    const response = await this.mset(this.redis, keyValues);
    return response;
  };

  mgetFirst = async (keys: string[]) => {
    const response = await this.mget(this.redis, keys);
    return response;
  };

  msetSecond = async (keyValues: Record<string, any>) => {
    const response = await this.mset(this.secondRedis, keyValues);
    return response;
  };

  mgetSecond = async (keys: string[]) => {
    const response = await this.mget(this.secondRedis, keys);
    return response;
  };

  getSecond = async (key: string) => {
    const response = await this.get(this.secondRedis, key);
    return response;
  };

  setSecond = async (key: string, value: string, ttl: number | null = null) => {
    const response = await this.set(this.secondRedis, key, value, ttl);
    return response;
  };

  hgetallSecond = async (key: string) => {
    const response = await this.hgetall(this.secondRedis, key);
    return response;
  };

  deleteSecond = async (key: string) => {
    const response = await this.delete(this.secondRedis, key);
    return response;
  };

  deleteThird = async (key: string) => {
    const response = await this.delete(this.thirdRedis, key);
    return response;
  };

  getThird = async (key: string) => {
    const response = await this.get(this.thirdRedis, key);
    return response;
  };

  hgetallThird = async (key: string) => {
    const response = await this.hgetall(this.thirdRedis, key);
    return response;
  };

  hsetThird = async (key: string, value: any, ttl: number | null = null) => {
    const response = await this.hset(this.thirdRedis, key, value, ttl);
    return response;
  };

  hmsetThird = async (key: string, value: any, ttl: number | null = null) => {
    const response = await this.hmset(this.thirdRedis, key, value, ttl);
    return response;
  };

  private retryConnection = async () => {
    try {
      this.connect();
    } catch (e) {
      // this.logger.error('Failed to connect', '', 'REDIS');

      throw new Error(e.message);
    }
  };

  private retry = async (fn: () => Promise<any>, retries: number) => {
    try {
      return await fn();
    } catch (e) {
      if (retries) {
        await this.retryConnection();
        return await this.retry(fn, retries - 1);
      } else {
        // this.logger.error('Failed all retries', '', 'REDIS');

        throw new Error(e.message);
      }
    }
  };

  onApplicationShutdown() {
    // this.logger.error('closing redis connection...');
  }
}
