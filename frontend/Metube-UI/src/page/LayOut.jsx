import { useState } from 'react';
import { Routes, Route, useLocation } from 'react-router-dom';

import Navbar from "../components/NavigationBar";
import Sidebar from "../components/SideBar";

import HomePage from "./HomePage";
import SearchPage from "./SearchPage";
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

const LayOut = ({ theme }) => {
  const [showUploadPage, setShowUploadPage] = useState(false);
  const [isSidebarOpen, setIsSidebarOpen] = useState(true);

  const rootClasses = theme === 'light'
    ? 'bg-[#f8fafc] text-[#0f172a]'
    : 'bg-[#0f0f0f] text-[#f1f1f1]';

  return (
    <div className={`${rootClasses} min-h-screen`}>
      <Navbar goToUploadPage={() => setShowUploadPage(true)} toggleSidebar={() => setIsSidebarOpen((prev) => !prev)} />

      <div className="flex pt-14">
        {isSidebarOpen && <Sidebar />}

        <main className={`flex-1 p-2 bg-[#0f0f0f] min-h-[calc(100vh-56px)] transition-all duration-300 ${isSidebarOpen ? "md:ml-60" : "md:ml-0"}`}>
          <Routes>
            <Route path="/" element={<HomePage />} />
            <Route path="/search" element={<SearchPage />} />
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