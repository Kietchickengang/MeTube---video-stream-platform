import vietnix from "../config/storage.js";
import "dotenv/config";

import { getSignedUrl } from "@aws-sdk/s3-request-presigner";
import { createPresignedPost } from "@aws-sdk/s3-presigned-post";

import { vnTimeString } from "./helper.js";

import { validMimeType, validFileExtension, validFileSize } from "../middleware/validate.js";
import { validImgExtension, validImgMimeType, validImgSize } from "../middleware/validate.js";
import { decrypting } from "../middleware/AES.js";

const aes_secret = process.env.AES_SECRET_KEY;
const role = "admin";

// Return temporary presigned URL & key 
export const getPresignedURL = async({
    fileName,
    folderName = "", 
    bucket, 
    contentType, 
    fileSize,
    expiresIn = 60 * 10, // Set TTL = 10 minutes
    nameDir = "videos"
}) => {

    if((!validMimeType(contentType)   && nameDir === "videos") || (!validImgMimeType(contentType) && nameDir === "thumbnail")) throw new Error("Unsupported MIME type");
    if((!validFileExtension(fileName) && nameDir === "videos") || (!validImgExtension(fileName)   && nameDir === "thumbnail")) throw new Error("Invalid or unsupported file extension");
    if((!validFileSize(fileSize)      && nameDir === "videos") || (!validImgSize(fileSize)        && nameDir === "thumbnail")) throw new Error("File exceeded allowed file size restriction");

    const tmp = `${vnTimeString()}_${fileName}`;
    const key = `${nameDir}/${tmp}`; // for raw uploaded video
    const Tkey = `${role}/${decrypting(aes_secret, folderName).substring("videos/".length)}/thumbnail.jpg`; // for user uploaded thumbnail
    const propSize = (nameDir === "videos")? 500 : 7;

    // Enforce Vietnix to auto reject video file that has unallowed MIME type & size > 500MB
    // Reject user's uploaded image if size > 7MB
    const { url, fields } = await createPresignedPost(vietnix, {
        Bucket: bucket,
        Key: nameDir === "videos"? key : Tkey,
        Conditions: [
            ["content-length-range", 0, propSize * 1024 * 1024],
            ["eq", "$Content-Type", contentType],
        ],
        Fields: {
            "Content-Type": contentType, 
            acl: "public-read-write", // *** Required to have this line
        },
        Expires: expiresIn,
    });

    return {
        url: url,
        fields: fields, 
        videoId: key,
    }
}