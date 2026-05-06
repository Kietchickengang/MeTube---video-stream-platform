import multer from 'multer';

// Use multer to upload file to object storage s3 (vietnix)
export const upload = multer({ 
    storage: multer.memoryStorage(), 
    limits: {
        fileSize: 1024 * 1024 * 1024, // Error if file size > 1GB
    } 
});