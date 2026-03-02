import { Worker } from "bullmq";
import { env } from "./config/env";
import { processAiJob, type AiJobData, type AiJobName } from "./infrastructure/queue/processor";
import { getRedisConnection } from "./infrastructure/queue/redis";

if (env.USE_QUEUES !== "true") {
  console.warn("Queues are disabled (USE_QUEUES=false). Worker will not start.");
  process.exit(0);
}

if (env.REDIS_ENABLED !== "true") {
  console.warn("Redis is disabled (REDIS_ENABLED=false). Worker will not start.");
  process.exit(0);
}

const connection = getRedisConnection();
if (!connection) {
  console.warn("Redis connection not available. Worker will not start.");
  process.exit(0);
}

const worker = new Worker(
  "ai-jobs",
  async job => {
    await processAiJob(job.name as AiJobName, job.data as AiJobData);
  },
  { connection }
);

worker.on("failed", (job, err) => {
  console.error("Job failed", job?.id, err);
});
