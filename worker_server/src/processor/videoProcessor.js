// Start video process
import { worker } from "../service/ffmpeg.js";
import { formatOut } from "../util/helper.js";

worker.on("completed", (job) => {
  console.log(`[Worker] job completed: ${formatOut(job.id)} (${formatOut(job.name)})`);
});

worker.on("failed", (job, err) => {
  console.error(`[Worker] job failed: ${formatOut(job?.id)} (${formatOut(job?.name)})`, err?.message || err);
});