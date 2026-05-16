import { Worker } from "bullmq";
import { redis_config } from "./redis.js";
import { formatOut } from "../util/helper.js";

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
    console.log(`[Worker] processing job: ${formatOut(job.id)} for ${formatOut(job.name)}`);
  });

  worker.on("failed", (job, err) => {
    console.error(`[-] Worker failed job ${formatOut(job?.id)} for ${formatOut(job?.name)}:`, err?.message || err);
  });

  worker.on("error", (err) => {
    console.error("[-] Worker queue error:", err);
  });

  return worker;
};
