import express from 'express';

import { upload } from '../middleware/uploadFile.js';
import { generatePresignedURL, uploadVideo, confirmUpload, updateStatusDB, checkStatusUpload } from '../controller/videoController.js';

const router = express.Router();

router.post("/upload-video", upload.single("file"), uploadVideo, (error, req, res, next) => {
    if (error.code === 'LIMIT_FILE_SIZE') return res.status(400).send('Exceeded maximum allowed file size');
});

router.post("/presigned-URL", generatePresignedURL);

router.post("/:videoId/cnf", confirmUpload);

router.post("/:videoId/upProcess", updateStatusDB);

router.get("/:videoId/upStatus", checkStatusUpload);

export default router;