// --- Manage file & directory
// --- Create temporary workspace

import path from 'path';
import fs from "fs/promises";
import os from "os";

// === FILE STRUCTURE ===
// --- /tmp/metube-videoId-X/
// --- ├── raw.mp4
// --- └── output/
// ---     ├── thumbnail/
// ---     │   └── thumbnail.jpg
// ---     │
// ---     └── manifest/
// ---         ├─ master.m3u8
// ---         ├─ 360p/
// ---         │   ├─ index.m3u8   
// ---         │   ├─ segment_000.ts
// ---         │   └─ ...  
// ---         ├─ 480p/
// ---         ├─ ├─ ...
// ---         ...

export const setUpWrkEnv = async(input) => {
    const { videoId, videoPath } = input;
    // 1> Extract file extension
    const fileExt = path.extname(videoPath);
    
    // 2> Create new temporary directory. Format: '/tmp/metube-videoId-X'
    //    X is padded randomly by NodeJS
    const tempDir = await fs.mkdtemp(path.join(os.tmpdir(), `metube-${videoId}-`));

    // 3> Create path to raw file inside tempDir
    //    to save raw video and stabilize it
    const rawFile = path.join(tempDir, `raw${fileExt}`);

    // 4> Create path to output directory inside tempDir
    //    to save folder thumbnail and manifest
    const outputDir = path.join(tempDir, "output");

    // 5> Create output directory auto-create parent directories if missing
    //    Create subDirectories
    const subDirs = {
        thumbnailDir : path.join(outputDir, "thumbnail"),
        manifestDir  : path.join(outputDir, "manifest"),
    };

    await Promise.all(
        Object.values(subDirs).map((dir) =>
            fs.mkdir(dir, { recursive: true })
        )
    );

    return { tempDir, rawFile, outputDir, ...subDirs };
}