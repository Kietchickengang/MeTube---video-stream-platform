import React, { useState, useEffect, useRef } from 'react';
import { useParams, useNavigate } from 'react-router-dom';

import VideoPlayer from '../components/VideoPlayer';
import Navbar from '../components/Navbar';

const VideoPage = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const [videoData, setVideoData] = useState(null);
  const [isTheaterMode, setIsTheaterMode] = useState(false);
  const [loading, setLoading] = useState(true);
  
  // Các state phục vụ tính năng Auto-play
  const [isAutoPlay, setIsAutoPlay] = useState(true); // Trạng thái bật/tắt tự động phát
  const [countdown, setCountdown] = useState(null); // Số giây đếm ngược còn lại
  const timerRef = useRef(null);
  
  const api_port = 8000;
  const hostPath = `http://localhost:${api_port}/metube/videos`;
  const videoPrefix = "https://s3.vn-hcm-1.vietnix.cloud/processed-video";

  // ID của video tiếp theo (Giả định lấy tạm id+1 hoặc từ danh sách của bạn)
  const nextVideoId = Number(id) + 1; 

  useEffect(() => {
    const fetchVideoDetail = async () => {
      try {
        setCountdown(null); // Reset đếm ngược khi đổi video
        clearInterval(timerRef.current);

        const response = await fetch(`${hostPath}/${id}`);
        const data = await response.json();
        setVideoData(data);
      } 
      catch (err) {
        console.error("Error get detailed video:", err);
      } 
      finally {
        setLoading(false);
      }
    };
    fetchVideoDetail();

    return () => clearInterval(timerRef.current);
  }, [id]);

  // Hàm xử lý khi video hiện tại chạy xong hết
  const handleVideoEnded = () => {
    if (!isAutoPlay) return; // Nếu tắt tự động phát thì dừng không làm gì cả

    setCountdown(15); // Bắt đầu đếm ngược từ 15 giây
  };

  // Effect chạy bộ đếm ngược thời gian thực
  useEffect(() => {
  if (countdown === null) return;

  // Nếu đếm ngược chạm 0, dọn dẹp và chuyển trang ngay lập tức
  if (countdown === 0) {
    clearInterval(timerRef.current);
    navigate(`/video/${nextVideoId}`);
    return;
  }

    timerRef.current = setInterval(() => {
    setCountdown((prev) => {
      if (prev === null || prev <= 1) {
        clearInterval(timerRef.current);
        return 0;
      }
      return prev - 1;
    });
  }, 1000);
  return () => clearInterval(timerRef.current);
}, [countdown === 0, navigate, nextVideoId]);

  // Hàm hủy đếm ngược nếu user đổi ý bấm "Cancel"
  const cancelCountdown = () => {
    setCountdown(null);
    clearInterval(timerRef.current);
  };

  if (loading) return <div className="text-white">Loading...</div>;
  if (!videoData) return <div className="text-white">Video not found.</div>;

  return (
    <div className="bg-[#0f0f0f] min-h-screen">
      <Navbar />
      <div className={`pt-14 transition-all duration-300 ${isTheaterMode ? 'flex flex-col' : 'flex flex-row gap-6 px-10'}`}>
        
        {/* Main Content Area */}
        <div className={`${isTheaterMode ? 'w-full' : 'w-[70%] mt-6'}`}>
          <VideoPlayer 
            videoPath={`${videoPrefix}/${videoData.hlsPath}`} 
            thumbnailUrl={`${videoPrefix}/${videoData.thumbnailUrl}`}
            isTheaterMode={isTheaterMode}
            toggleTheater={() => setIsTheaterMode(!isTheaterMode)}
            onVideoEnded={handleVideoEnded} // Truyền callback xuống player
            isAutoPlay={isAutoPlay} // Truyền xuống để hiển thị đồng bộ nút bấm trên thanh bar
            setIsAutoPlay={setIsAutoPlay}
          />
          
          <div className={`mt-4 text-white ${isTheaterMode ? 'px-10 pb-10' : ''}`}>
            <h1 className="text-xl font-bold">{videoData.title}</h1>
            
            {/* Hộp thông báo đang chuẩn bị tự động phát (Hiện ra khi video kết thúc) */}
            {countdown !== null && (
              <div className="mt-4 p-4 bg-zinc-900 rounded-xl flex items-center justify-between border border-zinc-800 animate-in fade-in duration-300">
                <div className="flex items-center gap-3">
                  <div className="h-2 w-2 rounded-full bg-red-500 animate-pulse" />
                  <p className="text-sm font-medium text-zinc-300">
                    Next video will play in <span className="text-red-500 font-bold text-base px-1">{countdown}</span> seconds...
                  </p>
                </div>
                <button 
                  onClick={cancelCountdown}
                  className="px-4 py-1.5 bg-white/10 hover:bg-white/20 text-white text-xs font-semibold rounded-full transition-colors"
                >
                  Auto play is off
                </button>
              </div>
            )}
          </div>
        </div>

        {/* Sidebar (Video Suggestion) */}
        <div className={`${isTheaterMode ? 'w-full px-10' : 'w-[30%] mt-6'}`}>
          <div className="flex items-center justify-between text-white mb-3">
            <span className="font-bold text-sm">Next video</span>
          </div>
          <div className="bg-[#272727] h-20 rounded-lg mb-2"></div>
          <div className="bg-[#272727] h-20 rounded-lg mb-2"></div>
        </div>
      </div>
    </div>
  );
};

export default VideoPage;