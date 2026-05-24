import { createClient, type RedisClientType } from "redis";

const redisUrl = process.env.REDIS_URL;
const REDIS_CONNECT_TIMEOUT_MS = 1_000;
const REDIS_RETRY_COOLDOWN_MS = 30_000;

const globalForRedis = globalThis as typeof globalThis & {
  _redisClient?: RedisClientType;
  _redisClientPromise?: Promise<RedisClientType>;
  _redisDisabledUntil?: number;
};

export const getRedisClient = async () => {
  if (!redisUrl) {
    return null;
  }

  if (
    globalForRedis._redisDisabledUntil &&
    Date.now() < globalForRedis._redisDisabledUntil
  ) {
    return null;
  }

  if (!globalForRedis._redisClient) {
    const client = createClient({
      url: redisUrl,
      socket: {
        connectTimeout: REDIS_CONNECT_TIMEOUT_MS,
        reconnectStrategy: false,
      },
    });

    client.on("error", (error) => {
      console.error("Redis connection error", error);
    });

    globalForRedis._redisClient = client as RedisClientType;
    globalForRedis._redisClientPromise = client
      .connect()
      .then(() => client as RedisClientType);
  }

  try {
    return await globalForRedis._redisClientPromise!;
  } catch (error) {
    console.error("Failed to connect to Redis", error);
    globalForRedis._redisClient?.destroy();
    globalForRedis._redisClient = undefined;
    globalForRedis._redisClientPromise = undefined;
    globalForRedis._redisDisabledUntil = Date.now() + REDIS_RETRY_COOLDOWN_MS;
    return null;
  }
};
