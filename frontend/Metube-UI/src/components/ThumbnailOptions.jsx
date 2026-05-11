import React, { useEffect, useRef, useState } from "react";
import { formatTimeVid } from "../helper/helper.js";
import "../assets/custom.css";
import { notifyError } from "../helper/popUp.js";

const ThumbnailPicker = ({ previewVid, setThumbnailUrl, onClose, handleReset }) => {
    const videoRef = useRef(null);
    const canvasRef = useRef(null);

    const [duration, setDuration] = useState(0);
    const [thumbTime, setThumbTime] = useState(0);

    // draw current frame to canvas
    const drawFrame = () => {
        const video = videoRef.current;
        const canvas = canvasRef.current;

        if(!video || !canvas) return;

        canvas.width = video.videoWidth;
        canvas.height = video.videoHeight;

        const ctx = canvas.getContext("2d");
        ctx.drawImage(video, 0, 0, canvas.width, canvas.height);
    };

    // user adjusts personal timestampt in video to make thumbnail
    const handleSlider = async(e) => {
        const time = Number(e.target.value);
        setThumbTime(time);

        const video = videoRef.current;
        if(video){
            video.currentTime = time;
            // wait until seek completed
            video.onseeked = () => drawFrame();
        }
    };

    // when user pressed OK button
    const handleSelect = () => {
        const canvas = canvasRef.current;
        // convert canvas -> image url
        const thumbnailData = canvas.toDataURL("image/jpeg");
        // use for generate thumbnail of api route
        setThumbnailUrl({
            timestamp: thumbTime,
            image: thumbnailData
        });
        onClose();
    };

    useEffect(() => {
        const video = videoRef.current;
        if(!video) return;

        video.onloadedmetadata = () => {
            setDuration(video.duration);
            // initialize first or else it will render none at first
            video.currentTime = 1;
            // default first frame
            video.onseeked = () => {
                drawFrame();
            };
        };
    }, []);

    return (
        <div className="mt-3 p-3 rounded-xl border border-secondary font-inter w-100">
            <div className="d-flex justify-content-between align-items-center mb-1">
                <h6 className="text-white mb-1">Design your own thumbnail</h6>
            </div>

            {/* hidden internal video */}
            <video ref={videoRef} src={previewVid} style={{ display: "none" }}/>

            {/* thumbnail preview */}
            <canvas ref={canvasRef} className="w-100 rounded-md mt-1"
                style={{ maxHeight: "200px", objectFit: "cover", background: "#BEBFC5"}}
            />

            {/* timeline */}
            <input
                type="range"
                min="0"
                max={duration}
                step="0.1"
                value={thumbTime}
                onChange={handleSlider}
                className="custom-slider"
            />

            <div className="d-flex justify-content-between text-secondary small mb-2">
                {/* User's chosen thumbnail timestampt */}
                <span>{formatTimeVid(thumbTime)}</span>
                <span>{formatTimeVid(duration)}</span>
            </div>

            <div className="d-flex justify-content-end gap-2">
                <button type="button" className="text-heading bg-transparent box-border border-transparent hover:text-yellow-200 hover:bg-neutral-secondary-medium focus:ring-4 focus:ring-neutral-tertiary font-medium leading-5 rounded-pill text-sm px-2 py-2.5 focus:outline-none" onClick={handleReset}>Re-zero</button>
                <button type="button" className="text-white bg-gradient-to-r from-red-400 via-red-500 to-red-600 hover:bg-gradient-to-br focus:ring-4 focus:outline-none focus:ring-red-300 dark:focus:ring-red-800 font-medium rounded-md text-sm px-4 py-2.5 text-center leading-5" onClick={onClose}>Cancel</button>
                <button type="button" className="text-white bg-gradient-to-r from-green-400 via-green-500 to-green-600 hover:bg-gradient-to-br focus:ring-4 focus:outline-none focus:ring-green-300 dark:focus:ring-green-800 font-medium rounded-md text-sm px-4 py-2.5 text-center leading-5" onClick={handleSelect}>OK</button>
            </div>
        </div>
    );
};

export default ThumbnailPicker;