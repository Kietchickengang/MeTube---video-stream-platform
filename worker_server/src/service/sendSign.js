import Redis from 'ioredis';
import { redis_config } from '../config/redis.js';
import { VIDEO_STATUS } from '../../../api_server/src/util/constants.js';
import { formatOut } from '../util/helper.js';

const redis = redis_config;

export const onJobComplete = async(videoId) => {
    const message = JSON.stringify({ 
        videoId, 
        status: VIDEO_STATUS.READY, 
    });
    
    await redis.publish('video_ready', message);
    console.log(`[+]---- Worker sent signal for Api server: ${formatOut(videoId)}`);
}