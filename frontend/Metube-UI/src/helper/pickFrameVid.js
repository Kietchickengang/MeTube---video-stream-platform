
// default pick first frame from video
export const getFrameFromVideo = (videoUrl, time) => {
    return new Promise((resolve) => {
        const video = document.createElement("video");
        video.src = videoUrl;
        video.currentTime = time || 1;
        video.muted = true;
        video.playsInline = true;

        video.onseeked = () => {
            const canvas = document.createElement("canvas");
            canvas.width = 1280;
            canvas.height = 720;
            const ctx = canvas.getContext("2d");
            ctx.drawImage(video, 0, 0, canvas.width, canvas.height);
            resolve(canvas.toDataURL("image/jpeg"));
        };
    });
};