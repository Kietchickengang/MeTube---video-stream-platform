const MAX_THUMBNAIL_SIZE = 7 * 1024 * 1024; // 7MB
const MIN_WIDTH = 1280;
const MIN_HEIGHT = 720;
const TARGET_RATIO = 16 / 9;
const RATIO_TOLERANCE = 0.05;

export const validateThumbnailFile = (file) => {
    if (!file) throw new Error("Empty file");
    // Check valid type of file
    if (!file.type.startsWith("image/")) throw new Error("Invalid type of image"); 
    // Check valid file size
    if (file.size > MAX_THUMBNAIL_SIZE) throw new Error("Exceeded max file size (7MB)");

    return new Promise((resolve, reject) => {
        const img = new Image();
        const url = URL.createObjectURL(file);

        img.onload = () => {
            const { width, height } = img;
            URL.revokeObjectURL(url);
            // Check valid file width and height
            if (width < MIN_WIDTH || height < MIN_HEIGHT) {
                reject(new Error("Resolution is too low. It should be at least 1280x720"));
                return;
            }
            // Check valid file ratio
            const ratio = width / height;
            if (Math.abs(ratio - TARGET_RATIO) > RATIO_TOLERANCE) {
                reject(new Error("Thumbnail should use 16:9 ratio"));
                return;
            }

            resolve({ width, height, ratio, });
        };

        img.onerror = () => {
            URL.revokeObjectURL(url);
            reject(new Error("Invalid image file"));
        };

        img.src = url;
    });
};