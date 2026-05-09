import express from 'express';

import { generatePresignedURL, confirmUpload, initStatusDB, checkStatusUpload, updateSubmitDB } from '../controller/videoController.js';

// --- Note: Because vietnix key's format is "videos/{videoId}""
// ---       so it need encrypting before requesting api (route confirmUpload)
// ---       or else it will trigger error because the splash ("/")

const router = express.Router();

router.post("/presigned-URL", generatePresignedURL);

router.post("/:videoId/cnf", confirmUpload);

router.post("/:videoId/initVidDB", initStatusDB);

router.get("/:videoId/upStatus", checkStatusUpload);

router.patch("/:videoId/goPublish", updateSubmitDB);

export default router;