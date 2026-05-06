// test connection between api_server & worker_server
import { videoWorker } from "../../../api_server/src/config/bullmq.js";

// Test sample
export const worker = videoWorker(async (job) => {
    console.log("=== JOB RECEIVED ===");
    console.log("Name:", job.name);
    console.log("Data:", job.data);

    await new Promise(r => setTimeout(r, 2000));

    console.log("=== PROCESS DONE ===\njob completed");
    return { status: "ok" };
});