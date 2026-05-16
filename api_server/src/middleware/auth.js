import jwt from 'jsonwebtoken';

const JWT_SECRET = process.env.JWT_SECRET || 'metube_secret_key';

export const isAuthenticated = (req, res, next) => {
  const token = req.cookies?.metube_token || req.headers.authorization?.split(' ')[1];
  if (!token) {
    return res.status(401).json({ message: 'Yêu cầu đăng nhập.' });
  }

  try {
    const payload = jwt.verify(token, JWT_SECRET);
    if (!req.session?.user || req.session.user.id !== payload.id) {
      return res.status(401).json({ message: 'Phiên không hợp lệ. Vui lòng đăng nhập lại.' });
    }

    req.user = req.session.user;
    return next();
  } catch (err) {
    console.error('Token validation error:', err);
    return res.status(401).json({ message: 'JWT không hợp lệ hoặc đã hết hạn.' });
  }
};
