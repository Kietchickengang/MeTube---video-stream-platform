import React from 'react';
import { Home, PlaySquare, Clock, ThumbsUp, History, Flame, ShoppingBag, Music2, Trophy, Settings, Flag, HelpCircle } from "lucide-react";

// 1. Cập nhật SidebarItem với các class Dark Mode
const SidebarItem = ({ icon: Icon, title, active = false }) => (
  <div className={`flex items-center gap-3 px-4 py-2 rounded-lg cursor-pointer transition-colors 
    ${active 
      ? "bg-[#272727] font-semibold !text-white" 
      : "!text-[#f1f1f1] hover:bg-[#272727]"}`}>
    <Icon size={22} strokeWidth={active ? 2.2 : 1.5} className="flex-shrink-0"/>
    <span className="text-[15px] tracking-tight text-inherit 
                     hover:no-underline hover:!text-[#DC143C] hover:[text-shadow:_0.5px_0_0_currentColor] 
                     transition-all duration-200
                     whitespace-nowrap overflow-hidden text-ellipsis">{title} {/* Điều chỉnh để responsive khi inspect */}
    </span>
  </div>
);

const Sidebar = () => {
  return (
    // 2. Thay đổi bg-white thành bg-[#0f0f0f]
    <aside className="w-60 hidden md:flex flex-col h-[calc(100vh-56px)] sticky top-14 overflow-y-auto p-2 scrollbar-hide bg-[#0f0f0f]">
      
      {/* Section 1: Main */}
      <div className="flex flex-col border-b border-[#3f3f3f] pb-3 mb-1.8">
        <SidebarItem icon={Home} title="Trang chủ" active />
        <SidebarItem icon={PlaySquare} title="Shorts" />
        <SidebarItem icon={History} title="Kênh đăng ký" />
      </div>

      {/* Section 2: Personal */}
      <div className="flex flex-col border-b border-[#3f3f3f] py-3 mb-1.8">
        <h3 className="px-4 py-2 font-bold text-base text-white">Bạn</h3>
        <SidebarItem icon={History} title="Video đã xem" />
        <SidebarItem icon={PlaySquare} title="Video của bạn" />
        <SidebarItem icon={Clock} title="Xem sau" />
        <SidebarItem icon={ThumbsUp} title="Video đã thích" />
      </div>

      {/* Section 3: Explore */}
      <div className="flex flex-col border-b border-[#3f3f3f] py-3 mb-1.8">
        <h3 className="px-4 py-2 font-bold text-base text-white">Khám phá</h3>
        <SidebarItem icon={Flame} title="Thịnh hành" />
        <SidebarItem icon={ShoppingBag} title="Mua sắm" />
        <SidebarItem icon={Music2} title="Âm nhạc" />
        <SidebarItem icon={Trophy} title="Thể thao" />
      </div>

      {/* Section 4: Settings */}
      <div className="flex flex-col py-3">
        <SidebarItem icon={Settings} title="Cài đặt" />
        <SidebarItem icon={Flag} title="Nhật ký báo cáo" />
        <SidebarItem icon={HelpCircle} title="Trợ giúp" />
      </div>
      
      {/* Footer */}
      <div className="px-3 py-3 text-[12px] text-[#aaaaaa] font-medium leading-relaxed">
        <p className="mb-2">• Giới thiệu <br></br>• Bản quyền <br></br> • Liên hệ <br></br>• Quảng cáo</p>
        <p>© 2026 - K13T & L0C</p>
      </div>
    </aside>
  );
};

export default Sidebar;