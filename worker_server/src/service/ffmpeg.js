import fs from "fs/promises";
import os from "os";
import path from "path";
import ffmpeg from "fluent-ffmpeg";
import { createWorker } from "../config/queue.js";
import { downloadObjectToFile, uploadDirectoryToBucket } from "./storage.js";
import { VideoDB_operation } from "./db.js";

const rawBucket = process.env.BUCKET_RAW_VIDEO;
const processedBucket = process.env.BUCKET_PROCESSED_VIDEO || process.env.BUCKET_RAW_VIDEO;
const { updateStatus, updateByVideoId } = VideoDB_operation;

const transcodeToHls = (inputFile, outputPlaylist, segmentDirectory) => {
  return new Promise((resolve, reject) => {
    ffmpeg(inputFile)
      .outputOptions([
        "-preset fast",
        "-g 48",
        "-sc_threshold 0",
        "-c:v libx264",
        "-c:a aac",
        "-b:v 1200k",
        "-b:a 128k",
        "-hls_time 6",
        "-hls_playlist_type vod",
        "-hls_flags independent_segments",
        "-hls_segment_filename",
        path.join(segmentDirectory, "segment_%03d.ts"),
      ])
      .output(outputPlaylist)
      .on("error", (err) => reject(err))
      .on("end", () => resolve())
      .run();
  });
};

const cleanupTemp = async (tempDir) => {
  if (!tempDir) return;
  try {
    await fs.rm(tempDir, { recursive: true, force: true });
  } catch (err) {
    console.warn(`[Worker] cleanup failed for ${tempDir}:`, err.message || err);
  }
};

const processVideoJob = async (job) => {
  const { videoId, videoPath } = job.data;
  if (!videoId || !videoPath) {
    throw new Error("Job payload must include videoId and videoPath");
  }

  console.log(`[Worker] received job for videoId=${videoId} rawKey=${videoPath}`);
  await updateStatus(videoId, "processing");

  const tempBase = await fs.mkdtemp(path.join(os.tmpdir(), `metube-${videoId}-`));
  const rawFile = path.join(tempBase, "raw.mp4");
  const hlsDir = path.join(tempBase, "hls");
  await fs.mkdir(hlsDir, { recursive: true });

  const hlsPrefix = `hls/${videoId}`;
  const playlistKey = `${hlsPrefix}/index.m3u8`;

  try {
    await downloadObjectToFile(rawBucket, videoPath, rawFile);
    await transcodeToHls(rawFile, path.join(hlsDir, "index.m3u8"), hlsDir);
    await uploadDirectoryToBucket(processedBucket, hlsPrefix, hlsDir);
    await updateByVideoId(videoId, { status: "ready", hlsPath: playlistKey });
    console.log(`[Worker] finished processing videoId=${videoId}`);
    return { status: "ready", hlsPath: playlistKey };
  } catch (err) {
    console.error(`[Worker] processing failed for videoId=${videoId}:`, err.message || err);
    await updateStatus(videoId, "failed");
    throw err;
  } finally {
    await cleanupTemp(tempBase);
  }
};

export const worker = createWorker(processVideoJob);
