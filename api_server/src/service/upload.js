import { PutObjectCommand } from '@aws-sdk/client-s3';
import "dotenv/config";

import vietnix from "../config/storage.js";
import { vnTimeString } from "../util/helper.js";
import { validFileExtension } from '../middleware/validate.js';

const raw_video_bucket = process.env.BUCKET_RAW_VIDEO;

export const getCommand = (file, bucket, key) => {
    const filename = file.originalname;
    if(!validFileExtension(filename)) throw new Error("Unsupport this file's extension");

    const command = new PutObjectCommand({
        ACL: "private",
        Bucket: bucket,
        Key: key,
        Body: file.buffer,
        ContentType: file.mimetype,
    })
    return command;
}
