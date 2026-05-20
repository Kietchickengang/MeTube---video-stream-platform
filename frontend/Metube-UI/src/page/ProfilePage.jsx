import { useState } from 'react';
import { useAuth } from '../context/AuthContext.jsx';
import { changePassword } from '../service/authService.js';
import { User, Mail, Lock, KeyRound, LogOut, Eye, EyeOff, ChevronRight } from 'lucide-react';

const ProfilePage = () => {
  const { user, logout } = useAuth();
  const [showChangePassword, setShowChangePassword] = useState(false);
  const [oldPassword, setOldPassword] = useState('');
  const [newPassword, setNewPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [error, setError] = useState('');
  const [message, setMessage] = useState('');
  const [loading, setLoading] = useState(false);

  const [showOldPass, setShowOldPass] = useState(false);
  const [showNewPass, setShowNewPass] = useState(false);

  const handleChangePassword = async (e) => {
    e.preventDefault();
    setError('');
    setMessage('');
    setLoading(true);

    if (!oldPassword || !newPassword || !confirmPassword) {
      setError('Vui lòng điền đầy đủ thông tin.');
      setLoading(false);
      return;
    }

    if (newPassword.length < 6) {
      setError('Mật khẩu mới phải có ít nhất 6 ký tự.');
      setLoading(false);
      return;
    }

    if (newPassword !== confirmPassword) {
      setError('Mật khẩu xác nhận không khớp.');
      setLoading(false);
      return;
    }

    try {
      const data = await changePassword({ oldPassword, newPassword });
      setMessage(data.message || 'Cập nhật mật khẩu thành công.');
      setOldPassword('');
      setNewPassword('');
      setConfirmPassword('');
      setTimeout(() => setShowChangePassword(false), 1500);
    } catch (err) {
      setError(err?.response?.data?.message || 'Đổi mật khẩu thất bại.');
    } finally {
      setLoading(false);
    }
  };

  if (!user) {
    return (
      <div className="flex items-center justify-center min-h-screen bg-[#0f0f0f]">
        <div className="text-center font-inter animate-fade-in">
          <p className="text-zinc-500 mb-5 text-sm font-medium tracking-wide">Yêu cầu xác thực tài khoản</p>
          <a 
            href="/login" 
            className="inline-block rounded-xl bg-zinc-100 px-6 py-2.5 text-xs font-bold uppercase tracking-wider text-black transition-all hover:bg-white shadow-lg active:scale-95"
          >
            Đăng nhập ngay
          </a>
        </div>
      </div>
    );
  }

  return (
    <div className="mt-12 relative mx-auto max-w-sm overflow-hidden rounded-[32px] border-none bg-[#0f0f0f] p-8 shadow-2xl shadow-black/80 font-inter select-none transition-all duration-300">
      {/* Ambient Radial Glow (Hào quang mịn, sâu hơn) */}
      <div className="absolute -right-16 -top-16 h-48 w-48 rounded-full bg-[#3ea6ff]/5 blur-[80px] pointer-events-none"></div>
      <div className="absolute -left-16 -bottom-16 h-48 w-48 rounded-full bg-red-500/[0.03] blur-[80px] pointer-events-none"></div>

      <div className="relative z-10">
        {/* Profile Card Header */}
        <div className="mb-8 flex items-center gap-4 bg-zinc-900/10 p-2 rounded-2xl">
          <div className="relative h-14 w-14 shrink-0 rounded-2xl bg-zinc-900/60 shadow-inner flex items-center justify-center overflow-hidden border-none group">
            {user.avatarUrl || user.image ? (
              <img 
                src={user.image || user.avatarUrl} 
                alt="Avatar" 
                className="h-full w-full object-cover transition-transform duration-500 group-hover:scale-110"
              />
            ) : (
              <img src="https://tinyurl.com/49hydya9" className="text-zinc-500" />
            )}
          </div>
          <div className="text-left truncate">
            <h1 className="text-xl font-semibold tracking-tight text-zinc-100 truncate">{user.name}</h1>
            <p className="text-sm font-semibold text-zinc-500 tracking-wider uppercase">member</p>
          </div>
        </div>

        {/* Info Grid Layout (Dạng thẻ thông tin phẳng siêu sạch) */}
        <div className="space-y-3 mb-6">
          <div className="w-full flex items-center justify-between rounded-2xl border-none bg-zinc-900/20 px-4 py-3.5 transition-all hover:bg-zinc-900/30">
            <div className="text-left">
              <span className="block text-sm font-bold uppercase tracking-widest text-zinc-500 mb-0.5">username</span>
              <span className="text-md font-medium text-zinc-300">{user.name}</span>
            </div>
            <User size={24} className="text-zinc-600" />
          </div>

          <div className="w-full flex items-center justify-between rounded-2xl border-none bg-zinc-900/20 px-4 py-3.5 transition-all hover:bg-zinc-900/30">
            <div className="text-left truncate pr-4">
              <span className="block text-sm font-bold uppercase tracking-widest text-zinc-500 mb-0.5">Email</span>
              <span className="text-md font-medium text-zinc-300 truncate block">{user.email}</span>
            </div>
            <Mail size={24} className="text-zinc-600" />
          </div>
        </div>

        {/* Interactive Action Area */}
        {!showChangePassword ? (
          <button
            onClick={() => setShowChangePassword(true)}
            className="w-full flex items-center justify-between rounded-2xl bg-zinc-900/40 px-4 py-4 text-md font-semibold text-zinc-400 transition-all duration-200 hover:bg-zinc-900/60 hover:text-zinc-200 active:scale-[0.99]"
          >
            <div className="flex items-center gap-3">
              <KeyRound size={24} className="text-zinc-500" />
              <span>Secuity & Password</span>
            </div>
            <ChevronRight size={24} className="text-zinc-600" />
          </button>
        ) : (
          <form onSubmit={handleChangePassword} className="space-y-4 pt-2 mb-4 animate-fade-in text-left">
            {/* Old Password */}
            <div className="relative flex items-center group">
              <Lock size={14} className="absolute left-4 text-zinc-600 transition-colors group-focus-within:text-[#3ea6ff]" />
              <input
                type={showOldPass ? "text" : "password"}
                value={oldPassword}
                onChange={(e) => setOldPassword(e.target.value)}
                placeholder="Mật khẩu hiện tại"
                className="w-full rounded-2xl border-none bg-zinc-900/30 pl-10 pr-12 py-3.5 text-xs font-medium text-zinc-200 placeholder-zinc-600 transition-all duration-200 outline-none focus:bg-zinc-900/60 focus:ring-1 focus:ring-[#3ea6ff]/30"
                disabled={loading}
              />
              <button
                type="button"
                onClick={() => setShowOldPass(!showOldPass)}
                className="absolute right-4 text-zinc-600 hover:text-zinc-400 transition-colors"
              >
                {showOldPass ? <EyeOff size={14} /> : <Eye size={14} />}
              </button>
            </div>

            {/* New Password */}
            <div className="relative flex items-center group">
              <Lock size={14} className="absolute left-4 text-zinc-600 transition-colors group-focus-within:text-[#3ea6ff]" />
              <input
                type={showNewPass ? "text" : "password"}
                value={newPassword}
                onChange={(e) => setNewPassword(e.target.value)}
                placeholder="Mật khẩu mới (tối thiểu 6 ký tự)"
                className="w-full rounded-2xl border-none bg-zinc-900/30 pl-10 pr-12 py-3.5 text-xs font-medium text-zinc-200 placeholder-zinc-600 transition-all duration-200 outline-none focus:bg-zinc-900/60 focus:ring-1 focus:ring-[#3ea6ff]/30"
                disabled={loading}
              />
              <button
                type="button"
                onClick={() => setShowNewPass(!showNewPass)}
                className="absolute right-4 text-zinc-600 hover:text-zinc-400 transition-colors"
              >
                {showNewPass ? <EyeOff size={14} /> : <Eye size={14} />}
              </button>
            </div>

            {/* Confirm Password */}
            <div className="relative flex items-center group">
              <Lock size={14} className="absolute left-4 text-zinc-600 transition-colors group-focus-within:text-[#3ea6ff]" />
              <input
                type="password"
                value={confirmPassword}
                onChange={(e) => setConfirmPassword(e.target.value)}
                placeholder="Xác nhận lại mật khẩu mới"
                className="w-full rounded-2xl border-none bg-zinc-900/30 pl-10 pr-4 py-3.5 text-xs font-medium text-zinc-200 placeholder-zinc-600 transition-all duration-200 outline-none focus:bg-zinc-900/60 focus:ring-1 focus:ring-[#3ea6ff]/30"
                disabled={loading}
              />
            </div>

            {/* Micro Toast Feedback */}
            {error && (
              <div className="flex items-center gap-2 rounded-xl bg-red-500/5 p-3 text-[11px] font-medium text-red-400/90 border-none transition-all">
                <span className="h-1 w-1 rounded-full bg-red-400 shrink-0"></span>
                <span>{error}</span>
              </div>
            )}
            {message && (
              <div className="flex items-center gap-2 rounded-xl bg-emerald-500/5 p-3 text-[11px] font-medium text-emerald-400/90 border-none transition-all">
                <span className="h-1 w-1 rounded-full bg-emerald-400 shrink-0"></span>
                <span>{message}</span>
              </div>
            )}

            {/* Form Control Buttons */}
            <div className="flex gap-2 pt-1">
              <button
                type="submit"
                disabled={loading}
                className="flex-1 rounded-xl bg-zinc-100 py-3 text-xs font-bold uppercase tracking-wider text-black transition-all duration-200 hover:bg-white active:scale-95 disabled:opacity-40"
              >
                {loading ? '...' : 'Xác nhận'}
              </button>
              <button
                type="button"
                onClick={() => setShowChangePassword(false)}
                className="flex-1 rounded-xl bg-zinc-900/60 py-3 text-xs font-bold uppercase tracking-wider text-zinc-400 transition-all duration-200 hover:bg-zinc-900 hover:text-zinc-200 active:scale-95"
              >
                Hủy bỏ
              </button>
            </div>
          </form>
        )}
      </div>
    </div>
  );
};

export default ProfilePage;