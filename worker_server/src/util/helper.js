export const contentTypeMap = {
    ".m3u8": "application/vnd.apple.mpegurl",
    ".ts": "video/MP2T",
    ".mp4": "video/mp4",
    ".jpg": "image/jpeg",
    ".jpeg": "image/jpeg",
    ".png": "image/png",
    ".webp": "image/webp",
    ".json": "application/json",
    ".txt": "text/plain",
};

export const formatOut = (info, num = 10) => info.length > num? info.substring(0, num) + "..." : info;
