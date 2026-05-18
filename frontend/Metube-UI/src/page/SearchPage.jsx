import { useEffect, useMemo, useState } from 'react';
import { Link, useLocation } from 'react-router-dom';
import { Play } from 'lucide-react';
import { timeAgo, displayDuration } from '../utils/cal_in4';

const api_port = 8000;
const hostPath = `http://localhost:${api_port}/metube/videos`;
const videoPrefix = 'https://s3.vn-hcm-1.vietnix.cloud/processed-video';

const SearchPage = () => {
  const location = useLocation();
  const [videos, setVideos] = useState([]);
  const [loading, setLoading] = useState(true);
  const query = useMemo(() => new URLSearchParams(location.search).get('q')?.trim() || '', [location.search]);

  useEffect(() => {
    const fetchVideos = async () => {
      setLoading(true);
      try {
        const response = await fetch(hostPath);
        const data = await response.json();
        setVideos(data || []);
      } catch (err) {
        console.error('Search failed:', err);
        setVideos([]);
      } finally {
        setLoading(false);
      }
    };

    fetchVideos();
  }, [query]);

  const filtered = useMemo(() => {
    if (!query) return [];
    return videos.filter((video) => {
      const text = `${video.title || ''} ${video.description || ''} ${video.channelName || ''}`.toLowerCase();
      return text.includes(query.toLowerCase());
    });
  }, [query, videos]);

  return (
    <div className="max-w-7xl mx-auto px-2 py-4">
      <div className="mb-6">
        <h1 className="text-3xl font-bold mb-2">Kết quả tìm kiếm</h1>
        <p className="text-sm text-[#c0c0c0]">Từ khóa: <span className="font-semibold text-white">{query || '---'}</span></p>
      </div>

      {loading ? (
        <div className="flex justify-center items-center h-40 text-white">Đang tìm kiếm...</div>
      ) : !query ? (
        <div className="rounded-3xl border border-[#272727] bg-[#121212] p-6 text-[#c0c0c0]">
          Nhập nội dung tìm kiếm trong thanh tìm kiếm để bắt đầu.
        </div>
      ) : filtered.length === 0 ? (
        <div className="rounded-3xl border border-[#272727] bg-[#121212] p-6 text-[#c0c0c0]">
          Không tìm thấy video nào cho "{query}".
        </div>
      ) : (
        <div className="grid grid-cols-1 lg:grid-cols-2 xl:grid-cols-3 gap-4">
          {filtered.map((video) => (
            <Link
              key={video.videoId}
              to={`/video/${video.videoId}`}
              className="group overflow-hidden rounded-3xl bg-[#111111] hover:bg-[#1e1e1e] transition p-3 no-underline"
            >
              <div className="relative overflow-hidden rounded-2xl bg-[#222222] aspect-video mb-4">
                <img
                  src={`${videoPrefix}/${video.thumbnailUrl}/thumbnail.jpg`}
                  alt={video.title}
                  className="w-full h-full object-cover"
                />
                {video.duration && (
                  <div className="absolute bottom-3 right-3 rounded-md bg-black/70 px-2 py-1 text-xs text-white">
                    {displayDuration(video.duration)}
                  </div>
                )}
              </div>
              <div className="text-white font-semibold text-lg mb-2 line-clamp-2">{video.title}</div>
              <div className="text-[#aaaaaa] text-sm mb-2">{video.channelName || 'Kênh không xác định'}</div>
              <div className="flex items-center justify-between text-[#777] text-xs">
                <span>{video.views || '0'} lượt xem</span>
                <span>{timeAgo(video.createdAt)}</span>
              </div>
            </Link>
          ))}
        </div>
      )}
    </div>
  );
};

export default SearchPage;
