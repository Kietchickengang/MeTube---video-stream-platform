import Ffmpeg from "fluent-ffmpeg";
import ffmpegPath from "ffmpeg-static";

Ffmpeg.setFfmpegPath(ffmpegPath);
import path from "path";
import { setUpWrkEnv } from "../util/workspace.js";

// If timeChose is undefined or empty --> Auto-generate mode by default
export const generateThumbnail = (inputFile, thumbnailDir, timeChose) => {
    return new Promise((resolve, reject) => {
        Ffmpeg(inputFile)
            .screenshots({
                // Default generate video thumbnail at first second 
                timestamps: [timeChose || 1],
                filename: 'thumbnail.jpg',
                folder: thumbnailDir,
                size: '1280x720'
            })
            .on('end', () => resolve(path.join(thumbnailDir, 'thumbnail.jpg')))
            .on('error', (err) => reject(err));
    });
};