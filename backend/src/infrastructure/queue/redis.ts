import IORedis from "ioredis";
import { env } from "../../config/env";

let redis: IORedis | null = null;

export const getRedisConnection = () => {
  if (env.REDIS_ENABLED !== "true") return null;
  if (!env.REDIS_URL) return null;

  if (!redis) {
    redis = new IORedis(env.REDIS_URL, {
      maxRetriesPerRequest: null,
      enableReadyCheck: false,
      lazyConnect: true
    });
  }

  return redis;
};
