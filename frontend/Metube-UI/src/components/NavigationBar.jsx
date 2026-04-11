import { Search, Menu, Video, Bell, User, Mic, Play, Plus } from "lucide-react";

const Navbar = ({goToUploadPage}) => {
  return (
    <nav className="fixed top-0 w-full bg-[#0f0f0f] text-white flex justify-between items-center px-4 h-14 z-50">
      
      {/* 1. Bên trái: Menu & Logo */}
      <div className="flex items-center gap-3">
        <button className="p-2 hover:bg-[#272727] rounded-full transition text-white">
          <Menu size={23} strokeWidth={1.5} />
        </button>
        <div className="flex items-center gap-1 cursor-pointer">
          <div className="bg-red-600 p-1 rounded-lg">
             <Play size={20} color="red" fill="white" className="w-7 h-4"/>
          </div>
          <span className="font-semibold text-[23px] tracking-[-0.11em] text-white hover:no-underline">MeTube</span>
        </div>
      </div>

      {/* 2. Ở giữa: Thanh tìm kiếm (YouTube Dark Style) */}
      <div className="hidden md:flex flex-1 max-w-[720px] ml-10 items-center gap-4">
        <div className="flex w-full">
          <div className="flex items-center w-full bg-[#121212] border-none rounded-l-full px-4 py-2 focus-within:border-[#1c62b9] focus-within:ml-[-1px] transition-all">
            <Search size={18} className="text-[#aaaaaa] mr-3 hidden focus-within:block" />
            <input 
              type="text" 
              placeholder="Tìm kiếm" 
              className="w-full bg-transparent outline-none text-[17px] placeholder-[#aaaaaa] text-[#f1f1f1]"
            />
          </div>
          <button className="bg-[#222222] border-none rounded-r-full px-4 py-1.5 hover:bg-[#272727] transition shadow-sm group">
            <Search size={20} strokeWidth={2.5} className="text-[#f1f1f1]" />
          </button>
        </div>
        <button className="p-2.5 bg-[#181818] hover:bg-[#272727] rounded-full transition text-white">
          <Mic size={20} />
        </button>
      </div>

      {/* 3. Bên phải: Actions & Profile */}
      <div className="flex items-center gap-1 md:gap-4">
        <button className="p-2 hover:bg-[#272727] rounded-full hidden sm:block text-white" onClick={goToUploadPage}>
        {/* Hiện form để đăng video khi click vào button này */}
          <Plus size={24} strokeWidth={1.5} />
        </button>
        <button className="p-2 hover:bg-[#272727] rounded-full hidden sm:block text-white">
          <Bell size={24} strokeWidth={1.5} />
        </button>
        
        {/* Nút Đăng nhập kiểu Dark Mode */}
        <button className="p-1.5 border-none text-[#FFFFFF] rounded-full flex items-center gap-2 px-3 hover:bg-[#263850] hover:border-transparent transition ml-2">
          <div className="border-2 border-[#999999] rounded-full p-0.5">
            <User size={20} strokeWidth={3}/>
          </div>
          <span className="text-[16px] font-bold hidden md:inline hover:no-underline hover:!text-[#FF3366]">Đăng nhập</span>
        </button>
      </div>
    </nav>
  );
};

export default Navbar;