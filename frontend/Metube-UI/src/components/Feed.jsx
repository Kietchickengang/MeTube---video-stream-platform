import { Play} from 'lucide-react';
import { useState, useEffect } from 'react';
import { Link } from "react-router-dom";
import { timeAgo, displayDuration } from "../utils/cal_in4"

const api_port = 8000;
const hostPath = `http://localhost:${api_port}/metube/videos`;
const videoPrefix = "https://s3.vn-hcm-1.vietnix.cloud/processed-video";

const Feed = () => {
  const [videos, setVideos] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const getVideos = async () => {
      try {
        const response = await fetch(`${hostPath}`);
        const data = await response.json();
        setVideos(data); 
      } 
      catch (err) {console.error("Error fetching videos:", err);}
      finally {
        setLoading(false);
      }
    };
    getVideos();
  }, []);

  if (loading) {
    return (
      <div className="flex justify-center items-center h-screen bg-[#0f0f0f] text-white">
        <div className="animate-spin rounded-full h-10 w-10 border-t-2 border-white"></div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-[#0f0f0f] text-white mt-0 px-2">
      <div className="mb-3 flex gap-3 overflow-x-auto pb-2 no-scrollbar">
        {['Tất cả', 'Âm nhạc', 'Trò chơi', 'Trực tiếp', 'Học tập', 'Tin tức', 'Mới tải lên gần đây'].map((tab, index) => (
          <button 
            key={tab} 
            className={`ml-2 flex justify-center items-center whitespace-nowrap px-3 py-1.5 rounded-lg text-[14px] font-medium transition
              ${index === 0 
                ? 'bg-white text-black' 
                : 'bg-[#272727] text-white hover:bg-[#3f3f3f]'}`}
          >
            {tab}
          </button>
        ))}
      </div>

      {/* 2. Grid Videos */}
      <div className="grid grid-cols-1 lg:grid-cols-2 xl:grid-cols-3 gap-x-4 gap-y-8">
        {videos.map((video) => (
          <Link to={`/video/${video.videoId}`} key={video.videoId} className="group flex flex-col gap-3 no-underline text-inherit hover:bg-[#272727] p-2 rounded-2xl">
            {/* Thumbnail */}
            <div className="relative aspect-video w-full overflow-hidden rounded-xl bg-[#272727]">
              <img 
                src={`${videoPrefix}/${video.thumbnailUrl}/thumbnail.jpg`} 
                alt={video.title} 
                className="w-full h-full object-cover group-hover:scale-105 group-hover:rounded-none transition-all duration-500" 
              />
              {video.duration && (
                <div className="absolute bottom-2 right-2 bg-black/80 text-white text-sm font-medium px-2 py-0.5 rounded-pill group-hover:opacity-0">
                  {displayDuration(video.duration)}
                </div>
              )}
            </div>

            {/* Thông tin Video */}
            <div className="flex gap-3 px-1">
              <img 
                src={video.channelAvatar || "https://tinyurl.com/277pc7ru"} 
                alt={video.channelName || "K13T DU0N9"} 
                className="w-9 h-9 rounded-full object-cover flex-shrink-0" 
              />
              <div className="flex flex-col tracking-tight">
                <h3 className="text-lg font-semibold line-clamp-2 leading-snug text-[#f1f1f1] tracking-tight">
                  {video.title}
                </h3>
                <div className="mt-1 text-sm text-[#aaaaaa] leading-none flex items-center flex-wrap gap-x-2">
                  <p className="hover:text-white transition">{video.channelName || "K13T DU0N9"}</p>
                  <p className="flex items-center flex-wrap gap-x-1">
                    <Play size={15}></Play>{video.views || "8.3 N"}&nbsp;&nbsp;&nbsp;{timeAgo(video.createdAt)}
                  </p>
                </div>
              </div>
            </div>
          </Link>
        ))}
      </div>
    </div>
  );
};

export default Feed;