import express from 'express';
import multer from 'multer';
import "dotenv/config";

import { uploadRawVid } from '../service/upload.js';
import { getPresignedURL } from '../util/presignedURL.js';

const router = express.Router();

// Use multer to upload file to object storage s3 (vietnix)
const upload = multer({ storage: multer.memoryStorage() });
const raw_video_bucket = process.env.BUCKET_RAW_VIDEO;

router.post("/test", upload.single("file"), async (req, res) => {
    try{
        const res_data = await uploadRawVid(req.file);
        return res.status(201).json({
            message: "Upload successfully",
            data: res_data,
         });
    }
    catch(err){
        console.log(`Upload failed: ${err.message}`);
        return res.status(500).json({
            message: "Upload failed.Try again",
            error: err.message,
        });
    }
})

router.post("/upload-video", upload.single("file"), async(req, res) => {
    try{
        const file = req.file;
        const { url, key } = await getPresignedURL({
            file: file, 
            bucket: raw_video_bucket
        });

        return res.status(200).json({
            url: url,
            key: key,
        })
    }
    catch(err){
        console.log(`Something wrong with presigned URL service: ${err.message}`);
        res.status(500).json({
            message: " Failed to generate presigned URL for object upload",
            error: err.message,
        })
    }
})

export default router;