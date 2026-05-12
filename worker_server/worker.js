import express from "express";
import "dotenv/config";
import { worker } from "./src/service/ffmpeg.js";
import { formatOut } from "./src/util/helper.js";
//import "./src/service/test.js";

const app = express();
const port = process.env.PORT || 4000;

app.listen(port, () => {
  console.log(`Worker server is running on port ${port}`);
});

worker.on("completed", (job) => {
  console.log(`[Worker] job completed: ${formatOut(job.id)} (${formatOut(job.name)})`);
});

worker.on("failed", (job, err) => {
  console.error(`[Worker] job failed: ${formatOut(job?.id)} (${formatOut(job?.name)})`, err?.message || err);
});

