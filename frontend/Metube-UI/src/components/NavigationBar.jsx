import { Search, Menu, Video, Bell, User, Mic, Play, Plus, LogOut } from "lucide-react";
import { useNavigate } from "react-router-dom";
import { useAuth } from "../context/AuthContext.jsx";
import { useState } from "react";

// Khởi tạo hook navigate
const Navbar = ({ goToUploadPage, toggleSidebar }) => {
  const navigate = useNavigate();
  const { user, logout } = useAuth();
  const [searchQuery, setSearchQuery] = useState("");

  const handleLogout = async () => {
    await logout();
    navigate('/');
  };

  const handleSearch = (event) => {
    event.preventDefault();
    const query = searchQuery.trim();
    if (query) {
      navigate(`/search?q=${encodeURIComponent(query)}`);
    }
  };

  return (
    <nav className="fixed top-0 w-full bg-[#0f0f0f] text-white flex justify-between items-center px-4 h-14 z-50">
      
      {/* Bên trái: Menu & Logo */}
      <div className="flex items-center gap-3">
        <button onClick={toggleSidebar} className="p-2 hover:bg-[#272727] rounded-full transition text-white">
          <Menu size={23} strokeWidth={1.5} />
        </button>
        
        {/* Thêm sự kiện onClick và điều hướng về "/" */}
        <div 
          onClick={() => navigate("/")} 
          className="flex items-center gap-1 cursor-pointer"
        >
          <div className="bg-red-600 p-1 rounded-lg">
             <Play size={20} color="red" fill="white" className="w-7 h-4"/>
          </div>
          <span className="font-semibold text-[23px] tracking-[-0.11em] text-white hover:no-underline">MeTube</span>
        </div>
      </div>

      {/* Ở giữa: Thanh tìm kiếm (YouTube Dark Style) */}
      <div className="hidden md:flex flex-1 max-w-[720px] ml-10 items-center gap-4">
        <form onSubmit={handleSearch} className="flex w-full">
          <div className="flex items-center w-full bg-[#121212] border-none rounded-l-full px-4 py-2 focus-within:border-[#1c62b9] focus-within:ml-[-1px] transition-all">
            <Search size={18} className="text-[#aaaaaa] mr-3 hidden focus-within:block" />
            <input 
              autoComplete="false"
              spellCheck="false"
              type="text" 
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              placeholder="Tìm kiếm" 
              className="w-full bg-transparent outline-none text-[17px] placeholder-[#aaaaaa] text-[#f1f1f1]"
            />
          </div>
          <button type="submit" className="bg-[#222222] border-none rounded-r-full px-4 py-1.5 hover:bg-[#272727] transition shadow-sm group">
            <Search size={20} strokeWidth={2.5} className="text-[#f1f1f1]" />
          </button>
        </form>
        <button className="p-2.5 bg-[#181818] hover:bg-[#272727] rounded-full transition text-white">
          <Mic size={20} />
        </button>
      </div>

      {/* Bên phải: Actions & Profile */}
      <div className="flex items-center gap-1 md:gap-4">
        <button className="p-2 hover:bg-[#272727] rounded-full hidden sm:block text-white" onClick={goToUploadPage}>
          <Plus size={24} strokeWidth={1.5} />
        </button>
        <button className="p-2 hover:bg-[#272727] rounded-full hidden sm:block text-white">
          <Bell size={24} strokeWidth={1.5} />
        </button>
        
        {user ? (
          <div className="flex items-center">
            <button
              onClick={() => navigate('/profile')}
              className="p-1 border-none text-[#FFFFFF] rounded-full flex items-center gap-2 px-3 hover:bg-[#272727] hover:border-transparent transition"
            >
              <div className="border-2 border-[#999999] rounded-full p-0.5">
                {!user && <User size={20} strokeWidth={3}/>}
                { user && <img src="https://tinyurl.com/49hydya9" className="h-8 w-8 rounded-full object-cover"></img>}
              </div>
              <span className="text-md font-semibold hidden md:inline text-white truncate max-w-[120px]">
                {user.name}
              </span>
            </button>
            <button
              onClick={handleLogout}
              className="p-2 hover:bg-[#272727] rounded-full text-white transition hidden sm:block"
              title="Đăng xuất"
            >
              <LogOut size={22} strokeWidth={3} />
            </button>
          </div>
        ) : (
          <button
            className="group p-1.5 border-none text-[#FFFFFF] rounded-full flex items-center gap-2 px-3 hover:bg-[#263850] hover:border-transparent transition ml-2"
            onClick={() => navigate('/login')}
          >
            <div className="border-2 border-[#007FFF] rounded-full p-0.5 group-hover:border-[#FF3366]">
              <User size={20} strokeWidth={3} className="text-[#007FFF] group-hover:text-[#FF3366]"/>
            </div>
            <span className="text-[16px] text-[#007FFF] font-bold hidden md:inline hover:no-underline group-hover:text-[#FF3366]">Đăng nhập</span>
          </button>
        )}
      </div>
    </nav>
  );
};

export default Navbar;