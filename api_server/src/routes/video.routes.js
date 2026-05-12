import express from 'express';

import { 
    generatePresignedURL, confirmUpload, initStatusDB, checkStatusUpload, updateSubmitDB, 
    callWorker, uploadThumbS3,
 } from '../controller/videoController.js';

// --- Note: Because vietnix key's format is "videos/{videoId}""
// ---       so it need encrypting before requesting api (route confirmUpload)
// ---       or else it will trigger error because the splash ("/")

const router = express.Router();

router.post("/presigned-URL", generatePresignedURL);

router.post("/upFile/presigned-URL", uploadThumbS3);

router.post("/:videoId/cnf", confirmUpload);

router.post("/:videoId/initVidDB", initStatusDB);

router.post("/:videoId/wrkJobs", callWorker);

router.get("/:videoId/upStatus", checkStatusUpload);

router.patch("/:videoId/goPublish", updateSubmitDB);

export default router;