// --- Can not use share same code with api server (/api_server/middleware/validate.js)
//     since it will trigger environment mismatch

// Check MIME
export const validMimeType = (mimeType) => {
    return ["mp4", "webm", "ogg", "x-matroska", "quicktime", "mpeg", "x-ms-wmv", "3gpp"]
           .find(type => `video/${type}` === mimeType);
}

export const getFileExtension = (filename) => {return filename.split(".").pop();}

// Check extension
export const validFileExtension = (filename) => {
    const file_extension = getFileExtension(filename);
    return ['mp4', 'mov', 'avi', 'mkv', 'wmv', 'webm'].includes(file_extension);
}

// Check size
export const validFileSize = (fileSize) => {
    // Set maximum size for video file
    const MAX_ALLOWED_SIZE = 500 * 1024 * 1024;
    return fileSize && fileSize < MAX_ALLOWED_SIZE;
}   
