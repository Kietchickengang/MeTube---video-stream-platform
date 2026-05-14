import Ffmpeg from "fluent-ffmpeg";
import ffmpegPath from "ffmpeg-static";
import ffprobePath from "ffprobe-static";

import path from "path";
import fs from "fs/promises";
import { existsSync, mkdirSync, writeFileSync } from "fs";

import { renditions } from "../util/checkRendition.js";
import { m3u8_Content } from "../util/checkRendition.js";

Ffmpeg.setFfmpegPath(ffmpegPath);
Ffmpeg.setFfprobePath(ffprobePath.path);

export const HLS = async(inputFile, { manifestDir }) => {
    // 1> Extract height from raw video
    const metadata = await new Promise((res, rej) => {
        Ffmpeg.ffprobe(inputFile, (err, data) => (err ? rej(err) : res(data)));
    });

    const srcHeight = metadata.streams.find(s => s.codec_type === 'video').height;
    const available_renditions = renditions(srcHeight);

    // 2> Create Master Playlist (.m3u8)
    const masterPlaylistPath = path.join(manifestDir, "master.m3u8");

    // 3> Fill content for .m3u8
    writeFileSync(masterPlaylistPath, m3u8_Content(srcHeight));

    await Promise.all(available_renditions.map(async (res) => {
        const resDir = path.join(manifestDir, res.name);

        if (!existsSync(resDir)) mkdirSync(resDir, { recursive: true });

        return new Promise((resolve, reject) => {
            Ffmpeg(inputFile)
                .outputOptions([
                    "-preset fast",                        // Balance transcode speed with file size
                    `-vf scale=-2:${res.height}`,          // Resize
                    "-c:v libx264",
                    "-crf 23",                             // Quality-based encoding
                    `-maxrate ${res.bitrate}`,
                    `-bufsize ${res.bufsize}`,
                    "-c:a aac", "-b:a 128k",
                    "-g 48", "-sc_threshold 0",            // Configurate Group of Pictures
                    "-hls_time 6",
                    "-hls_playlist_type vod",
                    "-hls_flags independent_segments",
                    "-hls_segment_filename", 
                    path.join(resDir, "segment_%03d.ts"),
                    "-hls_base_url", `./`                  // Important for Master to find segment
                ])
                .output(path.join(resDir, "index.m3u8")) 
                .on("error", reject)
                .on("end", resolve)                        // Return path of file m3u8
                .run();                                    // Return playlist path after finishing encoding
        });
    }));

    return available_renditions.map(p => p.name);
}