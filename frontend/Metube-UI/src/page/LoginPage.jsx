import { useState } from "react";
import { useNavigate, Link } from "react-router-dom";
import { loginUser } from "../service/authService.js";
import { useAuth } from "../context/AuthContext.jsx";

const LoginPage = () => {
  const navigate = useNavigate();
  const { setUser } = useAuth();

  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const [message, setMessage] = useState("");

  const handleSubmit = async (event) => {
    event.preventDefault();
    setError("");
    setMessage("");

    try {
      const data = await loginUser({ email, password });

      // ❌ KHÔNG dùng token nữa (backend không trả)
      const { user } = data;

      setMessage(data.message || "Đăng nhập thành công");

      // ✔ chỉ lưu user vào context
      setUser(user);

      setTimeout(() => {
        navigate("/");
      }, 800);
    } catch (err) {
      const responseMessage =
        err?.response?.data?.message ||
        err?.message ||
        "Đăng nhập thất bại. Vui lòng thử lại.";

      setError(responseMessage);
    }
  };

  return (
    <div className="mt-10 relative mx-auto max-w-md overflow-hidden rounded-3xl border-none border-zinc-800/60 bg-[#0f0f0f] p-10 shadow-2xl shadow-black/40">
      <div className="relative z-10">
        <div className="mb-8 text-center">
          <h1 className="text-3xl font-bold text-zinc-100">Đăng nhập</h1>
          <p className="mt-3 text-sm text-zinc-400">
            Tiếp tục trải nghiệm không gian giải trí của bạn
          </p>
        </div>

        <form onSubmit={handleSubmit} className="space-y-6">
          <div>
            <label className="block text-sm text-red-100">Email</label>
            <input
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              className="w-full rounded-xl bg-zinc-900/40 px-4 py-2.5 text-zinc-100"
            />
          </div>

          <div>
            <label className="block text-sm text-red-100">Password</label>
            <input
              type="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              className="w-full rounded-xl bg-zinc-900/40 px-4 py-2.5 text-zinc-100"
            />
          </div>

          {error && <div className="text-red-400 text-sm">{error}</div>}
          {message && <div className="text-green-400 text-sm">{message}</div>}

          <button className="w-full rounded-full bg-white py-2.5 text-black">
            Đăng nhập
          </button>
        </form>

        <p className="mt-8 text-center text-sm text-zinc-500">
          Chưa có tài khoản?{" "}
          <Link to="/register" className="text-red-400">
            Đăng ký ngay
          </Link>
        </p>
      </div>
    </div>
  );
};

export default LoginPage;
