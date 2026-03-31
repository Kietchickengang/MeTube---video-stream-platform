import { useState, useEffect } from 'react';
import { useParams } from 'react-router-dom';
import VideoPlayer from '../components/VideoPlayer';
import { fetchVideoById } from '../service/api';

const VideoPage = () => {
  const { id } = useParams();
  const [video, setVideo] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

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

  return (
    <div className="max-w-6xl mx-auto">
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Video Player */}
        <div className="lg:col-span-2">
          <VideoPlayer video={video} />
          <div className="mt-4">
            <h1 className="text-2xl font-bold mb-2">{video.title}</h1>
            <div className="flex items-center gap-4 text-sm text-gray-600 mb-4">
              <span>{video.views} views</span>
              <span>{video.postedAt}</span>
            </div>
            <div className="flex items-center gap-3 mb-4">
              <img src={video.channelAvatar} alt={video.channelName} className="w-10 h-10 rounded-full" />
              <div>
                <p className="font-semibold">{video.channelName}</p>
                <p className="text-sm text-gray-600">Subscriber count</p>
              </div>
              <button className="ml-auto bg-red-600 text-white px-4 py-2 rounded-full hover:bg-red-700">
                Subscribe
              </button>
            </div>
            <div className="bg-gray-100 p-4 rounded-lg">
              <p>{video.description || 'No description available.'}</p>
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
