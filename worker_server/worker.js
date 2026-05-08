import express from "express";
import "dotenv/config";
import { worker } from "./src/service/ffmpeg.js";

const app = express();
const port = process.env.PORT || 4000;

app.get("/health", (_, res) => {
  res.status(200).json({ status: "ok", worker: "running" });
});

app.listen(port, () => {
  console.log(`Worker server is running on port ${port}`);
});

worker.on("completed", (job) => {
  console.log(`[Worker] job completed: ${job.id} (${job.name})`);
});

worker.on("failed", (job, err) => {
  console.error(`[Worker] job failed: ${job?.id} (${job?.name})`, err?.message || err);
});
