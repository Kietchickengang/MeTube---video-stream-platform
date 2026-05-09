import { ListObjectsV2Command } from "@aws-sdk/client-s3";
import vietnix from "../config/storage.js";

// Check MIME
export const validMimeType = (mimeType) => {
    return ["mp4", "webm", "ogg", "x-matroska", "quicktime", "mpeg", "x-ms-wmv", "3gpp"]
           .find(type => `video/${type}` === mimeType);
}

export const getFileExtension = (filename) => {return filename.split(".").pop();}

// Check extension
export const validFileExtension = (filename) => {
    const file_extension = getFileExtension(filename);
    return ['mp4', 'mov', 'avi', 'mkv', 'wmv', 'webm'].includes(file_extension);
}

// Check size
export const validFileSize = (fileSize) => {
    // Set maximum size for video file
    const MAX_ALLOWED_SIZE = 500 * 1024 * 1024;
    return fileSize && fileSize < MAX_ALLOWED_SIZE;
}   

// Check storage Head request
export const checkHeadRequestS3 = async(bucket, videoId) => {
    try{
        const my_command = new ListObjectsV2Command({
             Bucket: bucket,
             Prefix: videoId,
        });
        // Send HEAD request to Vietnix
        const vietnixRep = await vietnix.send(my_command);

        // Search for video
        if(vietnixRep.Contents && vietnixRep.Contents.length){
            const video = vietnixRep.Contents.find(e => e.Key === videoId);
            if(video) return true;
        }

        // Video no found (400)
        return false;
    }
    catch(err){
        console.error(`Something wrong here: ${err}`);
        return false;
    }
}