import vietnix from "../config/storage.js";
import "dotenv/config";

import { PutObjectCommand } from "@aws-sdk/client-s3";
import { getSignedUrl } from "@aws-sdk/s3-request-presigner";
import { vnTimeString } from "./helper.js";
import { validMimeType } from "../middleware/validate.js";

// Return temporary presigned URL & key 
export const getPresignedURL = async({
    fileName, 
    bucket, 
    contentType, 
    expiresIn = 60 * 10, // Set TTL = 10 minutes
}) => {
    if(!validMimeType(contentType)) throw new Error("Unsupported MIME type");

    const key = `videos/${vnTimeString}_${fileName}`;
    const my_command = new PutObjectCommand({
        Bucket: bucket,
        Key: key,
        ContentType: contentType,
    });

    const presignedURL = await getSignedUrl(vietnix, my_command, {expiresIn});
    return {
        url: presignedURL,
        videoId: key,
    }
}