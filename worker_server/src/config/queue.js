import { Worker } from "bullmq";
import { redis_config } from "./redis.js";

const queueName = "video_processing";

export const createWorker = (processor) => {
  const worker = new Worker(queueName, processor, {
    connection: redis_config,
    concurrency: 2,
    lockDuration: 300000,
    autorun: true,
    removeOnComplete: true,
    removeOnFail: { count: 777, age: 3600 * 24 },
  });

  worker.on("completed", (job) => {
    console.log(`[Worker] completed job ${job.id} for ${job.name}`);
  });

  worker.on("failed", (job, err) => {
    console.error(`[Worker] failed job ${job?.id} for ${job?.name}:`, err?.message || err);
  });

  worker.on("error", (err) => {
    console.error("[Worker] queue error:", err);
  });

  return worker;
};
