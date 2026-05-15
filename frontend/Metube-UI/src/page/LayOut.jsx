import { useState } from 'react';
import { Routes, Route, useLocation } from 'react-router-dom';

import Navbar from "../components/NavigationBar";
import Sidebar from "../components/SideBar";

import HomePage from "./HomePage";
import VideoPage from "./VideoPage";
import UploadPage from "./UploadPage";

const LayOut = () => {
  const [showUploadPage, setShowUploadPage] = useState(false);

  const location = useLocation();

  const isVideoPage = location.pathname.startsWith("/video/");

  return (
    <div className="bg-[#0f0f0f] min-h-screen text-[#f1f1f1]">
      <Navbar goToUploadPage={() => setShowUploadPage(true)} />

      <div className="flex">
        {!isVideoPage && <Sidebar />}

        <main className="flex-1 p-2 bg-[#0f0f0f] mt-[10px]">
          <Routes>
            <Route path="/" element={<HomePage />} />
            <Route path="/video/:id" element={<VideoPage />} />
            <Route path="/upload" element={<UploadPage />} />
          </Routes>
        </main>

        {showUploadPage && (
          <div className="fixed inset-0 z-[100] bg-opacity-60 flex justify-center items-center backdrop-blur-sm">
            <div className="w-full max-w-[1000px]">
              <UploadPage isClose={() => setShowUploadPage(false)} />
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default LayOut;