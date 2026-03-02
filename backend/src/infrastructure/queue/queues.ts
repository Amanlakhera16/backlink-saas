import { Queue } from "bullmq";
import { env } from "../../config/env";
import { createInMemoryQueue } from "./inMemoryQueue";
import { processAiJob } from "./processor";
import { getRedisConnection } from "./redis";

const createRedisQueue = () => {
  const connection = getRedisConnection();
  if (!connection) return null;

  return new Queue("ai-jobs", {
    connection,
    defaultJobOptions: {
      attempts: 3,
      backoff: { type: "exponential", delay: 1000 },
      removeOnComplete: 1000,
      removeOnFail: 1000
    }
  });
};

const createFallbackQueue = () => {
  return createInMemoryQueue(async job => {
    await processAiJob(job.name, job.data);
  });
};

const shouldUseRedisQueue = env.USE_QUEUES === "true" && env.REDIS_ENABLED === "true";

const redisQueue = shouldUseRedisQueue ? createRedisQueue() : null;

if (shouldUseRedisQueue && !redisQueue) {
  console.warn("Redis queue requested but unavailable. Falling back to in-memory queue.");
}

export const aiQueue = redisQueue ?? createFallbackQueue();
