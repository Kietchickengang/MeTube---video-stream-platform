import React, { useState, useRef, useEffect, useImperativeHandle, forwardRef } from "react";
import { Pause, Play, Maximize2, Minimize, Monitor, Volume2, VolumeX, Settings, Rabbit, Snail, PlayCircle } from "lucide-react";
import Hls from "hls.js";

import VideoSettings from "./VideoSettings.jsx";
import { formatTime } from "../utils/cal_in4.js";
import { controlBtnClass } from "../utils/constants.js";

import "../../public/volume.css";

const VideoPlayer = forwardRef(({ videoPath, thumbnailUrl, isTheaterMode, toggleTheater, onVideoEnded, isAutoPlay, setIsAutoPlay }, ref) => {
  const videoRef = useRef(null);
  const containerRef = useRef(null);
  const hlsRef = useRef(null);
  const hideTimerRef = useRef(null);

  const [speed, setSpeed] = useState(1);
  const [showSpeedMenu, setShowSpeedMenu] = useState(false);
  const speedOptions = [0.5, 0.75, 1, 1.25, 1.5, 2];

  useEffect(() => {
    if (videoRef.current) {
      videoRef.current.playbackRate = speed;
    }
  }, [speed, videoPath]);

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
        try { v.currentTime = time || 0; } catch {}
        if (playing) v.play().catch(() => {});
      };
      if (v.readyState >= 1) {
        restore();
      } else {
        v.addEventListener("loadedmetadata", restore, { once: true });
      }
    },
    videoElement: videoRef.current,
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

  const handleSpeedChange = (newSpeed) => {
    setSpeed(newSpeed);
    setShowSpeedMenu(false);
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
        video.playbackRate = speed;
        video.play().catch(() => {});
      });
    } else if (canUseNativeHls) {
      video.src = videoPath;
      video.playbackRate = speed;
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
    } else {
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
      } else {
        await document.exitFullscreen();
      }
    } catch (err) {
      console.error("Fullscreen error:", err);
    }
  };

  const seekTo = (e) => {
    e.stopPropagation();
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
          hideTimerRef.current = setTimeout(() => {
            setControlsVisible(false);
            setShowSpeedMenu(false);
          }, 400);
        }
      }}
      onTouchStart={handleActivity}
    >
      <div className="absolute inset-0 bg-[#0f0f0f]">
        <img src={thumbnailUrl} alt="" className="w-full h-full object-cover scale-125 opacity-10 saturate-50" />
        <div className="absolute inset-0 bg-[#0f0f0f]" />
      </div>

      <video
        ref={videoRef}
        poster={thumbnailUrl}
        className="relative z-10 w-full h-full object-contain cursor-pointer"
        playsInline
        onEnded={onVideoEnded}
        onClick={(e) => {
          e.stopPropagation();
          togglePlay();
        }}
      />

      {isBuffering && (
        <div className="absolute inset-0 z-20 flex items-center justify-center pointer-events-none">
          <div className="h-12 w-12 rounded-full border-4 border-white/30 border-t-white animate-spin" />
        </div>
      )}

      <div 
        className="absolute inset-0 z-15 cursor-pointer" 
        onClick={(e) => {
          e.stopPropagation();
          togglePlay();
        }}
        style={{ bottom: "60px" }} 
      />

      <div
        className={`absolute bottom-0 left-0 right-0 z-30 flex items-end bg-gradient-to-t from-black/80 via-black/40 to-transparent transition-opacity duration-300 ${
          controlsVisible ? "opacity-100" : "opacity-0 pointer-events-none"
        }`}
        onClick={(e) => e.stopPropagation()}
      >
        <div className="w-full px-4 pb-2">
          <div
            className="w-full h-1 hover:h-1.5 bg-white/20 rounded-full mb-2 cursor-pointer group transition-all duration-150 relative z-40"
            onClick={seekTo}
          >
            <div className="h-full rounded-full bg-red-600 relative" style={{ width: `${progress}%` }}>
              <div className="absolute right-0 top-1/2 -translate-y-1/2 h-3 w-3 rounded-full bg-red-600 opacity-0 group-hover:opacity-100 shadow-lg transition-opacity" />
            </div>
          </div>

          <div className="flex items-center justify-between text-white select-none">
            <div className="flex items-center gap-3">
              <button type="button" onClick={togglePlay} className={controlBtnClass}>
                {isPlaying ? <Pause size={22} fill="white" /> : <Play size={22} fill="white" />}
              </button>

              <div
                className="flex items-center gap-2 group/volume"
                onMouseEnter={() => setShowVolumeSlider(true)}
                onMouseLeave={() => setShowVolumeSlider(false)}
              >
                <button type="button" onClick={toggleMute} className={`${controlBtnClass} flex items-center justify-center`}>
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
                      className="youtube-volume-slider"
                    />
                  </div>
                </div>
              </div>

              <span className="text-white/90 text-sm font-medium px-2 py-1.5">
                {formatTime(currentTime)} / {formatTime(duration)}
              </span>
            </div>

            <div className="flex items-center gap-3 relative">
              {/* Vùng Auto-play đã được đóng gói an toàn và chặn nổi bọt tự động */}
              <div className="flex items-center gap-1.5 px-1 py-1 rounded-lg" onClick={(e) => e.stopPropagation()}>
                <button
                  type="button"
                  onClick={() => setIsAutoPlay && setIsAutoPlay(!isAutoPlay)}
                  className={`flex items-center justify-center transition-colors duration-200 ${controlBtnClass} ${isAutoPlay ? 'text-red-500' : 'text-zinc-400'}`}
                  title={isAutoPlay ? "Auto play off" : "Auto play on"}
                >
                  <PlayCircle size={25} fill={isAutoPlay ? "currentColor" : "none"} strokeWidth={1.5} />
                </button>
                <div 
                  onClick={() => setIsAutoPlay && setIsAutoPlay(!isAutoPlay)}
                  className={`w-10 h-5 flex items-center rounded-full p-0.5 cursor-pointer transition-colors duration-200 ${isAutoPlay ? "bg-red-600" : "bg-gray-600/30"}`}
                >
                  <div className={`bg-white w-3 h-3 rounded-full shadow-md transform transition-transform duration-200 ${isAutoPlay ? "translate-x-3" : "translate-x-0"}`} />
                </div>
              </div>
              
              <div className="relative flex items-center">
                {showSpeedMenu && (
                  <div className="absolute bottom-14 right-0 bg-zinc-950/60 border-none text-white rounded-xl p-3 text-sm flex flex-col shadow-2xl min-w-[85px] z-50 backdrop-blur-md animate-in fade-in slide-in-from-bottom-2 duration-150">
                    <div className="px-2 py-0 text-zinc-500 font-medium border-b border-zinc-800/60 pb-1 mb-1 text-md uppercase tracking-wider">Speed</div>
                    {speedOptions.map((opt) => (
                      <button
                        key={opt}
                        onClick={() => handleSpeedChange(opt)}
                        className={`px-2.5 py-1.5 rounded-lg text-left hover:bg-zinc-800 font-medium transition-colors ${
                          speed === opt ? "text-red-500 bg-red-500/10 font-bold" : "text-zinc-200"
                        }`}
                      >
                        {opt === 1 ? "Standard" : `${opt}x`}
                      </button>
                    ))}
                  </div>
                )}
                
                <button
                  type="button"
                  onClick={() => { setShowSpeedMenu(!showSpeedMenu) }}
                  className={`${controlBtnClass} ${speed !== 1 ? "text-red-500" : ""}`}
                  title="Speed"
                >
                  {speed >=1 && <Rabbit size={20} />}
                  {speed < 1 && <Snail size={20} />}
                </button>
              </div>

              <VideoSettings
                hls={hlsRef.current}
                currentQuality={currentQuality}
                setCurrentQuality={setCurrentQuality}
                controlBtnClass={controlBtnClass}
              />

              <button type="button" onClick={toggleTheater} className={controlBtnClass}>
                <Monitor size={20} />
              </button>

              <button type="button" onClick={toggleFullScreen} className={controlBtnClass}>
                {isFullscreen ? <Minimize size={20} /> : <Maximize2 size={20} />}
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
});

VideoPlayer.displayName = "VideoPlayer";
export default VideoPlayer;