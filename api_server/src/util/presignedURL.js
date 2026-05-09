import vietnix from "../config/storage.js";
import "dotenv/config";

import { PutObjectCommand } from "@aws-sdk/client-s3";
import { getSignedUrl } from "@aws-sdk/s3-request-presigner";
import { createPresignedPost } from "@aws-sdk/s3-presigned-post";

import { vnTimeString } from "./helper.js";
import { validMimeType, validFileExtension, validFileSize } from "../middleware/validate.js";

// Return temporary presigned URL & key 
export const getPresignedURL = async({
    fileName, 
    bucket, 
    contentType, 
    fileSize,
    expiresIn = 60 * 10, // Set TTL = 10 minutes
}) => {

    if(!validMimeType(contentType)) throw new Error("Unsupported MIME type");
    if(!validFileExtension(fileName)) throw new Error("Invalid or unsupported file extension");
    if(!validFileSize(fileSize)) throw new Error("File exceeded allowed file size restriction");

    const key = `videos/${vnTimeString()}_${fileName}`;
    
    // Enforce Vietnix to auto reject file that has unallowed MIME type & size > 500MB
    const { url, fields } = await createPresignedPost(vietnix, {
        Bucket: bucket,
        Key: key,
        Conditions: [
            ["content-length-range", 0, 500 * 1024 * 1024],
            ["eq", "$Content-Type", contentType],
        ],
        Fields: {
            "Content-Type": contentType, 
        },
        Expires: expiresIn,
    });

    return {
        url: url,
        fields: fields, 
        videoId: key,
    }
}