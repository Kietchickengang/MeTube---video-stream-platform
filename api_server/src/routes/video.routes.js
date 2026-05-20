import express from "express";

import {
  generatePresignedURL,
  confirmUpload,
  initStatusDB,
  checkStatusUpload,
  updateSubmitDB,
  callWorker,
  uploadThumbS3,
  getAllVideos,
  getVideoById,
  getMyVideos,
  deleteVideo,
  updateVideoInfo,
} from "../controller/videoController.js";

import { isAuthenticated } from "../middleware/auth.js";

const router = express.Router();

// VIDEO LIST + VIDEO DETAIL

router.get("/videos", getAllVideos);

router.get("/videos/:videoId", getVideoById);

// MY VIDEOS

router.get("/my-videos", isAuthenticated, getMyVideos);

// EDIT / DELETE

router.patch("/videos/:videoId/edit", isAuthenticated, updateVideoInfo);

router.delete("/videos/:videoId", isAuthenticated, deleteVideo);

// UPLOAD FLOW

router.post("/presigned-URL", isAuthenticated, generatePresignedURL);

router.post("/upFile/presigned-URL", isAuthenticated, uploadThumbS3);

router.post("/videos/:videoId/cnf", isAuthenticated, confirmUpload);

router.post("/videos/:videoId/initVidDB", isAuthenticated, initStatusDB);

router.post("/videos/:videoId/wrkJobs", isAuthenticated, callWorker);

router.get("/videos/:videoId/upStatus", isAuthenticated, checkStatusUpload);

router.patch("/videos/:videoId/goPublish", isAuthenticated, updateSubmitDB);

export default router;
