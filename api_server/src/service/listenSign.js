import Redis from 'ioredis';
import "dotenv/config";

import { io } from '../middleware/socket.js';
import { formatOut } from '../../../worker_server/src/util/helper.js';

const redisPort = process.env.REDIS_PORT;
const redisHost = process.env.REDIS_HOST;
const redisPass = process.env.REDIS_PASSWORD;

const redisSub = new Redis({
    port: redisPort,
    host: redisHost,
    password: redisPass,
    maxRetriesPerRequest: null,
});;

redisSub.subscribe('video_ready', (err, count) => {
    if (err) console.error("Redis Subscribe Error:", err);
    console.log(`Server is listening ${count} channel from Redis.`);
});


redisSub.on('message', (channel, message) => {
    if (channel === 'video_ready') {
        const { videoId, status } = JSON.parse(message);
        
        io.to(videoId).emit('video_ready_UI', { status });

        console.log(`[+] Server informed UI via Socket - Video ${formatOut(videoId)} is READY`);
    }
});