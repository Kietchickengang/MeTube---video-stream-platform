import { ObjectId } from "mongodb";
import { VIDEO_STATUS } from "../util/constants.js";

export const standardInputDB = (data) => {
  const now = new Date();

  const {
    videoId,
    userId,
    title,
    description,
    videoPath,
    duration,
    resolution,
    videoSize,
    mimeType,
  } = data;

  return {
    videoId: videoId,
    userId: userId ? new ObjectId(userId) : null,

    title: title || "",
    description: description || "",

    status: VIDEO_STATUS.UPLOADING,

    videoPath: videoPath || "",
    hlsPath: "",
    thumbnailUrl: "",

    duration: duration || 0,
    resolution: resolution || [],

    videoSize: videoSize || 0,
    mimeType: mimeType || "",

    // FIX HERE
    views: 0,

    unexpected_err: "",
    retryCnt: 0,

    createdAt: now,
    updatedAt: now,
  };
};
