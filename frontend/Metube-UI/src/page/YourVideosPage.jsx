import { useEffect, useState } from "react";
import { useAuth } from "../context/AuthContext.jsx";
import { useNavigate } from "react-router-dom";
import VideoCard from "../components/VideoCard.jsx";

const api_port = 8000;

const hostPath = `http://localhost:${api_port}/metube/my-videos`;

const YourVideosPage = () => {
  const { user } = useAuth();

  const navigate = useNavigate();

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
        const response = await fetch(hostPath, {
          credentials: "include",
        });

        const data = await response.json();

        setVideos(Array.isArray(data) ? data : []);
      } catch (err) {
        console.error("Không thể tải video của bạn:", err);
        setVideos([]);
      } finally {
        setLoading(false);
      }
    };

    loadVideos();
  }, [user]);

  // DELETE VIDEO
  const handleDelete = async (videoId) => {
    const confirmDelete = window.confirm(
      "Bạn có chắc muốn xóa video này không?",
    );

    if (!confirmDelete) return;

    try {
      const response = await fetch(
        `http://localhost:${api_port}/metube/videos/${videoId}`,
        {
          method: "DELETE",
          credentials: "include",
        },
      );

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.message || "Delete failed");
      }

      // remove khỏi state
      setVideos((prev) => prev.filter((video) => video.videoId !== videoId));
    } catch (err) {
      console.error("Delete error:", err);
      alert("Xóa video thất bại");
    }
  };

  // EDIT VIDEO
  const handleEdit = (videoId) => {
    navigate(`/video/${videoId}/edit`);
  };

  if (!user) {
    return (
      <div className="max-w-6xl mx-auto px-2 py-4">
        <h1 className="text-3xl font-bold mb-3">Video của bạn</h1>

        <p className="text-sm text-[#c0c0c0] leading-relaxed mb-4">
          Vui lòng đăng nhập để xem những video bạn đã tải lên.
        </p>

        <a
          href="/login"
          className="inline-block rounded-full bg-[#1c62b9] px-5 py-3 text-white"
        >
          Đăng nhập
        </a>
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
        <div className="rounded-3xl border border-[#272727] bg-[#121212] p-6 text-[#c0c0c0]">
          Đang tải video...
        </div>
      ) : videos.length === 0 ? (
        <div className="rounded-3xl border border-[#272727] bg-[#121212] p-6 text-[#c0c0c0]">
          Bạn chưa tải lên video nào.
        </div>
      ) : (
        <div className="grid grid-cols-1 lg:grid-cols-2 xl:grid-cols-3 gap-4">
          {videos.map((video) => (
            <div
              key={video.videoId}
              className="bg-[#121212] rounded-2xl overflow-hidden border border-[#272727]"
            >
              <VideoCard video={video} />

              {/* ACTION BUTTONS */}
              <div className="flex gap-3 p-4">
                <button
                  onClick={() => handleEdit(video.videoId)}
                  className="flex-1 bg-[#272727] hover:bg-[#3a3a3a] text-white py-2 rounded-xl transition"
                >
                  Sửa
                </button>

                <button
                  onClick={() => handleDelete(video.videoId)}
                  className="flex-1 bg-red-600 hover:bg-red-700 text-white py-2 rounded-xl transition"
                >
                  Xóa
                </button>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

export default YourVideosPage;
