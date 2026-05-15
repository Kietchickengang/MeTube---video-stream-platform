import { useState } from 'react';
import { useParams } from 'react-router-dom';

import VideoPlayer from '../components/VideoPlayer';
import Navbar from '../components/Navbar';

const VideoPage = () => {
  const { id } = useParams();
  const [videoData, setVideoData] = useState(null);
  const [isTheaterMode, setIsTheaterMode] = useState(false);
  const [loading, setLoading] = useState(true);
  
  const api_port = 8000;
  const hostPath = `http://localhost:${api_port}/metube/videos`;
  const videoPrefix = "https://s3.vn-hcm-1.vietnix.cloud/processed-video";

  useEffect(() => {
    const fetchVideoDetail = async () => {
      try {
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
    }, [id]);

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
          />
          
          <div className={`mt-4 text-white ${isTheaterMode ? 'px-10 pb-10' : ''}`}>
            <h1 className="text-xl font-bold">{videoData.title}</h1>
          </div>
        </div>

        {/* Sidebar (Video Suggestion) */}
        <div className={`${isTheaterMode ? 'w-full px-10' : 'w-[30%] mt-6'}`}>
          {/* Map danh sách video card nhỏ ở đây */}
          <div className="bg-[#272727] h-20 rounded-lg mb-2"></div>
          <div className="bg-[#272727] h-20 rounded-lg mb-2"></div>
        </div>
      </div>
    </div>
  );
};
