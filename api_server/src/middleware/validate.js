import { HeadObjectCommand } from "@aws-sdk/client-s3";
import vietnix from "../config/storage.js";

export const validMimeType = (mimeType) => {
    return ["mp4", "webm", "ogg", "x-matroska", "quicktime", "mpeg", "x-ms-wmv", "3gpp"]
           .find(type => `video/${type}` === mimeType);
}

export const getFileExtension = (filename) => {return filename.split(".").pop();}

export const validFileExtension = (filename) => {
    const file_extension = getFileExtension(filename);
    return ['mp4', 'mov', 'avi', 'mkv', 'wmv', 'webm'].includes(file_extension);
}

export const checkHeadRequestS3 = async(bucket, videoId) => {
    try{
        const my_command = new HeadObjectCommand({
             Bucket: bucket,
             Key: videoId,
        });
        // Send HEAD request to Vietnix
        await vietnix.send(my_command);
        // If no errors then video exists
        return true;
    }
    catch(err){
        return false;
        throw err;
    }
}