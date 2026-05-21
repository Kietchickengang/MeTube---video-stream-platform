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
    <div className="h-fit mt-2 relative mx-auto max-w-md overflow-hidden rounded-3xl border-none border-zinc-800/60 bg-[#0f0f0f] pt-10 px-10 pb-6 shadow-2xl shadow-black/40">
      {/* Ambient Glow Effects (Hiệu ứng hào quang mờ kiểu YouTube Premium) */}
      <div className="absolute -right-12 -top-12 h-40 w-40 rounded-full bg-[#3ea6ff]/10 blur-[60px] pointer-events-none"></div>
      <div className="absolute -left-12 -bottom-12 h-40 w-40 rounded-full bg-red-500/5 blur-[60px] pointer-events-none"></div>

      <div className="relative z-10">
        {/* Header */}
        <div className="mb-8 text-center">
          <h1 className="text-3xl font-bold tracking-tight text-zinc-100">Đăng ký</h1>
          <p className="mt-3 text-md text-zinc-400">Nâng tầm giải trí với nền tảng streaming Metube</p>
        </div>

        <form onSubmit={handleSubmit} className="space-y-5 font-inter font-semibold">
          {/* Name Input */}
          <div className="group relative">
            <label className="mb-3 block text-sm font-bold uppercase tracking-wider text-red-100 transition-colors duration-200 group-focus-within:text-red-400">
              username
            </label>
            <input
              autoComplete='false'
              spellCheck={false}
              type="text"
              value={name}
              onChange={(e) => setName(e.target.value)}
              placeholder="Nhập họ và tên"
              className="w-full rounded-xl border-none bg-zinc-900/40 px-4 py-3 text-md text-zinc-100 placeholder-zinc-600 transition-all duration-200 outline-none focus:border-[#3ea6ff] focus:bg-zinc-900/90 focus:ring-4 focus:ring-[#3ea6ff]/10"
            />
          </div>

          {/* Email Input */}
          <div className="group relative">
            <label className="mb-3 block text-sm font-bold uppercase tracking-wider text-red-100 transition-colors duration-200 group-focus-within:text-red-400">
              Email
            </label>
            <input
              autoComplete='false'
              spellCheck={false}
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              placeholder="Nhập email của bạn"
              className="w-full rounded-xl border-none bg-zinc-900/40 px-4 py-3 text-md text-zinc-100 placeholder-zinc-600 transition-all duration-200 outline-none focus:border-[#3ea6ff] focus:bg-zinc-900/90 focus:ring-4 focus:ring-[#3ea6ff]/10"
            />
          </div>

          {/* Password Input */}
          <div className="group relative">
            <label className="mb-3 block text-md font-semibold uppercase tracking-wider text-red-100 transition-colors duration-200 group-focus-within:text-red-400">
              Password
            </label>
            <input
              autoComplete='false'
              type="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              placeholder="Tạo mật khẩu (ít nhất 6 ký tự)"
              className="w-full rounded-xl border-none bg-zinc-900/40 px-4 py-3 text-md text-zinc-100 placeholder-zinc-600 transition-all duration-200 outline-none focus:border-[#3ea6ff] focus:bg-zinc-900/90 focus:ring-4 focus:ring-[#3ea6ff]/10"
            />
          </div>

          {/* Status Messages */}
          {error && (
            <div className="flex items-center gap-2.5 rounded-xl border-none border-red-500/20 bg-red-500/10 p-3.5 text-sm font-mono text-red-400 transition-all">
              <span className="h-1.5 w-1.5 shrink-0 rounded-full bg-red-500"></span>
              {error}
            </div>
          )}
          {message && (
            <div className="flex items-center gap-2.5 rounded-xl border-none border-emerald-500/20 bg-emerald-500/10 p-3.5 text-sm font-mono text-emerald-400 transition-all">
              <span className="h-1.5 w-1.5 shrink-0 rounded-full bg-emerald-500"></span>
              {message}
            </div>
          )}

          {/* Submit Button */}
          <button
            type="submit"
            className="w-full rounded-full bg-zinc-100 py-2.5 text-md font-semibold text-black transition-all duration-200 hover:bg-white hover:scale-[1.01] active:scale-[0.99] shadow-md"
          >
            Đăng ký
          </button>
        </form>

        {/* Footer Link */}
        <p className="mt-4 text-center text-md text-zinc-500">
          Đã có tài khoản?{' '}
          <Link to="/login" className="ml-2 font-semibold text-red-400 hover:underline transition-colors no-underline">
            Đăng nhập
          </Link>
        </p>
      </div>
    </div>
  );
};

export default RegisterPage;