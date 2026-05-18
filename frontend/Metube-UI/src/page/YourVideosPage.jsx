import { useEffect, useState } from 'react';
import { useAuth } from '../context/AuthContext.jsx';
import { getUserUploads } from '../service/userDataService.js';
import VideoCard from '../components/VideoCard.jsx';

const api_port = 8000;
const hostPath = `http://localhost:${api_port}/metube/videos`;

const YourVideosPage = () => {
  const { user } = useAuth();
  const [videos, setVideos] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const loadVideos = async () => {
      if (!user) {
        setVideos([]);
        setLoading(false);
        return;
      }

      try {
        const response = await fetch(hostPath);
        const data = await response.json();
        const storedUploads = getUserUploads(user);
        const ownVideos = Array.isArray(data)
          ? data.filter((video) => video.channelName === user.name)
          : [];

        const merged = [...storedUploads, ...ownVideos].reduce((acc, item) => {
          if (!acc.some((video) => video.videoId === item.videoId)) {
            acc.push(item);
          }
          return acc;
        }, []);

        setVideos(merged);
      } catch (err) {
        console.error('Không thể tải video của bạn:', err);
        setVideos(getUserUploads(user));
      } finally {
        setLoading(false);
      }
    };

    loadVideos();
  }, [user]);

  if (!user) {
    return (
      <div className="max-w-6xl mx-auto px-2 py-4">
        <h1 className="text-3xl font-bold mb-3">Video của bạn</h1>
        <p className="text-sm text-[#c0c0c0] leading-relaxed mb-4">Vui lòng đăng nhập để xem những video bạn đã tải lên.</p>
        <a href="/login" className="inline-block rounded-full bg-[#1c62b9] px-5 py-3 text-white">Đăng nhập</a>
      </div>
    );
  }

  return (
    <div className="max-w-7xl mx-auto px-2 py-4">
      <h1 className="text-3xl font-bold mb-3">Video của bạn</h1>
      <p className="text-sm text-[#c0c0c0] leading-relaxed mb-6">
        Quản lý các video bạn đã tải lên và xem trạng thái xử lý ở đây.
      </p>
      {loading ? (
        <div className="rounded-3xl border border-[#272727] bg-[#121212] p-6 text-[#c0c0c0]">Đang tải video...</div>
      ) : videos.length === 0 ? (
        <div className="rounded-3xl border border-[#272727] bg-[#121212] p-6 text-[#c0c0c0]">
          Bạn chưa có video nào hoặc hệ thống chưa ghi nhận kênh của bạn. Hãy tải lên video mới để bắt đầu.
        </div>
      ) : (
        <div className="grid grid-cols-1 lg:grid-cols-2 xl:grid-cols-3 gap-4">
          {videos.map((video) => (
            <VideoCard key={video.videoId} video={video} />
          ))}
        </div>
      )}
    </div>
  );
};

export default YourVideosPage;
