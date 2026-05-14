import { Server } from "socket.io";
import http from "http";
import express from 'express';

import { formatOut } from "../../../worker_server/src/util/helper.js";

const app = express();

const httpServer = http.createServer(app);
const io = new Server(httpServer, {
    cors: {
        origin: "*",
    }
});

io.on("connection", (socket) => {
    console.log("----------------------------------------------");
    console.log(`${socket.id} connected`);

    socket.on("join_video_room", (videoId) => {
        socket.join(videoId);
        console.log(`[+] User joined room: ${formatOut(videoId)}`);
    })

    socket.on("disconnect", () => {
        console.log("[-] User disconnected or network fault");
        console.log("[-] Disconnecting socket...");
        console.log("[!]---- END ----");
        console.log("----------------------------------------------");
    })
})

export { io, httpServer, app };
