import React from 'react';
import { NavLink } from 'react-router-dom';
import { Home, PlaySquare, Clock, ThumbsUp, History, Settings, Flag, HelpCircle } from "lucide-react";

const SidebarItem = ({ icon: Icon, title, to }) => (
  <NavLink
    to={to}
    end
    className={({ isActive }) => `no-underline flex items-center gap-3 px-4 py-2 rounded-lg transition-colors ${isActive ? "bg-[#272727] font-semibold text-white" : "text-[#f1f1f1] hover:bg-[#272727]"}`}>
    {({ isActive }) => (
      <>
        <Icon size={22} strokeWidth={isActive ? 2.2 : 1.5} className="flex-shrink-0" />
        <span className="text-[15px] tracking-tight text-inherit transition-all duration-200 whitespace-nowrap overflow-hidden text-ellipsis">
          {title}
        </span>
      </>
    )}
  </NavLink>
);

const Sidebar = () => {
  const navigate = useNavigate();
  const location = useLocation();

  return (
    <aside className="w-60 hidden md:flex flex-col fixed top-14 left-0 h-[calc(100vh-56px)] overflow-y-auto p-2 scrollbar-hide bg-[#0f0f0f]">
      
      {/* Section Main */}
      <div className="flex flex-col border-b border-[#3f3f3f] pb-3 mb-1.8">
        <SidebarItem icon={Home} title="Trang chủ" to="/" />
        <SidebarItem icon={History} title="Kênh đăng ký" to="/subscriptions" />
      </div>

      {/* Section Personal */}
      <div className="flex flex-col border-b border-[#3f3f3f] py-3 mb-1.8">
        <h3 className="px-4 py-2 font-bold text-base text-white">Bạn</h3>
        <SidebarItem icon={History} title="Video đã xem" to="/history" />
        <SidebarItem icon={PlaySquare} title="Video của bạn" to="/your-videos" />
        <SidebarItem icon={Clock} title="Xem sau" to="/watch-later" />
        <SidebarItem icon={ThumbsUp} title="Video đã thích" to="/liked" />
      </div>

      {/* Section Settings */}
      <div className="flex flex-col py-3">
        <SidebarItem icon={Settings} title="Cài đặt" to="/settings" />
        <SidebarItem icon={Flag} title="Nhật ký báo cáo" to="/reports" />
        <SidebarItem icon={HelpCircle} title="Trợ giúp" to="/help" />
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