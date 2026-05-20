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
} from "../controller/videoController.js";

import { isAuthenticated } from "../middleware/auth.js";

const router = express.Router();

// upload flow requires login
router.post("/presigned-URL", isAuthenticated, generatePresignedURL);

router.post("/upFile/presigned-URL", isAuthenticated, uploadThumbS3);

// confirm upload requires login
router.post("/:videoId/cnf", isAuthenticated, confirmUpload);

// initialize video in DB requires login
router.post("/:videoId/initVidDB", isAuthenticated, initStatusDB);

// worker trigger requires login
router.post("/:videoId/wrkJobs", isAuthenticated, callWorker);

// status check requires login (optional but recommended)
router.get("/:videoId/upStatus", isAuthenticated, checkStatusUpload);

// public routes (can be viewed without login)
router.get("/videos", getAllVideos);

router.get("/videos/:videoId", getVideoById);

// update requires login
router.patch("/:videoId/goPublish", isAuthenticated, updateSubmitDB);

export default router;
