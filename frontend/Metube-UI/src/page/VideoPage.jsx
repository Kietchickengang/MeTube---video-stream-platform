import { ThumbsUp, ThumbsDown, Redo2 } from 'lucide-react';
import React from 'react';
import { useState, useEffect } from 'react';
import { useParams } from 'react-router-dom';
import VideoPlayer from '../components/VideoPlayer';
import { fetchVideoById } from '../service/api';

const VideoPage = () => {
  const { id } = useParams();
  const [video, setVideo] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  const [activeIcon, setActiveIcon] = useState(null); // like || dislike || null

  useEffect(() => {
    const loadVideo = async () => {
      try {
        const videoData = await fetchVideoById(id);
        setVideo(videoData);
      } catch (error) {
        console.error('Error loading video:', error);
        setError('Failed to load video');
      } finally {
        setLoading(false);
      }
    };

    loadVideo();
  }, [id]);

  if (loading) {
    return <div className="flex justify-center items-center h-64">Loading...</div>;
  }

  if (error || !video) {
    return <div className="flex justify-center items-center h-64 text-red-500">{error || 'Video not found'}</div>;
  }

  const iconProp = [
      {keyId: "like", ico: ThumbsUp},
      {keyId: "dislike", ico: ThumbsDown},
  ]

  return (
    <div className="max-w-7xl mx-auto">
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Video Player */}
        <div className="lg:col-span-2">
          <VideoPlayer video={video} />
          <div className="mt-4">
            <h1 className="text-xl font-bold mb-2">{video.title}</h1>
            <div className="flex items-center justify-start gap-3 mb-1">
              <img src={video.channelAvatar} alt={video.channelName} className="w-10 h-10 rounded-full" />
              <div>
                <p className="mt-3 font-semibold mb-0">{video.channelName}</p>
                <p className="text-sm text-gray-400">Subscriber</p>
              </div>
              <button className="font-semibold tracking-tight ml-7px bg-red-600 text-white px-3 py-2 rounded-full hover:bg-red-700 text-center">
                Subscribe
              </button>
              <div className="flex items-center bg-[#222222] rounded-full overflow-hidden tracking-tight ml-7">
                  {
                    iconProp.map((btn,idx) => {
                      const isActive = (activeIcon === btn.keyId);
                      return (
                        <React.Fragment key={btn.keyId}>
                          <button className="flex flex-row gap-2 items-center justify-center font-semibold bg-[#222222] px-3 py-2 rounded-full cursor-pointer"
                                  onClick={() => setActiveIcon(isActive? null : btn.keyId)}>
                            <btn.ico
                              fill={isActive? "white":"none"} 
                              color={isActive? "#333333" : "white"}
                              strokeWidth={isActive ? 1 : 2}
                              className="transition-all duration-200 hover:opacity-50"
                            />
                            {idx === 0? video.liked : ""}        
                          </button>
                          {idx === 0 && <div className="w-[1px] h-6 bg-[#444444]"></div>}
                        </React.Fragment>
                      )
                  })}
              </div>
              <button className="flex flex-row gap-2 items-center justify-center font-semibold bg-[#222222] px-2.5 py-2 rounded-full cursor-pointer tracking-tight">
                <Redo2/> Share
              </button>
            </div>
            <div className="bg-[#222222] p-2 rounded-xl">
              <div className="flex items-center gap-4 text-sm text-white-700 mb-1 font-semibold ml-2">
                <span>{video.views} views</span>
                <span>{video.postedAt}</span>
              </div>
              <p className='ml-2'>{video.description || 'No description available.'}</p>
            </div>
          </div>
        </div>

        {/* Sidebar - Related videos or comments */}
        <div className="lg:col-span-1">
          <h3 className="text-lg font-semibold mb-4">Related Videos</h3>
          {/* Placeholder for related videos */}
          <div className="space-y-4">
            {/* You can add related videos here */}
          </div>
        </div>
      </div>
    </div>
  );
};

export default VideoPage;
