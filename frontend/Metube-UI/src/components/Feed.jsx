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
    <div className="min-h-screen bg-[#0f0f0f] text-white mt-14 px-4 py-4">
      {/* 1. Thanh Tabs Phân loại (Dark Style) */}
      <div className="mb-6 flex gap-3 overflow-x-auto pb-2 no-scrollbar">
        {['Tất cả', 'Âm nhạc', 'Trò chơi', 'Trực tiếp', 'Học tập', 'Tin tức', 'Mới tải lên gần đây'].map((tab, index) => (
          <button 
            key={tab} 
            className={`whitespace-nowrap px-3 py-1.5 rounded-lg text-sm font-medium transition
              ${index === 0 
                ? 'bg-white text-black' 
                : 'bg-[#272727] text-white hover:bg-[#3f3f3f]'}`}
          >
            {tab}
          </button>
        ))}
      </div>

      {/* 2. Grid Videos */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-x-4 gap-y-8">
        {videos.map((video) => (
          <Link to={`/video/${video.id}`} key={video.id} className="group flex flex-col gap-3">
            {/* Thumbnail */}
            <div className="relative aspect-video w-full overflow-hidden rounded-xl bg-[#272727]">
              <img 
                src={video.thumbnail} 
                alt={video.title} 
                className="w-full h-full object-cover group-hover:rounded-none transition-all duration-200" 
              />
              {video.duration && (
                <div className="absolute bottom-2 right-2 bg-black/80 text-white text-xs font-medium px-1.5 py-0.5 rounded">
                  {video.duration}
                </div>
              )}
            </div>

            {/* Thông tin Video */}
            <div className="flex gap-3">
              <img 
                src={video.channelAvatar} 
                alt={video.channelName} 
                className="w-9 h-9 rounded-full object-cover flex-shrink-0" 
              />
              <div className="flex flex-col">
                <h3 className="text-sm font-bold line-clamp-2 leading-snug text-[#f1f1f1]">
                  {video.title}
                </h3>
                <div className="mt-1 text-sm text-[#aaaaaa]">
                  <p className="hover:text-white transition">{video.channelName}</p>
                  <p>{video.views} lượt xem • {video.postedAt}</p>
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