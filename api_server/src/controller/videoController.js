import "dotenv/config";
import { getPresignedURL } from '../util/presignedURL.js';
import { uploadRawVid } from '../service/upload.js';
import { checkHeadRequestS3 } from "../middleware/validate.js";
import { VideoDB_operation } from "../../../worker_server/src/service/db.js";

const raw_video_bucket = process.env.BUCKET_RAW_VIDEO;
const { updateStatus, findByVideoId } = VideoDB_operation;

export const generatePresignedURL = async(req, res) => {
    try{
        const { fileName, contentType } = req.body;
        const { url, videoId } = await getPresignedURL({
            fileName: fileName, 
            bucket: raw_video_bucket,
            contentType: contentType,
        });

        return res.status(200).json({
            url: url,
            key: videoId,
        })
    }
    catch(err){
        console.log(`Something wrong with presigned URL service: ${err.message}`);
        res.status(500).json({
            message: " Failed to generate presigned URL for object upload",
            error: err.message,
        })
    }
}

export const uploadVideo = async(req, res) => {
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
}

export const confirmUpload = async(req, res) => {
    try{
        // Extract videoId from client request
        const { videoId } = req.params;
        const fileIsExist = await checkHeadRequestS3(raw_video_bucket, videoId);
        if(!fileIsExist) return res.status(400).json({
            message: "Video is not existed",
        })
        return res.status(200).json({
            message: "Valid video, upload confirmation successfully",
        })
    }
    catch(err){
        console.log(`Upload confirmation failed: ${err.message}`);
        return res.status(500).json({
            message: "Upload confirmation failed.Try again",
            error: err.message,
        })
    }
}

export const updateStatusDB = async(req, res) => {
    try{
        const { videoId } = req.params;
        await updateStatus(videoId, "processing");
        return res.status(200).json({
            message: `Updated video ${videoId}'s status`,
        })
    }
    catch(err){
        console.log(`Can not update Database: ${err}`);
        return res.status(500).json({
            message: "Update failed.Try again",
            error: err.message,
        })
    }
}

export const checkStatusUpload = async(req, res) => {
    try{
        const { videoId } = req.params;
        const uploadVideo = await findByVideoId(videoId);
        return res.status(200).json({
            message: `Accessed information from Database`,
            data: {
                uploadStatus: uploadVideo.status,
            }
        })
    }
    catch(err){
        console.log(`Can not get information from Database: ${err}`);
        return res.status(500).json({
            message: "Get information failed.Try again",
            error: err.message,
        })
    }
}