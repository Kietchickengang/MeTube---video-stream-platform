import ffmpeg from "fluent-ffmpeg";
import path from "path";

export const HLS = (inputFile, { hlsChunksDir, manifestDir}) => {
    // 1> Create path to file HLS holding list of segment .ts
    const outputPlayList = path.join(manifestDir, "index.m3u8");

    // 2> Create path to file containing segment video
    const segmentVid = path.join(hlsChunksDir, "segment_%03d.ts");

    return new Promise((resolve, reject) => {
        ffmpeg(inputFile).outputOptions(
            [
                "-preset fast",                             // Balance transcode speed with file size
                "-g 48", "-sc_threshold 0",                 // Configurate Group of Pictures
                "-c:v libx264", "-c:a aac",                 // Convert video to H264 standard and AAC sound
                "-b:v 1200k", "-b:a 128k",                  // Set bitrate for video and audio
                "-hls_time 6",                              // Split into segments, each lasts for 6 seconds
                "-hls_playlist_type vod",                   // Video on demand is set for playlist type
                "-hls_flags independent_segments",          // Every segment decodes independently

                "-hls_segment_filename",                    // Set name format for output segment 
                segmentVid,                                 // Segment format: segment_XXX.ts
                "-hls_base_url", "../HLS_chunks/",      
            ])
            .output(outputPlayList)                         // Save file playlist .m3u8 to manifestDir
            .on("error", (err) => reject(err))
            .on("end", () => resolve(outputPlayList))       // Return path of file m3u8 
            .run();                                         // Return playlist path after finishing encoding
        }
    );
}