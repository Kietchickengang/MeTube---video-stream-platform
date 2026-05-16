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
    <div className="mx-auto max-w-md rounded-3xl border border-[#272727] bg-[#121212] p-8 shadow-xl shadow-black/20">
      <h1 className="mb-6 text-center text-3xl font-semibold text-white">Đăng nhập</h1>
      <form onSubmit={handleSubmit} className="space-y-5">
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
            placeholder="Nhập mật khẩu"
            className="w-full rounded-2xl border border-[#333333] bg-[#0f0f0f] px-4 py-3 text-white outline-none focus:border-[#1c62b9]"
          />
        </div>

        {error && <div className="rounded-xl bg-red-700/20 p-3 text-sm text-red-200">{error}</div>}
        {message && <div className="rounded-xl bg-emerald-700/20 p-3 text-sm text-emerald-200">{message}</div>}

        <button type="submit" className="w-full rounded-full bg-[#1c62b9] px-5 py-3 text-white transition hover:bg-[#15488e]">
          Đăng nhập
        </button>
      </form>

      <p className="mt-6 text-center text-sm text-[#aaaaaa]">
        Chưa có tài khoản?{' '}
        <Link to="/register" className="text-[#58a6ff] hover:underline">
          Đăng ký ngay
        </Link>
      </p>
    </div>
  );
};

export default LoginPage;
