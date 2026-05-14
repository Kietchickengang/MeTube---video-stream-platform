
const RESOLUTIONS = [
    { name: "360p",  height: 360,  bitrate: "1200k", bufsize: "1800k" },
    { name: "480p",  height: 480,  bitrate: "2000k", bufsize: "3000k" },
    { name: "720p",  height: 720,  bitrate: "4000k", bufsize: "6000k" },
    { name: "1080p", height: 1080, bitrate: "8000k", bufsize: "12000k" },
];

// Filter available resolution of raw video
export const renditions = (srcHeight) => {
    return RESOLUTIONS.filter(res => (res.height <= srcHeight));
}

// Generate content for file master.m3u8
export const m3u8_Content = (srcHeight) => {
    let masterContent = "#EXTM3U\n#EXT-X-VERSION:3\n";

    renditions(srcHeight).
        forEach((e) => {
            const { name, height, bitrate, bufsize } = e;
            const bandwidth = parseInt(bitrate) * 1000;

            masterContent += `#EXT-X-STREAM-INF:BANDWIDTH=${bandwidth},RESOLUTION=-1x${height},NAME="${name}"\n`;
            masterContent += `${name}/index.m3u8\n`;
        });
    return masterContent;
}