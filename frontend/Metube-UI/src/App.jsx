import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import Navbar from "./components/NavigationBar";
import Sidebar from "./components/SideBar";
import HomePage from "./page/HomePage";
import VideoPage from "./page/VideoPage";
import UploadPage from "./page/UploadPage";

function App() {
  return (
    <Router>
      {/* 1. Nền đen toàn trang */}
      <div className="bg-[#0f0f0f] min-h-screen text-[#f1f1f1]">
        <Navbar />
        
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
        </div>
      </div>
    </Router>
  );
}

export default App;