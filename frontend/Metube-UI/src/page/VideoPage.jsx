import React, { useState, useEffect, useRef } from "react";
import { useParams } from "react-router-dom";

import { ThumbsUp, ThumbsDown, Redo2, Bookmark, Ellipsis, } from "lucide-react";
import { SiGooglegemini } from "react-icons/si";

import VideoPlayer from "../components/VideoPlayer";
import VideoCard from "../components/VideoCard";
import { useAuth } from "../context/AuthContext.jsx";
import { addWatchHistory, isSubscribed, toggleSubscription } from "../service/userDataService.js";
import { timeAgo } from "../utils/cal_in4.js";
import { formatOut } from "../../../../worker_server/src/util/helper.js";

const api_port = 8000;
const hostPath = `http://localhost:${api_port}/metube/videos`;
const prefix = "https://s3.vn-hcm-1.vietnix.cloud/processed-video";

const VideoPage = () => {
  const { id } = useParams();
  const { user } = useAuth();
  const [video, setVideo] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [activeIcon, setActiveIcon] = useState(null);
  const [isTheaterMode, setIsTheaterMode] = useState(false);
  const [expandDesc, setExpandDesc] = useState(false);
  const [recommendedVideos, setRecommendedVideos] = useState([]);
  const [subscribed, setSubscribed] = useState(false);

  const playerRef = useRef(null);

  const toggleTheater = () => {
    playerRef.current?.savePlaybackState?.();
    setIsTheaterMode((v) => !v);

    setTimeout(() => {
      playerRef.current?.restorePlaybackState?.();
    }, 0);
  };

  useEffect(() => {
    const loadVideo = async () => {
      try {
        const response = await fetch(`${hostPath}/${id}`);
        if (!response.ok) {
          throw new Error("Video is not existed");
        }
        const data = await response.json();
        setVideo(data);
      } catch (error) {
        console.error(error);
        setError("Failed to load video");
      } finally {
        setLoading(false);
      }
    };

    const loadRecommended = async () => {
      try {
        const res = await fetch(hostPath);
        const data = await res.json();
        setRecommendedVideos(data);
      } catch (err) {
        console.error(err);
      }
    };

    loadVideo();
    loadRecommended();
  }, [id]);

  useEffect(() => {
    if (video && user) {
      addWatchHistory(user, video);
      setSubscribed(isSubscribed(user, video.channelName || ""));
    }
  }, [user, video]);

  if (loading) {
    return (
      <div className="flex justify-center items-center h-64">
        Loading...
      </div>
    );
  }

  if (error || !video) {
    return (
      <div className="flex justify-center items-center h-64 text-lg text-red-500">
        {error || "Video not found"}
      </div>
    );
  }

  const iconProp = [
    { keyId: "like", ico: ThumbsUp },
    { keyId: "dislike", ico: ThumbsDown },
  ];

  const VideoDetails = () => (
    <>
      <h1 className="text-xl leading-tigh tracking-none font-bold mb-0">{video.title}</h1>
      <div className="flex items-center justify-start gap-3 mb-1 flex-wrap">
        <img
          src={video.channelAvatar || "https://tinyurl.com/277pc7ru"}
          alt={video.channelName || "K13T DU0N9"}
          className="w-10 h-10 rounded-full"
        />
        <div>
          <p className="mt-2 font-semibold mb-0">
            {video.channelName || "K13T DU0N9"}
          </p>
          <p className="text-xs text-gray-400 tracking-tight mt-1">{video.subscriber || "8.3 N"} subscriber</p>
        </div>
        <button
          onClick={() => {
            if (!user) return;
            const next = toggleSubscription(user, {
              channelName: video.channelName || "Kênh không xác định",
              channelAvatar: video.channelAvatar || null,
            });
            setSubscribed(next.some((item) => item.channelName === video.channelName));
          }}
          className={`font-semibold tracking-tight px-3 py-2 rounded-full transition ${subscribed ? 'bg-gray-500 hover:bg-gray-400' : 'bg-red-600 hover:bg-red-700'} text-white`}
        >
          {subscribed ? 'Đã đăng ký' : 'Subscribe'}
        </button>

        <div className="flex items-center bg-[#222222] rounded-full overflow-hidden tracking-tight ml-auto">
          {iconProp.map((btn, idx) => {
            const isActive = activeIcon === btn.keyId;
            return (
              <React.Fragment key={btn.keyId}>
                <button
                  className="flex flex-row gap-2 items-center justify-center font-semibold bg-[#222222] px-3 py-2 rounded-full cursor-pointer"
                  onClick={() =>
                    setActiveIcon(isActive ? null : btn.keyId)
                  }
                >
                  <btn.ico
                    fill={isActive ? "white" : "none"}
                    color={isActive ? "#333333" : "white"}
                    strokeWidth={isActive ? 1 : 2}
                    className="transition-all duration-200 hover:opacity-50"
                  />
                  {idx === 0 ? video.liked || 8386 : ""}
                </button>

                {idx === 0 && (
                  <div className="w-[1px] h-6 bg-[#444444]" />
                )}
              </React.Fragment>
            );
          })}
        </div>

        <button className="flex gap-2 items-center font-semibold bg-[#222222] px-2.5 py-2 rounded-full">
          <Redo2 />
          Share
        </button>

        <button className="flex gap-2 items-center font-semibold bg-[#222222] px-2.5 py-2 rounded-full">
          <SiGooglegemini size={20} />
          Ask question
        </button>

        <button className="flex gap-2 items-center font-semibold bg-[#222222] px-2.5 py-2 rounded-full">
          <Bookmark />
          Save
        </button>

        <button className="flex items-center justify-center bg-[#222222] rounded-full w-[40px] h-[40px]">
          <Ellipsis />
        </button>
      </div>

      <div className="bg-[#222222] p-3 rounded-xl mb-2 h-fit leading-tight">
        <div className="flex items-center gap-4 text-sm font-semibold">
          <span>{video.views || 8386} views</span>
          <span>{timeAgo(video.createdAt)}</span>
        </div>

        <div className={`mt-2 text-[14px] leading-6 text-[#f1f1f1] whitespace-pre-wrap text-left ${!expandDesc && "line-clamp-2"}`}>
          {video.description || "No description available."}
        </div>

        <button onClick={() => setExpandDesc(!expandDesc)}
          className="mt-1 text-sm font-semibold hover:text-gray-300"
        >
          {expandDesc ? "Show less" : "... More"}
        </button>
      </div>
    </>
  );

  const Sidebar = ({ className = "" }) => (
    <div className={className}>
      <div className="flex flex-col gap-3">
        {recommendedVideos.map((videoItem) => (
          <VideoCard
            key={videoItem.videoId}
            video={videoItem}
            isCurrent={videoItem.videoId === id}
          />
        ))}
      </div>
    </div>
  );

  return (
    <div className="w-full px-4 xl:px-6">
      {!isTheaterMode ? (
        <div className="flex gap-6 items-start">
          <div className="flex-1 min-w-0 max-w-[calc(100%-402px)] ml-[25px]">
            <VideoPlayer
              ref={playerRef}
              videoPath={`${prefix}/${video.hlsPath}`}
              thumbnailUrl={`${prefix}/${video.thumbnailUrl}/thumbnail.jpg`}
              isTheaterMode={isTheaterMode}
              toggleTheater={toggleTheater}
            />

            <div className="mt-3">
              <VideoDetails />
            </div>
          </div>

          <Sidebar className="w-[402px] shrink-0 pt-1" />
        </div>
      ) : (
        <div>
          <div className="w-full">
            <VideoPlayer
              ref={playerRef}
              videoPath={`${prefix}/${video.hlsPath}`}
              thumbnailUrl={`${prefix}/${video.thumbnailUrl}/thumbnail.jpg`}
              isTheaterMode={isTheaterMode}
              toggleTheater={toggleTheater}
            />
          </div>

          <div className="flex gap-6 items-start mt-3">
            <div className="flex-1 min-w-0">
              <VideoDetails />
            </div>

            <Sidebar className="w-[450px] shrink-0 pt-1" />
          </div>
        </div>
      )}
    </div>
  );
};

export default VideoPage;