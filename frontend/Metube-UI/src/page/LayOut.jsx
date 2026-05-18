import { useState, useEffect } from 'react';
import { Routes, Route, useLocation } from 'react-router-dom';

import Navbar from "../components/NavigationBar";
import Sidebar from "../components/SideBar";

import HomePage from "./HomePage";
import VideoPage from "./VideoPage";
import UploadPage from "./UploadPage";
import SubscriptionsPage from "./SubscriptionsPage";
import WatchHistoryPage from "./WatchHistoryPage";
import YourVideosPage from "./YourVideosPage";
import WatchLaterPage from "./WatchLaterPage";
import LikedVideosPage from "./LikedVideosPage";
import SettingsPage from "./SettingsPage";
import ReportHistoryPage from "./ReportHistoryPage";
import HelpPage from "./HelpPage";
import LoginPage from "./LoginPage";
import RegisterPage from "./RegisterPage";
import ProfilePage from "./ProfilePage";

const LayOut = () => {
  const location = useLocation();
  const isVideoPage = location.pathname.startsWith("/video/");
  const [showUploadPage, setShowUploadPage] = useState(false);
  const [isSidebarOpen, setIsSidebarOpen] = useState(true);

  // Hide sidebar when click video
  useEffect(() => { 
    if(isVideoPage) { 
      setIsSidebarOpen(false); 
    } 
  }, [isVideoPage]);

  return (
    <div className="bg-[#0f0f0f] min-h-screen text-[#f1f1f1]">
      <Navbar goToUploadPage={() => setShowUploadPage(true)} toggleSidebar={() => setIsSidebarOpen((prev) => !prev)} />

      <div className="flex pt-14">
        {/* ===== HOMEPAGE SIDEBAR ===== */}
        {!isVideoPage && isSidebarOpen && (
          <div className="shrink-0">
            <Sidebar />
          </div>
        )}
        {/* ===== VIDEO PAGE OVERLAY SIDEBAR ===== */}
        {isVideoPage && isSidebarOpen && (
          <>
            {/* BACKDROP */}
            <div
              className="fixed inset-0 bg-black/50 z-40"
              onClick={() => setIsSidebarOpen(false)}
            />
            {/* OVERLAY SIDEBAR */}
            <div className="fixed top-14 left-0 z-50">
              <Sidebar />
            </div>
          </>
        )}

        <main className={`flex-1 p-2 bg-[#0f0f0f] min-h-[calc(100vh-56px)] transition-all duration-300 ${
          isSidebarOpen && !isVideoPage ? "md:ml-60" : "md:ml-0"
        }`}>
          <Routes>
            <Route path="/" element={<HomePage />} />
            <Route path="/subscriptions" element={<SubscriptionsPage />} />
            <Route path="/history" element={<WatchHistoryPage />} />
            <Route path="/your-videos" element={<YourVideosPage />} />
            <Route path="/watch-later" element={<WatchLaterPage />} />
            <Route path="/liked" element={<LikedVideosPage />} />
            <Route path="/settings" element={<SettingsPage />} />
            <Route path="/reports" element={<ReportHistoryPage />} />
            <Route path="/help" element={<HelpPage />} />
            <Route path="/video/:id" element={<VideoPage />} />
            <Route path="/upload" element={<UploadPage />} />
            <Route path="/login" element={<LoginPage />} />
            <Route path="/register" element={<RegisterPage />} />
            <Route path="/profile" element={<ProfilePage />} />
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