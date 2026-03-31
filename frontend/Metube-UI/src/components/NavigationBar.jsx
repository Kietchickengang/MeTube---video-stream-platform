import { Search, Menu, Video, Bell, User, Mic } from "lucide-react";

const Navbar = () => {
  return (
    <nav className="fixed top-0 w-full bg-[#0f0f0f] text-white flex justify-between items-center px-4 h-14 z-50">
      
      {/* 1. Bên trái: Menu & Logo */}
      <div className="flex items-center gap-4">
        <button className="p-2 hover:bg-[#272727] rounded-full transition text-white">
          <Menu size={24} strokeWidth={1.5} />
        </button>
        <div className="flex items-center gap-1 cursor-pointer">
          <div className="bg-red-600 p-1 rounded-lg">
             <Video size={20} color="white" fill="white" />
          </div>
          <span className="font-bold text-xl tracking-tighter text-white">MeTube</span>
        </div>
      </div>

      {/* 2. Ở giữa: Thanh tìm kiếm (YouTube Dark Style) */}
      <div className="hidden md:flex flex-1 max-w-[720px] ml-10 items-center gap-4">
        <div className="flex w-full">
          <div className="flex items-center w-full bg-[#121212] border border-[#303030] rounded-l-full px-4 py-1.5 focus-within:border-[#1c62b9] focus-within:ml-[-1px] transition-all">
            <Search size={18} className="text-[#aaaaaa] mr-3 hidden focus-within:block" />
            <input 
              type="text" 
              placeholder="Tìm kiếm" 
              className="w-full bg-transparent outline-none text-base placeholder-[#aaaaaa] text-[#f1f1f1]"
            />
          </div>
          <button className="bg-[#222222] border border-l-0 border-[#303030] rounded-r-full px-5 py-1.5 hover:bg-[#272727] transition shadow-sm group">
            <Search size={20} strokeWidth={1.5} className="text-[#f1f1f1]" />
          </button>
        </div>
        <button className="p-2.5 bg-[#181818] hover:bg-[#272727] rounded-full transition text-white">
          <Mic size={20} />
        </button>
      </div>

      {/* 3. Bên phải: Actions & Profile */}
      <div className="flex items-center gap-2 md:gap-4">
        <button className="p-2 hover:bg-[#272727] rounded-full hidden sm:block text-white">
          <Video size={24} strokeWidth={1.5} />
        </button>
        <button className="p-2 hover:bg-[#272727] rounded-full hidden sm:block text-white">
          <Bell size={24} strokeWidth={1.5} />
        </button>
        
        {/* Nút Đăng nhập kiểu Dark Mode */}
        <button className="p-1.5 border border-[#3f3f3f] text-[#3ea6ff] rounded-full flex items-center gap-2 px-3 hover:bg-[#263850] hover:border-transparent transition ml-2">
          <div className="border border-[#3ea6ff] rounded-full p-0.5">
            <User size={18} />
          </div>
          <span className="text-sm font-bold hidden md:inline">Đăng nhập</span>
        </button>
      </div>
    </nav>
  );
};

export default Navbar;