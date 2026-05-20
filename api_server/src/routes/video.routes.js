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

router.post("/presigned-URL", isAuthenticated, generatePresignedURL);

router.post("/upFile/presigned-URL", isAuthenticated, uploadThumbS3);

// ===== PUBLIC =====
router.get("/videos", getAllVideos);

router.get("/videos/:videoId", getVideoById);

// ===== USER =====
router.get("/my-videos", isAuthenticated, getMyVideos);

// ===== VIDEO ACTIONS =====
router.post("/:videoId/cnf", isAuthenticated, confirmUpload);

router.post("/:videoId/initVidDB", isAuthenticated, initStatusDB);

router.post("/:videoId/wrkJobs", isAuthenticated, callWorker);

router.get("/:videoId/upStatus", isAuthenticated, checkStatusUpload);

router.patch("/:videoId/goPublish", isAuthenticated, updateSubmitDB);

router.patch("/:videoId/edit", isAuthenticated, updateVideoInfo);

router.delete("/:videoId", isAuthenticated, deleteVideo);

export default router;
