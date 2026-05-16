import { useState } from 'react';
import { Routes, Route, useLocation } from 'react-router-dom';

import Navbar from "../components/NavigationBar";
import Sidebar from "../components/SideBar";

import HomePage from "./HomePage";
import VideoPage from "./VideoPage";
import UploadPage from "./UploadPage";

const LayOut = () => {
  const location = useLocation();
  const isVideoPage = location.pathname.startsWith("/video/");
  // Home mặc định mở sidebar
  const [sidebarOpen, setSidebarOpen] = useState(true);
  const [showUploadPage, setShowUploadPage] = useState(false);

  return (
    <div className="bg-[#0f0f0f] min-h-screen text-[#f1f1f1]">

      <Navbar
        goToUploadPage={() => setShowUploadPage(true)}
        toggleSidebar={() => setSidebarOpen(v => !v)}
      />

      <div className="flex pt-14">

        {/* ===== HOMEPAGE SIDEBAR ===== */}
        {!isVideoPage && sidebarOpen && (
          <div className="shrink-0">
            <Sidebar />
          </div>
        )}

        {/* ===== VIDEO PAGE OVERLAY SIDEBAR ===== */}
        {isVideoPage && sidebarOpen && (
          <>
            {/* BACKDROP */}
            <div
              className="fixed inset-0 bg-black/50 z-40"
              onClick={() => setSidebarOpen(false)}
            />

            {/* OVERLAY SIDEBAR */}
            <div className="fixed top-14 left-0 z-50">
              <Sidebar />
            </div>
          </>
        )}

        {/* ===== MAIN CONTENT ===== */}
        <main className="flex-1 bg-[#0f0f0f] pt-[10px] transition-all duration-300">
          <Routes>
            <Route path="/" element={<HomePage />} />
            <Route path="/video/:id" element={<VideoPage />} />
            <Route path="/upload" element={<UploadPage />} />

            <Route path="/shorts" element={<div>Shorts Page</div>} />
            <Route path="/history" element={<div>History Page</div>} />
            <Route path="/myVid" element={<div>My Videos</div>} />
            <Route path="/laterVid" element={<div>Watch Later</div>} />
          </Routes>
        </main>
      </div>

      {/* ===== UPLOAD MODAL ===== */}
      {showUploadPage && (
        <div className="fixed inset-0 z-[100] bg-black/60 flex justify-center items-center backdrop-blur-sm">
          <div className="w-full max-w-[1000px]">
            <UploadPage
              isClose={() => setShowUploadPage(false)}
            />
          </div>
        </div>
      )}
    </div>
  );
};

export default LayOut;