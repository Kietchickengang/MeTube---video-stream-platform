import express from 'express';
import "dotenv/config";
import './src/service/listenSign.js';

import videoRoutes from "./src/routes/video.routes.js";
import authRoutes from "./src/routes/auth.routes.js";

import { app, httpServer } from './src/middleware/socket.js';
import { connectDB } from '../worker_server/src/config/db.js';
//import { testDB } from '../worker_server/src/service/db.js';
//import { testMQ } from './src/service/queue.js';
import { logger } from './src/middleware/logger.js';
import { cors_rule } from './src/middleware/cors.js';
import cookieParser from 'cookie-parser';
import session from 'express-session';

const port = process.env.PORT;

await connectDB();
//await testDB();
//const testRedisConnection = await redis_config.ping();
//console.log(testRedisConnection); 
//await testMQ();

// Write requests detail to check server operation & debug
app.use(logger);

// Parse JSON body
app.use(express.json());
app.use(cookieParser());
app.use(session({
  secret: process.env.SESSION_SECRET || 'metube_session_secret',
  resave: false,
  saveUninitialized: false,
  cookie: {
    httpOnly: true,
    sameSite: 'lax',
    secure: process.env.NODE_ENV === 'production',
    maxAge: 24 * 60 * 60 * 1000,
  },
}));

// Allow access
app.use(cors_rule);

// Add prefix for routes
app.use('/metube/auth', authRoutes);
app.use('/metube', videoRoutes);

app.get("/", (req, res) => { res.send("Hello world from k13t!"); })

httpServer.listen(port, () => {
    console.log(`Server is running on port ${port}`);
})