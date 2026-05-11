export const cleanUploadForm = ({
    setFile, setPreviewVid, setProgress, setVidKey, setTitle, setDescription,
    setThumbnailUrl, setAutoGenThumb, setPickedThumb, setUploadThumb
}) => {
    setFile(null);
    setPreviewVid(null);
    setVidKey(null);
    setAutoGenThumb(null);
    setUploadThumb(null);

    setProgress(0);

    setTitle("");
    setDescription("");
    setThumbnailUrl("");

    setPickedThumb(false);
}