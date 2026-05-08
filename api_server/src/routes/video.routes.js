import express from 'express';

import { upload } from '../middleware/uploadFile.js';
import { generatePresignedURL, uploadVideo, confirmUpload, initStatusDB, checkStatusUpload, updateProcessStatus } from '../controller/videoController.js';

// --- Note: Because vietnix key's format is "videos/{videoId}""
// ---       so it need encrypting before requesting api (route confirmUpload)
// ---       or else it will trigger error because the splash ("/")

const router = express.Router();

router.post("/upload-video", upload.single("file"), uploadVideo, (error, req, res, next) => {
    if (error.code === 'LIMIT_FILE_SIZE') return res.status(400).send('Exceeded maximum allowed file size');
});

router.post("/presigned-URL", generatePresignedURL);

router.post("/:videoId/cnf", confirmUpload);

router.post("/:videoId/initVidDB", initStatusDB);

router.get("/:videoId/upStatus", checkStatusUpload);

router.patch("/:videoId/processStatus", updateProcessStatus);

export default router;