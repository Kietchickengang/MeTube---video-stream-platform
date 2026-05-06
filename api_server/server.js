import express from 'express';
import "dotenv/config";

import videoRoutes from "./src/routes/video.routes.js";

//import { connectDB } from '../worker_server/src/config/db.js'
//import { testDB } from '../worker_server/src/service/db.js';
//import { testMQ } from './src/service/queue.js';
import { logger } from './src/middleware/logger.js';
import { cors_rule } from './src/middleware/cors.js';

const app = express();
const port = process.env.PORT;

//await connectDB();
//await testDB();
//const testRedisConnection = await redis_config.ping();
//console.log(testRedisConnection); 
//await testMQ();

// Write requests detail to check server operation & debug
app.use(logger);
// Parse JSON body
app.use(express.json());

// Allow access
app.use(cors_rule);

// Add prefix for routes
app.use('/metube/videos', videoRoutes);

app.get("/", (req, res) => { res.send("Hello world from k13t!"); })

app.listen(port, () => {
    console.log(`Server is running on port ${port}`);
})