import React, {useState, useRef, useEffect, useImperativeHandle, forwardRef,} from "react";
import {Pause, Play, Maximize2, Minimize, Monitor, Volume2, VolumeX, Settings,} from "lucide-react";
import Hls from "hls.js";

import VideoSettings from "./VideoSettings.jsx";

import { formatTime } from "../utils/cal_in4.js";
import { controlBtnClass } from "../utils/constants.js";

import "../../public/volume.css";

const VideoPlayer = forwardRef(({videoPath, thumbnailUrl, isTheaterMode, toggleTheater,}, ref) => {
  const videoRef = useRef(null);
  const containerRef = useRef(null);
  const hlsRef = useRef(null);
  const hideTimerRef = useRef(null);

  const savedStateRef = useRef({
    time: 0,
    playing: false,
  });

  const [isPlaying, setIsPlaying] = useState(false);
  const [isFullscreen, setIsFullscreen] = useState(false);
  const [isMuted, setIsMuted] = useState(false);
  const [currentTime, setCurrentTime] = useState(0);
  const [duration, setDuration] = useState(0);
  const [controlsVisible, setControlsVisible] = useState(true);
  const [isBuffering, setIsBuffering] = useState(false);
  const [volume, setVolume] = useState(1);
  const [showVolumeSlider, setShowVolumeSlider] = useState(false);
  const [currentQuality, setCurrentQuality] = useState("Auto");

  useImperativeHandle(ref, () => ({
    savePlaybackState() {
      const v = videoRef.current;
      if (!v) return;

      savedStateRef.current = {
        time: v.currentTime || 0,
        playing: !v.paused && !v.ended,
      };
    },
    restorePlaybackState() {
      const v = videoRef.current;
      if (!v) return;

      const { time, playing } = savedStateRef.current;
      const restore = () => {
        try {
          v.currentTime = time || 0;
        } 
        catch {}
        if (playing) {
          v.play().catch(() => {});
        }
      };

      if (v.readyState >= 1) {
        restore();
      } 
      else {
        v.addEventListener("loadedmetadata", restore, { once: true });
      }
    },
  }));

  const scheduleHideControls = () => {
    clearTimeout(hideTimerRef.current);
    hideTimerRef.current = setTimeout(() => {
      if (isPlaying) setControlsVisible(false);
    }, 1800);
  };

  const handleActivity = () => {
    setControlsVisible(true);
    if (isPlaying) scheduleHideControls();
  };

  useEffect(() => {
    const video = videoRef.current;
    if (!video || !videoPath) return;

    setCurrentTime(0);
    setDuration(0);
    setIsPlaying(false);
    setIsBuffering(true);

    if (hlsRef.current) {
      hlsRef.current.destroy();
      hlsRef.current = null;
    }

    const canUseNativeHls = video.canPlayType("application/vnd.apple.mpegurl");

    if (Hls.isSupported()) {
      const hls = new Hls({
        capLevelToPlayerSize: true,
        startLevel: -1,
      });
      hlsRef.current = hls;

      hls.loadSource(videoPath);
      hls.attachMedia(video);

      hls.on(Hls.Events.MANIFEST_PARSED, () => {
        setCurrentQuality("Auto");
        video.play().catch(() => {});
      });
    } 
    else if (canUseNativeHls) {
      video.src = videoPath;
    }

    const onPlay = () => {
      setIsPlaying(true);
      setControlsVisible(true);
      scheduleHideControls();
    };

    const onPause = () => {
      setIsPlaying(false);
      setControlsVisible(true);
      clearTimeout(hideTimerRef.current);
    };

    const onWaiting = () => setIsBuffering(true);
    const onPlaying = () => setIsBuffering(false);
    const onLoadedMetadata = () => setDuration(video.duration || 0);
    const onTimeUpdate = () => setCurrentTime(video.currentTime || 0);

    video.addEventListener("play", onPlay);
    video.addEventListener("pause", onPause);
    video.addEventListener("waiting", onWaiting);
    video.addEventListener("playing", onPlaying);
    video.addEventListener("loadedmetadata", onLoadedMetadata);
    video.addEventListener("timeupdate", onTimeUpdate);

    return () => {
      clearTimeout(hideTimerRef.current);
      video.removeEventListener("play", onPlay);
      video.removeEventListener("pause", onPause);
      video.removeEventListener("waiting", onWaiting);
      video.removeEventListener("playing", onPlaying);
      video.removeEventListener("loadedmetadata", onLoadedMetadata);
      video.removeEventListener("timeupdate", onTimeUpdate);
      hlsRef.current?.destroy();
      hlsRef.current = null;
    };
  }, [videoPath]);

  useEffect(() => {
    const onFsChange = () => setIsFullscreen(Boolean(document.fullscreenElement));
    document.addEventListener("fullscreenchange", onFsChange);
    return () => document.removeEventListener("fullscreenchange", onFsChange);
  }, []);

  const togglePlay = async () => {
    const video = videoRef.current;
    if (!video) return;

    try {
      if (video.paused) await video.play();
      else video.pause();
    } catch (error) {
      console.error("Playback error:", error);
    }
  };

  const toggleMute = () => {
    const video = videoRef.current;
    if (!video) return;

    if (video.muted || volume === 0) {
      video.muted = false;
      video.volume = volume || 1;
      setIsMuted(false);
    } 
    else {
      video.muted = true;
      setIsMuted(true);
    }
  };

  const handleVolumeChange = (e) => {
    const value = Number(e.target.value);
    const video = videoRef.current;
    if (!video) return;

    video.volume = value;
    setVolume(value);

    if (value === 0) {
      video.muted = true;
      setIsMuted(true);
    } else {
      video.muted = false;
      setIsMuted(false);
    }
  };

  const toggleFullScreen = async () => {
    try {
      if (!document.fullscreenElement) {
        await containerRef.current?.requestFullscreen();
      } 
      else {
        await document.exitFullscreen();
      }
    } catch (err) {
      console.error("Fullscreen error:", err);
    }
  };

  const seekTo = (e) => {
    const video = videoRef.current;
    const bar = e.currentTarget;
    if (!video || !duration) return;

    const rect = bar.getBoundingClientRect();
    const percent = Math.min(1, Math.max(0, (e.clientX - rect.left) / rect.width));
    video.currentTime = percent * duration;
  };

  const progress = duration > 0 ? (currentTime / duration) * 100 : 0;
  return (
    <div
      ref={containerRef}
      className={`relative isolate overflow-hidden will-change-transform transition-all duration-300 ${
        isTheaterMode && !isFullscreen
          ? "w-full h-[68vh] rounded-none bg-[#111111]"
          : "w-full aspect-video rounded-2xl bg-black shadow-2xl"
      }`}
      onClick={togglePlay}
      onMouseMove={handleActivity}
      onMouseEnter={handleActivity}
      onMouseLeave={() => {
        if (isPlaying) {
          clearTimeout(hideTimerRef.current);
          hideTimerRef.current = setTimeout(() => setControlsVisible(false), 400);
        }
      }}
      onTouchStart={handleActivity}
    >
      <div className="absolute inset-0 bg-[#0f0f0f]">
        <img src={thumbnailUrl} alt="" className={`w-full h-full object-cover scale-125 opacity-10 saturate-50`}/>
        <div className="absolute inset-0 bg-[#0f0f0f]" />
      </div>

      <video
        ref={videoRef}
        poster={thumbnailUrl}
        className="relative z-10 w-full h-full object-contain cursor-pointer"
        playsInline
      />

      {isBuffering && (
        <div className="absolute inset-0 z-20 flex items-center justify-center pointer-events-none">
          <div className="h-12 w-12 rounded-full border-4 border-white/30 border-t-white animate-spin" />
        </div>
      )}

      <div className={`absolute inset-0 z-30 flex items-end bg-gradient-to-t from-black/10 via-black/10 to-transparent transition-opacity duration-300 ${
          controlsVisible ? "opacity-100" : "opacity-0"
        }`}>
        <div className="w-full px-4 pb-2">
          <div className="w-full h-1 bg-white/20 rounded-full mb-2 cursor-pointer group"
            onClick={seekTo}>
            <div className="h-full rounded-full bg-red-600 relative"
              style={{ width: `${progress}%` }}>
              <div className="absolute right-0 top-1/2 -translate-y-1/2 h-3 w-3 rounded-full bg-red-600 opacity-0 group-hover:opacity-100 shadow-lg" />
            </div>
          </div>

          <div className="flex items-center justify-between text-white">
            <div className="flex items-center gap-3">
              <button type="button" onClick={(e) => {e.stopPropagation(); togglePlay();}} className={controlBtnClass}>
                {isPlaying ? <Pause size={22} fill="white" /> : <Play size={22} fill="white" />}
              </button>

              <div className="flex items-center gap-2 group/volume"
                onMouseEnter={() => setShowVolumeSlider(true)}
                onMouseLeave={() => setShowVolumeSlider(false)}
              >
                <button type="button" onClick={(e) => {e.stopPropagation(); toggleMute();}} className={`${controlBtnClass} flex items-center justify-center`}>
                  {isMuted || volume === 0 ? <VolumeX size={21} /> : <Volume2 size={21} />}
                </button>

                <div className={`overflow-hidden transition-all duration-200 ease-out ${showVolumeSlider ? "w-20 opacity-100" : "w-0 opacity-0"}`}>
                  <div className="h-9 flex items-center">
                    <input
                      type="range"
                      min="0"
                      max="1"
                      step="0.01"
                      value={isMuted ? 0 : volume}
                      onChange={handleVolumeChange}
                      onClick={e => e.stopPropagation()}
                      className="youtube-volume-slider"
                    />
                  </div>
                </div>
              </div>

              <span className="text-white/95 hover:bg-white/10 active:bg-white/20 transition-all duration-150 ease-out px-2 py-1.5 rounded-pill">
                {formatTime(currentTime)} / {formatTime(duration)}
              </span>
            </div>

            <div className="flex items-center gap-4">
              <button type="button" onClick={(e) => {e.stopPropagation(); toggleTheater();}} className={controlBtnClass}>
                <Monitor size={20} />
              </button>
                <VideoSettings
                  hls={hlsRef.current}
                  currentQuality={currentQuality}
                  setCurrentQuality={setCurrentQuality}
                  controlBtnClass={controlBtnClass}
                />
              <button type="button" onClick={(e) => {e.stopPropagation(); toggleFullScreen();}} className={controlBtnClass}>
                {isFullscreen ? <Minimize size={20} /> : <Maximize2 size={20} />}
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
});

export default VideoPlayer;