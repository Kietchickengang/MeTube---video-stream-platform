import { ObjectId } from "mongodb";

export const standardInputDB = (data) => {
    const now = new Date();

    const { videoId, userId, title, description, videoPath, duration, resolution, videoSize, mimeType } = data;

    return {
        videoId: videoId,
        userId: new ObjectId(userId),
        title: title || "",

        description: description || "",
        status: "uploading",
        videoPath: videoPath || "",
        hlsPath: "",
        thumbnailUrl: "",
        duration: duration || 0,
        resolution: resolution || "360p",
        videoSize: videoSize || 0,
        mimeType: mimeType || "",

        unexpected_err: "",
        retryCnt: 0,

        createdAt: now,
        updatedAt: now,
    };
};