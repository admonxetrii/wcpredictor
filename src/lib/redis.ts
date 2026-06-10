import { Redis } from 'ioredis';

const globalForRedis = global as unknown as { redis: Redis };

export const redis =
  globalForRedis.redis ||
  new Redis({
    host: process.env.REDIS_HOST || '127.0.0.1',
    port: parseInt(process.env.REDIS_PORT || '6379'),
    password: process.env.REDIS_PASSWORD || undefined,
    connectTimeout: parseInt(process.env.REDIS_CONNECT_TIMEOUT || '2000'),
    lazyConnect: true,
  });

if (process.env.NODE_ENV !== 'production') globalForRedis.redis = redis;

/**
 * Helper to fetch data from cache or execute the fetcher and cache the result.
 * @param key The Redis key
 * @param fetcher The function to execute if the cache is a miss
 * @param ttlSeconds Optional time-to-live in seconds
 */
export async function getCached<T>(key: string, fetcher: () => Promise<T>, ttlSeconds?: number): Promise<T> {
  try {
    const cached = await redis.get(key);
    if (cached) {
      // Date objects need to be parsed properly if needed, but Prisma data typically serializes okay or we rely on Next.js hydration.
      // Wait, date objects will become strings. Next.js server components can pass dates to client, but here it becomes strings.
      // We will parse it and then recursively convert strings matching ISO dates to Date objects to ensure Prisma compatibility.
      const parsed = JSON.parse(cached, (k, v) => {
        if (typeof v === 'string' && /^\d{4}-\d{2}-\d{2}T\d{2}:\d{2}:\d{2}.\d{3}Z$/.test(v)) {
          return new Date(v);
        }
        return v;
      });
      return parsed;
    }
  } catch (error) {
    console.error(`Redis get error for key ${key}:`, error);
  }

  const data = await fetcher();

  if (data !== null && data !== undefined) {
    try {
      if (ttlSeconds) {
        await redis.setex(key, ttlSeconds, JSON.stringify(data));
      } else {
        await redis.set(key, JSON.stringify(data));
      }
    } catch (error) {
      console.error(`Redis set error for key ${key}:`, error);
    }
  }

  return data;
}

/**
 * Helper to invalidate one or multiple keys
 */
export async function invalidateCache(keys: string | string[]) {
  try {
    if (Array.isArray(keys)) {
      if (keys.length > 0) {
        await redis.del(...keys);
      }
    } else {
      await redis.del(keys);
    }
  } catch (error) {
    console.error('Redis invalidation error:', error);
  }
}

/**
 * Helper to invalidate keys by pattern (e.g. "user:*")
 */
export async function invalidateCachePattern(pattern: string) {
  try {
    const keys = await redis.keys(pattern);
    if (keys.length > 0) {
      await redis.del(...keys);
    }
  } catch (error) {
    console.error('Redis pattern invalidation error:', error);
  }
}
