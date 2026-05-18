import { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { loginUser } from '../service/authService.js';
import { useAuth } from '../context/AuthContext.jsx';

const LoginPage = () => {
  const navigate = useNavigate();
  const { setUser } = useAuth();
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [message, setMessage] = useState('');

  const handleSubmit = async (event) => {
    event.preventDefault();
    setError('');
    setMessage('');

    try {
      const data = await loginUser({ email, password });
      setMessage(data.message || 'Đăng nhập thành công');
      setUser(data.user);
      setTimeout(() => {
        navigate('/');
      }, 800);
    } catch (err) {
      const responseMessage = err?.response?.data?.message || 'Đăng nhập thất bại. Vui lòng thử lại.';
      setError(responseMessage);
    }
  };

  return (
    <div className="mt-10 relative mx-auto max-w-md overflow-hidden rounded-3xl border-none border-zinc-800/60 bg-[#0f0f0f] p-10 shadow-2xl shadow-black/40">
      {/* Ambient Glow Effects (Hiệu ứng hào quang mờ kiểu YouTube Premium) */}
      <div className="absolute -right-12 -top-12 h-40 w-40 rounded-full bg-[#3ea6ff]/10 blur-[60px] pointer-events-none"></div>
      <div className="absolute -left-12 -bottom-12 h-40 w-40 rounded-full bg-red-500/5 blur-[60px] pointer-events-none"></div>

      <div className="relative z-10">
        {/* Header */}
        <div className="mb-8 text-center">
          <h1 className="text-3xl font-bold tracking-tight text-zinc-100">Đăng nhập</h1>
          <p className="mt-3 text-sm text-zinc-400">Tiếp tục trải nghiệm không gian giải trí của bạn</p>
        </div>

        <form onSubmit={handleSubmit} className="space-y-6 font-inter font-semibold">
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
              className="w-full rounded-xl border-none bg-zinc-900/40 px-4 py-2.5 text-md text-zinc-100 placeholder-zinc-600 transition-all duration-200 outline-none focus:border-[#3ea6ff] focus:bg-zinc-900/90 focus:ring-4 focus:ring-[#3ea6ff]/10"
            />
          </div>

          {/* Password Input */}
          <div className="group relative">
            <label className="mb-3 block text-sm font-bold uppercase tracking-wider text-red-100 transition-colors duration-200 group-focus-within:text-red-400">
              Password
            </label>
            <input
              autoComplete='false'
              spellCheck={false}
              type="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              placeholder="Nhập mật khẩu"
              className="w-full rounded-xl border-none border-zinc-800 bg-zinc-900/40 px-4 py-2.5 text-md text-zinc-100 placeholder-zinc-600 transition-all duration-200 outline-none focus:border-[#3ea6ff] focus:bg-zinc-900/90 focus:ring-4 focus:ring-[#3ea6ff]/10"
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

          <button
            type="submit"
            className="w-full rounded-full bg-zinc-100 py-2.5 text-md font-semibold text-black transition-all duration-200 hover:bg-white hover:scale-[1.01] active:scale-[0.99] shadow-md"
          >
            Đăng nhập
          </button>
        </form>

        {/* Footer Link */}
        <p className="mt-8 text-center text-md text-zinc-500">
          Chưa có tài khoản?{' '}
          <Link to="/register" className="ml-2 font-semibold text-red-400 hover:underline transition-colors">
            Đăng ký ngay
          </Link>
        </p>
      </div>
    </div>
  );
};

export default LoginPage;