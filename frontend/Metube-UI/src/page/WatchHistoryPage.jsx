import { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { useAuth } from '../context/AuthContext.jsx';
import { getWatchHistory } from '../service/userDataService.js';
import { timeAgo } from '../utils/cal_in4.js';

const WatchHistoryPage = () => {
  const { user } = useAuth();
  const [history, setHistory] = useState([]);

  useEffect(() => {
    setHistory(getWatchHistory(user));
  }, [user]);

  if (!user) {
    return (
      <div className="max-w-6xl mx-auto px-2 py-4">
        <h1 className="text-3xl font-bold mb-3">Video đã xem</h1>
        <p className="text-sm text-[#c0c0c0] leading-relaxed mb-4">Vui lòng đăng nhập để xem lịch sử xem của bạn.</p>
        <Link to="/login" className="inline-block rounded-full bg-[#1c62b9] px-5 py-3 text-white">Đăng nhập</Link>
      </div>
    );
  }

  return (
    <div className="max-w-6xl mx-auto px-2 py-4">
      <h1 className="text-3xl font-bold mb-3">Video đã xem</h1>
      <p className="text-sm text-[#c0c0c0] leading-relaxed mb-6">
        Danh sách các video bạn đã xem sẽ được lưu trữ và hiển thị tại đây.
      </p>

      {history.length === 0 ? (
        <div className="rounded-3xl border border-[#272727] bg-[#121212] p-6 text-[#c0c0c0]">
          Hiện chưa có lịch sử xem nào. Hãy xem một video để bắt đầu.
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {history.map((item) => (
            <Link
              to={`/video/${item.videoId}`}
              key={item.videoId}
              className="group overflow-hidden rounded-3xl bg-[#111111] p-4 no-underline hover:bg-[#1a1a1a] transition"
            >
              <div className="flex gap-4 items-center">
                <div className="w-[126px] h-[72px] rounded-xl overflow-hidden bg-[#222222] flex-shrink-0">
                  <img
                    src={`https://s3.vn-hcm-1.vietnix.cloud/processed-video/${item.thumbnailUrl}/thumbnail.jpg`}
                    alt={item.title}
                    className="w-full h-full object-cover"
                  />
                </div>
                <div className="flex-1">
                  <h2 className="text-lg font-semibold text-white line-clamp-2">{item.title}</h2>
                  <p className="text-sm text-[#aaaaaa]">{item.channelName || 'Kênh không xác định'}</p>
                  <p className="text-xs text-[#777] mt-1">Xem lần cuối: {timeAgo(item.viewedAt)}</p>
                </div>
              </div>
            </Link>
          ))}
        </div>
      )}
    </div>
  );
};

export default WatchHistoryPage;
