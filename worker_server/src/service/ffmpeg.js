import path from "path";
import "dotenv/config";

import { createWorker } from "../config/queue.js";
import { downloadObjectToFile, uploadDirectoryToBucket } from "./storage.js";
import { VideoDB_operation } from "./db.js";
import { formatOut } from "../util/helper.js";
import { VIDEO_STATUS } from "../../../api_server/src/util/constants.js";
import { setUpWrkEnv } from "../util/workspace.js";
import { HLS } from "../processor/HLS.js";
import { generateThumbnail } from "../processor/thumbnailGen.js";
import { cleanUpTmp } from "../processor/cleanUp.js"

const rawBucket = process.env.BUCKET_RAW_VIDEO;
const processedBucket = process.env.BUCKET_PROCESSED_VIDEO;

const { updateStatus, updateByVideoId } = VideoDB_operation;

const processVideoJob = async (job) => {
  // Take job from BullMQ
  const { videoId, videoPath } = job.data;
  if (!videoId || !videoPath) throw new Error("Job payload must include videoId and videoPath");

  // Set up working space
  const wrkEnv = await setUpWrkEnv({ videoId, videoPath });
  const { tempDir, rawFile, hlsChunksDir, manifestDir, thumbnailDir} = wrkEnv;

  try {
      // 1> Download raw video from vietnix
      await downloadObjectToFile(rawBucket, videoPath, rawFile);

      // 2> Transcode & generate thumbnail running in parallel
      await Promise.all([
          HLS(rawFile, { hlsChunksDir, manifestDir }),
          generateThumbnail(rawFile, thumbnailDir, 5)
      ]);

      // 3> Declare prefix in vietnix
      const chunksPrefix = `videos/${videoId}/HLS_chunks`;
      const manifestPrefix = `videos/${videoId}/manifest`;
      const playlistKey = `${manifestPrefix}/index.m3u8`;
      const thumbPrefix = `videos/${videoId}/thumbnail`;

      // 4> Upload processed video to vietnix
      await Promise.all([
          uploadDirectoryToBucket(processedBucket, chunksPrefix, hlsChunksDir),
          uploadDirectoryToBucket(processedBucket, manifestPrefix, manifestDir),
          uploadDirectoryToBucket(processedBucket, thumbPrefix, thumbnailDir)
      ]);

      // 5> Update DB with metadata
      await updateByVideoId(videoId, { 
          status: VIDEO_STATUS.READY, 
          hlsPath: playlistKey, 
          thumbnailPath: `${thumbPrefix}/thumbnail.jpg`
      });

      return { status: VIDEO_STATUS.READY, hlsPath: playlistKey };
  } 
  catch (err) {
      console.error(`[-] Worker processing failed for videoId=${videoId}:`, err.message || err);
      // Update DB: status = "failed" to retry
      await updateStatus(videoId, VIDEO_STATUS.FAIL);
      throw err;
  } 
  finally {
      // Clean up after finishing job
      await cleanUpTmp(tempDir);
  }
};

export const worker = createWorker(processVideoJob);
