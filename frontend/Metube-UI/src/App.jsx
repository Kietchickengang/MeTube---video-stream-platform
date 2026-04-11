import { useState } from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import Navbar from "./components/NavigationBar";
import Sidebar from "./components/SideBar";
import HomePage from "./page/HomePage";
import VideoPage from "./page/VideoPage";
import UploadPage from "./page/UploadPage";

function App() {
  const [showUploadPage, setShowUploadPage] = useState(false);
  return (
    <Router>
      {/* 1. Nền đen toàn trang */}
      <div className="bg-[#0f0f0f] min-h-screen text-[#f1f1f1]">
        <Navbar goToUploadPage={() => setShowUploadPage(true)}/>
        
        <div className="flex">
          {/* Sidebar nên có độ rộng cố định hoặc ẩn hiện tùy mobile */}
          <Sidebar />
          
          {/* 2. Phần nội dung chính: Đổi bg-gray-50 thành bg-transparent hoặc bg-[#0f0f0f] */}
          <main className="flex-1 p-4 bg-[#0f0f0f]">
            <Routes>
              <Route path="/" element={<HomePage />} />
              <Route path="/video/:id" element={<VideoPage />} />
              <Route path="/upload" element={<UploadPage />} />
            </Routes>
          </main>

          {/* showUploadPage = true thì mới mở form để upload */}
          {/* Hook hơi rườm rà tí :)) */}
          { showUploadPage &&
            <div className="fixed inset-0 z-[100] bg-opacity-60 flex justify-center items-center backdrop-blur-sm">
              {/* Thẻ div trung gian để cái thẻ quỷ này bung max :)) */}
              <div className="w-full max-w-[1000px]">
                  <UploadPage isClose={() => setShowUploadPage(false)}/>
              </div>
            </div>
          }
        </div>
      </div>
    </Router>
  );
}

export default App;