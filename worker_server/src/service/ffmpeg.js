import fs from "fs/promises";
import os from "os";
import path from "path";
import ffmpeg from "fluent-ffmpeg";
import "dotenv/config";

import { createWorker } from "../config/queue.js";
import { downloadObjectToFile, uploadDirectoryToBucket } from "./storage.js";
import { VideoDB_operation } from "./db.js";
import { formatOut } from "../util/helper.js";
import { cleanupTemp } from "../processor/cleanUp.js";

const rawBucket = process.env.BUCKET_RAW_VIDEO;
const processedBucket = process.env.BUCKET_PROCESSED_VIDEO;
const { updateStatus, updateByVideoId } = VideoDB_operation;

const transcodeToHls = (inputFile, outputPlaylist, segmentDirectory) => {
  return new Promise((resolve, reject) => {
    ffmpeg(inputFile)
      .outputOptions([
        "-preset fast",                     // Balance transcode speed with file size
        "-g 48", "-sc_threshold 0",         // Configurate Group of Pictures
        "-c:v libx264", "-c:a aac",         // Convert video to H264 standard and AAC sound
        "-b:v 1200k",
        "-b:a 128k",
        "-hls_time 6",                      // Split into segments, each lasts for 6 seconds
        "-hls_playlist_type vod",           // Video on demand
        "-hls_flags independent_segments",
        "-hls_segment_filename",
        path.join(segmentDirectory, "segment_%03d.ts"), // Segment format: segment_XXX.ts
      ])
      .output(outputPlaylist)
      .on("error", (err) => reject(err))
      .on("end", () => resolve())
      .run();
  });
};

const processVideoJob = async (job) => {
  // Take job from BullMQ
  const { videoId, videoPath } = job.data;

  if (!videoId || !videoPath) {
    throw new Error("Job payload must include videoId and videoPath");
  }

  console.log(`[Worker] received job for videoId=${formatOut(videoId)} rawKey=${videoPath}`);

  // Create temporary directory
  const tempBase = await fs.mkdtemp(path.join(os.tmpdir(), `metube-${videoId}-`));
  const rawFile = path.join(tempBase, "raw.mp4");
  const hlsDir = path.join(tempBase, "hls");

  await fs.mkdir(hlsDir, { recursive: true });

  const hlsPrefix = `hls/${videoId}`;
  const playlistKey = `${hlsPrefix}/index.m3u8`;

  try {
      // Pull raw video from vietnix to local machine
      await downloadObjectToFile(rawBucket, videoPath, rawFile);

      // Split video into HLS format (Many .ts & 1 file list .m3u8)
      await transcodeToHls(rawFile, path.join(hlsDir, "index.m3u8"), hlsDir);

      // Upload processed HLS to Vietnix
      await uploadDirectoryToBucket(processedBucket, hlsPrefix, hlsDir);

      // Update DB: status = "ready" & HLS path
      await updateByVideoId(videoId, { status: "ready", hlsPath: playlistKey });

      console.log(`[Worker] finished processing videoId=${videoId}`);
      return { status: "ready", hlsPath: playlistKey };
  } 
  catch (err) {
      console.error(`[Worker] processing failed for videoId=${videoId}:`, err.message || err);
      // Update DB: status = "failed" to retry
      await updateStatus(videoId, "failed");
      throw err;
  } 
  finally {
      // Clean up after finishing job
      await cleanupTemp(tempBase);
  }
};

export const worker = createWorker(processVideoJob);
