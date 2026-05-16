import { useState } from 'react';
import { useAuth } from '../context/AuthContext.jsx';
import { changePassword } from '../service/authService.js';

const ProfilePage = () => {
  const { user, logout } = useAuth();
  const [showChangePassword, setShowChangePassword] = useState(false);
  const [oldPassword, setOldPassword] = useState('');
  const [newPassword, setNewPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [error, setError] = useState('');
  const [message, setMessage] = useState('');
  const [loading, setLoading] = useState(false);

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
      setMessage(data.message || 'Đổi mật khẩu thành công.');
      setOldPassword('');
      setNewPassword('');
      setConfirmPassword('');
      setTimeout(() => {
        setShowChangePassword(false);
      }, 1500);
    } catch (err) {
      const responseMessage = err?.response?.data?.message || 'Đổi mật khẩu thất bại. Vui lòng thử lại.';
      setError(responseMessage);
    } finally {
      setLoading(false);
    }
  };

  const handleLogout = async () => {
    await logout();
    window.location.href = '/';
  };

  if (!user) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="text-center">
          <p className="text-[#aaaaaa] mb-4">Bạn chưa đăng nhập</p>
          <a href="/login" className="text-[#1c62b9] hover:underline">Đăng nhập</a>
        </div>
      </div>
    );
  }

  return (
    <div className="mx-auto max-w-lg rounded-3xl border border-[#272727] bg-[#121212] p-8 shadow-xl shadow-black/20">
      <h1 className="mb-8 text-center text-3xl font-semibold text-white">Thông tin cá nhân</h1>

      {/* User Info */}
      <div className="mb-8 space-y-4">
        <div className="rounded-2xl bg-[#0f0f0f] p-4 border border-[#333333]">
          <p className="text-sm font-medium text-[#bbbbbb] mb-1">Tên</p>
          <p className="text-lg text-white font-semibold">{user.name}</p>
        </div>
        <div className="rounded-2xl bg-[#0f0f0f] p-4 border border-[#333333]">
          <p className="text-sm font-medium text-[#bbbbbb] mb-1">Email</p>
          <p className="text-lg text-white">{user.email}</p>
        </div>
      </div>

      {/* Change Password Section */}
      {!showChangePassword ? (
        <button
          onClick={() => setShowChangePassword(true)}
          className="w-full rounded-full bg-[#1c62b9] px-5 py-3 text-white transition hover:bg-[#15488e] mb-4"
        >
          Đổi mật khẩu
        </button>
      ) : (
        <form onSubmit={handleChangePassword} className="mb-4 space-y-4 bg-[#0f0f0f] p-4 rounded-2xl border border-[#333333]">
          <h2 className="text-lg font-semibold text-white mb-4">Đổi mật khẩu</h2>

          <div>
            <label className="mb-2 block text-sm font-medium text-[#bbbbbb]">Mật khẩu cũ</label>
            <input
              type="password"
              value={oldPassword}
              onChange={(e) => setOldPassword(e.target.value)}
              placeholder="Nhập mật khẩu cũ"
              className="w-full rounded-2xl border border-[#333333] bg-[#0f0f0f] px-4 py-3 text-white outline-none focus:border-[#1c62b9]"
              disabled={loading}
            />
          </div>

          <div>
            <label className="mb-2 block text-sm font-medium text-[#bbbbbb]">Mật khẩu mới</label>
            <input
              type="password"
              value={newPassword}
              onChange={(e) => setNewPassword(e.target.value)}
              placeholder="Nhập mật khẩu mới (ít nhất 6 ký tự)"
              className="w-full rounded-2xl border border-[#333333] bg-[#0f0f0f] px-4 py-3 text-white outline-none focus:border-[#1c62b9]"
              disabled={loading}
            />
          </div>

          <div>
            <label className="mb-2 block text-sm font-medium text-[#bbbbbb]">Xác nhận mật khẩu</label>
            <input
              type="password"
              value={confirmPassword}
              onChange={(e) => setConfirmPassword(e.target.value)}
              placeholder="Xác nhận mật khẩu mới"
              className="w-full rounded-2xl border border-[#333333] bg-[#0f0f0f] px-4 py-3 text-white outline-none focus:border-[#1c62b9]"
              disabled={loading}
            />
          </div>

          {error && <div className="rounded-xl bg-red-700/20 p-3 text-sm text-red-200">{error}</div>}
          {message && <div className="rounded-xl bg-emerald-700/20 p-3 text-sm text-emerald-200">{message}</div>}

          <div className="flex gap-3 pt-2">
            <button
              type="submit"
              disabled={loading}
              className="flex-1 rounded-full bg-[#1c62b9] px-5 py-3 text-white transition hover:bg-[#15488e] disabled:opacity-50"
            >
              {loading ? 'Đang xử lý...' : 'Cập nhật'}
            </button>
            <button
              type="button"
              onClick={() => setShowChangePassword(false)}
              className="flex-1 rounded-full bg-[#333333] px-5 py-3 text-white transition hover:bg-[#444444]"
            >
              Hủy
            </button>
          </div>
        </form>
      )}

      {/* Logout Button */}
      <button
        onClick={handleLogout}
        className="w-full rounded-full bg-red-600 px-5 py-3 text-white transition hover:bg-red-700"
      >
        Đăng xuất
      </button>
    </div>
  );
};

export default ProfilePage;
