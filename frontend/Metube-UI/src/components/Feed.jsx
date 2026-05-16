import { Play} from 'lucide-react';
import { useState, useEffect } from 'react';
import { Link } from "react-router-dom";
// import { fetchVideos } from '../service/api'; // Giữ nguyên logic của bạn
import { MOCK_VIDEOS } from "../utils/constants";

const Feed = () => {
  const [videos, setVideos] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    // Tạm thời dùng MOCK_VIDEOS để demo giao diện
    setVideos(MOCK_VIDEOS);
    setLoading(false);
  }, []);

  if (loading) {
    return (
      <div className="flex justify-center items-center h-screen bg-[#0f0f0f] text-white">
        <div className="animate-spin rounded-full h-10 w-10 border-t-2 border-white"></div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-[#0f0f0f] text-white mt-7 px-4 py-4">
      {/* 2. Grid Videos */}
      <div className="grid grid-cols-1 lg:grid-cols-2 xl:grid-cols-3 gap-x-4 gap-y-8">
        {videos.map((video) => (
          <Link to={`/video/${video.id}`} key={video.id} className="group flex flex-col gap-3 no-underline text-inherit hover:bg-[#272727] p-2 rounded-2xl">
            {/* Thumbnail */}
            <div className="relative aspect-video w-full overflow-hidden rounded-xl bg-[#272727]">
              <img 
                src={video.thumbnail} 
                alt={video.title} 
                className="w-full h-full object-cover group-hover:scale-105 group-hover:rounded-none transition-all duration-500" 
              />
              {video.duration && (
                <div className="absolute bottom-2 right-2 bg-black/80 text-white text-xs font-medium px-1.5 py-0.5 rounded group-hover:opacity-0">
                  {video.duration}
                </div>
              )}
            </div>

            {/* Thông tin Video */}
            <div className="flex gap-3 px-1">
              <img 
                src={video.channelAvatar} 
                alt={video.channelName} 
                className="w-9 h-9 rounded-full object-cover flex-shrink-0" 
              />
              <div className="flex flex-col">
                <h3 className="text-[17px] font-semibold line-clamp-2 leading-snug text-[#f1f1f1] tracking-tight">
                  {video.title}
                </h3>
                <div className="mt-1 text-[15px] text-[#aaaaaa] leading-none flex items-center flex-wrap gap-x-2">
                  <p className="hover:text-white transition">{video.channelName}</p>
                  <p className="flex items-center flex-wrap gap-x-1">
                    <Play size={15}></Play>{video.views}&nbsp;&nbsp;{video.postedAt}
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