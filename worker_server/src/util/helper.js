export const contentTypeMap = {
    ".m3u8": "application/vnd.apple.mpegurl",
    ".ts": "video/MP2T",
    ".mp4": "video/mp4",
    ".jpg": "image/jpeg",
    ".jpeg": "image/jpeg",
    ".png": "image/png",
    ".json": "application/json",
    ".txt": "text/plain",
};

export const formatOut = (info) => info.length > 10? info.substring(0, 10) + "..." : info;

export const transFE_thumbChose = () => {

}