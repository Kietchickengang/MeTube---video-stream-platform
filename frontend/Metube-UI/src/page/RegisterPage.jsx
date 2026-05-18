import { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { registerUser } from '../service/authService.js';
import { useAuth } from '../context/AuthContext.jsx';

const RegisterPage = () => {
  const navigate = useNavigate();
  const { setUser } = useAuth();
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [message, setMessage] = useState('');

  const validateForm = () => {
    if (!name.trim()) {
      setError('Vui lòng nhập tên.');
      return false;
    }
    if (name.trim().length < 2) {
      setError('Tên phải có ít nhất 2 ký tự.');
      return false;
    }
    if (name.trim().length > 100) {
      setError('Tên không được vượt quá 100 ký tự.');
      return false;
    }
    if (!email.trim()) {
      setError('Vui lòng nhập email.');
      return false;
    }
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(email.trim())) {
      setError('Email không đúng định dạng.');
      return false;
    }
    if (!password) {
      setError('Vui lòng nhập mật khẩu.');
      return false;
    }
    if (password.length < 6) {
      setError('Mật khẩu phải có ít nhất 6 ký tự.');
      return false;
    }
    return true;
  };

  const handleSubmit = async (event) => {
    event.preventDefault();
    setError('');
    setMessage('');

    if (!validateForm()) return;

    try {
      await registerUser({ name: name.trim(), email: email.trim(), password });
      setMessage('Tạo tài khoản thành công. Chuyển hướng đến trang đăng nhập...');
      setTimeout(() => {
        navigate('/login');
      }, 1500);
    } catch (err) {
      console.error('Register error details:', err);
      console.error('Error response:', err?.response?.data);
      const responseMessage = err?.response?.data?.message || 'Đăng ký thất bại. Vui lòng thử lại.';
      setError(responseMessage);
    }
  };

  return (
    <div className="mx-auto max-w-md rounded-3xl border border-[#272727] bg-[#121212] p-8 shadow-xl shadow-black/20">
      <h1 className="mb-6 text-center text-3xl font-semibold text-white">Đăng ký</h1>
      <form onSubmit={handleSubmit} className="space-y-5">
        <div>
          <label className="mb-2 block text-sm font-medium text-[#bbbbbb]">Tên</label>
          <input
            type="text"
            value={name}
            onChange={(e) => setName(e.target.value)}
            placeholder="Tên của bạn"
            className="w-full rounded-2xl border border-[#333333] bg-[#0f0f0f] px-4 py-3 text-white outline-none focus:border-[#1c62b9]"
          />
        </div>

        <div>
          <label className="mb-2 block text-sm font-medium text-[#bbbbbb]">Email</label>
          <input
            type="email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            placeholder="Nhập email"
            className="w-full rounded-2xl border border-[#333333] bg-[#0f0f0f] px-4 py-3 text-white outline-none focus:border-[#1c62b9]"
          />
        </div>

        <div>
          <label className="mb-2 block text-sm font-medium text-[#bbbbbb]">Mật khẩu</label>
          <input
            type="password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            placeholder="Tạo mật khẩu (ít nhất 6 ký tự)"
            className="w-full rounded-2xl border border-[#333333] bg-[#0f0f0f] px-4 py-3 text-white outline-none focus:border-[#1c62b9]"
          />
        </div>

        {error && <div className="rounded-xl bg-red-700/20 p-3 text-sm text-red-200">{error}</div>}
        {message && <div className="rounded-xl bg-emerald-700/20 p-3 text-sm text-emerald-200">{message}</div>}

        <button type="submit" className="w-full rounded-full bg-[#1c62b9] px-5 py-3 text-white transition hover:bg-[#15488e]">
          Đăng ký
        </button>
      </form>

      <p className="mt-6 text-center text-sm text-[#aaaaaa]">
        Đã có tài khoản?{' '}
        <Link to="/login" className="text-[#58a6ff] hover:underline">
          Đăng nhập
        </Link>
      </p>
    </div>
  );
};

export default RegisterPage;
