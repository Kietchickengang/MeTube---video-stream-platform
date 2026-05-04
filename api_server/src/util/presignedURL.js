import vietnix from "../config/storage.js";
import "dotenv/config";

import { PutObjectCommand } from "@aws-sdk/client-s3";
import { getSignedUrl } from "@aws-sdk/s3-request-presigner";
import { getCommand } from "../service/upload.js";
import { vnTimeString } from "./helper.js";

// Return temporary presigned URL & key 
export const getPresignedURL = async({
    file, bucket, expiresIn = 60 * 5,
}) => {
    const key = `videos/${vnTimeString}_${file.originalname}`;

    const my_command = getCommand(file, bucket, key);

    const presignedURL = await getSignedUrl(vietnix, my_command, {expiresIn});
    return {
        url: presignedURL,
        key: key,
    }
}