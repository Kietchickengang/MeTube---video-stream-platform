import { redis_config } from "../config/redis.js";
import { videoQueue, initVideoQueue } from "../config/bullmq.js";

initVideoQueue();

// Sample test
export const testMQ = async() => {
    await videoQueue.add("test", {
        videoId: "vid_test_001",
        videoPath: "video/raw/test.mp4",
    })
};

// Add job to Redis
export const addJobToQueue = async(video) => {
    const { videoId, videoPath, timestamp, file } = video;
    try{
        await videoQueue.add("processing-line", {
            videoId: videoId,
            videoPath: videoPath,
            timestamp: timestamp,
            file: file,
        },{
            // Prevent duplicate
            jobId: videoId, 
            // Auto retry if errors
            attempts: 7,
            // Break-time each retry
            backoff: {
                type: 'exponential', // Double each time
                delay: 1000 * 60 * 5, // 5 minutes each time
            }
        })
    }
    catch(err){
        console.error(`BullMQ can not add video ${videoId} to queue`, err);
        // Inform errors to the Controller 
        throw err; 
    }
    
} 